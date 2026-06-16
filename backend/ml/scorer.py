import json
import re
import os
from models import ResumeData, AnalysisResult, ScoreCategory

# Load scoring config
_config_path = os.path.join(os.path.dirname(__file__), "weights.json")
with open(_config_path, "r") as f:
    CONFIG = json.load(f)

WEIGHTS = CONFIG["weights"]
RULES = CONFIG["scoring_rules"]
GRADES = CONFIG["grade_thresholds"]

ACTION_VERBS = [
    "developed", "built", "designed", "implemented", "optimized", "led", "managed",
    "created", "deployed", "automated", "improved", "achieved", "increased", "reduced",
    "collaborated", "analyzed", "researched", "architected", "delivered", "integrated",
    "maintained", "migrated", "launched", "established", "spearheaded", "streamlined"
]

QUANTIFY_PATTERNS = [
    r"\d+%", r"\$[\d,]+", r"\d+ (users|customers|clients|people|team|engineers|hours|days|weeks)",
    r"(x\d+|\d+x)", r"reduced by \d+", r"increased by \d+", r"saved \d+"
]


def _clamp(val, lo=0.0, hi=1.0):
    return max(lo, min(hi, val))


def _get_grade(score: float) -> str:
    for grade, threshold in sorted(GRADES.items(), key=lambda x: -x[1]):
        if score >= threshold:
            return grade
    return "D"


# ─── Category scorers ───────────────────────────────────────────────────────

def score_contact(resume: ResumeData) -> ScoreCategory:
    c = resume.contact
    rules = RULES["contact_info"]
    score = 0.0
    tips = []

    if c.name:
        score += rules["name"]
    else:
        tips.append("Add your full name prominently at the top of the resume.")

    if c.email:
        score += rules["email"]
    else:
        tips.append("Include a professional email address.")

    if c.phone:
        score += rules["phone"]
    else:
        tips.append("Add your phone number with country code.")

    if c.linkedin:
        score += rules["linkedin"]
    else:
        tips.append("Add your LinkedIn profile URL to boost credibility.")

    if c.github or c.portfolio:
        score += rules["github_or_portfolio"]
    else:
        tips.append("Link your GitHub or portfolio — essential for tech roles.")

    return ScoreCategory(
        name="Contact Information",
        score=score,
        max_score=WEIGHTS["contact_info"],
        tips=tips
    )


def score_summary(resume: ResumeData) -> ScoreCategory:
    summary = resume.summary.strip()
    score = 0.0
    tips = []

    if summary:
        length = len(summary.split())
        if length >= 30:
            score = WEIGHTS["summary"]
        elif length >= 15:
            score = WEIGHTS["summary"] * 0.6
            tips.append("Expand your summary to 2-3 impactful sentences (30-60 words).")
        else:
            score = WEIGHTS["summary"] * 0.3
            tips.append("Write a compelling professional summary highlighting your goals and top skills.")
    else:
        tips.append("Add a professional summary/objective — it's the first thing recruiters read.")

    return ScoreCategory(
        name="Professional Summary",
        score=score,
        max_score=WEIGHTS["summary"],
        tips=tips
    )


def score_skills(resume: ResumeData) -> ScoreCategory:
    skills = [s.lower() for s in resume.skills]
    rules = RULES["skills"]
    score = 0.0
    tips = []
    max_score = WEIGHTS["skills"]

    count = len(skills)
    if count == 0:
        tips.append("Add a dedicated skills section with technical tools and technologies.")
        return ScoreCategory(name="Skills", score=0, max_score=max_score, tips=tips)

    # Points per skill (capped)
    skill_score = min(count * rules["points_per_skill"], max_score - rules["diversity_bonus"])
    score += skill_score

    # Diversity bonus — check presence across different categories
    taxonomy = CONFIG["skills_taxonomy"]
    categories_covered = 0
    for cat, cat_skills in taxonomy.items():
        if any(s in skills for s in cat_skills):
            categories_covered += 1

    if categories_covered >= 3:
        score += rules["diversity_bonus"]
    elif categories_covered >= 2:
        score += rules["diversity_bonus"] * 0.5
        tips.append("Diversify your skills — add both core technical and tools/frameworks.")
    else:
        tips.append("Broaden your skill set across programming, frameworks, and tools.")

    if count < rules["min_skills_for_full_score"]:
        tips.append(f"List at least {rules['min_skills_for_full_score']} relevant skills (you have {count}).")

    return ScoreCategory(
        name="Skills",
        score=_clamp(score, 0, max_score),
        max_score=max_score,
        tips=tips
    )


def score_experience(resume: ResumeData) -> ScoreCategory:
    experiences = resume.experience
    rules = RULES["experience"]
    score = 0.0
    tips = []
    max_score = WEIGHTS["experience"]

    if not experiences:
        tips.append("Add work experience, internships, or part-time roles.")
        return ScoreCategory(name="Work Experience", score=0, max_score=max_score, tips=tips)

    roles = min(len(experiences), rules["max_roles"])
    score += roles * rules["points_per_role"]

    # Action verb check
    all_text = " ".join([
        exp.description + " " + " ".join(exp.achievements)
        for exp in experiences
    ]).lower()

    verb_count = sum(1 for v in ACTION_VERBS if v in all_text)
    if verb_count >= 5:
        score += rules["action_verb_bonus"]
    else:
        tips.append("Use strong action verbs (e.g., 'Developed', 'Optimized', 'Led') in bullet points.")

    # Quantification check
    quantified = any(
        re.search(pattern, all_text, re.IGNORECASE)
        for pattern in QUANTIFY_PATTERNS
    )
    if quantified:
        score += rules["quantification_bonus"]
    else:
        tips.append("Quantify your achievements (e.g., 'Improved performance by 30%', 'Served 1000+ users').")

    return ScoreCategory(
        name="Work Experience",
        score=_clamp(score, 0, max_score),
        max_score=max_score,
        tips=tips
    )


