import { useState, useEffect } from 'react';
import { getTemplates } from '../api/client';

const TEMPLATE_PREVIEWS = {
  ats_pro: {
    bg: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
    accent: '#7C3AED',
    lines: [
      { w: '60%', h: 12, y: 16, bg: '#7C3AED' },
      { w: '40%', h: 6, y: 36, bg: 'rgba(255,255,255,0.15)' },
      { w: '100%', h: 1, y: 52, bg: '#7C3AED' },
      { w: '80%', h: 6, y: 64, bg: 'rgba(255,255,255,0.1)' },
      { w: '70%', h: 6, y: 78, bg: 'rgba(255,255,255,0.07)' },
      { w: '90%', h: 6, y: 92, bg: 'rgba(255,255,255,0.07)' },
      { w: '50%', h: 6, y: 106, bg: 'rgba(255,255,255,0.05)' },
    ],
  },
  modern_creative: {
    bg: 'linear-gradient(135deg, #0F2027 0%, #203A43 100%)',
    accent: '#06D6A0',
    lines: [
      { w: '30%', h: '100%', y: 0, bg: 'rgba(6,214,160,0.12)', x: 0, pos: 'sidebar' },
      { w: '50%', h: 10, y: 16, bg: '#06D6A0', x: '35%' },
      { w: '35%', h: 6, y: 36, bg: 'rgba(255,255,255,0.2)', x: '35%' },
      { w: '55%', h: 5, y: 56, bg: 'rgba(255,255,255,0.1)', x: '35%' },
      { w: '55%', h: 5, y: 70, bg: 'rgba(255,255,255,0.07)', x: '35%' },
    ],
  },
  academic: {
    bg: 'linear-gradient(135deg, #1C1C1C 0%, #2C2C2C 100%)',
    accent: '#C0392B',
    lines: [
      { w: '70%', h: 10, y: 14, bg: 'rgba(255,255,255,0.9)' },
      { w: '50%', h: 5, y: 32, bg: 'rgba(255,255,255,0.3)' },
      { w: '100%', h: 1, y: 46, bg: '#C0392B' },
      { w: '85%', h: 5, y: 58, bg: 'rgba(255,255,255,0.1)' },
      { w: '75%', h: 5, y: 72, bg: 'rgba(255,255,255,0.08)' },
      { w: '90%', h: 5, y: 86, bg: 'rgba(255,255,255,0.06)' },
      { w: '60%', h: 5, y: 100, bg: 'rgba(255,255,255,0.05)' },
    ],
  },
};

function MiniPreview({ templateId, accent }) {
  const preview = TEMPLATE_PREVIEWS[templateId];
  if (!preview) return null;

  return (
    <div style={{
      background: preview.bg,
      height: 120,
      borderRadius: 8,
      position: 'relative',
      overflow: 'hidden',
      marginBottom: 12,
    }}>
      {preview.lines.map((line, i) => (
        line.pos === 'sidebar' ? (
          <div key={i} style={{
            position: 'absolute',
            left: 0, top: 0,
            width: line.w,
            height: '100%',
            background: line.bg,
          }} />
        ) : (
          <div key={i} style={{
            position: 'absolute',
            left: line.x || '5%',
            top: line.y,
            width: line.w,
            height: line.h,
            background: line.bg,
            borderRadius: 2,
          }} />
        )
      ))}
      {/* Accent dot */}
      <div style={{
        position: 'absolute', bottom: 8, right: 8,
        width: 8, height: 8,
        borderRadius: '50%',
        background: preview.accent,
        boxShadow: `0 0 8px ${preview.accent}`,
      }} />
    </div>
  );
}

export default function TemplateSelector({ selected, onSelect }) {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    getTemplates()
      .then(setTemplates)
      .catch(() => setTemplates([]));
  }, []);

  const defaultTemplates = [
    { id: 'ats_pro', name: 'ATS Pro', description: 'Clean & ATS-optimized', tags: ['ATS-friendly', 'Professional'], recommended: true },
    { id: 'modern_creative', name: 'Modern Creative', description: 'Two-column with sidebar', tags: ['Creative', 'Modern'] },
    { id: 'academic', name: 'Academic', description: 'Formal academic layout', tags: ['Formal', 'Research'] },
  ];

  const displayTemplates = templates.length > 0 ? templates : defaultTemplates;

  return (
    <div>
      <h3 className="section-title" style={{ fontSize: '1.1rem', marginBottom: 4 }}>
        Choose Template
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: 16 }}>
        All templates are ATS-readable
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {displayTemplates.map(t => (
          <div
            key={t.id}
            id={`template-${t.id}`}
            className={`template-card ${selected === t.id ? 'selected' : ''}`}
            onClick={() => onSelect(t.id)}
            style={{ padding: 12 }}
          >
            <MiniPreview templateId={t.id} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{t.name}</div>
              {t.recommended && (
                <span className="badge badge-cyan" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                  Recommended
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>
              {t.description}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {t.tags?.map(tag => (
                <span key={tag} className="badge badge-violet" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                  {tag}
                </span>
              ))}
            </div>
            {selected === t.id && (
              <div style={{
                marginTop: 8, textAlign: 'center', fontSize: '0.75rem',
                color: 'var(--accent-violet-light)', fontWeight: 600
              }}>
                ✓ Selected
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
