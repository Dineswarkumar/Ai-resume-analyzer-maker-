from pydantic import BaseModel, EmailStr
from typing import List, Optional


class ContactInfo(BaseModel):
    name: str = ""
    email: str = ""
    phone: str = ""
    linkedin: str = ""
    github: str = ""
    portfolio: str = ""
    location: str = ""


class Education(BaseModel):
    degree: str = ""
    institution: str = ""
    year: str = ""
    gpa: str = ""
    field: str = ""


class Experience(BaseModel):
    title: str = ""
    company: str = ""
    duration: str = ""
    description: str = ""
    achievements: List[str] = []


class Project(BaseModel):
    name: str = ""
    description: str = ""
    technologies: List[str] = []
    url: str = ""
    github: str = ""


class Certification(BaseModel):
    name: str = ""
    issuer: str = ""
    year: str = ""
    url: str = ""


class ResumeData(BaseModel):
    contact: ContactInfo = ContactInfo()
    summary: str = ""
    education: List[Education] = []
    experience: List[Experience] = []
    skills: List[str] = []
    projects: List[Project] = []
    certifications: List[Certification] = []
    languages: List[str] = []
    template: str = "ats_pro"


class ScoreCategory(BaseModel):
    name: str
    score: float
    max_score: float
    tips: List[str]


class AnalysisResult(BaseModel):
    total_score: float
    grade: str
    categories: List[ScoreCategory]
    top_improvements: List[str]
    strengths: List[str]
    ats_compatibility: float
    keyword_density: float


class ParsedResumeResponse(BaseModel):
    resume_data: ResumeData
    raw_text: str
    confidence: float


class GenerateRequest(BaseModel):
    resume_data: ResumeData
    format: str = "pdf"  # pdf | docx | json
