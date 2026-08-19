from fastapi import FastAPI
from backend.main import app as backend_app

app = FastAPI(title="CareerGap AI")
app.mount("/", backend_app)
