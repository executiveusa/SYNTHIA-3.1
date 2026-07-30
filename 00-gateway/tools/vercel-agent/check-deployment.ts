#!/usr/bin/env tsx
// tools/vercel-agent/check-deployment.ts
// Non-invasive deployment status checker — safe to run anytime
import { listDeployments } from "./vercelClient.js";

const DEPLOYMENT_URL = process.env.DEPLOYMENT_URL;

async function check() {
  console.log("📊 Vercel Deployment Status");
  console.log("─".repeat(50));

  if (DEPLOYMENT_URL) {
    console.log(`\n🎯 Target URL: ${DEPLOYMENT_URL}`);
    try {
      const res = await fetch(DEPLOYMENT_URL);
      const icon = res.ok ? "✅" : "❌";
      console.log(`${icon} HTTP ${res.status}`);
      if (res.ok) {
        console.log("📊 Self-Grade: ✅ SUCCESS — App is live");
        return;
      }
    } catch (e: any) {
      console.log(`❌ Connection failed: ${e.message}`);
    }
  }

  try {
    const deployments = await listDeployments(5);

    if (deployments.length === 0) {
      console.log("\n⚠️  No deployments found");
      console.log("   Run: npm run deploy:agent");
      return;
    }

    console.log(`\n📦 Recent deployments:\n`);
    deployments.forEach((d, i) => {
      const state = d.state ?? d.readyState;
      const icon = state === "READY" ? "✅" : state === "BUILDING" ? "⏳" : "❌";
      console.log(`${icon}  ${i + 1}. https://${d.url}`);
      console.log(`      State: ${state}  |  ID: ${d.id}`);
    });

    const latest = deployments[0];
    const latestState = latest.state ?? latest.readyState;
    const isReady = latestState === "READY";

    console.log("\n─".repeat(50));
    console.log(`📊 Self-Grade: ${isReady ? "✅ SUCCESS" : "🟡 PROGRESS"}`);

    if (isReady) {
      console.log(`\n🌐 Live: https://${latest.url}`);
    } else {
      console.log(`\n⏳ State: ${latestState}`);
      console.log("   Run: npm run deploy:agent");
    }
  } catch (e: any) {
    console.error("❌ Error:", e.message);
    console.log("\n💡 Check VERCEL_TOKEN and VERCEL_PROJECT_ID in .env");
  }
}

check();
