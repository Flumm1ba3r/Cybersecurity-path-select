# Cybersecurity Field Notes

**Five weeks. Five disciplines. One informed career decision.**

A static, personal learning dashboard for the
[Cybersecurity Career Exploration — 5-Week Practical Plan](./cybersecurity-career-exploration-5-week-plan.md).
Compare DFIR, malware analysis, reverse engineering, red teaming / penetration testing and threat hunting / detection engineering through practitioner videos, named challenges and walkthroughs. Then record which discipline suits you.

- Vite + React + TypeScript, `HashRouter` (safe on GitHub Pages)
- No backend, no accounts, no API keys. Progress lives in your browser's `localStorage`.
- Content is data-driven: [`src/data/programme.ts`](./src/data/programme.ts) is transcribed from the plan (the source of truth).

## Run locally

Requires Node.js 20.19+ (22 recommended).

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
npm run lint       # ESLint
npm run check-links  # re-verify every external link (see below)
```

## Deploy to GitHub Pages

1. Push to `main`. The workflow in [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) lints, builds and deploys with the official `actions/configure-pages`, `actions/upload-pages-artifact` and `actions/deploy-pages`.
2. One-time setup: in the repository, open **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. The site is published at `https://<github-username>.github.io/<repository-name>/`.

### Base path

- The workflow sets `BASE_PATH=/<repository-name>/` automatically from the repository name, so forks and renames work unchanged.
- Locally, the default base is `./` (relative), which works under any sub-path because routing uses URL hashes (`#/week/1`).
- To pin a base manually: `BASE_PATH=/my-repo/ npm run build`. The setting lives in [`vite.config.ts`](./vite.config.ts).
- For a user/organisation site (`<user>.github.io`), use `BASE_PATH=/`.

## How progress is stored

- Everything you enter is saved in `localStorage` under the key `cyber-field-notes:v1`. That covers ticked tasks, day notes, weekly reflection scores, comparison scores, observations and the last-opened week.
- Data stays on the current browser/device. It is **not** synced between devices, and clearing site data removes it.
- **About & Settings** has an *Export JSON backup* button, an *Import backup* button (the file is validated before anything is replaced) and *Reset my progress* (with confirmation).
- **Career Reflection** exports your reflections as Markdown or JSON.
- Day and week completion are derived from the task checkboxes. "Mark day complete" simply ticks every task of that day.

## External links & availability

Training-platform access and video availability change over time, so the app never shows a broken embed silently:

- `scripts/check-links.mjs` checks every URL. Pages must load with their expected content, and YouTube videos are checked for being public and embeddable via oEmbed. Results are written to `src/data/link-status.json`.
- Each challenge, walkthrough and video shows a status badge: *Link checked*, *Access restricted*, *Sign-in required*, *Embedding disabled*, *Unavailable* or *Not checked*. Resources that need attention also get a short explanation. The full table is on **About → Resource & link status**.
- YouTube embeds use `youtube-nocookie.com`, stay collapsed until you click play, and never autoplay. If a video's thumbnail fails to load at runtime (removed, private or blocked), the card switches to a clear "Video unavailable" state with a direct link instead of an iframe.
- Channels and the BrightTALK recording are shown as external-link cards.

Re-run `npm run check-links` before publishing changes and commit the updated JSON. Never substitute a different challenge or video without updating the plan first.

## Project structure

```text
src/
  components/   AppShell, VideoCard, ChallengeCard, DayCard, WeekCard, StoredTextarea, ui (rings, bars, notices, score input)
  data/         programme.ts (content), link-status.json (generated), types.ts
  hooks/        useProgress (context + localStorage persistence)
  lib/          storage (validation), progress (derived state), exportImport, youtube, linkStatus
  pages/        DashboardPage, WeekPage, ReflectionPage, AboutPage, NotFoundPage
  styles/       global.css (design tokens + layout)
scripts/        check-links.mjs
```

## Safety

Run malware exercises only inside the official lab environment or an isolated VM. Attack only the Hack The Box machine assigned to you, within the platform's rules.
