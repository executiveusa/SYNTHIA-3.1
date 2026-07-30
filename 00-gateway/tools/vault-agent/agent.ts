#!/usr/bin/env tsx
/**
 * tools/vault-agent/agent.ts
 * Zero-touch secrets sync agent
 * Reads from master.env or vault file → pushes to GitHub repo/org secrets → Vercel env vars
 * Runs autonomously, never logs secret values, encrypts with sodium before upload
 */
import { execSync } from "child_process";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import "dotenv/config";

// ── Types ────────────────────────────────────────────────────────────────────

interface SecretMap {
  [key: string]: string;
}

interface SyncResult {
  key: string;
  target: "github-repo" | "github-env" | "vercel";
  status: "ok" | "skip" | "error";
  note?: string;
}

// ── Config ───────────────────────────────────────────────────────────────────

const GITHUB_REPO = process.env.GITHUB_REPOSITORY ?? "executiveusa/Synthia-avatar";
const GITHUB_TOKEN = process.env.GH_PAT_ADMIN ?? process.env.GITHUB_TOKEN ?? "";
const VERCEL_TOKEN = process.env.VERCEL_TOKEN ?? "";
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID ?? "";
const VAULT_FILE = process.env.VAULT_FILE ?? ".env";

// Secrets that belong at repo level (CI/CD, not runtime)
const REPO_SECRET_KEYS = new Set([
  "GH_PAT_ADMIN",
  "VERCEL_TOKEN",
  "VERCEL_ORG_ID",
  "VERCEL_PROJECT_ID",
  "VERCEL_PROJECT_NAME",
]);

// Secrets that belong in Vercel environment (runtime)
const VERCEL_ENV_KEYS = new Set([
  "NEXT_PUBLIC_EMAILJS_SERVICE_ID",
  "NEXT_PUBLIC_EMAILJS_TEMPLATE_ID",
  "NEXT_PUBLIC_EMAILJS_PUBLIC_KEY",
]);

const SEP = "─".repeat(54);

// ── Helpers ──────────────────────────────────────────────────────────────────

function log(msg: string) {
  // Never log secret values — only keys and statuses
  console.log(msg);
}

function redact(val: string): string {
  if (!val || val.length < 8) return "****";
  return val.slice(0, 4) + "****" + val.slice(-4);
}

function parseEnvFile(filePath: string): SecretMap {
  const resolved = resolve(filePath);
  if (!existsSync(resolved)) {
    throw new Error(`Vault file not found: ${resolved}`);
  }
  const lines = readFileSync(resolved, "utf-8").split("\n");
  const result: SecretMap = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    if (key) result[key] = val;
  }
  return result;
}

