# AGENTS — Map of SYNTHIA 3.1

> **Name:** always **SYNTHIA** (S, never C). Fix "Cynthia" on sight.

## Where things live

- **Public gateway** → `00-gateway/` (SYNTHIA-avatar, locked)
- **Company site** → `01-public/` (Vite, deploy to Vercel)
- **Cockpit** → `02-cockpit/` (Tauri desktop app, Phase C)
- **Backend brain** → `03-brain/apps/control-room/` (Next.js)
  - Sphere viewer: `src/components/SphereField.tsx`, `Theater3D.tsx`
  - Sphere physics: `src/shared/sphere-state.ts`
  - Event protocol: `src/shared/council-events.ts`
  - Council engine: `src/lib/council-engine.ts`
  - Alex agent: `src/lib/alex-agent.ts`
  - API routes: `src/app/api/` (~110 routes)
- **Design doctrine** → `04-doctrine/doctrine/` (DESIGN_LAWS.md, udec-rubric.yaml, etc.)
- **Voice engine** → `05-voice/` (python, brain-jetty fork)

## How to work here

1. Always read `CLAUDE.md` first.
2. For frontend: read `04-doctrine/doctrine/DESIGN_LAWS.md` + `kupuri-frontend-SKILL.md`.
3. For spheres: read `03-brain/apps/control-room/src/shared/sphere-state.ts` + `council-events.ts`.
4. For personas: the canonical roster is in CLAUDE.md. Legacy .md files in 03-brain/agents/ are reconciled in Phase B.
5. Deploy: `01-public` + `00-gateway` → Vercel; `03-brain` + `05-voice` → Hostinger VPS (Coolify).

## Known issues (Phase B targets)

- `03-brain/.../src/lib/swarm.ts` is STALE — delete in Phase B.
- `/dashboard` calls `/api/tasks` (doesn't exist).
- `/api/spheres/status` returns hardcoded standby.
- Memory embeddings are placeholder.
- 3 tables used in code missing from migrations.
- "Cynthia" appears in imported docs — rename to SYNTHIA.
