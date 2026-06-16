from fastapi import APIRouter

router = APIRouter()

TEMPLATES = [
    {
        "id": "ats_pro",
        "name": "ATS Pro",
        "description": "Clean, single-column layout optimized for Applicant Tracking Systems. Best for most tech roles.",
        "preview_color": "#7C3AED",
        "tags": ["ATS-friendly", "Clean", "Professional"],
        "recommended": True,
    },
    {
        "id": "modern_creative",
        "name": "Modern Creative",
        "description": "Bold two-column design with sidebar for skills and contact. Perfect for design, product, and startup roles.",
        "preview_color": "#06D6A0",
        "tags": ["Creative", "Modern", "Startup"],
        "recommended": False,
    },
    {
        "id": "academic",
        "name": "Academic / Research",
        "description": "Formal layout with emphasis on publications, research, and academic achievements.",
        "preview_color": "#C0392B",
        "tags": ["Academic", "Research", "Formal"],
        "recommended": False,
    },
]


@router.get("/")
def list_templates():
    return {"templates": TEMPLATES}


@router.get("/{template_id}")
def get_template(template_id: str):
    for t in TEMPLATES:
        if t["id"] == template_id:
            return t
    return {"error": "Template not found"}
