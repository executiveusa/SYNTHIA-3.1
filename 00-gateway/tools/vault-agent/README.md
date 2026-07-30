# Vault Sync Agent — Secrets Reference

## Environment Secrets vs Repository Secrets

| | Repository Secret | Environment Secret |
|---|---|---|
| **Scope** | All jobs in the repo | Only jobs targeting that environment (production/preview/dev) |
| **Where set** | Repo → Settings → Secrets → Actions | Repo → Settings → Environments → [env name] → Secrets |
| **Override** | Base layer | Overrides repo secret for that environment |
| **Best for** | CI/CD tokens (deploy keys, API tokens) | Runtime config that differs per env (prod DB vs dev DB) |
| **Vercel analogy** | Vercel Project Settings → Environment Variables (all) | Vercel → Environment Variables scoped to Production only |

### Rule of thumb
- `GH_PAT_ADMIN`, `VERCEL_TOKEN` → **Repository secrets** (needed by CI runner, not the app)
- `NEXT_PUBLIC_*` vars → **Environment secrets** (needed by the running app, differ per env)

---

## Full Secrets List

### Required: GitHub Repository Secrets
Set at: `github.com/executiveusa/Synthia-avatar/settings/secrets/actions`

| Key | Where to get the value |
|-----|----------------------|
| `GH_PAT_ADMIN` | github.com/settings/tokens → New classic token → scopes: `repo`, `workflow`, `admin:org` (for org-level bypass) |
| `VERCEL_TOKEN` | vercel.com/account/tokens → Create |
| `VERCEL_ORG_ID` | Vercel → Settings → General → **Team ID** (starts with `team_`) |
| `VERCEL_PROJECT_ID` | Vercel → synthia-avatar → Settings → General → **Project ID** (starts with `prj_`) |

### Optional: GitHub Environment Secrets (production)
Set at: `github.com/executiveusa/Synthia-avatar/settings/environments/production`

| Key | Where to get the value |
|-----|----------------------|
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | emailjs.com → Email Services → your service |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | emailjs.com → Email Templates → your template |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | emailjs.com → Account → API Keys → Public Key |

### Vercel Environment Variables (set via dashboard OR vault agent)
Set at: `vercel.com/executiveusa/synthia-avatar/settings/environment-variables`

| Key | Environment | Notes |
|-----|-------------|-------|
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | production, preview | Client-side safe |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | production, preview | Client-side safe |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | production, preview | Client-side safe |

---

## Zero-Touch Usage

```bash
# 1. Copy secrets template and fill in real values
cp tools/vault-agent/secrets-template.json /tmp/my-secrets.json
# (edit /tmp/my-secrets.json with real values)

# 2. Create .env from your master.env
cp "E:\THE PAULI FILES\master.env" .env   # Windows
# or
cp ~/master.env .env                       # Mac/Linux

# 3. Run vault agent — pushes everything, never logs values
VAULT_FILE=.env npm run vault:sync

# 4. Delete local .env when done
rm .env
```

---

## For Org-Level Secrets (shared across all 4 Pauli repos)

Set `GH_PAT_ADMIN` and `VERCEL_TOKEN` once at org level:
`github.com/organizations/executiveusa/settings/secrets/actions`

Then each repo only needs its own `VERCEL_PROJECT_ID`.
