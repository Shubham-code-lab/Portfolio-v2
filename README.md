# Portfolio

Static portfolio served by GitHub Pages from this repository root.

- Source: [`portfolio-code/`](portfolio-code/)
- Live site: built `index.html` and `assets/` at the repo root
- Changelog / publish switch: [`release.json`](release.json)

Local development:

```bash
cd portfolio-code
npm install
npm run dev
```

## Publish a new site

1. In a PR, bump `version` and `description` in `release.json` and set `"publish": true`.
2. Merge that PR into `main`.
3. The publish workflow rebuilds the site, replaces root `index.html` / `assets/`, then sets `publish` back to `false`.

If `publish` is `false`, merging to `main` does not change the live site.

## GitHub (one-time)

**Pages:** Settings → Pages → Deploy from a branch → `main` → `/` (root).

**Protect `main`:** require a pull request (no direct pushes). Allow **GitHub Actions** to bypass that rule so the publish job can commit the built site.
