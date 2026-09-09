import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>© {new Date().getFullYear()} IKS Smart Water Advisor — Computer Engineering Project</span>
        <span>
          Built with React, Node.js, Express, MySQL &amp; ESP32
        </span>
      </div>
    </footer>
  );
}
