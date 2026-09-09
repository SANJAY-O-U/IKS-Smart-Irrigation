import React from 'react';

function getGaugeInfo(moisture) {
  if (moisture < 30) {
    return { color: 'var(--red-600)', label: 'DRY' };
  }
  if (moisture <= 60) {
    return { color: 'var(--amber-600)', label: 'MODERATE' };
  }
  return { color: 'var(--green-600)', label: 'SUFFICIENT' };
}

export default function MoistureGauge({ moisture = 0 }) {
  const clamped = Math.max(0, Math.min(100, moisture));
  const { color, label } = getGaugeInfo(clamped);

  return (
    <div className="gauge-wrap">
      <div className="gauge-header">
        <span className="label" style={{ color: 'var(--gray-500)', fontWeight: 600 }}>
          SOIL MOISTURE
        </span>
        <span style={{ fontWeight: 700, fontSize: '1.4rem', color }}>{clamped}%</span>
      </div>
      <div className="gauge-track">
        <div
          className="gauge-fill"
          style={{ width: `${clamped}%`, background: color }}
        />
      </div>
      <span style={{ fontWeight: 700, fontSize: '0.8rem', color }}>{label}</span>
    </div>
  );
}
