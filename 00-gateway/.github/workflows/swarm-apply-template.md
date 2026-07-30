# How to apply the auto-deploy pipeline to any repo

## Required GitHub Secrets (set once per org or per repo)

| Secret | Where to get it |
|--------|----------------|
| `GH_PAT_ADMIN` | github.com/settings/tokens — needs `repo`, `workflow`, and org admin to bypass branch protection |
| `VERCEL_TOKEN` | vercel.com/account/tokens |
| `VERCEL_ORG_ID` | Vercel → Settings → General → Team ID |
| `VERCEL_PROJECT_ID` | Vercel → Project → Settings → General → Project ID |

## Per-repo setup (one command)

```bash
# From the target repo root:
mkdir -p .github/workflows tools/vercel-agent e2e

# Copy the workflow
curl -o .github/workflows/auto-merge-deploy.yml \
  https://raw.githubusercontent.com/executiveusa/Synthia-avatar/main/.github/workflows/auto-merge-deploy.yml

# Copy agent tools
curl -o tools/vercel-agent/vercelClient.ts \
  https://raw.githubusercontent.com/executiveusa/Synthia-avatar/main/tools/vercel-agent/vercelClient.ts
curl -o tools/vercel-agent/agent.ts \
  https://raw.githubusercontent.com/executiveusa/Synthia-avatar/main/tools/vercel-agent/agent.ts
curl -o tools/vercel-agent/check-deployment.ts \
  https://raw.githubusercontent.com/executiveusa/Synthia-avatar/main/tools/vercel-agent/check-deployment.ts

# Copy smoke tests and playwright config
curl -o playwright.config.ts \
  https://raw.githubusercontent.com/executiveusa/Synthia-avatar/main/playwright.config.ts
curl -o e2e/smoke.spec.ts \
  https://raw.githubusercontent.com/executiveusa/Synthia-avatar/main/e2e/smoke.spec.ts

# Copy vercel.json (no-secrets build)
curl -o vercel.json \
  https://raw.githubusercontent.com/executiveusa/Synthia-avatar/main/vercel.json

# Copy .env.example
curl -o .env.example \
  https://raw.githubusercontent.com/executiveusa/Synthia-avatar/main/.env.example
```

## Target repos

- git@github.com:executiveusa/open-agent-platform-pauli.git
- git@github.com:executiveusa/pauli-agentql.git
- git@github.com:executiveusa/paulis-agenthub.git
- git@github.com:executiveusa/pauli-agency-agents.git

## How it works after setup

1. Push any `claude/*` branch
2. GitHub Actions auto-triggers
3. Build verified (no secrets required)
4. Branch merged to main automatically
5. Vercel deployment triggered
6. Monitor + health check
7. Report generated

No human intervention needed.
