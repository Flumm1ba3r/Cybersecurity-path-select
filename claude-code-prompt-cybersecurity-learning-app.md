# Claude Code Prompt — Build the Cybersecurity Career Exploration App

You are an experienced product designer and senior frontend engineer. Build a polished, responsive web app around the accompanying **Cybersecurity Career Exploration — 5-Week Practical Plan**.

The app will be published in a **public GitHub repository** and hosted using **GitHub Pages**. It must work as a static website: no backend, no paid APIs, no secrets, and no server-side dependencies.

## 1. Start by inspecting the repository

Before changing anything:

1. Inspect the existing repository structure, package manager, framework, scripts and deployment setup.
2. Identify whether this is an existing project or an empty repository.
3. Preserve useful existing work. Do not overwrite or delete files without understanding their purpose.
4. If the repository is empty, create a modern, lightweight frontend using **Vite + React + TypeScript**.
5. Use the package manager already present. If none exists, use npm.
6. Explain briefly which framework and deployment approach you selected, then implement the app. Do not stop after producing a plan or mockup.

The supplied Markdown plan is the source of truth for the programme content:

`cybersecurity-career-exploration-5-week-plan.md`

If the file is not in the repository, ask me to add it or locate it in the current workspace. Do not silently invent missing challenge names, video URLs, walkthroughs, prices or claims.

## 2. Product goal

Create a personal learning dashboard that makes the five-week programme easy to follow day by day.

The five disciplines are:

1. DFIR / Digital Forensics & Incident Response
2. Malware Analysis
3. Reverse Engineering
4. Red Team / Penetration Testing
5. Threat Hunting / Detection Engineering

The user wants to understand what people in these jobs actually do, through practitioner videos, recorded investigations, named practical challenges and step-by-step walkthroughs. This is a career exploration programme, not a generic course catalogue.

The app should answer at a glance:

- What week am I on?
- What should I do today?
- Which video should I watch?
- Which exact challenge should I complete?
- Where is the walkthrough?
- What have I completed?
- What did I learn, and which discipline did I enjoy most?

## 3. Design direction — premium cybersecurity editorial aesthetic

Make the app visually impressive, but not a cliché “hacker terminal” or neon-green Matrix clone.

Use a refined dark visual identity:

- Main background: deep midnight navy / blue-black.
- Surfaces: layered slate / charcoal-blue cards.
- Primary accent: vivid electric cyan / teal for navigation, progress and active states.
- Secondary accent: restrained violet for reverse engineering / analysis.
- Warm amber for warnings, notes and items requiring attention.
- Green only for completed states / positive progress.
- Text: high-contrast off-white with muted blue-grey secondary text.

Suggested palette (you may tune it for contrast and polish):

- `#07111F` — page background
- `#0D1B2A` — primary surface
- `#13263A` — elevated surface
- `#1C344A` — borders / dividers
- `#E8F1F8` — primary text
- `#9FB2C5` — secondary text
- `#35D0C3` — primary accent
- `#7C8CFF` — secondary accent
- `#F2B66D` — warning / attention
- `#5CCB8A` — completion

Design principles:

- High-quality typography, generous spacing, clear hierarchy.
- Subtle gradients and restrained glow, not excessive effects.
- Strong visual identity with small line icons and simple diagrams.
- Consistent visual language across dashboard, week pages and daily tasks.
- Smooth but restrained transitions; respect `prefers-reduced-motion`.
- Accessible colour contrast, keyboard navigation, visible focus states and semantic HTML.
- Responsive from mobile to desktop. Mobile should feel deliberately designed, not just squeezed desktop UI.
- Avoid huge hero sections that push the actual work below the fold.

Use a clean, modern font stack. If using an external font, provide a system fallback and do not make the app dependent on that font loading.

## 4. Information architecture and screens

### A. Dashboard / Home

Create an attractive home dashboard with:

- App title: **Cybersecurity Field Notes**
- Subtitle: **Five weeks. Five disciplines. One informed career decision.**
- Overall programme progress.
- Five week cards with discipline, short description, status, progress and estimated weekly effort.
- “Continue where you left off” card that opens the next incomplete daily task.
- A “Today’s mission” panel showing the next task, video and challenge link.
- A compact “Your exploration” panel showing reflection scores once entered.
- A small safety / access reminder for malware labs and paid platform challenges.

The dashboard must not assume the user is on a particular week. Derive the next task from saved progress.

### B. Week detail pages

Each of the five weeks must have its own detail page or route.

Each week page should show:

1. Week number and discipline.
2. Role scenario / real-world use case.
3. The central investigative question.
4. Exact practical assignment and challenge name.
5. Challenge difficulty / platform / access note, where supplied by the plan.
6. Videos in a dedicated media section.
7. Daily schedule, clearly separated into Day 1–Day 5.
8. Walkthrough links.
9. Tools and concepts encountered.
10. Weekly deliverables.
11. Weekly reflection scorecard.

Daily schedule requirements:

- Each day is an actionable checklist.
- Tasks should be individually checkable.
- Show the expected time if provided; otherwise do not invent a precise duration.
- Allow a short personal note per day.
- Show daily completion state.
- Show a clear “next task” action.
- Do not mark a day complete merely because the user opened it.

### C. Video experience

The user explicitly wants videos embedded in the app.

For each video:

- Display a thumbnail / video card with title, source/channel, purpose and approximate duration only when provided in the plan.
- Embed YouTube videos using a responsive iframe with `https://www.youtube-nocookie.com/embed/VIDEO_ID`.
- Use `loading="lazy"`, a meaningful `title`, and an accessible allow list.
- Do not autoplay.
- If a URL is not a YouTube watch URL or a valid YouTube video ID cannot be confidently extracted, show a polished external-link card instead of a broken iframe.
- For BrightTALK or other non-YouTube recordings, use an external-link card unless a reliable official embed is available.
- Add a “Watch on YouTube” / “Open recording” link as a fallback.
- Never invent or guess video IDs.
- Keep embeds collapsed or lazy-loaded until the user opens a video, so the page remains fast and avoids loading many third-party players at once.

