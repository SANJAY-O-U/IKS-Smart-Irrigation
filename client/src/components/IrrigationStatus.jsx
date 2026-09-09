import React from 'react';

const statusConfig = {
  'IRRIGATION REQUIRED': {
    className: 'dry',
    icon: '🔴',
    why: 'Soil moisture is below the recommended threshold (30%).',
  },
  MONITOR: {
    className: 'moderate',
    icon: '🟡',
    why: 'Soil moisture is within the moderate range (30–60%). No action needed yet.',
  },
  'NO IRRIGATION': {
    className: 'sufficient',
    icon: '🟢',
    why: 'Soil moisture is above the sufficient threshold (60%).',
  },
};

export default function IrrigationStatus({ status = 'MONITOR', recommendation }) {
  const config = statusConfig[status] || statusConfig.MONITOR;

  return (
    <div className={`status-banner ${config.className}`}>
      <span className="headline">
        {config.icon} {status}
      </span>
      <span className="why-label">Why?</span>
      <p style={{ margin: 0 }}>{config.why}</p>
      {recommendation && <p style={{ margin: 0, fontStyle: 'italic' }}>{recommendation}</p>}
    </div>
  );
}
