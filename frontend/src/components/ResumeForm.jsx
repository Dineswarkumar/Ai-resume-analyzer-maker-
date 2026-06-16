import { useState } from 'react';

const COMMON_SKILLS = [
  'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'Go', 'React', 'Node.js',
  'FastAPI', 'Django', 'SQL', 'PostgreSQL', 'MongoDB', 'Docker', 'Kubernetes',
  'AWS', 'Git', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch',
  'scikit-learn', 'Pandas', 'NumPy', 'REST API', 'GraphQL', 'HTML', 'CSS',
];

const STEPS = [
  { id: 'contact', label: '👤 Personal', icon: '👤' },
  { id: 'summary', label: '📝 Summary', icon: '📝' },
  { id: 'experience', label: '💼 Experience', icon: '💼' },
  { id: 'education', label: '🎓 Education', icon: '🎓' },
  { id: 'skills', label: '⚡ Skills', icon: '⚡' },
  { id: 'projects', label: '🚀 Projects', icon: '🚀' },
  { id: 'certifications', label: '🏆 Certs', icon: '🏆' },
];

export default function ResumeForm({
  resumeData,
  updateContact,
  updateField,
  addSkill, removeSkill,
  addEducation, updateEducation, removeEducation,
  addExperience, updateExperience, removeExperience,
  addProject, updateProject, removeProject,
  addCertification, updateCertification, removeCertification,
}) {
  const [activeStep, setActiveStep] = useState('contact');
  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      addSkill(skillInput.trim());
      setSkillInput('');
    }
  };

  const renderContact = () => (
    <div className="animate-fade-in">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input id="input-name" className="form-input" placeholder="e.g. Dinesh Kumar"
            value={resumeData.contact.name}
            onChange={e => updateContact('name', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Email *</label>
          <input id="input-email" className="form-input" type="email" placeholder="you@email.com"
            value={resumeData.contact.email}
            onChange={e => updateContact('email', e.target.value)} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input id="input-phone" className="form-input" placeholder="+91 98765 43210"
            value={resumeData.contact.phone}
            onChange={e => updateContact('phone', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Location</label>
          <input id="input-location" className="form-input" placeholder="Bangalore, India"
            value={resumeData.contact.location}
            onChange={e => updateContact('location', e.target.value)} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">LinkedIn URL</label>
          <input id="input-linkedin" className="form-input" placeholder="linkedin.com/in/yourname"
            value={resumeData.contact.linkedin}
            onChange={e => updateContact('linkedin', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">GitHub URL</label>
          <input id="input-github" className="form-input" placeholder="github.com/yourname"
            value={resumeData.contact.github}
            onChange={e => updateContact('github', e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Portfolio / Website</label>
        <input id="input-portfolio" className="form-input" placeholder="https://yourportfolio.dev"
          value={resumeData.contact.portfolio}
          onChange={e => updateContact('portfolio', e.target.value)} />
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="animate-fade-in">
      <div className="form-group">
        <label className="form-label">Professional Summary</label>
        <textarea id="input-summary" className="form-textarea" rows={5}
          placeholder="e.g. Passionate B.Tech student specializing in ML and full-stack development. Built 5+ projects with React and FastAPI. Seeking internship to apply skills in real-world AI systems..."
          value={resumeData.summary}
          style={{ minHeight: 140 }}
          onChange={e => updateField('summary', e.target.value)} />
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
          💡 Tip: 2-3 sentences mentioning your domain, key skills, and goal. Aim for 40-60 words.
        </div>
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="animate-fade-in">
      {resumeData.experience.map((exp, idx) => (
        <div key={idx} className="card" style={{ marginBottom: 16, position: 'relative' }}>
          <button
            onClick={() => removeExperience(idx)}
            style={{
              position: 'absolute', top: 12, right: 12,
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#EF4444', borderRadius: 6, padding: '4px 8px',
              cursor: 'pointer', fontSize: '0.75rem'
            }}
          >✕ Remove</button>
          <div style={{ fontWeight: 600, marginBottom: 16, color: 'var(--accent-violet-light)' }}>
            Experience #{idx + 1}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Job Title</label>
              <input className="form-input" placeholder="Software Engineer Intern"
                value={exp.title}
                onChange={e => updateExperience(idx, 'title', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Company</label>
              <input className="form-input" placeholder="Google"
                value={exp.company}
                onChange={e => updateExperience(idx, 'company', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Duration</label>
            <input className="form-input" placeholder="June 2024 – August 2024"
              value={exp.duration}
              onChange={e => updateExperience(idx, 'duration', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Description & Achievements</label>
            <textarea className="form-textarea" rows={4}
              placeholder="• Developed a feature that improved API response time by 40%&#10;• Collaborated with a team of 6 to ship 3 major product releases&#10;• Automated testing pipeline reducing manual effort by 60%"
              value={exp.description}
              onChange={e => updateExperience(idx, 'description', e.target.value)} />
          </div>
        </div>
      ))}
      <button className="btn btn-secondary" onClick={addExperience} style={{ width: '100%' }}>
        + Add Experience
      </button>
      {resumeData.experience.length === 0 && (
        <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Add internships, part-time jobs, or freelance work
        </div>
      )}
    </div>
  );

  const renderEducation = () => (
    <div className="animate-fade-in">
      {resumeData.education.map((edu, idx) => (
        <div key={idx} className="card" style={{ marginBottom: 16, position: 'relative' }}>
          <button
            onClick={() => removeEducation(idx)}
            style={{
              position: 'absolute', top: 12, right: 12,
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#EF4444', borderRadius: 6, padding: '4px 8px',
              cursor: 'pointer', fontSize: '0.75rem'
            }}
          >✕ Remove</button>
          <div style={{ fontWeight: 600, marginBottom: 16, color: 'var(--accent-cyan)' }}>
            Education #{idx + 1}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Degree</label>
              <input className="form-input" placeholder="B.Tech Computer Science"
                value={edu.degree}
                onChange={e => updateEducation(idx, 'degree', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Institution</label>
              <input className="form-input" placeholder="IIT Bombay"
                value={edu.institution}
                onChange={e => updateEducation(idx, 'institution', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Year</label>
              <input className="form-input" placeholder="2022 – 2026"
                value={edu.year}
                onChange={e => updateEducation(idx, 'year', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">GPA / CGPA</label>
              <input className="form-input" placeholder="8.5 / 10"
                value={edu.gpa}
                onChange={e => updateEducation(idx, 'gpa', e.target.value)} />
            </div>
          </div>
        </div>
      ))}
      <button className="btn btn-secondary" onClick={addEducation} style={{ width: '100%' }}>
        + Add Education
      </button>
    </div>
  );

  const renderSkills = () => (
    <div className="animate-fade-in">
      {/* Skill input */}
      <div className="form-group">
        <label className="form-label">Add a Skill</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input id="input-skill" className="form-input" placeholder="e.g. React, Python, Docker..."
            value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddSkill()} />
          <button className="btn btn-primary btn-sm" onClick={handleAddSkill}>Add</button>
        </div>
      </div>

      {/* Current skills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        {resumeData.skills.map(skill => (
          <div key={skill} className="skill-tag">
            {skill}
            <button className="remove-btn" onClick={() => removeSkill(skill)}>✕</button>
          </div>
        ))}
        {resumeData.skills.length === 0 && (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No skills added yet. Type above or click suggestions below.
          </div>
        )}
      </div>

      {/* Quick-add suggestions */}
      <div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>
          Quick Add:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {COMMON_SKILLS
            .filter(s => !resumeData.skills.includes(s))
            .map(skill => (
              <button
                key={skill}
                onClick={() => addSkill(skill)}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--bg-glass-border)',
                  color: 'var(--text-secondary)',
                  borderRadius: 20,
                  padding: '4px 12px',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'var(--font-body)',
                }}
                onMouseEnter={e => {
                  e.target.style.borderColor = 'var(--accent-violet)';
                  e.target.style.color = 'var(--accent-violet-light)';
                }}
                onMouseLeave={e => {
                  e.target.style.borderColor = 'var(--bg-glass-border)';
                  e.target.style.color = 'var(--text-secondary)';
                }}
              >
                + {skill}
              </button>
            ))}
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="animate-fade-in">
      {resumeData.projects.map((proj, idx) => (
        <div key={idx} className="card" style={{ marginBottom: 16, position: 'relative' }}>
          <button
            onClick={() => removeProject(idx)}
            style={{
              position: 'absolute', top: 12, right: 12,
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#EF4444', borderRadius: 6, padding: '4px 8px',
              cursor: 'pointer', fontSize: '0.75rem'
            }}
          >✕ Remove</button>
          <div style={{ fontWeight: 600, marginBottom: 16, color: 'var(--accent-orange)' }}>
            Project #{idx + 1}
          </div>
          <div className="form-group">
            <label className="form-label">Project Name</label>
            <input className="form-input" placeholder="AI Resume Maker"
              value={proj.name}
              onChange={e => updateProject(idx, 'name', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" rows={3}
              placeholder="A full-stack ML app that analyzes resumes and generates ATS-optimized PDFs..."
              value={proj.description}
              onChange={e => updateProject(idx, 'description', e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">GitHub URL</label>
              <input className="form-input" placeholder="github.com/you/project"
                value={proj.github}
                onChange={e => updateProject(idx, 'github', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Live URL</label>
              <input className="form-input" placeholder="https://myproject.vercel.app"
                value={proj.url}
                onChange={e => updateProject(idx, 'url', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Tech Stack (comma separated)</label>
            <input className="form-input" placeholder="React, FastAPI, Python, PostgreSQL"
              value={proj.technologies?.join(', ') || ''}
              onChange={e => updateProject(idx, 'technologies',
                e.target.value.split(',').map(t => t.trim()).filter(Boolean)
              )} />
          </div>
        </div>
      ))}
      <button className="btn btn-secondary" onClick={addProject} style={{ width: '100%' }}>
        + Add Project
      </button>
    </div>
  );

  const renderCertifications = () => (
    <div className="animate-fade-in">
      {resumeData.certifications.map((cert, idx) => (
        <div key={idx} className="card" style={{ marginBottom: 16, position: 'relative' }}>
          <button
            onClick={() => removeCertification(idx)}
            style={{
              position: 'absolute', top: 12, right: 12,
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#EF4444', borderRadius: 6, padding: '4px 8px',
              cursor: 'pointer', fontSize: '0.75rem'
            }}
          >✕ Remove</button>
          <div style={{ fontWeight: 600, marginBottom: 16, color: 'var(--accent-orange)' }}>
            Certification #{idx + 1}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Certificate Name</label>
              <input className="form-input" placeholder="AWS Cloud Practitioner"
                value={cert.name}
                onChange={e => updateCertification(idx, 'name', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Issuer</label>
              <input className="form-input" placeholder="Amazon Web Services"
                value={cert.issuer}
                onChange={e => updateCertification(idx, 'issuer', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Year</label>
              <input className="form-input" placeholder="2024"
                value={cert.year}
                onChange={e => updateCertification(idx, 'year', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Certificate URL</label>
              <input className="form-input" placeholder="https://coursera.org/cert/..."
                value={cert.url}
                onChange={e => updateCertification(idx, 'url', e.target.value)} />
            </div>
          </div>
        </div>
      ))}
      <button className="btn btn-secondary" onClick={addCertification} style={{ width: '100%' }}>
        + Add Certification
      </button>
    </div>
  );

  const RENDER_MAP = {
    contact: renderContact,
    summary: renderSummary,
    experience: renderExperience,
    education: renderEducation,
    skills: renderSkills,
    projects: renderProjects,
    certifications: renderCertifications,
  };

  return (
    <div>
      {/* Step Tabs */}
      <div className="tab-bar" style={{ marginBottom: 20 }}>
        {STEPS.map(step => (
          <button
            key={step.id}
            id={`tab-${step.id}`}
            className={`tab-item ${activeStep === step.id ? 'active' : ''}`}
            onClick={() => setActiveStep(step.id)}
          >
            {step.label}
          </button>
        ))}
      </div>

      {/* Active step content */}
      {RENDER_MAP[activeStep]?.()}
    </div>
  );
}
