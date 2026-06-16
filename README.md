# 🎯 AI Resume Maker — Full-Stack ML Project

> **A complete AI-powered resume builder & analyzer** built with React, FastAPI, and spaCy NLP.
> Perfect as a portfolio project for B.Tech students targeting ML/SDE internships.

---

## 🌟 Features

| Feature | Description |
|---------|-------------|
| 📎 **Multi-format Parsing** | Upload PDF, DOCX, Excel, or TXT — auto-extract all info |
| 📊 **Real-time ML Scoring** | 100-point score with animated gauge updates as you type |
| 💡 **AI Suggestions** | Exact improvement tips from the ML engine |
| 🎨 **3 Premium Templates** | ATS Pro, Modern Creative, Academic |
| 📤 **Multi-format Export** | Download as PDF, DOCX, or JSON |
| 🎯 **ATS Compatibility** | See how well your resume passes ATS filters |

---

## 🛠️ Tech Stack

### Frontend
- **React + Vite** — Fast SPA
- **Vanilla CSS** — Custom dark glassmorphism design system
- **Axios** — API communication
- **React Router** — Client-side routing

### Backend
- **FastAPI** — High-performance Python API
- **PyMuPDF** — PDF text extraction
- **python-docx** — DOCX parsing & generation
- **openpyxl** — Excel parsing
- **spaCy** — NLP entity extraction (names, emails, skills)
- **scikit-learn** — Feature engineering for ML scoring
- **reportlab** — PDF resume generation

---

## 🚀 Quick Start

### Option 1: One-click (Windows)
```bash
double-click run.bat
```

### Option 2: Manual

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

---

## 📁 Project Structure

```
PROJECT ML/
├── backend/
│   ├── main.py              ← FastAPI entry point
│   ├── models.py            ← Pydantic schemas
│   ├── routers/
│   │   ├── resume.py        ← /parse, /export endpoints
│   │   ├── analyze.py       ← /analyze ML endpoint
│   │   └── templates.py     ← /templates endpoint
│   ├── services/
│   │   ├── parser.py        ← Multi-format file parser + NLP
│   │   └── exporter.py      ← PDF + DOCX generator
│   ├── ml/
│   │   ├── scorer.py        ← 100-point ML scoring engine
│   │   └── weights.json     ← Scoring rubric config
│   └── requirements.txt
│
├── frontend/
│   └── src/
│       ├── api/client.js        ← Axios API client
│       ├── hooks/
│       │   ├── useResumeForm.js ← Form state management
│       │   └── useAnalysis.js   ← Debounced real-time scoring
│       ├── components/
│       │   ├── ScoreGauge.jsx   ← Animated SVG semi-circular gauge
│       │   ├── ImprovementPanel.jsx ← Score + tips panel
│       │   ├── ResumeForm.jsx   ← Multi-step form
│       │   ├── UploadZone.jsx   ← Drag & drop uploader
│       │   ├── TemplateSelector.jsx ← Template picker
│       │   └── ExportButtons.jsx    ← Download PDF/DOCX/JSON
│       └── pages/
│           ├── Landing.jsx      ← Hero landing page
│           └── Builder.jsx      ← Main builder page
└── run.bat                  ← One-click launcher (Windows)
```

---

## 🤖 ML Scoring System

The resume is scored across **8 categories** (total 100 points):

| Category | Points | What's measured |
|----------|--------|----------------|
| Contact Info | 10 | Name, email, phone, LinkedIn, GitHub |
| Professional Summary | 5 | Length, quality |
| Skills | 20 | Count, diversity across categories |
| Work Experience | 20 | Roles, action verbs, quantification |
| Education | 10 | Degree, institution, GPA |
| Projects | 15 | Count, URLs, tech stack |
| Certifications | 10 | Count and recency |
| Resume Structure | 10 | Section completeness |

**Grading:** A+ (90+), A (80+), B+ (70+), B (60+), C (50+), D (<50)

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resume/parse` | Upload & parse resume file |
| POST | `/api/resume/export/pdf` | Generate PDF |
| POST | `/api/resume/export/docx` | Generate DOCX |
| POST | `/api/resume/export/json` | Export JSON |
| POST | `/api/analyze/` | Full ML analysis |
| GET | `/api/templates/` | List templates |
| GET | `/health` | Health check |

---

## 🎓 Why This Project

This project demonstrates:
- ✅ **Full-stack development** (React + FastAPI)
- ✅ **NLP pipeline** (entity extraction, text classification)
- ✅ **ML scoring system** (multi-feature rubric)
- ✅ **File processing** (real-world unstructured data)
- ✅ **REST API design** (proper patterns, error handling)
- ✅ **Production-quality UI** (dark mode, animations, responsive)

---

*Built as a B.Tech ML project — 2026*
