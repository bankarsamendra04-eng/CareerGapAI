# CareerGap AI

**Your Skills. Your Target. Your Roadmap.**

> Don't just learn the missing skill. Build the project that proves you have it.

CareerGap AI turns a resume and a target job role into a clear, evidence-first action plan:
job-readiness score, prioritized skill gaps, a week-by-week roadmap, portfolio projects that
prove each gap is closed, and interview preparation topics.

## Features

- **Resume upload** with drag-and-drop, PDF/DOCX/TXT type and 10MB size validation, plus a sample profile for instant demos.
- **Target role selection** across AI/ML Engineer, Full Stack, Backend, Data Scientist, Cloud Engineer, and Product Analyst.
- **Deterministic job-readiness score** with a transparent breakdown (skill match, project evidence, GitHub evidence, other factors).
- **Skill match view** separating matched skills from prioritized gaps (HIGH / MEDIUM).
- **Roadmap** covering four focused weeks, each ending in something demonstrable.
- **Portfolio projects** mapped to the gaps they close.
- **Interview preparation** with technical questions and behavioral stories.
- **GitHub evidence** with public repository and follower context when a username is supplied.
- **Responsive SaaS-style UI** that works on desktop and mobile.

## Tech Stack

- HTML5
- CSS3 (custom design system, no framework)
- Vanilla JavaScript
- Python, FastAPI, and Google Gemini

Resume extraction and career analysis run through the FastAPI backend and Gemini. The API key
stays server-side and is never sent to the browser. The optional GitHub lookup only uses the
public profile API and does not invent repository evidence.

## Project Structure

```
CareerGapAI/
├── index.html    # Landing/upload flow, dashboard, and detail sections
├── styles.css    # Design system, layout, charts, responsive rules
├── app.js        # Navigation, upload validation, analysis rendering
├── backend/
│   └── main.py   # FastAPI API and Gemini integration
├── requirements.txt
├── pyproject.toml
├── .env.example
└── README.md
```

## Run Locally

Install the backend dependencies and configure Gemini:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and set GEMINI_API_KEY
set -a && source .env && set +a
uvicorn backend.main:app --reload --port 8000
```

Then open http://localhost:8000. `GET /api/health` confirms the API is running and whether
the Gemini key is configured.

You can also open `index.html` directly in a browser — there is no build step.

## How to Use

1. Drop in a resume (PDF, DOCX, or TXT) or click **Use sample profile**.
2. Pick your target job role and optionally add a GitHub username.
3. Click **Analyze my career fit**.
4. Explore **Skill gaps**, **Roadmap**, **Projects**, and **Interview prep** from the sidebar.

## Deployment

Deploy the FastAPI app to a Python host such as Fly.io, Render, or Railway. Set
`GEMINI_API_KEY` as a server environment variable and serve the repository root through the
included FastAPI app.

## Roadmap

Planned integrations that fit behind the current interfaces:

- SQLite/SQLAlchemy persistence
- GitHub REST API evidence checks
- "What if I learn this?" score simulation
