import { useEffect, useRef, useState } from 'react';

const COLORS = {
  low: '#EF4444',
  mid: '#F59E0B',
  high: '#10B981',
};

function getColor(score) {
  if (score >= 71) return COLORS.high;
  if (score >= 41) return COLORS.mid;
  return COLORS.low;
}

function getGradeColor(grade) {
  if (['A+', 'A'].includes(grade)) return '#10B981';
  if (['B+', 'B'].includes(grade)) return '#F59E0B';
  return '#EF4444';
}

export default function ScoreGauge({ score = 0, grade = 'D', loading = false }) {
  const [displayScore, setDisplayScore] = useState(0);
  const animRef = useRef(null);

  // Animated count-up
  useEffect(() => {
    if (loading) return;
    const target = score;
    const start = displayScore;
    const duration = 800;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
      setDisplayScore(Math.round(start + (target - start) * eased));
      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [score, loading]);

  const color = getColor(displayScore);
  const gradeColor = getGradeColor(grade);

  // SVG arc calculation
  const size = 200;
  const cx = size / 2;
  const cy = size / 2 + 20;
  const r = 75;
  const startAngle = 210; // degrees
  const endAngle = 330;
  const totalArc = 360 - startAngle + endAngle; // = 300 degrees

  const toRad = (deg) => (deg * Math.PI) / 180;

  const polarToXY = (angle) => ({
    x: cx + r * Math.cos(toRad(angle)),
    y: cy + r * Math.sin(toRad(angle)),
  });

  const describeArc = (startDeg, endDeg) => {
    const start = polarToXY(startDeg);
    const end = polarToXY(endDeg);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
  };

  const fillPercent = displayScore / 100;
  const fillArc = fillPercent * totalArc;
  const fillEndAngle = startAngle + fillArc;

  const bgPath = describeArc(startAngle, startAngle + totalArc);
  const fillPath = fillPercent > 0 ? describeArc(startAngle, fillEndAngle) : null;

  return (
    <div className="score-gauge-wrapper">
      <svg
        width={size}
        height={size - 10}
        viewBox={`0 0 ${size} ${size - 10}`}
        style={{ filter: loading ? 'blur(1px)' : 'none', transition: 'filter 0.3s' }}
      >
        {/* Background track */}
        <path
          d={bgPath}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={12}
          strokeLinecap="round"
        />
        {/* Filled arc */}
        {fillPath && (
          <path
            d={fillPath}
            fill="none"
            stroke={color}
            strokeWidth={12}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 8px ${color})`,
              transition: 'stroke 0.4s ease',
            }}
          />
        )}
        {/* Center score */}
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          fill={color}
          fontSize="32"
          fontWeight="800"
          fontFamily="Space Grotesk, sans-serif"
          style={{ transition: 'fill 0.4s ease' }}
        >
          {loading ? '—' : displayScore}
        </text>
        <text
          x={cx}
          y={cy + 16}
          textAnchor="middle"
          fill="rgba(255,255,255,0.4)"
          fontSize="11"
          fontFamily="Inter, sans-serif"
        >
          / 100
        </text>
        {/* Labels */}
        <text x={polarToXY(startAngle).x - 4} y={polarToXY(startAngle).y + 14}
          textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9">0</text>
        <text x={polarToXY(startAngle + totalArc).x + 4} y={polarToXY(startAngle + totalArc).y + 14}
          textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9">100</text>
      </svg>

      {/* Grade badge */}
      {!loading && grade && (
        <div
          className="score-grade"
          style={{
            background: `${gradeColor}20`,
            color: gradeColor,
            border: `1px solid ${gradeColor}40`,
          }}
        >
          Grade: {grade}
        </div>
      )}

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
          Analyzing...
        </div>
      )}

      {/* Score label */}
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        Resume Score
      </div>
    </div>
  );
}
