import React, { useEffect, useState, useCallback } from 'react';
import { getHistory } from '../services/api.js';

const PAGE_SIZE = 10;

function toCSV(rows) {
  const header = ['Date', 'Time', 'Soil Moisture (%)', 'Temperature (C)', 'Humidity (%)', 'Status', 'Recommendation'];
  const lines = rows.map((r) => {
    const d = new Date(r.created_at);
    const date = d.toLocaleDateString();
    const time = d.toLocaleTimeString();
    const cells = [date, time, r.soil_moisture, r.temperature, r.humidity, r.irrigation_status, r.recommendation];
    return cells.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',');
  });
  return [header.join(','), ...lines].join('\n');
}

function downloadCSV(rows) {
  const csv = toCSV(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `sensor-history-${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function History() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getHistory({ page, limit: PAGE_SIZE, from: fromDate || undefined, to: toDate || undefined });
      setRows(res.data);
      setTotal(res.total);
    } catch (err) {
      setError('SERVER OFFLINE — cannot load history right now.');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [page, fromDate, toDate]);

  useEffect(() => {
    load();
  }, [load]);

  const filteredRows = rows.filter((r) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      r.irrigation_status.toLowerCase().includes(term) ||
      r.recommendation.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      <h2>Historical Readings</h2>
      <p className="muted">Browse, filter and export past sensor readings and recommendations.</p>

      <div className="table-toolbar">
        <input
          className="input"
          placeholder="Search status or recommendation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input className="input" type="date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setPage(1); }} />
        <span className="muted">to</span>
        <input className="input" type="date" value={toDate} onChange={(e) => { setToDate(e.target.value); setPage(1); }} />
        <button className="btn btn-outline" onClick={load}>Refresh</button>
        <button className="btn btn-secondary" onClick={() => downloadCSV(filteredRows)} disabled={!filteredRows.length}>
          Export CSV
        </button>
      </div>

      {error && <div className="offline-banner">{error}</div>}

      {!error && (
        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Soil Moisture</th>
                <th>Temperature</th>
                <th>Humidity</th>
                <th>Status</th>
                <th>Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="muted" style={{ textAlign: 'center', padding: 24 }}>
                    {loading ? 'Loading...' : 'No readings found for this filter.'}
                  </td>
                </tr>
              )}
              {filteredRows.map((r) => {
                const d = new Date(r.created_at);
                return (
                  <tr key={r.id}>
                    <td>{d.toLocaleDateString()}</td>
                    <td>{d.toLocaleTimeString()}</td>
                    <td>{r.soil_moisture}%</td>
                    <td>{r.temperature}°C</td>
                    <td>{r.humidity}%</td>
                    <td>{r.irrigation_status}</td>
                    <td style={{ maxWidth: 320 }}>{r.recommendation}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!error && total > PAGE_SIZE && (
        <div className="pagination">
          <button className="btn btn-outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>
          <span className="muted">Page {page} of {totalPages}</span>
          <button className="btn btn-outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
