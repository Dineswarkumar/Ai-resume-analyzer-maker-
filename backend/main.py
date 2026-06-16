from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from routers import resume, analyze, templates

app = FastAPI(
    title="AI Resume Maker API",
    description="Full-stack ML-powered resume builder and analyzer",
    version="1.0.0"
)

# CORS — allow React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount exports folder as static
os.makedirs("exports", exist_ok=True)
app.mount("/exports", StaticFiles(directory="exports"), name="exports")

# Include routers
app.include_router(resume.router, prefix="/api/resume", tags=["Resume"])
app.include_router(analyze.router, prefix="/api/analyze", tags=["Analyze"])
app.include_router(templates.router, prefix="/api/templates", tags=["Templates"])


@app.get("/")
def root():
    return {"status": "ok", "message": "AI Resume Maker API is running 🚀"}


@app.get("/health")
def health():
    return {"status": "healthy"}
