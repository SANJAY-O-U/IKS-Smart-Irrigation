import React, { useEffect, useRef, useState } from 'react';
import SensorCard from '../components/SensorCard.jsx';
import MoistureGauge from '../components/MoistureGauge.jsx';
import SensorChart from '../components/SensorChart.jsx';
import IrrigationStatus from '../components/IrrigationStatus.jsx';
import { getLatestReading } from '../services/api.js';

const REFRESH_INTERVAL_MS = 4000;
const MAX_CHART_POINTS = 20;
const ESP32_STALE_MS = 60 * 1000; // if last real reading is older than this, warn ESP32 may be offline

function classifyMoisture(moisture) {
  if (moisture < 30) return { status: 'IRRIGATION REQUIRED', statusType: 'dry', label: 'DRY' };
  if (moisture <= 60) return { status: 'MONITOR', statusType: 'moderate', label: 'MODERATE' };
  return { status: 'NO IRRIGATION', statusType: 'sufficient', label: 'SUFFICIENT' };
}

function buildRecommendation(moisture, temperature, humidity) {
  const { status, label } = classifyMoisture(moisture);
  let reason = 'which is moderate';
  let action = 'Continue monitoring.';
  if (label === 'DRY') { reason = 'indicating dry soil'; action = 'Irrigation is recommended.'; }
  if (label === 'SUFFICIENT') { reason = 'indicating sufficient moisture'; action = 'Avoid unnecessary irrigation.'; }
  return {
    status,
    recommendation: `Soil moisture is ${moisture}%, ${reason}. Temperature is ${temperature}°C and humidity is ${humidity}%. ${action}`,
  };
}

function randomBetween(min, max, decimals = 0) {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimals));
}

function generateDemoReading() {
  const moisture = randomBetween(20, 75, 0);
  const temperature = randomBetween(25, 35, 1);
  const humidity = randomBetween(40, 80, 0);
  const { status, recommendation } = buildRecommendation(moisture, temperature, humidity);
  return {
    soil_moisture: moisture,
    temperature,
    humidity,
    irrigation_status: status,
    recommendation,
    created_at: new Date().toISOString(),
  };
}

function formatTime(isoString) {
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function Dashboard() {
  const [demoMode, setDemoMode] = useState(true);
  const [presentationMode, setPresentationMode] = useState(false);
  const [reading, setReading] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [errorState, setErrorState] = useState(null); // 'SERVER_OFFLINE' | 'ESP32_OFFLINE' | 'NO_DATA' | null
  const lastRealReadingRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle('presentation-mode', presentationMode);
    return () => document.body.classList.remove('presentation-mode');
  }, [presentationMode]);

  useEffect(() => {
    let cancelled = false;

    async function tick() {
      if (demoMode) {
        const demo = generateDemoReading();
        if (cancelled) return;
        setErrorState(null);
        setReading(demo);
        pushChartPoint(demo);
        return;
      }

      try {
        const res = await getLatestReading();
        if (cancelled) return;

        if (res.status === 'EMPTY') {
          setErrorState('NO_DATA');
          return;
        }

        const data = res.data;
        lastRealReadingRef.current = data;
        setReading(data);
        pushChartPoint(data);

        const age = Date.now() - new Date(data.created_at).getTime();
        setErrorState(age > ESP32_STALE_MS ? 'ESP32_OFFLINE' : null);
      } catch (err) {
        if (cancelled) return;
        setErrorState('SERVER_OFFLINE');
        // Keep showing the last known reading, if any, rather than crashing.
        if (lastRealReadingRef.current) {
          setReading(lastRealReadingRef.current);
        }
      }
    }

    function pushChartPoint(data) {
      setChartData((prev) => {
        const next = [
          ...prev,
          {
            time: formatTime(data.created_at),
            moisture: Number(data.soil_moisture),
            temperature: Number(data.temperature),
            humidity: Number(data.humidity),
          },
        ];
        return next.slice(-MAX_CHART_POINTS);
      });
    }

    tick();
    const interval = setInterval(tick, REFRESH_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [demoMode]);

  const moisture = reading ? Number(reading.soil_moisture) : null;
  const temperature = reading ? Number(reading.temperature) : null;
  const humidity = reading ? Number(reading.humidity) : null;
  const status = reading ? reading.irrigation_status : 'MONITOR';
  const recommendation = reading ? reading.recommendation : '';
  const moistureInfo = moisture !== null ? classifyMoisture(moisture) : { statusType: 'moderate', label: '—' };

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      <div className="dashboard-header">
        <div>
          <h2 style={{ marginBottom: 2 }}>Live Farm Monitoring</h2>
          <p className="muted" style={{ margin: 0 }}>Real-time soil, temperature and humidity readings</p>
        </div>
        <div className="hide-in-presentation" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            className={`btn-toggle${demoMode ? ' on' : ''}`}
            onClick={() => setDemoMode((v) => !v)}
          >
            Demo Mode: {demoMode ? 'ON' : 'OFF'}
          </button>
          <button className="btn btn-outline" onClick={() => setPresentationMode((v) => !v)}>
            {presentationMode ? 'Exit Presentation Mode' : 'Presentation Mode'}
          </button>
        </div>
      </div>

      {demoMode && (
        <div className="badge badge-demo" style={{ marginBottom: 18 }}>
          DEMO MODE — SIMULATED IoT DATA
        </div>
      )}

      {!demoMode && errorState === 'SERVER_OFFLINE' && (
        <div className="offline-banner">⚠️ SERVER OFFLINE — cannot reach the backend API.</div>
      )}
      {!demoMode && errorState === 'ESP32_OFFLINE' && (
        <div className="offline-banner">⚠️ ESP32 OFFLINE — showing the last reading received.</div>
      )}
      {!demoMode && errorState === 'NO_DATA' && (
        <div className="offline-banner">No live sensor data available.</div>
      )}

      {reading ? (
        <>
          <div className="card-grid" style={{ marginBottom: 22 }}>
            <SensorCard
              icon="🌱"
              label="Soil Moisture"
              value={moisture}
              unit="%"
              statusLabel={moistureInfo.label}
              statusType={moistureInfo.statusType}
            />
            <SensorCard icon="🌡" label="Temperature" value={temperature} unit="°C" />
            <SensorCard icon="💧" label="Humidity" value={humidity} unit="%" />
            <SensorCard
              icon="🚿"
              label="Irrigation"
              value={status === 'IRRIGATION REQUIRED' ? 'REQUIRED' : status === 'MONITOR' ? 'MONITOR' : 'NOT NEEDED'}
              statusLabel={moistureInfo.label}
              statusType={moistureInfo.statusType}
            />
          </div>

          <div className="dashboard-grid two-col" style={{ marginBottom: 22 }}>
            <div className="card">
              <MoistureGauge moisture={moisture} />
            </div>
            <IrrigationStatus status={status} recommendation={recommendation} />
          </div>

          <div className="card">
            <h3 style={{ marginBottom: 12 }}>Sensor Trends</h3>
            <SensorChart data={chartData} />
          </div>
        </>
      ) : (
        <div className="card">
          <p className="muted" style={{ margin: 0 }}>No live sensor data available.</p>
        </div>
      )}
    </div>
  );
}
