import React from 'react';
import SystemArchitecture from '../components/SystemArchitecture.jsx';

const layerExplanations = [
  { title: 'Farm', desc: 'The physical field being monitored — the real-world context the whole system exists to serve.' },
  { title: 'Capacitive Soil Sensor + DHT11', desc: 'The sensing layer. The capacitive sensor measures soil moisture without corroding like resistive probes, and the DHT11 adds ambient temperature and humidity context.' },
  { title: 'ESP32', desc: 'A low-cost microcontroller with built-in Wi-Fi that reads the analog and digital sensor signals and formats them as JSON.' },
  { title: 'Wi-Fi', desc: 'Carries the JSON reading from the ESP32 to the backend server over the local network using a simple HTTP POST request.' },
  { title: 'Node.js / Express', desc: 'A lightweight REST API that validates incoming data, runs the rule-based recommendation logic, and stores the result.' },
  { title: 'MySQL', desc: 'A relational database that persists every reading with a timestamp, enabling history, trends and reporting.' },
  { title: 'React', desc: 'The frontend dashboard that polls the API and renders live cards, gauges, charts and history tables.' },
  { title: 'Smart Recommendation', desc: 'The final, human-readable output: a clear irrigation decision the farmer can immediately act on.' },
];

export default function Architecture() {
  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      <h2>System Architecture</h2>
      <p className="muted" style={{ maxWidth: 720 }}>
        A deliberately simple, linear pipeline — easy to draw on a whiteboard and easy to explain
        in a viva.
      </p>

      <div className="card" style={{ marginTop: 24, marginBottom: 32 }}>
        <SystemArchitecture />
      </div>

      <h3>What each layer does</h3>
      <div className="card-grid">
        {layerExplanations.map((l) => (
          <div className="card" key={l.title}>
            <h4>{l.title}</h4>
            <p style={{ margin: 0, fontSize: '0.92rem' }}>{l.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
