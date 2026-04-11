// NavSketchbookLink.tsx
// Drop this inside your existing Navbar component — it's a styled link that
// fits alongside your regular nav items but has personality.
// Usage: <NavSketchbookLink /> anywhere inside your nav ul/flex container

import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function NavSketchbookLink() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hovered, setHovered] = useState(false);
  const isActive = location.pathname === '/sketchbook';

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/sketchbook');
  };

  return (
    <>
      <a
        href="/sketchbook"
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`nav-sketch-link ${isActive ? 'active' : ''}`}
        aria-label="Sketchbook — the other side"
      >
        <span className="nav-sketch-icon" aria-hidden="true">
          {hovered ? '🚪' : '✦'}
        </span>
        <span className="nav-sketch-text">Sketchbook</span>
        {hovered && (
          <span className="nav-sketch-tooltip" aria-hidden="true">
            the other side →
          </span>
        )}
      </a>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');

        .nav-sketch-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          position: relative;
          text-decoration: none;
          padding: 4px 10px 4px 8px;
          border: 1.5px dashed rgba(124,58,237,0.4);
          border-radius: 4px;
          font-family: 'Caveat', cursive;
          font-size: 16px;
          font-weight: 700;
          color: #7c3aed;
          letter-spacing: 0.02em;
          transition: border-color 0.2s, background 0.2s, transform 0.15s;
          background: rgba(124,58,237,0.04);
          cursor: pointer;
        }

        .nav-sketch-link:hover {
          border-color: rgba(124,58,237,0.8);
          background: rgba(124,58,237,0.08);
          transform: rotate(-1deg) scale(1.04);
        }

        .nav-sketch-link.active {
          border-style: solid;
          border-color: #7c3aed;
          background: rgba(124,58,237,0.1);
          color: #6d28d9;
        }

        .nav-sketch-icon {
          font-size: 14px;
          transition: transform 0.2s;
          display: inline-block;
        }

        .nav-sketch-link:hover .nav-sketch-icon {
          transform: scale(1.2);
        }

        .nav-sketch-text {
          font-size: 15px;
        }

        .nav-sketch-tooltip {
          position: absolute;
          bottom: -28px;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Caveat', cursive;
          font-size: 12px;
          color: #9b6fd4;
          white-space: nowrap;
          pointer-events: none;
          animation: tooltipFade 0.15s ease forwards;
        }

        @keyframes tooltipFade {
          from { opacity: 0; transform: translateX(-50%) translateY(-4px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        /* Mobile: hide tooltip, keep icon only option */
        @media (max-width: 640px) {
          .nav-sketch-text { display: none; }
          .nav-sketch-link { padding: 4px 8px; }
          .nav-sketch-tooltip { display: none; }
        }
      `}</style>
    </>
  );
}
