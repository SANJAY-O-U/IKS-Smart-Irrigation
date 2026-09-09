import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/history', label: 'History' },
  { to: '/iks-knowledge', label: 'IKS Knowledge' },
  { to: '/architecture', label: 'Architecture' },
  { to: '/about', label: 'About' },
];

export default function Navbar({ isDemoMode = false }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <span>🌱</span>
          <span>IKS Smart Water Advisor</span>
        </div>

        <nav className="navbar-links">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ display: 'flex', gap: 8 }}>
          <span className="badge badge-live">
            <span className="dot" /> Live
          </span>
          {isDemoMode && <span className="badge badge-demo">Demo Mode</span>}
        </div>
      </div>
    </header>
  );
}