def score_education(resume: ResumeData) -> ScoreCategory:
    education = resume.education
    rules = RULES["education"]
    score = 0.0
    tips = []
    max_score = WEIGHTS["education"]

    if not education:
        tips.append("Add your educational background (degree, institution, year).")
        return ScoreCategory(name="Education", score=0, max_score=max_score, tips=tips)

    edu = education[0]
    if edu.degree:
        score += rules["degree_present"]
    if edu.institution:
        score += rules["institution_present"]
    else:
        tips.append("Include the institution name in your education section.")
    if edu.gpa:
        score += rules["gpa_present"]
    elif not edu.gpa:
        tips.append("Include your GPA/CGPA if it is 7.5+ or 3.5+/4.0.")

    return ScoreCategory(
        name="Education",
        score=_clamp(score, 0, max_score),
        max_score=max_score,
        tips=tips
    )


def score_projects(resume: ResumeData) -> ScoreCategory:
    projects = resume.projects
    rules = RULES["projects"]
    score = 0.0
    tips = []
    max_score = WEIGHTS["projects"]

    if not projects:
        tips.append("Add 2-3 personal or academic projects — crucial for student resumes.")
        return ScoreCategory(name="Projects", score=0, max_score=max_score, tips=tips)

    count = min(len(projects), rules["max_projects"])
    score += count * rules["points_per_project"]

    for proj in projects[:rules["max_projects"]]:
        if proj.url or proj.github:
            score += rules["url_bonus"]
        else:
            tips.append(f"Add a GitHub/live URL for '{proj.name or 'your project'}'.")
        if proj.technologies:
            score += rules["tech_stack_bonus"]
        else:
            tips.append(f"List technologies used in '{proj.name or 'your project'}'.")

    if len(projects) < 2:
        tips.append("Add at least 2 projects to strengthen your resume.")

    return ScoreCategory(
        name="Projects",
        score=_clamp(score, 0, max_score),
        max_score=max_score,
        tips=tips
    )


def score_certifications(resume: ResumeData) -> ScoreCategory:
    certs = resume.certifications
    rules = RULES["certifications"]
    score = 0.0
    tips = []
    max_score = WEIGHTS["certifications"]

    count = min(len(certs), rules["max_certs"])
    score = count * rules["points_per_cert"]

    if count == 0:
        tips.append("Add certifications (Coursera, AWS, Google) to stand out.")
    elif count < 3:
        tips.append("Earn 2-3 more industry certifications to strengthen your profile.")

    return ScoreCategory(
        name="Certifications",
        score=_clamp(score, 0, max_score),
        max_score=max_score,
        tips=tips
    )


def score_formatting(resume: ResumeData) -> ScoreCategory:
    score = 0.0
    tips = []
    max_score = WEIGHTS["formatting"]

    # Check section completeness
    sections_present = sum([
        bool(resume.contact.name),
        bool(resume.summary),
        bool(resume.education),
        bool(resume.experience),
        bool(resume.skills),
        bool(resume.projects),
    ])

    score = (sections_present / 6.0) * max_score

    if sections_present < 4:
        tips.append("Complete all major sections: Summary, Experience, Skills, Projects, Education.")
    if not resume.summary:
        tips.append("A professional summary increases ATS match rate by 20-30%.")

    return ScoreCategory(
        name="Resume Structure",
        score=_clamp(score, 0, max_score),
        max_score=max_score,
        tips=tips
    )


# ─── Main analyzer ──────────────────────────────────────────────────────────

def analyze_resume(resume: ResumeData) -> AnalysisResult:
    categories = [
        score_contact(resume),
        score_summary(resume),
        score_skills(resume),
        score_experience(resume),
        score_education(resume),
        score_projects(resume),
        score_certifications(resume),
        score_formatting(resume),
    ]

    total = sum(c.score for c in categories)
    max_possible = sum(c.max_score for c in categories)
    normalized = (total / max_possible) * 100

    grade = _get_grade(normalized)

    # Top improvements — collect all tips, prioritize low-score categories
    sorted_cats = sorted(categories, key=lambda c: c.score / c.max_score)
    all_tips = []
    for cat in sorted_cats:
        all_tips.extend(cat.tips)

    top_improvements = all_tips[:6]

    # Strengths
    strengths = []
    for cat in categories:
        ratio = cat.score / cat.max_score if cat.max_score else 0
        if ratio >= 0.8:
            strengths.append(f"Strong {cat.name} section")

    # ATS compatibility (based on keywords + structure)
    skills_count = len(resume.skills)
    has_contact = bool(resume.contact.email and resume.contact.name)
    has_sections = bool(resume.experience and resume.education)
    ats = _clamp(
        (skills_count / 10.0) * 0.4 +
        (1.0 if has_contact else 0.0) * 0.3 +
        (1.0 if has_sections else 0.0) * 0.3
    )

    # Keyword density (unique skills / total words estimate)
    estimated_words = 300 + len(resume.skills) * 3 + len(resume.experience) * 50
    keyword_density = _clamp(skills_count / max(estimated_words / 10, 1))

    return AnalysisResult(
        total_score=round(normalized, 1),
        grade=grade,
        categories=categories,
        top_improvements=top_improvements,
        strengths=strengths if strengths else ["Keep building your profile!"],
        ats_compatibility=round(ats * 100, 1),
        keyword_density=round(keyword_density * 100, 1),
    )
