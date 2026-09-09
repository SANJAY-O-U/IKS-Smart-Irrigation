import React from 'react';

const layers = [
  { icon: '🌱', title: 'Farm', desc: 'The physical field with crops and soil to be monitored.' },
  { icon: '💧', title: 'Capacitive Soil Sensor + DHT11', desc: 'Measure soil moisture, temperature and humidity in real time.' },
  { icon: '🔌', title: 'ESP32', desc: 'Reads sensor values and packages them as JSON.' },
  { icon: '📶', title: 'Wi-Fi', desc: 'Transmits the JSON reading to the backend over HTTP.' },
  { icon: '🖥️', title: 'Node.js / Express REST API', desc: 'Validates input, runs the recommendation logic, and stores data.' },
  { icon: '🗄️', title: 'MySQL Database', desc: 'Persists every sensor reading with its recommendation.' },
  { icon: '📊', title: 'React Dashboard', desc: 'Displays live readings, gauges, charts and history.' },
  { icon: '🚿', title: 'Smart Irrigation Recommendation', desc: 'A clear, rule-based decision the farmer can act on.' },
];

export default function SystemArchitecture({ compact = false }) {
  return (
    <div className="arch-grid">
      {layers.map((layer, index) => (
        <React.Fragment key={layer.title}>
          <div className="arch-card">
            <h4>
              {layer.icon} {layer.title}
            </h4>
            {!compact && <p>{layer.desc}</p>}
          </div>
          {index < layers.length - 1 && <span className="flow-arrow">↓</span>}
        </React.Fragment>
      ))}
    </div>
  );
}
