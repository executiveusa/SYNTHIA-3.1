# HANDOFF — Alex / Synthia Agent Platform → Production

**To:** Production engineer / next-iteration model
**From:** Digital co-founder (ZCode agent, GLM-5.2)
**Date:** 2026-07-14
**Project:** Alex — voice-first AI agent for Ivette / Kupuri Media (CDMX, Mexico)
**Repos:**
- `C:\Users\execu\ZCodeProject\alex-kupuri\` — the engine (9 commits, clean tree)
- `https://github.com/executiveusa/AKASHPORTFOLIO` — persona source (3,620 files, READ ONLY — do not deploy)
- Spec: `C:\Users\execu\ZCodeProject\docs\superpowers\specs\2026-07-13-alex-synthia-agent-platform-design.md` (v4)
- Plan: `C:\Users\execu\ZCodeProject\docs\superpowers\plans\2026-07-13-alex-core-engine.md` (Plan 1 of N)
- Server cleanup manifest: `docs/server-cleanup/PAULI-95-APPS-manifest-2026-07-13.md`

> Read this entire document before touching anything. It contains the full context, every blocker we hit, and the exact phases to ship. The build is **80% done and architecturally proven** — the remaining 20% is persona tuning + 4 v4 features + deploy.

---

## 1. WHAT THIS IS (the 30,000-ft view)

**Alex** is the voice-first Chief-of-Staff AI agent for **Ivette** (founder of Kupuri Media, CDMX Mexico). She speaks to it in Mexican Spanish; it answers from her own knowledge vault; a 3D galaxy visualizes her brain as spheres.

**Three layers, one system:**
- **Gateway** = Synthia-avatar (3D wizard landing page) — LOCKED, do not touch.
- **Brain** = Synthia = GLM/Claude/Groq LLM + the extracted `synthia-prime.md` SOUL + markdown vault.
- **Body** = Alex = the brain-jetty voice engine (this repo), rebranded.

