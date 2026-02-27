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
- First workflow run triggered after push (`run #1`) but failed at `Configure GitHub Pages` because Pages site was not initialized yet (`Get Pages site failed: Not Found`) ✅ diagnosed
- Workflow updated to include `enablement: true` in `actions/configure-pages@v5` to auto-enable Pages on first deploy ✅

## Changes Applied
- `.github/workflows/deploy.yml`
  - Trigger: push to `main` + manual dispatch.
  - Jobs: build (`npm ci`, `npm run build`, upload artifact) and deploy (`actions/deploy-pages`).
- `vite.config.ts`
  - Production base path set to `/meet_vocab/`.
- `README.md`
  - Added hosting section with repo, URL, and deploy mechanism.

## Remaining Manual Steps
1. In GitHub repo settings, enable Pages and set source to `GitHub Actions`.
2. Re-run or re-trigger the deploy workflow after Pages is enabled.
3. Confirm deployment job succeeds and URL loads:
   - `https://favrei.github.io/meet_vocab/`

## Current Blocker (2026-02-27)
- Workflow runs `#1` and `#2` failed at `Configure GitHub Pages` before build steps.
- Root cause: Actions token cannot create initial Pages site (`Create Pages site failed: Resource not accessible by integration`).
- Evidence:
  - Run #1: `https://github.com/favrei/meet_vocab/actions/runs/22468686356`
  - Run #2: `https://github.com/favrei/meet_vocab/actions/runs/22468715398`
- API check for Pages site currently returns `404 Not Found`:
  - `GET https://api.github.com/repos/favrei/meet_vocab/pages`

## Acceptance Criteria
- Pages workflow runs successfully on `main`.
- App loads at `/meet_vocab/` with assets resolving correctly.
- No test/build regressions from hosting changes.
