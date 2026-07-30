# SYNTHIA 3.1 — The Kupuri Media Operating System

The single consolidated monorepo for the Kupuri Media AI agency platform.
Organized by the ICM / Model Workspace Protocol: **the folder IS the architecture,
the markdown IS the dispatch, one agent reads the right files at the right time.**

> **Branding rule (non-negotiable):** The name is always **SYNTHIA** (with an S).
> Never "Cynthia", never "Cinthia", never any other spelling. Any occurrence of
> "Cynthia" in imported code is a bug to be fixed in Phase B.

## Folder map (ICM numbered = the flow)

| Folder | What | Status | Deploy |
|---|---|---|---|
| `00-gateway/` | Ivette's personal gateway (3D wizard). **LOCKED.** | Live | Vercel |
| `01-public/` | Kupuri Media company site + blog | Live | Vercel |
| `02-cockpit/` | The master cockpit (desktop app) | EMPTY — built Phase C | Tauri (Mac/Win) |
| `03-brain/` | The engine room (council engine, spheres, Supabase, API) | 70% real — Phase B fixes joints | Hostinger VPS |
| `04-doctrine/` | Design laws, UDEC rubric, Emerald Tablets. Read by everything. | Canonical | N/A (read-only) |
| `05-voice/` | The voice engine (Alex, CDMX Spanish, 3D galaxy) | Built | Hostinger VPS |

## The agent roster (canonical 9 Sphere OS agents)

`synthia` (CEO), `alex` (Chief-of-Staff/voice), `cazadora` (sales), `forjadora` (build),
`seductora` (content), `consejo` (strategy), `dr-economia` (finance),
`dra-cultura` (brand), `ing-teknos` (engineering). + `la-vigilante` (guardian, off-ring).

Legacy named agents (ralphy/indigo/merlina/morpho/clandestino/fany/ivette-voice)
are reconciled INTO these 9 in Phase B. Until then, they live in 03-brain's agents/.

## Rules (non-negotiable)

1. **00-gateway is LOCKED.** No code changes without explicit approval.
2. **The name is SYNTHIA.** Fix any "Cynthia" on sight.
3. **Mexican Spanish is primary.** Every user-facing string is es-MX first.
4. **Read 04-doctrine before any frontend work.** The DESIGN_LAWS, UDEC rubric
   (≥8.5 floor), and Sacred Earth palette are binding. No purple. No neon.
5. **The folder IS the architecture.** Don't add multi-agent frameworks — the
   markdown in agents/ + the council engine is the orchestration.
6. **Secrets never in git.** config.json and .env are gitignored.
7. **One repo, webhooks connect deployments.** No cross-service direct calls.

## Current phase

Phase A (this consolidation) — DONE.
Phase B (fix broken joints in 03-brain, collapse roster, fix Cynthia→Synthia) — NEXT.
Phase C (build the cockpit in 02-cockpit) — AFTER B.
