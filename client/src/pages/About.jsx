import React from 'react';

const objectives = [
  'Reduce unnecessary irrigation',
  'Monitor soil conditions',
  'Provide understandable recommendations',
  'Promote water conservation',
  'Connect IKS concepts with modern technology',
  'Build an economical student prototype',
];

export default function About() {
  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      <h2>About This Project</h2>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-grid">
          <div>
            <span className="label" style={{ color: 'var(--gray-500)' }}>Project Name</span>
            <p style={{ margin: '4px 0 0', fontWeight: 600 }}>IKS Smart Water Advisor</p>
          </div>
          <div>
            <span className="label" style={{ color: 'var(--gray-500)' }}>Subject</span>
            <p style={{ margin: '4px 0 0', fontWeight: 600 }}>Indian Knowledge Systems</p>
          </div>
          <div>
            <span className="label" style={{ color: 'var(--gray-500)' }}>Department</span>
            <p style={{ margin: '4px 0 0', fontWeight: 600 }}>Computer Engineering</p>
          </div>
          <div>
            <span className="label" style={{ color: 'var(--gray-500)' }}>Technology</span>
            <p style={{ margin: '4px 0 0', fontWeight: 600 }}>IoT + Web Development + Database</p>
          </div>
          <div>
            <span className="label" style={{ color: 'var(--gray-500)' }}>Hardware</span>
            <p style={{ margin: '4px 0 0', fontWeight: 600 }}>ESP32 + Capacitive Soil Moisture Sensor + DHT11</p>
          </div>
          <div>
            <span className="label" style={{ color: 'var(--gray-500)' }}>Software</span>
            <p style={{ margin: '4px 0 0', fontWeight: 600 }}>React + Node.js + Express + MySQL</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Objectives</h3>
        <ul className="pill-list">
          {objectives.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
