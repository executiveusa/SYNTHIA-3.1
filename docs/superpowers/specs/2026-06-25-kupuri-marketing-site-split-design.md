# Kupuri Marketing Site Split Design

## Objective

Launch an independent Kupuri Media company website without moving or changing SYNTHIA product code.

## Architecture

The new repository is a static Vite site deployed as its own Vercel project. It owns public company content, visual assets, bilingual copy, portfolio sections, and contact entry points. All product actions cross an explicit HTTPS boundary to the existing SYNTHIA deployment.

## Ownership

This repository owns:

- `/` company homepage
- `/contact` contact page
- Kupuri brand images, typography, and animation code
- Search and social metadata
- Public hosting configuration

`executiveusa/AKASHPORTFOLIO` continues to own:

- SYNTHIA product pages
- Authentication and onboarding
- Cockpit and dashboard routes
- Agent services and APIs
- Billing and operational data

## Migration Rules

- Do not copy AI SDK dependencies or product server code.
- Do not redirect first-time visitors into onboarding.
- Do not use relative links for product routes.
- Do not modify the dirty AKASHPORTFOLIO worktree.
- Preserve the existing Kupuri visual language while removing stale template documentation and misleading form behavior.
- Keep third-party font files isolated and document that their license must be confirmed by the owner.

## Contact Behavior

The first production release uses direct email composition instead of pretending a backend accepted a form. A later release may add a verified form provider or a dedicated API endpoint.

## Verification

- Static boundary tests
- Production Vite build
- Desktop and mobile browser checks
- Lighthouse accessibility, SEO, and best-practices audits
- Hosted URL smoke test
