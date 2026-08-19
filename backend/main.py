import json
import os
import re
from pathlib import Path
from typing import Any

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

try:
    from google import genai
except ImportError:
    genai = None

ROOT = Path(__file__).resolve().parent.parent
MAX_RESUME_SIZE = 10 * 1024 * 1024
ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx", ".txt"}


class Analysis(BaseModel):
    readiness_score: int = Field(ge=0, le=100)
    skill_match: int = Field(ge=0, le=100)
    profile_confidence: str
    matched_skills: list[str]
    gaps: list[dict[str, str]]
    roadmap: list[dict[str, str]]
    projects: list[dict[str, str]]
    interview_questions: list[str]


app = FastAPI(title="CareerGap AI API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def extract_text(filename: str, content: bytes) -> str:
    extension = Path(filename).suffix.lower()
    if extension == ".txt":
        return content.decode("utf-8", errors="ignore")
    if extension == ".pdf":
        try:
            from pypdf import PdfReader
            from io import BytesIO

            return "\n".join(page.extract_text() or "" for page in PdfReader(BytesIO(content)).pages)
        except ImportError as exc:
            raise HTTPException(500, "PDF support is not installed.") from exc
    if extension == ".docx":
        try:
            from io import BytesIO
            from docx import Document

            return "\n".join(paragraph.text for paragraph in Document(BytesIO(content)).paragraphs)
        except ImportError as exc:
            raise HTTPException(500, "DOCX support is not installed.") from exc
    if extension == ".doc":
        raise HTTPException(400, "Legacy .doc files are not supported; export the resume as .docx or PDF.")
    raise HTTPException(400, "Use a PDF, DOCX, or TXT resume.")


def parse_json(text: str) -> dict[str, Any]:
    cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", text.strip(), flags=re.IGNORECASE)
    try:
        result = json.loads(cleaned)
    except json.JSONDecodeError as exc:
        raise HTTPException(502, "Gemini returned an invalid analysis. Please try again.") from exc
    if not isinstance(result, dict):
        raise HTTPException(502, "Gemini returned an unexpected analysis format.")
    return result


def analyze_with_gemini(resume_text: str, role: str, github_username: str) -> Analysis:
    if genai is None:
        raise HTTPException(500, "The Gemini SDK is not installed.")
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(503, "GEMINI_API_KEY is not configured on the server.")

    prompt = f"""
You are a career coach and technical recruiter. Analyze the resume below for the target role.
Return ONLY valid JSON matching this exact shape:
{{
  "readiness_score": 0,
  "skill_match": 0,
  "profile_confidence": "High",
  "matched_skills": ["skill"],
  "gaps": [{{"name": "skill", "detail": "why it matters", "priority": "HIGH", "tone": "red", "icon": "◆", "action": "proof project"}}],
  "roadmap": [{{"week": "01", "title": "milestone", "skills": "skill list", "status": "NEXT UP", "tone": "amber"}}],
  "projects": [{{"title": "project", "description": "what to build", "label": "CLOSES A GAP"}}],
  "interview_questions": ["question"]
}}
Use 4-8 matched skills, 3-6 gaps, exactly 4 roadmap entries, 3-4 projects, and 4 interview questions.
Scores must be integers from 0 to 100. The optional GitHub username is evidence context only; do not invent repository facts.
Target role: {role}
GitHub username: {github_username or "not provided"}
Resume:
{resume_text[:30000]}
"""
    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
        contents=prompt,
        config={"response_mime_type": "application/json"},
    )
    return Analysis.model_validate(parse_json(response.text))


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok", "gemini": "configured" if os.getenv("GEMINI_API_KEY") else "missing"}


@app.post("/api/analyze", response_model=Analysis)
async def analyze(
    role: str = Form(...),
    github_username: str = Form(""),
    resume: UploadFile | None = File(None),
    sample: bool = Form(False),
) -> Analysis:
    if resume is None and not sample:
        raise HTTPException(400, "Upload a resume or choose the sample profile.")
    if resume is not None:
        extension = Path(resume.filename or "").suffix.lower()
        if extension not in ALLOWED_EXTENSIONS:
            raise HTTPException(400, "Use a PDF, DOCX, or TXT resume.")
        content = await resume.read()
        if len(content) > MAX_RESUME_SIZE:
            raise HTTPException(400, "That file is larger than 10MB.")
        resume_text = extract_text(resume.filename or "resume.txt", content)
    else:
        resume_text = "Sample profile: Python, SQL, NumPy, Pandas, scikit-learn, Git, and several data projects. Some exposure to machine learning deployment, Docker, PyTorch, AWS, and MLOps is missing."
    if not resume_text.strip():
        raise HTTPException(400, "We could not extract text from that resume.")
    return analyze_with_gemini(resume_text, role, github_username.strip())


@app.exception_handler(HTTPException)
async def http_exception_handler(_, exc: HTTPException) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


app.mount("/", StaticFiles(directory=ROOT, html=True), name="static")
