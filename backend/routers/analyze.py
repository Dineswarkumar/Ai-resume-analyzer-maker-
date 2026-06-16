from fastapi import APIRouter, HTTPException
from models import ResumeData, AnalysisResult
from ml.scorer import analyze_resume

router = APIRouter()


@router.post("/", response_model=AnalysisResult)
async def analyze(resume: ResumeData):
    """
    Analyze a resume and return a detailed score with improvement suggestions.
    Call this in real-time as the user fills the form.
    """
    try:
        result = analyze_resume(resume)
        return result
    except Exception as e:
        raise HTTPException(500, f"Analysis failed: {e}")


@router.post("/quick-score")
async def quick_score(resume: ResumeData):
    """Return just the total score (for frequent polling)."""
    result = analyze_resume(resume)
    return {
        "total_score": result.total_score,
        "grade": result.grade,
        "ats_compatibility": result.ats_compatibility
    }
