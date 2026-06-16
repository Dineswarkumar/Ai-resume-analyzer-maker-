import urllib.request
import json
import sys
import os

# Force UTF-8 output on Windows
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# ── Read PDF ────────────────────────────────────────────────────
pdf_path = r'T:\B-Tech\semester\PROJECT ML\Dinesh Resume.pdf'
with open(pdf_path, 'rb') as f:
    pdf_bytes = f.read()

print(f"[OK] PDF loaded: {len(pdf_bytes):,} bytes")

# ── Multipart upload ─────────────────────────────────────────────
boundary = b'PythonDemoBoundary99'

body = b''
body += b'--' + boundary + b'\r\n'
body += b'Content-Disposition: form-data; name="file"; filename="Dinesh Resume.pdf"\r\n'
body += b'Content-Type: application/pdf\r\n\r\n'
body += pdf_bytes
body += b'\r\n--' + boundary + b'--\r\n'

req = urllib.request.Request(
    'http://127.0.0.1:8000/api/resume/parse',
    data=body,
    headers={'Content-Type': 'multipart/form-data; boundary=PythonDemoBoundary99'},
    method='POST'
)

print("\nUploading to /api/resume/parse ...")

try:
    with urllib.request.urlopen(req, timeout=30) as resp:
        result = json.loads(resp.read())
except urllib.error.HTTPError as e:
    print(f"HTTP Error {e.code}: {e.read().decode()}")
    sys.exit(1)

# ── Display results ──────────────────────────────────────────────
data = result.get('resume_data', {})
contact = data.get('contact', {})
conf = result.get('confidence', 0)

print(f"\n{'='*55}")
print(f"  PARSED RESUME  --  Confidence: {conf*100:.0f}%")
print(f"{'='*55}")
print(f"  Name      : {contact.get('name', '-')}")
print(f"  Email     : {contact.get('email', '-')}")
print(f"  Phone     : {contact.get('phone', '-')}")
print(f"  LinkedIn  : {contact.get('linkedin', '-')}")
print(f"  GitHub    : {contact.get('github', '-')}")
print(f"  Location  : {contact.get('location', '-')}")

skills = data.get('skills', [])
print(f"\n  Skills ({len(skills)}):")
for s in skills:
    print(f"    - {s}")

education = data.get('education', [])
print(f"\n  Education ({len(education)}):")
for e in education:
    print(f"    - {e.get('degree','')} | {e.get('institution','')} | {e.get('year','')}")

experience = data.get('experience', [])
print(f"\n  Experience ({len(experience)}):")
for e in experience:
    print(f"    - {e.get('title','')} @ {e.get('company','')} ({e.get('duration','')})")

projects = data.get('projects', [])
print(f"\n  Projects ({len(projects)}):")
for p in projects:
    techs = ', '.join(p.get('technologies', []))
    print(f"    - {p.get('name','')}  [{techs}]")

certs = data.get('certifications', [])
print(f"\n  Certifications ({len(certs)}):")
for c in certs:
    print(f"    - {c.get('name','')}")

summary = data.get('summary', '')
print(f"\n  Summary (first 150 chars):")
print(f"    {summary[:150]}...")
print(f"{'='*55}\n")

# ── Now analyze the resume ───────────────────────────────────────
print("Running ML analysis...")

analyze_body = json.dumps(data).encode('utf-8')
req2 = urllib.request.Request(
    'http://127.0.0.1:8000/api/analyze/',
    data=analyze_body,
    headers={'Content-Type': 'application/json'},
    method='POST'
)

with urllib.request.urlopen(req2, timeout=15) as resp2:
    analysis = json.loads(resp2.read())

print(f"\n{'='*55}")
print(f"  ML RESUME SCORE REPORT")
print(f"{'='*55}")
print(f"  Total Score    : {analysis['total_score']}/100  [Grade: {analysis['grade']}]")
print(f"  ATS Score      : {analysis['ats_compatibility']}%")
print(f"  Keyword Density: {analysis['keyword_density']}%")
print(f"\n  Category Breakdown:")
for cat in analysis['categories']:
    bar_len = int((cat['score'] / cat['max_score']) * 20) if cat['max_score'] else 0
    bar = '#' * bar_len + '.' * (20 - bar_len)
    pct = int((cat['score'] / cat['max_score']) * 100) if cat['max_score'] else 0
    print(f"    {cat['name']:<26} [{bar}] {cat['score']:.1f}/{cat['max_score']} ({pct}%)")

print(f"\n  [+] Strengths:")
for s in analysis.get('strengths', []):
    print(f"      + {s}")

print(f"\n  [!] Top Improvements:")
for tip in analysis.get('top_improvements', [])[:5]:
    print(f"      -> {tip}")
print(f"{'='*55}\n")

# ── Export PDF ───────────────────────────────────────────────────
print("Generating PDF resume output...")
export_body = json.dumps({'resume_data': data, 'format': 'pdf'}).encode()
req3 = urllib.request.Request(
    'http://127.0.0.1:8000/api/resume/export/pdf',
    data=export_body,
    headers={'Content-Type': 'application/json'},
    method='POST'
)

with urllib.request.urlopen(req3, timeout=30) as resp3:
    pdf_out = resp3.read()

out_path = r'T:\B-Tech\semester\PROJECT ML\demo_output_resume.pdf'
with open(out_path, 'wb') as f:
    f.write(pdf_out)

print(f"  [SAVED] PDF: {out_path}  ({len(pdf_out):,} bytes)")
print(f"\n*** DEMO COMPLETE! All pipeline stages working. ***\n")
