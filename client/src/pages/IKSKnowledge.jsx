import React from 'react';

const topics = [
  { icon: '🏺', title: 'Traditional Water Harvesting', desc: 'Ancient Indian communities built systems like tanks, ponds and check dams to capture and store monsoon rainfall for use throughout the year.' },
  { icon: '🪜', title: 'Stepwells', desc: 'Structures such as baolis and vavs provided year-round access to groundwater while also serving as community and cultural spaces.' },
  { icon: '🤝', title: 'Community Water Management', desc: 'Water bodies were traditionally maintained collectively by villages, with shared responsibility for upkeep and fair distribution.' },
  { icon: '🌾', title: 'Traditional Irrigation Practices', desc: 'Methods such as tank irrigation, canal systems, and field-bunding helped distribute water efficiently across farmland.' },
  { icon: '🌦️', title: 'Seasonal Agricultural Awareness', desc: 'Farming calendars were aligned with monsoon cycles and local climate patterns, minimizing water stress on crops.' },
  { icon: '🌍', title: 'Soil and Water Conservation', desc: 'Practices like mulching, contour farming and crop rotation preserved soil moisture and long-term fertility.' },
  { icon: '♻️', title: 'Sustainable Resource Use', desc: 'Resources were used with a long-term view, respecting natural replenishment cycles rather than short-term extraction.' },
];

export default function IKSKnowledge() {
  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      <h2>Indian Knowledge Systems &amp; Water Sustainability</h2>
      <p className="muted" style={{ maxWidth: 720 }}>
        India has a centuries-old tradition of managing water sustainably, developed long before
        modern sensors and dashboards existed. This project draws on that tradition as its
        guiding philosophy.
      </p>

      <div className="card-grid" style={{ marginTop: 24 }}>
        {topics.map((t) => (
          <div className="card" key={t.title}>
            <span style={{ fontSize: '1.7rem' }}>{t.icon}</span>
            <h4 style={{ marginTop: 10 }}>{t.title}</h4>
            <p style={{ margin: 0, fontSize: '0.92rem' }}>{t.desc}</p>
          </div>
        ))}
      </div>

      <div className="section">
        <h2 className="section-title" style={{ textAlign: 'center' }}>IKS + Modern IoT</h2>
        <div className="iks-modern-split">
          <div className="card">
            <h4>Traditional IKS</h4>
            <ul className="pill-list">
              <li>Sustainable practices</li>
              <li>Water conservation</li>
              <li>Seasonal awareness</li>
              <li>Local resource management</li>
              <li>Community knowledge</li>
            </ul>
          </div>
          <div className="card">
            <h4>Modern IoT</h4>
            <ul className="pill-list">
              <li>Real-time sensors</li>
              <li>ESP32 microcontroller</li>
              <li>Continuous data collection</li>
              <li>Digital monitoring</li>
              <li>Data-driven recommendations</li>
            </ul>
          </div>
        </div>

        <div className="card" style={{ marginTop: 22, textAlign: 'center', background: 'var(--green-100)', border: 'none' }}>
          <h3 style={{ marginBottom: 6 }}>Together: IKS Smart Water Advisor</h3>
          <p style={{ margin: '0 auto', maxWidth: 640 }}>
            This project does not claim that ancient IKS knowledge mathematically predicts
            irrigation needs. Instead, IKS provides the sustainable principles and traditional
            practices that motivate <em>why</em> water conservation matters, while IoT provides
            the real-time environmental measurements needed to act on those principles today.
            The recommendation engine simply combines both inputs into a practical,
            easy-to-explain decision-support system.
          </p>
        </div>
      </div>
    </div>
  );
}
