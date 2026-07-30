# Pauli Cockpit — Setup Guide

## Quick Start

```bash
npm install
cp .env.example .env.local
# Fill in your keys from E:\THE PAULI FILES\master.env
npm run dev
```

Open http://localhost:3000

---

## Remote Access via Cloudflare Tunnel

```bash
# 1. Install cloudflared
brew install cloudflare/cloudflare/cloudflared  # Mac
# or download from https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/

# 2. Expose terminal (install ttyd first)
ttyd -p 7681 bash

# 3. Start tunnel
cloudflared tunnel --url http://localhost:3000

# 4. Copy the tunnel URL → Cockpit Settings → Cloudflare Tunnel
```

---

## Ghostty Terminal Integration

Install Ghostty: https://ghostty.org

The terminal panel in the cockpit connects to a WebSocket terminal server.
Configure the URL in **Settings → Cloudflare Tunnel**.

---

## ALEX (AI Agent)

ALEX uses `claude-sonnet-4-6` via the Anthropic API.

1. Get your key at https://console.anthropic.com
2. Add to Settings → ALEX Configuration, OR
3. Add to `E:\THE PAULI FILES\master.env` as `ANTHROPIC_API_KEY=sk-ant-...`

---

## WhatsApp Business

1. Create Meta Business account
2. Enable WhatsApp Cloud API
3. Add token to Settings → WhatsApp Business API

---

## Connected Repos

| Repo | Purpose |
|------|---------|
| `executiveusa/pauli-vibe_cockpit` | This app |
| `executiveusa/pauli-sercets-vault-` | Secrets vault backend |
| `executiveusa/paulis-pope-bot` | ALEX / Pope Bot |
| `executiveusa/pauli-Uncodixfy` | Design system |

---

## Reselling to Clients

Each client gets:
- Their own ALEX agent instance
- Private WhatsApp number
- Dedicated vault
- Custom subdomain via Cloudflare

Pricing inspiration:
- Starter: $97/mo (1 agent, WA, vault)
- Pro: $297/mo (3 agents, priority, clients panel)
- Enterprise: $997/mo (unlimited, white-label, API)
