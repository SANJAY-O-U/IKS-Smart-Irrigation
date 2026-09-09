import React from 'react';
import { Link } from 'react-router-dom';

const processSteps = [
  '🌱 FARM',
  '💧 SENSORS',
  'ESP32',
  'Wi-Fi',
  'REST API',
  'MYSQL',
  '📊 DASHBOARD',
  '🚿 IRRIGATION RECOMMENDATION',
];

const features = [
  { icon: '📡', title: 'Real-time monitoring', desc: 'Live soil, temperature and humidity readings every few seconds.' },
  { icon: '🌾', title: 'Soil moisture analysis', desc: 'Rule-based thresholds classify soil as dry, moderate, or sufficient.' },
  { icon: '🌡️', title: 'Temperature monitoring', desc: 'Tracks ambient temperature alongside soil conditions.' },
  { icon: '💧', title: 'Humidity monitoring', desc: 'Captures relative humidity to give full environmental context.' },
  { icon: '🚿', title: 'Water conservation', desc: 'Avoids unnecessary irrigation when soil is already sufficiently moist.' },
  { icon: '🪔', title: 'IKS-inspired sustainability', desc: 'Grounded in traditional Indian water-management principles.' },
  { icon: '💰', title: 'Low-cost implementation', desc: 'Built entirely on affordable, open hardware and open-source software.' },
];

export default function Home() {
  return (
    <div>
      <section className="hero">
        <div className="container">
          <span className="hero-tag">Indian Knowledge Systems Project</span>
          <h1>IKS Smart Water Advisor</h1>
          <p className="subtitle">Traditional Indian Knowledge + IoT for Sustainable Irrigation</p>
          <p className="description">
            An economical IoT-based decision-support system that combines traditional Indian
            water-management principles with real-time farm sensing.
          </p>
          <div className="hero-actions">
            <Link to="/dashboard" className="btn btn-primary">View Live Dashboard</Link>
            <Link to="/iks-knowledge" className="btn btn-secondary">Explore IKS</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>How it works</h2>
          <div className="flow">
            {processSteps.map((step, index) => (
              <React.Fragment key={step}>
                <div className="flow-step">{step}</div>
                {index < processSteps.length - 1 && <span className="flow-arrow">↓</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>Project Features</h2>
          <div className="card-grid">
            {features.map((f) => (
              <div className="feature-item" key={f.title}>
                <span style={{ fontSize: '1.6rem' }}>{f.icon}</span>
                <div>
                  <h4 style={{ marginBottom: 4 }}>{f.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