### D. Practical challenge and walkthrough cards

Each challenge card must visibly distinguish:

- **Challenge** — the exact hands-on assignment.
- **Walkthrough** — the official or named guide.
- **Watch first** — videos that provide context.
- **Access** — free / premium / account required only where the source plan explicitly says so.
- **Safety** — especially for malware and offensive security labs.

Use clear external-link icons and open external resources in a new tab with safe `rel` attributes.

Do not describe a challenge as free, premium or available unless that information is present in the plan and label it as something to verify because access can change.

### E. Programme reflection and comparison

Create a final comparison page with:

- Five disciplines.
- Editable 1–5 scores for enjoyment, curiosity, daily-job fit and practical completion.
- Text areas for observations.
- A comparison view (simple bar chart or radar chart is fine if accessible and legible).
- A summary of the user's highest-rated disciplines.
- A warning that the score is a personal reflection aid, not an objective career aptitude test.

Allow the user to export their reflections as Markdown or JSON.

## 5. Persistence and privacy

This is a static GitHub Pages app. Persist progress locally in the browser using `localStorage`.

Persist:

- Completed daily tasks.
- Completed days and weeks (derived where possible).
- Personal notes.
- Reflection scores.
- Current / last-opened week.
- Theme preference if a light mode is included.

Requirements:

- No account, login or backend.
- Add a clear “Reset my progress” action with confirmation.
- Add export / import backup for progress as JSON.
- Validate imported JSON before applying it.
- Explain in a small privacy note that progress is stored locally in the current browser/device and is not automatically synced between devices.
- Do not store secrets, passwords or sensitive personal data.

## 6. Content architecture

Keep programme content data-driven and separate from UI components.

Suggested structure:

```text
src/
  app/
  components/
    AppShell
    Sidebar
    MobileNavigation
    ProgressRing
    WeekCard
    VideoCard
    VideoEmbed
    ChallengeCard
    DailyTaskList
    ReflectionForm
    SafetyNotice
  data/
    programme.ts
  pages/
    DashboardPage
    WeekPage
    ReflectionPage
    AboutPage
  hooks/
    useProgress
  lib/
    storage
    exportImport
    youtube
  styles/
```

Adapt this structure to the existing repository rather than forcing it if a good structure already exists.

Represent each week in typed data with:

- `id`, `number`, `title`, `subtitle`, `scenario`, `centralQuestion`
- `challenge`: title, platform, URL, difficulty if provided, description, access note
- `videos`: title, URL, source, purpose, duration if provided, optional YouTube ID only when reliably derived
- `walkthroughs`: title, URL, source / type
- `days`: day number, title, tasks, deliverable
- `toolsAndConcepts`
- `weeklyReflectionQuestions`
- `careerReality`

Keep original plan content accurate. You may lightly edit for UI readability, but do not change the exact challenge, sample, video or walkthrough names and URLs without checking with me.

## 7. Navigation and interactions

- Desktop: elegant left sidebar with Dashboard, Week 1–5, Career Reflection and About.
- Mobile: compact bottom navigation or a well-designed menu.
- Active week and current task should be visually obvious.
- All buttons and links must work.
- Use accessible labels and keyboard support.
- Include breadcrumbs or clear back navigation on detail pages.
- Add a “Mark day complete” interaction, but completion should also be derivable from the individual task checkboxes.
- Show progress at programme, week, day and task levels.
- Avoid decorative controls that do nothing.

## 8. GitHub Pages deployment

Set up the project so it can be published at:

`https://<github-username>.github.io/<repository-name>/`

Requirements:

1. Configure Vite `base` correctly for a GitHub Pages project site. Do not assume the repository name; make it easy to configure.
2. Use `HashRouter` or another GitHub Pages-safe routing strategy so refreshing a nested route does not return a 404.
3. Add a GitHub Actions workflow to build and deploy the site to GitHub Pages.
4. Use the official GitHub Pages Actions deployment approach (`actions/configure-pages`, `actions/upload-pages-artifact`, `actions/deploy-pages`) with appropriate permissions and concurrency.
5. Add a README with:
   - Local setup and run commands.
   - Build command.
   - How to enable GitHub Pages.
   - How to configure the repository / base path.
   - How local progress storage works.
6. Do not include personal information in the public repository.

## 9. Quality requirements

- No dead buttons, placeholder routes, lorem ipsum or fake content.
- No broken image dependencies. Prefer CSS illustrations, icons or locally stored assets where appropriate.
- Do not use random stock photos as filler. A polished interface can use subtle diagrams, abstract shapes and clear typography instead.
- Ensure all five weeks are populated from the Markdown plan.
- Add sensible empty states for reflections and progress.
- Add loading and error handling for video embeds where feasible.
- Ensure the app works when deployed under a repository subpath.
- Run the production build and fix all errors.
- Run lint / type checks if configured.
- Test mobile layout and all navigation routes.
- Verify all external URLs are taken from the plan; do not invent replacements.

## 10. Deliverables

Implement the complete working app, then provide:

1. A short summary of the architecture and design.
2. The files created / changed.
3. Commands to run locally.
4. Exact GitHub repository settings needed to enable Pages.
5. Any assumptions or content links that need my verification.
6. A checklist confirming build, routing, progress persistence, export/import and mobile layout were tested.

**Do not stop at a design proposal. Build the application in the repository.**