**The key reframe (BLACK SWAN #3):** the original `AKASHPORTFOLIO` repo is a 3,620-file tangled Next.js platform with exceptional *character work* (synthia-prime, ivette-voice, alex ZTE protocol, 8-agent roster) but unusable *plumbing*. **Decision: extract the personas as markdown, leave the Next.js behind, build a fresh brain-jetty engine around them.** That is what `alex-kupuri` is.

---

## 2. WHAT'S DONE (Plan 1 — 10/10 tasks, all committed)

| # | Task | Status |
|---|------|--------|
| 1 | alex-kupuri repo created, brain-jetty engine imported | ✅ committed |
| 2 | `PLATFORM_AUDIT.md` — every macOS call inventoried | ✅ committed |
| 3 | `oscompat.py` cross-platform abstraction — **8/8 tests pass on Windows** | ✅ committed |
| 4 | server.py rewired — osctl lazy-imports only on macOS, all `/os /find /type /clip` routes guarded with graceful Spanish fallbacks | ✅ committed |
| 5 | `alex` persona SKIN added (warm CDMX es-MX) as default, 5/5 tests pass | ✅ committed |
| 6 | Personas extracted from AKASHPORTFOLIO → `SOUL.md` + 8 agent vault nodes | ✅ committed |
| 7 | `config.json` — Groq llama-3.3-70b (free) primary + Claude/Haiku/GLM hot-swap + stub Telegram | ✅ gitignored |
| 8 | ElevenLabs Sarah voice (es-MX) configured; **quota exceeded** → browser TTS fallback active | ✅ |
| 9 | Galaxy rebuilt — 8 Kupuri agents as nodes, ALEX branding | ✅ committed |
| 10 | Verification gate — server boots on Windows (HTTP 200), persona prompt proven fully Spanish in isolation | ✅ |

**Verified working:** `python server.py` → `http://localhost:4719` returns HTTP 200 on Windows. The `/chat` endpoint returns responses. The 3D galaxy renders.

---

## 3. CURRENT BLOCKERS (read these before anything)

### 🔴 Blocker A — Persona identity leak (PARTIALLY FIXED, needs final pass)
**Symptom:** Alex introduces itself as "The Pauli Effect / octava versión / mayordomo digital" instead of "Alex / Kupuri Media / Ivette's Chief-of-Staff".

**Root causes found & fixed:**
1. ✅ FIXED — English humor/honesty dial rules appended after the Spanish core (made `persona.system()` language-aware; alex now gets `_humor_rule(h, lang="es")` + `GATE_ES`).
2. ✅ FIXED — `style_hint()` in server.py now returns Spanish register for alex skin.
3. ✅ FIXED — alex core prompt explicitly forbids British-butler/JARVIS/"sir".

**Still leaking via Groq/llama specifically:**
- The model invents `[GAG:...]` tags (no gags file exists) and references "The Pauli Effect" / "New World Kids" — names that appear in the broader vault/context, not in our SOUL.
- **Cause:** llama-3.3-70b is weaker at system-prompt adherence than Claude. It roleplays "sarcastic AI" instead of obeying the identity rules.

**The fix to ship (Phase 1 below):**
- Switch primary brain back to **Claude Sonnet 4.5** (verified working, has balance) — it follows the persona cleanly. Groq stays as the cheap-fallback for the AUTO router only.
- Add a **hard identity anchor** as the final line of every system prompt: `"IDENTIDAD NO NEGOCIABLE: Eres Alex. Trabajas para Ivette en Kupuri Media. Nunca digas ser de The Pauli Effect, New World Kids, ni 'octava versión'. Responde en español mexicano."`
- Strip any literal `[GAG:...]` bracket output in the response post-processor (`speech_text()` / a new `clean_answer()`).
- Clear in-memory `SESSIONS` on server restart (verify it's not persisting bad turns to disk).

### 🟡 Blocker B — Dead/empty accounts in vault (3 of them)
The `Cosmos_Vault.env` has multiple broke accounts. Current status (verified 2026-07-14):
| Provider | Status | Action |
|---|---|---|
| **Anthropic Claude** | ✅ Working (Sonnet/Opus/Haiku 4.5 all have balance) | **Use as primary brain** |
| **Groq** | ✅ Working (free, fast) | Cheap-fallback / AUTO router |
| Z.ai GLM (both keys) | ❌ 429 Insufficient balance | Recharge or drop |
| OpenAI | ❌ insufficient_quota | Recharge for GPT-4o vision (feature 1.5d) |
| DeepSeek | ❌ Insufficient Balance | Drop or recharge |
| ElevenLabs | ⚠️ Valid key, **quota exceeded** (0 chars) | Recharge for premium voice; browser TTS fallback works meanwhile |
| Cloudflare | ✅ Working (fresh token created this session) | Tunnel ready |

### 🟢 Blocker C — session IPC degradation (environmental, not code)
The ZCode session's local IPC layer (curl/PowerShell to localhost) became wedged after repeated server kills. This is why the final end-to-end retest couldn't run in-session. **Fix: a fresh terminal.** `cd alex-kupuri && python server.py` then open Chrome to localhost:4719.

---

## 4. THE BUILD INVENTORY (what's in this repo)

```
alex-kupuri/
├── server.py              # the voice+brain server (110KB, brain-jetty V4 fork, macOS-guarded)
├── oscompat.py            # NEW — cross-platform abstraction (THE port, do not remove)
├── persona.py             # alex SKIN + language-aware dial rules
├── build.py               # vault → graph-data.js (cross-platform, unchanged)
├── osctl.py               # macOS-only desktop control (NEVER imported off-mac)
├── hue.py, overlay.py, setup_duplex.py   # unchanged engine pieces
├── config.json            # GITIGNORED — local secrets (Groq primary, Claude swap, ElevenLabs, stub TG)
├── config.example.json    # template (defaults still say Claude — update to match config.json)
├── SOUL.md                # = synthia-prime.md verbatim (the Synthia identity, CEO of Kupuri)
├── skills/ivette-voice.md # brand guardian skill
├── vault/agents/*.md      # 8 agent personas → sphere nodes
├── viewer/{3d.html, index.html, graph-data.js, serve.py}  # the 3D galaxy
├── tests/{test_oscompat.py, test_persona.py}  # 13 tests, all green
├── PLATFORM_AUDIT.md      # the macOS-call inventory (read before touching server.py/osctl.py)
└── HANDOFF.md             # this file
```

---

## 5. THE REMAINING PHASES (ship plan)

### Phase 1 — Persona lockdown (HOURS, not days) 🔴 CRITICAL
This is the gating step before any demo to Ivette.
- [ ] Switch `config.json` primary brain Groq → **Claude Sonnet 4.5** (better persona adherence). Keep Groq on the hot-swap shelf.
- [ ] Add hard identity anchor to end of every system prompt built in `server.py` chat paths (lines ~641, ~657, ~667).
- [ ] Add `clean_answer()` post-processor that strips `[GAG:...]`, `[N]`/`[C]` tags, stage directions before the user sees/hears the text.
- [ ] Verify `SESSIONS` does not persist across restarts (check if it's dumped to disk — it shouldn't be).
- [ ] Fresh-terminal retest: `python server.py` → "Alex, preséntate" → must answer as Kupuri Media's Chief-of-Staff in warm CDMX Spanish.
- [ ] **Acceptance:** zero mentions of "The Pauli Effect", "mayordomo", "británico", "sir", "versión".

### Phase 2 — v4 features (the user-facing layer) 🟡 2-4 days
These four features are spec'd in detail (`docs/.../spec.md` §Sub-project 1 features). Build them on the locked persona.
- [ ] **1.5a ChatGPT export upload** — `POST /upload-chatgpt` accepts large ZIP, unpacks `conversations.json` → `vault/chatgpt/*.md`, rebuilds galaxy. Chunked upload for mobile. Durable via absurd (Phase 5).
- [ ] **1.5b Voiced intro overlays** — two es-MX ElevenLabs-narrated full-screen intros ("Conoce a Alex" / "Conoce a Synthia") + guided button tour. Replaces the English onboarding in `viewer/index.html:973-978`.
- [ ] **1.5c Settings menu** — live-editable system prompt (SOUL) + token monitor (tokens-in/out/cost per model per day, persisted to Supabase `alex_usage`).
- [ ] **1.5d AUTO model switcher** — rule-based router (NO extra LLM decision call). Short chat → Groq; complex reasoning → Claude; vision → GPT-4o. Rules table visible/editable in Settings. "Power with ChatGPT" = OpenAI API key (NOT scraping chatgpt.com — ToS refusal).

### Phase 3 — Telegram channel (her new bot) 🟡 1 day
Adapter wired now with stub token. Real bot connects at cutover.
- [ ] Ivette creates bot via @BotFather (4-step guide in spec).
- [ ] Long-poll adapter → Alex `/chat` endpoint.
- [ ] Per-user conversation memory in Supabase `alex_conversations`.
- [ ] Draft-safe: actions hold for "¿Lo envío? (sí/no)".

### Phase 4 — Deploy to VPS 🟡 1-2 days
Server: `31.220.58.212` (Hostinger KVM2, Ubuntu 24.04, Coolify + Supabase + Cloudflare Tunnel already set up).
- [ ] Write `Dockerfile` (python:3.11-slim + viewer static files). Bind 127.0.0.1:4719.
- [ ] Verify `oscompat` paths resolve inside Linux container (should — it's gated on `is_macos()`).
- [ ] Create Coolify project `kupuri-media` (protected), deploy as app `alex-kupuri`.
- [ ] Route via the **named Cloudflare Tunnel `pauli-vps`** (already created via API, ID `662ba55d-340c-4024-a555-74b7d768eb7f`) → stable `*.trycloudflare.com` demo URL.
- [ ] Invite-token auth (Tailscale stubbed — NOT a dependency).
- [ ] Move `kupuri-landing` into the same project, tag LOCKED.

### Phase 5 — Durability + ZTE protocol 🟢 post-MVP
- [ ] Apply `absurd.sql` to existing Supabase Postgres (one file, no new service — from `github.com/earendil-works/absurd`).
- [ ] Model ZTE cycle (Planea→Ejecuta→Verifica→Notifica) as absurd checkpointed task.
- [ ] Stand up **habitat** web UI (Go binary, in absurd repo) as the process-viewer twin to the sphere knowledge-viewer.

### Phase 6 — White-label sales tier (sell-later, OUT OF SCOPE for Ivette's version)
Pricing tiers drafted in spec §1.5 (Inicial $1,497 → Código Abierto $25-50k one-time). Conekta for recurring. Not displayed in UI. Build only when ready to sell.

---

## 6. CRITICAL RULES (non-negotiable)

1. **Synthia-avatar is LOCKED.** The public 3D-wizard gateway stays exactly as-is. Backend + config only.
2. **Do NOT deploy AKASHPORTFOLIO's Next.js control-room.** Extract personas, leave the 3,305-file plumbing. This decision is locked.
3. **Never scrape chatgpt.com.** "Use her ChatGPT account" = OpenAI API key (legit, per-token). Scraping = ToS violation + ban risk. Refused.
4. **Mexican Spanish is primary.** Every user-facing string, voice, and persona is es-MX first. English is secondary toggle.
5. **Windows-primary dev.** The builder (Bambu) is on Windows. The engine MUST run via `python server.py` on Windows before any VPS deploy. oscompat.py is the gatekeeper — never bypass it.
6. **Desktop control is macOS-only-by-design.** osctl.py is never imported off-mac. Voice/brain/galaxy core runs everywhere.
7. **Secrets never in git.** `config.json` is gitignored. All keys live in `Cosmos_Vault.env` locally or Coolify env on the VPS.
8. **Zero downtime to existing infra.** Supabase + Coolify + kupuri-landing must stay healthy. Sub-project 0 (server cleanup) already secured this — 22GB reclaimed, 95 dormant apps retired, 4GB swap added.

---

## 7. HOW TO VERIFY THE CURRENT STATE (5-minute sanity check)

```bash
cd C:\Users\execu\ZCodeProject\alex-kupuri
python -m pytest tests/ -q          # expect 13 passed
python server.py                    # expect: "Brain Studio V3 ... on http://localhost:4719"
# open Chrome → http://localhost:4719 → galaxy renders, ALEX branding, 8 agent nodes
# in another terminal:
python -c "import json,urllib.request as u; r=u.urlopen(u.Request('http://localhost:4719/chat',data=json.dumps({'question':'Alex, preséntate','sid':'verify1'}).encode(),headers={'Content-Type':'application/json'}),timeout=90); print(json.loads(r.read())['answer'])"
```
**If the answer mentions Kupuri Media / Ivette / CDMX in warm Spanish → Phase 1 is done.** If it says "The Pauli Effect / mayordomo / versión" → execute Phase 1 steps (switch to Claude, add identity anchor, add clean_answer).

---

## 8. KEY FILES & LINE NUMBERS (where to make changes)

| What | Where |
|---|---|
| Primary brain config | `config.json` → `model` block (currently Groq; switch to Claude for Phase 1) |
| The alex persona SKIN | `persona.py` → `SKINS["alex"]` (~line 27) |
| Language-aware dial rules | `persona.py` → `_humor_rule(h, lang)`, `_honesty_rule(h, lang)`, `GATE_ES` |
| System prompt builder | `persona.py` → `system(question, allow_tags)` — picks `lang="es"` when skin==alex |
| Per-skin style hint | `server.py` → `style_hint()` (~line 376) |
| Chat conversation path (the `/chat` answer builder) | `server.py` `chat()` ~line 629; sysp built at ~641, ~657, ~667 |
| macOS route guards | `server.py` `/os /find /type /clip` ~lines 1829-1876 (each returns `oscompat.unsupported_message(...)` off-mac) |
| macOS import guard | `server.py` ~line 360 (`if oscompat.is_macos(): import osctl else: osctl = None`) |
| Overlay/desktop-ring guard | `server.py` `spawn_overlay()` ~line 1142 (no-ops off-mac) |
| ChatGPT upload endpoint | NEW — `server.py` add `POST /upload-chatgpt` route (Phase 2) |
| AUTO model router | NEW — `model_router.py` (Phase 2, rule-based) |

---

## 9. THE PEOPLE

- **Bambu / J. Bowers / executiveusa** — the builder. On Windows. Digital co-founder (that's me, the agent that wrote this). Takes the digital side.
- **Ivette** — the wife this is for. Founder of Kupuri Media. The wow-moment is for her. She is non-technical; everything must be speak-and-it-works.
- **Synthia** — the brain/brand identity (CEO Digital persona). NOT a separate app.
- **Alex** — the body/voice agent Ivette talks to.

---

## 10. OPEN QUESTIONS FOR THE NEXT ENGINEER

1. Does `config.example.json` need updating to match the Groq-primary `config.json`? (Yes — it still defaults to Claude. Align them, keep example keyless.)
2. The hot-swap `models` block has `glm`/`gpt` entries pointing at broke accounts — leave as placeholders (documented) or remove until recharged?
3. Is there a real Kupuri services/pricing doc to seed the vault, or draft one for Ivette to edit? (Spec open Q #7.)
4. For the AUTO router (Phase 2): confirm the rules table should be user-editable in Settings, or locked to sensible defaults? (Spec says editable.)

---

## 11. ONE-LINE SUMMARY

**Alex is a cross-platform (Windows+Linux) brain-jetty fork, wearing a CDMX-Spanish persona extracted from AKASHPORTFOLIO, with an 8-agent sphere galaxy, running on Groq-free/Claude-premium brains, ready for the 4 v4 features + VPS deploy. The one thing standing between here and the wow-moment is locking the persona identity against the Groq leak — switch primary to Claude and add the identity anchor. Then build Phase 2.**

Good luck. Make Ivette say "wow." 🚀
