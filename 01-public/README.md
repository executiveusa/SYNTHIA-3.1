# Kupuri Media Main Site

Standalone public marketing site for Kupuri Media.

## Repository boundary

This repository owns the public company presence:

- Brand and studio story
- Services and portfolio
- Founder and contact information
- Public SEO and social metadata
- Links to independent Kupuri products

It does not contain SYNTHIA, authentication, onboarding, dashboards, agents, billing, or product APIs. Those remain in `executiveusa/AKASHPORTFOLIO`.

## Commands

```powershell
npm install
npm test
npm run dev
npm run build
```

## Deployment

The site is deployed independently on Vercel. Product calls to action use the external URL configured in the static site content and never depend on internal application routes.
