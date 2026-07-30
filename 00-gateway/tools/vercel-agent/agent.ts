#!/usr/bin/env tsx
// tools/vercel-agent/agent.ts
// Self-iterating deployment agent — builds, tests, deploys, verifies, repeats
import { execSync } from "child_process";
import {
  triggerDeploy,
  waitForReady,
  listDeployments,
  getLatestDeployment,
} from "./vercelClient.js";

type Grade = "SUCCESS" | "PROGRESS" | "FAILURE";

interface CycleResult {
  cycle: number;
  action: string;
  grade: Grade;
  note: string;
}

const MAX_CYCLES = 3;
const SEP = "─".repeat(54);

function run(
  cmd: string,
  label: string
): { ok: boolean; out: string } {
  console.log(`\n📦 ${label}...`);
  try {
    const out = execSync(cmd, { encoding: "utf-8", stdio: "pipe" });
    console.log(`✅ ${label} succeeded`);
    return { ok: true, out };
  } catch (e: any) {
    console.log(`❌ ${label} failed`);
    return { ok: false, out: e.message };
  }
}

async function healthCheck(url: string): Promise<boolean> {
  console.log(`\n🏥 Health check → https://${url}`);
  try {
    const res = await fetch(`https://${url}`);
    console.log(`   HTTP ${res.status}`);
    return res.ok;
  } catch {
    console.log(`   Connection failed`);
    return false;
  }
}

function grade(result: Grade) {
  const icon = result === "SUCCESS" ? "✅" : result === "PROGRESS" ? "🟡" : "❌";
  console.log(`\n📊 Self-Grade: ${icon} ${result}`);
}

async function run_agent() {
  console.log("=".repeat(54));
  console.log("🤖 KUPURI MEDIA — AUTONOMOUS DEPLOY AGENT");
  console.log("=".repeat(54));
  console.log("Mission: Deploy until live · Max cycles:", MAX_CYCLES);
  console.log("");

  const results: CycleResult[] = [];

  for (let cycle = 1; cycle <= MAX_CYCLES; cycle++) {
    console.log(`\n${SEP}`);
    console.log(`🔄 CYCLE ${cycle}/${MAX_CYCLES}`);
    console.log(SEP);

    // ── 1. Check current state ──────────────────────────────────────────────
    console.log("\n📊 Checking current deployment state...");
    const latest = await getLatestDeployment().catch(() => null);
    if (latest) {
      const state = latest.state ?? latest.readyState;
      console.log(`   Latest: ${latest.url} (${state})`);
      if (state === "READY") {
        const healthy = await healthCheck(latest.url);
        if (healthy) {
          grade("SUCCESS");
          console.log("\n✅ App already live and healthy — nothing to do!");
          console.log(`🌐 https://${latest.url}`);
          return;
        }
      }
    } else {
      console.log("   No existing deployments found");
    }

    // ── 2. Build ─────────────────────────────────────────────────────────────
    let build = run("npm run build", "Build");
    if (!build.ok) {
      console.log("\n🔧 Auto-fix: installing dependencies...");
      run("npm ci", "npm ci");
      build = run("npm run build", "Build retry");
      if (!build.ok) {
        grade("FAILURE");
        results.push({ cycle, action: "build", grade: "FAILURE", note: "Build failed after dep install" });
        continue;
      }
    }

    // ── 3. Type check ────────────────────────────────────────────────────────
    run("npx tsc --noEmit", "TypeScript check");

    // ── 4. Deploy ────────────────────────────────────────────────────────────
    console.log("\n🚀 Deploying to Vercel...");
    let deployment;
    try {
      deployment = await triggerDeploy();
      console.log(`   ID:  ${deployment.id}`);
      console.log(`   URL: ${deployment.url}`);
    } catch (e: any) {
      console.log(`   ❌ Deploy trigger failed: ${e.message}`);
      grade("FAILURE");
      results.push({ cycle, action: "deploy", grade: "FAILURE", note: e.message });
      continue;
    }

    // ── 5. Monitor ───────────────────────────────────────────────────────────
    console.log("\n⏳ Monitoring deployment (max 6 min)...");
    const finalState = await waitForReady(deployment.id);

    if (finalState !== "READY") {
      grade("PROGRESS");
      results.push({ cycle, action: "monitor", grade: "PROGRESS", note: finalState });
      continue;
    }

    // ── 6. Verify ────────────────────────────────────────────────────────────
    const healthy = await healthCheck(deployment.url);

    if (healthy) {
      grade("SUCCESS");
      console.log("\n" + "=".repeat(54));
      console.log("🎉 DEPLOYMENT COMPLETE — App is LIVE!");
      console.log(`🌐 https://${deployment.url}`);
      console.log("=".repeat(54));
      return;
    } else {
      grade("PROGRESS");
      results.push({ cycle, action: "health", grade: "PROGRESS", note: "Health check failed" });
    }
  }

  // ── Escalation ──────────────────────────────────────────────────────────────
  console.log("\n" + "=".repeat(54));
  console.log("⚠️  ESCALATION — Exhausted all cycles");
  console.log("=".repeat(54));
  console.log("");
  results.forEach((r, i) =>
    console.log(`  ${i + 1}. Cycle ${r.cycle} [${r.action}]: ${r.grade} — ${r.note}`)
  );
  console.log("\n💡 Next steps:");
  console.log("   • Check Vercel dashboard for build logs");
  console.log("   • Verify VERCEL_TOKEN / VERCEL_PROJECT_ID in .env");
  console.log("   • Try: npx vercel --prod");
  process.exit(1);
}

run_agent().catch((e) => {
  console.error("\n❌ Fatal:", e.message);
  process.exit(1);
});
