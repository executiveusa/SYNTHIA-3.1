# Kupuri Marketing Site Launch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the existing Kupuri company marketing experience as an independent, tested Vercel site.

**Architecture:** Migrate only the static Vite marketing surface and its owned assets. Replace all hidden product coupling with explicit external links to the existing SYNTHIA deployment.

**Tech Stack:** HTML, CSS, JavaScript modules, Vite, GSAP, Lenis, Node test runner, Vercel.

---

### Task 1: Establish the repository boundary

**Files:**
- Create: `tests/site-boundary.test.mjs`
- Create: `docs/superpowers/specs/2026-06-25-kupuri-marketing-site-split-design.md`
- Modify: `README.md`

- [ ] Add tests that reject onboarding keys, automatic redirects, and relative app routes.
- [ ] Run `npm test` and confirm it fails because the marketing source is absent.

### Task 2: Migrate the public site

**Files:**
- Create: `index.html`
- Create: `contact.html`
- Create: `css/*.css`
- Create: `js/*.js`
- Create: `public/images/**`
- Create: `public/fonts/**`

- [ ] Copy only the public Vite application and assets from `apps/web`.
- [ ] Remove the onboarding redirect.
- [ ] Replace product links with `https://kupuri-media-cdmx.vercel.app/landing`.
- [ ] Replace fake contact success behavior with a prefilled email action.
- [ ] Run `npm test` and confirm the boundary tests pass.

### Task 3: Make the site independently deployable

**Files:**
- Create: `vercel.json`
- Create: `THIRD_PARTY_NOTICES.md`
- Modify: `package.json`

- [ ] Keep only Vite, GSAP, and Lenis dependencies.
- [ ] Add clean-route rewrites and security headers.
- [ ] Document upstream inspiration and the font-license verification requirement.
- [ ] Run `npm install` and `npm run build`.

### Task 4: Browser verification

- [ ] Start the production preview.
- [ ] Verify `/` and `/contact` on desktop and mobile.
- [ ] Confirm images, menu, language controls, animations, email action, and SYNTHIA link.
- [ ] Run Lighthouse accessibility, SEO, and best-practices audits.

### Task 5: Publish

- [ ] Review `git diff` and repository status.
- [ ] Commit the isolated marketing-site migration.
- [ ] Push `main` to `origin`.
- [ ] Link or create the Vercel project.
- [ ] Deploy and smoke-test the hosted URL.