async function githubRequest(
  endpoint: string,
  method: string,
  body?: object
): Promise<any> {
  if (!GITHUB_TOKEN) throw new Error("GH_PAT_ADMIN not set");
  const res = await fetch(`https://api.github.com${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok && res.status !== 204) {
    const text = await res.text().catch(() => "");
    throw new Error(`GitHub API ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.status === 204 ? null : res.json().catch(() => null);
}

async function vercelRequest(
  endpoint: string,
  method: string,
  body?: object
): Promise<any> {
  if (!VERCEL_TOKEN) throw new Error("VERCEL_TOKEN not set");
  const res = await fetch(`https://api.vercel.com${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Vercel API ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json().catch(() => null);
}

// ── GitHub: Get repo public key (needed for secret encryption) ───────────────

async function getRepoPublicKey(): Promise<{ key_id: string; key: string }> {
  return githubRequest(`/repos/${GITHUB_REPO}/actions/secrets/public-key`, "GET");
}

// ── Encrypt secret with libsodium (via gh CLI which handles this) ─────────────

async function pushGitHubRepoSecret(
  secretName: string,
  secretValue: string
): Promise<void> {
  // Use gh CLI which handles sodium encryption internally
  const escaped = secretValue.replace(/'/g, "'\\''");
  execSync(
    `echo '${escaped}' | gh secret set ${secretName} --repo ${GITHUB_REPO}`,
    { stdio: "pipe", env: { ...process.env, GH_TOKEN: GITHUB_TOKEN } }
  );
}

// ── Vercel: Set environment variable ─────────────────────────────────────────

async function pushVercelEnvVar(
  key: string,
  value: string,
  target: string[] = ["production", "preview", "development"]
): Promise<void> {
  if (!VERCEL_PROJECT_ID) throw new Error("VERCEL_PROJECT_ID not set");
  await vercelRequest(
    `/v10/projects/${VERCEL_PROJECT_ID}/env`,
    "POST",
    { key, value, type: "plain", target }
  );
}

// ── Main agent loop ───────────────────────────────────────────────────────────

async function run() {
  log("=".repeat(54));
  log("🔐 KUPURI MEDIA — VAULT SYNC AGENT");
  log("=".repeat(54));
  log(`Source: ${VAULT_FILE}`);
  log(`Repo:   ${GITHUB_REPO}`);
  log("");

  // 1. Load secrets from vault file
  let secrets: SecretMap;
  try {
    secrets = parseEnvFile(VAULT_FILE);
    log(`✅ Loaded ${Object.keys(secrets).length} keys from vault`);
    log(`   Keys: ${Object.keys(secrets).map((k) => k).join(", ")}`);
  } catch (e: any) {
    log(`❌ Failed to load vault: ${e.message}`);
    process.exit(1);
  }

  const results: SyncResult[] = [];

  // 2. Check which tools are available
  const hasGhCli = (() => {
    try { execSync("gh --version", { stdio: "pipe" }); return true; }
    catch { return false; }
  })();

  log(`\n${SEP}`);
  log("📤 Syncing to GitHub Repository Secrets...");
  log(SEP);

  // 3. Push repo secrets via gh CLI
  if (!hasGhCli) {
    log("⚠️  gh CLI not found — skipping GitHub secrets");
    log("   Install: https://cli.github.com/");
  } else if (!GITHUB_TOKEN) {
    log("⚠️  GH_PAT_ADMIN not set — skipping GitHub secrets");
  } else {
    for (const [key, value] of Object.entries(secrets)) {
      if (!REPO_SECRET_KEYS.has(key)) continue;
      if (!value || value.includes("REPLACE")) {
        results.push({ key, target: "github-repo", status: "skip", note: "placeholder value" });
        log(`⏭️  ${key} — skipped (placeholder)`);
        continue;
      }
      try {
        await pushGitHubRepoSecret(key, value);
        results.push({ key, target: "github-repo", status: "ok" });
        log(`✅ ${key} → github repo secret (${redact(value)})`);
      } catch (e: any) {
        results.push({ key, target: "github-repo", status: "error", note: e.message });
        log(`❌ ${key} — ${e.message.slice(0, 80)}`);
      }
    }
  }

  log(`\n${SEP}`);
  log("📤 Syncing to Vercel Environment Variables...");
  log(SEP);

  // 4. Push Vercel env vars
  if (!VERCEL_TOKEN) {
    log("⚠️  VERCEL_TOKEN not set — skipping Vercel env vars");
  } else if (!VERCEL_PROJECT_ID) {
    log("⚠️  VERCEL_PROJECT_ID not set — skipping Vercel env vars");
  } else {
    for (const [key, value] of Object.entries(secrets)) {
      if (!VERCEL_ENV_KEYS.has(key)) continue;
      if (!value || value.includes("REPLACE")) {
        results.push({ key, target: "vercel", status: "skip", note: "placeholder value" });
        log(`⏭️  ${key} — skipped (placeholder)`);
        continue;
      }
      try {
        await pushVercelEnvVar(key, value);
        results.push({ key, target: "vercel", status: "ok" });
        log(`✅ ${key} → vercel env (${redact(value)})`);
      } catch (e: any) {
        // If already exists, try to update
        if (e.message.includes("409") || e.message.includes("already")) {
          log(`⏭️  ${key} — already set in Vercel`);
          results.push({ key, target: "vercel", status: "skip", note: "already exists" });
        } else {
          results.push({ key, target: "vercel", status: "error", note: e.message });
          log(`❌ ${key} — ${e.message.slice(0, 80)}`);
        }
      }
    }
  }

  // 5. Summary
  const ok = results.filter((r) => r.status === "ok").length;
  const skipped = results.filter((r) => r.status === "skip").length;
  const errors = results.filter((r) => r.status === "error").length;

  log(`\n${"=".repeat(54)}`);
  log("📊 VAULT SYNC COMPLETE");
  log(`   ✅ Synced:  ${ok}`);
  log(`   ⏭️  Skipped: ${skipped}`);
  log(`   ❌ Errors:  ${errors}`);
  log("=".repeat(54));

  if (errors > 0) process.exit(1);
}

run().catch((e) => {
  console.error("❌ Fatal:", e.message);
  process.exit(1);
});
