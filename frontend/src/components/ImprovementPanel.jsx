import ScoreGauge from './ScoreGauge';

function CategoryBar({ category }) {
  const pct = (category.score / category.max_score) * 100;
  const color = pct >= 70 ? '#10B981' : pct >= 40 ? '#F59E0B' : '#EF4444';

  return (
    <div className="progress-bar-wrapper">
      <div className="progress-bar-label">
        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
          {category.name}
        </span>
        <span style={{ fontSize: '0.82rem', color, fontWeight: 700 }}>
          {Math.round(category.score)}/{category.max_score}
        </span>
      </div>
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}aa, ${color})`,
          }}
        />
      </div>
    </div>
  );
}

export default function ImprovementPanel({ analysis, loading }) {
  if (!analysis && !loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '32px 20px' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🤖</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
          Fill in your resume details to get an<br />
          <strong style={{ color: 'var(--accent-violet-light)' }}>AI-powered score & feedback</strong>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Score Gauge */}
      <div className="card" style={{ padding: '28px 20px', textAlign: 'center' }}>
        <ScoreGauge
          score={analysis?.total_score ?? 0}
          grade={analysis?.grade ?? 'D'}
          loading={loading}
        />

        {analysis && (
          <div style={{
            display: 'flex', justifyContent: 'space-around',
            marginTop: 20, paddingTop: 16,
            borderTop: '1px solid var(--bg-glass-border)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                {analysis.ats_compatibility}%
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ATS Score</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-violet-light)' }}>
                {analysis.keyword_density}%
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Keywords</div>
            </div>
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      {analysis && (
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 16, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Score Breakdown
          </h3>
          {analysis.categories.map((cat, i) => (
            <CategoryBar key={i} category={cat} />
          ))}
        </div>
      )}

      {/* Improvements */}
      {analysis && analysis.top_improvements.length > 0 && (
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 12, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🔧 To Improve
          </h3>
          {analysis.top_improvements.map((tip, i) => (
            <div key={i} className="improvement-item">
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>⚠️</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{tip}</span>
            </div>
          ))}
        </div>
      )}

      {/* Strengths */}
      {analysis && analysis.strengths.length > 0 && (
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 12, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ✅ Strengths
          </h3>
          {analysis.strengths.map((s, i) => (
            <div key={i} className="strength-item">
              <span style={{ fontSize: '1rem' }}>⭐</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{s}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
