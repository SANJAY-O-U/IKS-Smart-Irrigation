// ============================================================
// client/src/services/api.js
// Thin fetch wrapper for the Express REST API.
// ============================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export function getHealth() {
  return request('/health');
}

export function getLatestReading() {
  return request('/sensor/latest');
}

export function getHistory({ page = 1, limit = 20, from, to } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  return request(`/sensor/history?${params.toString()}`);
}

export function postReading({ soil_moisture, temperature, humidity }) {
  return request('/sensor/data', {
    method: 'POST',
    body: JSON.stringify({ soil_moisture, temperature, humidity }),
  });
}
