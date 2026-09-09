import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

/**
 * @param {Array<{ time: string, moisture: number, temperature: number, humidity: number }>} data
 */
export default function SensorChart({ data = [] }) {
  if (!data.length) {
    return <p className="muted">No readings yet to chart.</p>;
  }

  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 16, left: -12, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-200)" />
          <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="var(--gray-500)" />
          <YAxis tick={{ fontSize: 11 }} stroke="var(--gray-500)" />
          <Tooltip
            contentStyle={{ borderRadius: 10, border: '1px solid var(--gray-200)', fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey="moisture"
            name="Soil Moisture (%)"
            stroke="var(--green-600)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="temperature"
            name="Temperature (°C)"
            stroke="#d9772f"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="humidity"
            name="Humidity (%)"
            stroke="var(--blue-500)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
