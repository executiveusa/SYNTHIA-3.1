// tools/vercel-agent/vercelClient.ts
// Vercel API wrapper — zero external dependencies (native fetch only)
import "dotenv/config";

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const VERCEL_PROJECT_NAME = process.env.VERCEL_PROJECT_NAME;
const VERCEL_API = "https://api.vercel.com";

interface DeploymentResponse {
  id: string;
  url: string;
  state?: "BUILDING" | "READY" | "ERROR" | "CANCELED";
  readyState?: "BUILDING" | "READY" | "ERROR" | "CANCELED";
  target?: string;
  createdAt?: number;
}

async function vercelFetch(endpoint: string, options: RequestInit = {}) {
  if (!VERCEL_TOKEN) {
    throw new Error("VERCEL_TOKEN not found in environment");
  }
  const response = await fetch(`${VERCEL_API}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Vercel API error (${response.status}): ${error}`);
  }
  return response.json();
}

export async function getLatestDeployment(): Promise<DeploymentResponse | null> {
  const deployments = await listDeployments(1);
  return deployments[0] ?? null;
}

export async function triggerDeploy(): Promise<DeploymentResponse> {
  console.log(`   Triggering deployment for project: ${VERCEL_PROJECT_NAME}`);
  return vercelFetch("/v13/deployments", {
    method: "POST",
    body: JSON.stringify({
      name: VERCEL_PROJECT_NAME,
      project: VERCEL_PROJECT_ID,
      target: "production",
    }),
  });
}

export async function getDeploymentStatus(
  deploymentId: string
): Promise<DeploymentResponse> {
  return vercelFetch(`/v13/deployments/${deploymentId}`);
}

export async function listDeployments(
  limit: number = 5
): Promise<DeploymentResponse[]> {
  const data = await vercelFetch(
    `/v9/projects/${VERCEL_PROJECT_ID}/deployments?limit=${limit}`
  );
  return data.deployments ?? [];
}

export async function waitForReady(
  deploymentId: string,
  maxAttempts = 36
): Promise<"READY" | "ERROR" | "TIMEOUT"> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 10_000));
    const status = await getDeploymentStatus(deploymentId);
    const state = status.state ?? status.readyState;
    console.log(`   [${i + 1}/${maxAttempts}] Deployment state: ${state}`);
    if (state === "READY") return "READY";
    if (state === "ERROR" || state === "CANCELED") return "ERROR";
  }
  return "TIMEOUT";
}
