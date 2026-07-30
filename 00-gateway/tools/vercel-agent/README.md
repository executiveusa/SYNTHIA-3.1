# Vercel Deployment Agent

Self-iterating deployment loop for Kupuri Media / Synthia-avatar.

## Setup

1. Copy `.env.example` → `.env` and fill in values
2. Run: `npm run deploy:agent`

## Commands

| Command | Description |
|---------|-------------|
| `npm run deploy:agent` | Full autonomous build → deploy → verify loop |
| `npm run deploy:check` | Quick status check (non-invasive) |

## Required Secrets (GitHub Actions)

| Secret | Description |
|--------|-------------|
| `VERCEL_TOKEN` | From vercel.com/account/tokens |
| `VERCEL_ORG_ID` | From Vercel project settings |
| `VERCEL_PROJECT_ID` | From Vercel project settings |
| `GH_PAT_ADMIN` | GitHub PAT with `repo` + `workflow` + bypass branch protection |
