# ============================================================
#  Pauli — GitHub + Vercel Pipeline Setup
#  Reads from: E:\THE PAULI FILES\master.env
#  Run: .\setup-pipeline.ps1
# ============================================================

param(
    [string]$EnvFile = "E:\THE PAULI FILES\master.env",
    [string]$Repo    = "executiveusa/Synthia-avatar",
    [switch]$Deploy  = $false
)

# ── Helpers ─────────────────────────────────────────────────
function Write-Step  { param($msg) Write-Host "`n▶ $msg" -ForegroundColor Cyan }
function Write-OK    { param($msg) Write-Host "  ✓ $msg" -ForegroundColor Green }
function Write-Warn  { param($msg) Write-Host "  ⚠ $msg" -ForegroundColor Yellow }
function Write-Fail  { param($msg) Write-Host "  ✗ $msg" -ForegroundColor Red; exit 1 }

function Load-Env {
    param([string]$Path)
    if (-not (Test-Path $Path)) { Write-Fail "master.env not found at: $Path" }

    $vars = @{}
    Get-Content $Path | ForEach-Object {
        $line = $_.Trim()
        if ($line -and $line -notmatch '^\s*#' -and $line -match '^([^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $val = $matches[2].Trim().Trim('"').Trim("'")
            $vars[$key] = $val
            [System.Environment]::SetEnvironmentVariable($key, $val, 'Process')
        }
    }
    return $vars
}

function Require-CLI {
    param([string]$Name, [string]$InstallCmd)
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        Write-Warn "$Name not found. Installing..."
        Invoke-Expression $InstallCmd
        if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
            Write-Fail "$Name install failed. Install manually and re-run."
        }
    }
    Write-OK "$Name is available"
}

# ── 1. Load .env ─────────────────────────────────────────────
Write-Step "Loading secrets from master.env"
$env_vars = Load-Env -Path $EnvFile
Write-OK "Loaded $($env_vars.Count) variables"

# Grab the keys we need
$GH_TOKEN      = $env:GH_TOKEN      ?? $env:GITHUB_TOKEN
$VERCEL_TOKEN  = $env:VERCEL_TOKEN
$VERCEL_ORG    = $env:VERCEL_ORG_ID
$VERCEL_PROJ   = $env:VERCEL_PROJECT_ID

if (-not $GH_TOKEN)     { Write-Warn "GH_TOKEN not set in master.env" }
if (-not $VERCEL_TOKEN) { Write-Warn "VERCEL_TOKEN not set in master.env" }

# ── 2. Check / install CLIs ──────────────────────────────────
Write-Step "Checking required CLIs"

Require-CLI "gh"     "winget install --id GitHub.cli -e --silent 2>$null; scoop install gh 2>$null"
Require-CLI "vercel" "npm install -g vercel"
Require-CLI "git"    "winget install --id Git.Git -e --silent"

# ── 3. Authenticate GitHub CLI ───────────────────────────────
Write-Step "Authenticating GitHub CLI"
if ($GH_TOKEN) {
    $env:GH_TOKEN = $GH_TOKEN
    $ghUser = gh api user --jq '.login' 2>$null
    if ($ghUser) {
        Write-OK "GitHub: logged in as @$ghUser"
    } else {
        Write-Warn "gh auth check failed — trying token login"
        echo $GH_TOKEN | gh auth login --with-token
    }
} else {
    Write-Warn "No GH_TOKEN — launching interactive login"
    gh auth login
}

# ── 4. Authenticate Vercel CLI ───────────────────────────────
Write-Step "Authenticating Vercel CLI"
if ($VERCEL_TOKEN) {
    $env:VERCEL_TOKEN = $VERCEL_TOKEN

    # Confirm token works
    $vercelUser = vercel whoami --token $VERCEL_TOKEN 2>$null
    if ($vercelUser) {
        Write-OK "Vercel: logged in as $vercelUser"
    } else {
        Write-Warn "Vercel token check failed — check VERCEL_TOKEN in master.env"
    }
} else {
    Write-Warn "No VERCEL_TOKEN — launching interactive login"
    vercel login
}

# ── 5. Set GitHub repo secrets (Vercel tokens → GH Actions) ─
Write-Step "Pushing secrets to GitHub repo: $Repo"

$secrets = @{
    VERCEL_TOKEN      = $VERCEL_TOKEN
    VERCEL_ORG_ID     = $VERCEL_ORG
    VERCEL_PROJECT_ID = $VERCEL_PROJ
    ANTHROPIC_API_KEY = $env:ANTHROPIC_API_KEY
}

foreach ($pair in $secrets.GetEnumerator()) {
    if ($pair.Value) {
        gh secret set $pair.Key --body $pair.Value --repo $Repo 2>$null
        Write-OK "Secret set: $($pair.Key)"
    } else {
        Write-Warn "Skipped (empty): $($pair.Key)"
    }
}

# ── 6. Create GitHub Actions workflow ────────────────────────
Write-Step "Creating GitHub Actions workflow"

$workflowDir = ".\.github\workflows"
New-Item -ItemType Directory -Force -Path $workflowDir | Out-Null

$workflow = @'
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  VERCEL_ORG_ID:     ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install Vercel CLI
        run: npm install -g vercel

      - name: Pull Vercel env
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy
        id: deploy
        run: |
          URL=$(vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }})
          echo "url=$URL" >> $GITHUB_OUTPUT
          echo "Deployed to: $URL"

      - name: Comment PR with deploy URL
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `✅ **Preview deployed:** ${{ steps.deploy.outputs.url }}`
            })
'@

$workflowPath = "$workflowDir\deploy.yml"
$workflow | Out-File -FilePath $workflowPath -Encoding UTF8
Write-OK "Workflow created: $workflowPath"

# ── 7. Link Vercel project (optional) ────────────────────────
Write-Step "Linking Vercel project"
if ($VERCEL_TOKEN) {
    vercel link --yes --token $VERCEL_TOKEN 2>$null
    Write-OK "Vercel project linked"
} else {
    Write-Warn "Skipped — no VERCEL_TOKEN"
}

# ── 8. Optional: trigger deploy now ──────────────────────────
if ($Deploy) {
    Write-Step "Triggering production deploy"
    vercel --prod --token $VERCEL_TOKEN
    Write-OK "Deploy triggered"
}

# ── Done ─────────────────────────────────────────────────────
Write-Host ""
Write-Host "============================================" -ForegroundColor DarkGray
Write-Host "  Pauli Pipeline Ready " -ForegroundColor Green
Write-Host "============================================" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  Repo    : https://github.com/$Repo" -ForegroundColor White
Write-Host "  Workflow : $workflowPath" -ForegroundColor White
Write-Host "  Secrets  : set on GitHub Actions" -ForegroundColor White
Write-Host ""
Write-Host "  Next steps:" -ForegroundColor Cyan
Write-Host "   git add .github && git commit -m 'ci: add Vercel deploy workflow'" -ForegroundColor DarkGray
Write-Host "   git push origin main" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  Or deploy right now:" -ForegroundColor Cyan
Write-Host "   .\setup-pipeline.ps1 -Deploy" -ForegroundColor DarkGray
Write-Host ""
