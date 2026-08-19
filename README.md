# CareerGap AI

**Your Skills. Your Target. Your Roadmap.**

> Don't just learn the missing skill. Build the project that proves you have it.

CareerGap AI turns a resume and a target job role into a clear, evidence-first action plan:
job-readiness score, prioritized skill gaps, a week-by-week roadmap, portfolio projects that
prove each gap is closed, and interview preparation topics.

## Features

- **Resume upload** with drag-and-drop, type and 10MB size validation, plus a sample profile for instant demos.
- **Target role selection** across AI/ML Engineer, Full Stack, Backend, Data Scientist, Cloud Engineer, and Product Analyst.
- **Deterministic job-readiness score** with a transparent breakdown (skill match, project evidence, GitHub evidence, other factors).
- **Skill match view** separating matched skills from prioritized gaps (HIGH / MEDIUM).
- **Roadmap** covering four focused weeks, each ending in something demonstrable.
- **Portfolio projects** mapped to the gaps they close.
- **Interview preparation** with technical questions and behavioral stories.
- **Responsive SaaS-style UI** that works on desktop and mobile.

## Tech Stack

- HTML5
- CSS3 (custom design system, no framework)
- Vanilla JavaScript (no build step, no dependencies)

The scoring and gap analysis run locally and deterministically, so the demo works offline
with no API keys required.

## Project Structure

```
CareerGapAI/
├── index.html    # Landing/upload flow, dashboard, and detail sections
├── styles.css    # Design system, layout, charts, responsive rules
├── app.js        # Navigation, upload validation, analysis rendering
└── README.md
```

## Run Locally

Clone the repository and serve the folder with any static server:

```bash
git clone https://github.com/bankarsamendra04-eng/CareerGapAI.git
cd CareerGapAI
python3 -m http.server 4173
```

Then open http://localhost:4173 in your browser.

You can also open `index.html` directly in a browser — there is no build step.

## How to Use

1. Drop in a resume (PDF, DOCX, or TXT) or click **Use sample profile**.
2. Pick your target job role and optionally add a GitHub username.
3. Click **Analyze my career fit**.
4. Explore **Skill gaps**, **Roadmap**, **Projects**, and **Interview prep** from the sidebar.

## Deployment

The app is fully static, so it can be deployed to any static host (Netlify, Vercel, GitHub Pages,
Cloudflare Pages) by publishing the repository root.

## Roadmap

Planned integrations that fit behind the current interfaces:

- FastAPI backend with SQLite/SQLAlchemy persistence
- Gemini-powered resume extraction returning structured JSON
- GitHub REST API evidence checks
- "What if I learn this?" score simulation
