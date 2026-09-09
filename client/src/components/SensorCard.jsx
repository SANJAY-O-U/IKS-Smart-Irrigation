import React from 'react';

const statusClassMap = {
  dry: 'status-dry',
  moderate: 'status-moderate',
  sufficient: 'status-sufficient',
};

export default function SensorCard({ icon, label, value, unit = '', statusLabel, statusType }) {
  return (
    <div className="card sensor-card">
      <span className="icon">{icon}</span>
      <span className="label">{label}</span>
      <span className="value">
        {value}
        {unit}
      </span>
      {statusLabel && (
        <span className={`status-pill ${statusClassMap[statusType] || 'status-moderate'}`}>
          {statusLabel}
        </span>
      )}
    </div>
  );
}
