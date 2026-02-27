# Hosting Plan — GitHub Pages

## Objective
Deploy `meet_vocab` to GitHub Pages from this same repo, with automatic deploy on push to `main`.

## Scope
- Static frontend only (Vite build output in `dist`).
- No backend/service changes.
- Keep current app behavior unchanged.

## Repo
- SSH remote: `git@github.com:favrei/meet_vocab.git`
- Expected Pages URL: `https://favrei.github.io/meet_vocab/`

## Deployment Strategy
1. Ensure git remote is configured.
2. Add GitHub Actions workflow to build and deploy Pages.
3. Set Vite production `base` to `/meet_vocab/`.
4. Verify local `test` and `build`.
5. Push to `main`, then validate public URL.

## Status (2026-02-27)
- `origin` remote configured to `git@github.com:favrei/meet_vocab.git` ✅
- GitHub Pages workflow added at `.github/workflows/deploy.yml` ✅
- Vite production base path configured in `vite.config.ts` ✅
- README hosting section added ✅
- Local verification passed:
  - `npm test` (15/15 passing) ✅
  - `npm run build` (production build success) ✅

## Changes Applied
- `.github/workflows/deploy.yml`
  - Trigger: push to `main` + manual dispatch.
  - Jobs: build (`npm ci`, `npm run build`, upload artifact) and deploy (`actions/deploy-pages`).
- `vite.config.ts`
  - Production base path set to `/meet_vocab/`.
- `README.md`
  - Added hosting section with repo, URL, and deploy mechanism.

## Remaining Manual Steps
1. Commit and push current changes to `main`.
2. In GitHub repo settings, set Pages source to `GitHub Actions` (if not auto-set).
3. Confirm deployment job succeeds and URL loads:
   - `https://favrei.github.io/meet_vocab/`

## Acceptance Criteria
- Pages workflow runs successfully on `main`.
- App loads at `/meet_vocab/` with assets resolving correctly.
- No test/build regressions from hosting changes.
