from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
import json

from models import ResumeData, ParsedResumeResponse, GenerateRequest
from services.parser import parse_resume, extract_text
from services.exporter import export_to_pdf, export_to_docx

router = APIRouter()


@router.post("/parse", response_model=ParsedResumeResponse)
async def parse_resume_file(file: UploadFile = File(...)):
    """Upload a PDF/DOCX/Excel/TXT resume and extract structured data."""
    allowed = {"pdf", "docx", "doc", "xlsx", "xls", "txt"}
    ext = file.filename.lower().rsplit(".", 1)[-1]
    if ext not in allowed:
        raise HTTPException(400, f"Unsupported file type: .{ext}. Allowed: {allowed}")

    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:  # 10 MB limit
        raise HTTPException(400, "File too large. Max 10MB.")

    try:
        resume_data, raw_text, confidence = parse_resume(contents, file.filename)
    except ValueError as e:
        raise HTTPException(422, str(e))

    return ParsedResumeResponse(
        resume_data=resume_data,
        raw_text=raw_text[:3000],  # truncate for response
        confidence=confidence
    )


@router.post("/export/pdf")
async def export_pdf(request: GenerateRequest):
    """Generate and download a PDF resume."""
    try:
        filepath = export_to_pdf(request.resume_data, request.resume_data.template)
        return FileResponse(
            filepath,
            media_type="application/pdf",
            filename="resume.pdf"
        )
    except Exception as e:
        raise HTTPException(500, f"PDF generation failed: {e}")


@router.post("/export/docx")
async def export_docx(request: GenerateRequest):
    """Generate and download a DOCX resume."""
    try:
        filepath = export_to_docx(request.resume_data)
        return FileResponse(
            filepath,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            filename="resume.docx"
        )
    except Exception as e:
        raise HTTPException(500, f"DOCX generation failed: {e}")


@router.post("/export/json")
async def export_json(request: GenerateRequest):
    """Export resume data as JSON."""
    return request.resume_data.model_dump()
