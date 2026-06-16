import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: '🤖',
    title: 'AI-Powered Parsing',
    desc: 'Upload PDF, DOCX, Excel, or TXT — our NLP engine extracts all your information automatically.',
    color: '#7C3AED',
  },
  {
    icon: '📊',
    title: 'Real-Time Score',
    desc: 'Get instant feedback as you type. An animated gauge shows your resume score out of 100.',
    color: '#06D6A0',
  },
  {
    icon: '💡',
    title: 'Smart Suggestions',
    desc: 'Our ML model tells you exactly what to improve — from missing keywords to weak bullet points.',
    color: '#F59E0B',
  },
  {
    icon: '🎨',
    title: 'Premium Templates',
    desc: 'Choose from 3 professional templates: ATS Pro, Modern Creative, or Academic Research.',
    color: '#EC4899',
  },
  {
    icon: '📤',
    title: 'Multi-Format Export',
    desc: 'Download your polished resume as a PDF, DOCX, or JSON — instantly, no watermarks.',
    color: '#06B6D4',
  },
  {
    icon: '🎯',
    title: 'ATS Optimization',
    desc: 'See your ATS compatibility score and ensure your resume passes automated screening systems.',
    color: '#10B981',
  },
];

const STATS = [
  { number: '100', label: 'Point scoring system', suffix: '' },
  { number: '8', label: 'Resume categories analyzed', suffix: '+' },
  { number: '3', label: 'Premium templates', suffix: '' },
  { number: '4', label: 'File formats supported', suffix: '+' },
];

export default function Landing() {
  return (
    <div className="page-wrapper">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="container">
          <div className="hero-content animate-slide-up">
            <div className="hero-badge">
              <span>🚀</span>
              <span>AI-Powered Resume Builder — Built for Students & Freshers</span>
            </div>
            <h1 className="hero-title">
              Build Resumes That<br />
              <span className="gradient-text">Get You Hired</span>
            </h1>
            <p className="hero-desc">
              Upload your existing resume or build from scratch. Our ML engine analyzes
              your content in real-time, scores it out of 100, and tells you exactly
              what to improve to land that internship.
            </p>
            <div className="hero-actions">
              <Link to="/builder" className="btn btn-primary btn-lg" id="cta-start-building">
                🎯 Start Building Free
              </Link>
              <Link to="/builder" className="btn btn-secondary btn-lg" id="cta-upload-resume">
                📄 Upload & Analyze
              </Link>
            </div>

            <div className="hero-stats">
              {STATS.map((s, i) => (
                <div key={i} className="stat-item">
                  <div className="stat-number">{s.number}{s.suffix}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 0', background: 'var(--bg-secondary)', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
            }}>
              Everything You Need to{' '}
              <span className="gradient-text">Stand Out</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: 12, maxWidth: 500, margin: '12px auto 0' }}>
              A complete ML pipeline meets a beautiful design interface
            </p>
          </div>

          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="feature-card animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className="feature-icon"
                  style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}
                >
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,214,160,0.1))',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: 'var(--radius-xl)',
            padding: '56px 48px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Glow */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400, height: 400,
              background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: 16 }}>
                Ready to Get That <span className="gradient-text">Dream Internship?</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: '1.05rem' }}>
                Build your AI-optimized resume in minutes. Free forever.
              </p>
              <Link to="/builder" className="btn btn-primary btn-lg" id="cta-bottom">
                🚀 Create My Resume Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '32px 0', borderTop: '1px solid var(--bg-glass-border)',
        color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.85rem'
      }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, alignItems: 'center' }}>
            <span>🎓</span>
            <span>AI Resume Maker — A Full-Stack ML Project</span>
            <span>•</span>
            <span>Built with React + FastAPI + spaCy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
