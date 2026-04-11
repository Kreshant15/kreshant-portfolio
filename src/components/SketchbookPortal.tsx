// SketchbookPortal.tsx
// Drop this between your <Contact /> and <Footer /> in App.tsx or your main page
// It renders the glitch-tear door that leads to /sketchbook

import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';

export default function SketchbookPortal() {
  const navigate = useNavigate();
  const [isTriggered, setIsTriggered] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const triggerPortal = () => {
    if (isTriggered) return;
    setIsTriggered(true);

    const overlay = overlayRef.current;
    if (!overlay) return;

    overlay.style.display = 'block';

    // Phase 1: glitch flicker (0–300ms)
    let glitchCount = 0;
    const glitchInterval = setInterval(() => {
      glitchCount++;
      overlay.style.opacity = glitchCount % 2 === 0 ? '0.85' : '0.4';
      if (glitchCount > 8) {
        clearInterval(glitchInterval);
        overlay.style.opacity = '1';

        // Phase 2: tear expand then navigate
        setTimeout(() => {
          navigate('/sketchbook');
          setIsTriggered(false);
        }, 350);
      }
    }, 60);
  };

  return (
    <section className="portal-section">
      {/* Glitch overlay - covers viewport during transition */}
      <div
        ref={overlayRef}
        className="glitch-fullscreen"
        style={{ display: 'none' }}
        aria-hidden="true"
      >
        <div className="glitch-r" />
        <div className="glitch-b" />
        <div className="glitch-static" />
        <div className="tear-center" />
      </div>

      <div className="portal-inner">
        {/* Torn paper top edge */}
        <div className="torn-top" aria-hidden="true">
          <svg viewBox="0 0 1440 40" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0,40 L0,20 Q30,5 60,18 Q90,30 120,10 Q150,0 180,15 Q210,28 240,8 Q270,0 300,20 Q330,35 360,12 Q390,0 420,22 Q450,38 480,15 Q510,0 540,18 Q570,32 600,10 Q630,0 660,20 Q690,36 720,12 Q750,0 780,22 Q810,40 840,15 Q870,0 900,20 Q930,35 960,10 Q990,0 1020,18 Q1050,30 1080,8 Q1110,0 1140,22 Q1170,38 1200,15 Q1230,0 1260,20 Q1290,36 1320,10 Q1350,0 1380,18 Q1410,30 1440,15 L1440,40 Z"
              fill="#faf7f0"
            />
          </svg>
        </div>

        <div className="portal-content">
          {/* Handwritten label */}
          <p className="portal-eyebrow">psst... there's a secret</p>

          {/* The Door */}
          <button
            className="portal-door-btn"
            onClick={triggerPortal}
            aria-label="Enter the sketchbook world"
          >
            <div className="door-frame">
              <div className="door-glow" />
              <div className="door-window" />
              <div className="door-knob" />
              <div className="door-crack" />
            </div>
          </button>

          <h2 className="portal-heading">
            The Other<br />
            <span className="portal-heading-outlined">Side</span>
          </h2>

          <p className="portal-subtext">
            drawings · doodles · chaos · the real me
          </p>

          <div className="sticky-cluster" aria-hidden="true">
            <div className="sticky sticky-1">don't open</div>
            <div className="sticky sticky-2">← click it</div>
          </div>
        </div>

        {/* Torn paper bottom edge */}
        <div className="torn-bottom" aria-hidden="true">
          <svg viewBox="0 0 1440 40" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0,0 L0,20 Q30,35 60,22 Q90,10 120,30 Q150,40 180,25 Q210,12 240,32 Q270,40 300,20 Q330,5 360,28 Q390,40 420,18 Q450,2 480,25 Q510,40 540,22 Q570,8 600,30 Q630,40 660,20 Q690,5 720,28 Q750,40 780,18 Q810,0 840,25 Q870,40 900,20 Q930,5 960,30 Q990,40 1020,22 Q1050,10 1080,32 Q1110,40 1140,18 Q1170,2 1200,25 Q1230,40 1260,20 Q1290,5 1320,30 Q1350,40 1380,22 Q1410,8 1440,25 L1440,0 Z"
              fill="#faf7f0"
            />
          </svg>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Kalam:wght@300;400&display=swap');

        .portal-section {
          position: relative;
          width: 100%;
          background: #1a0a2e;
          margin: 0;
          overflow: hidden;
        }

        .glitch-fullscreen {
          position: fixed;
          inset: 0;
          z-index: 9999;
          pointer-events: none;
          background: #0a0010;
        }

        .glitch-r {
          position: absolute;
          inset: 0;
          background: rgba(255,0,100,0.12);
          mix-blend-mode: screen;
          transform: translateX(-6px);
          animation: glitchR 0.4s steps(2, end) infinite;
        }

        .glitch-b {
          position: absolute;
          inset: 0;
          background: rgba(0,200,255,0.12);
          mix-blend-mode: screen;
          transform: translateX(6px);
          animation: glitchB 0.4s steps(2, end) infinite;
        }

        .glitch-static {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.04) 2px,
            rgba(255,255,255,0.04) 3px
          );
        }

        .tear-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 0;
          height: 0;
          background: #faf7f0;
          border-radius: 50%;
          animation: tearBurst 0.35s ease-out 0.3s forwards;
        }

        @keyframes glitchR {
          0%,100% { clip-path: inset(0 0 80% 0); }
          50% { clip-path: inset(40% 0 20% 0); }
        }
        @keyframes glitchB {
          0%,100% { clip-path: inset(60% 0 0 0); }
          50% { clip-path: inset(10% 0 60% 0); }
        }
        @keyframes tearBurst {
          0% { width: 0; height: 0; opacity: 1; }
          100% { width: 300vw; height: 300vw; opacity: 1; border-radius: 0; }
        }

        .torn-top, .torn-bottom {
          width: 100%;
          line-height: 0;
        }

        .torn-top { transform: scaleY(-1); }

        .portal-inner {
          position: relative;
        }

        .portal-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 24px 80px;
          position: relative;
          text-align: center;
          min-height: 320px;
        }

        .portal-eyebrow {
          font-family: 'Caveat', cursive;
          font-size: 18px;
          color: rgba(196,181,255,0.6);
          margin-bottom: 32px;
          letter-spacing: 0.05em;
          transform: rotate(-2deg);
          display: inline-block;
        }

        /* THE DOOR */
        .portal-door-btn {
          background: none;
          border: none;
          cursor: pointer;
          margin-bottom: 28px;
          position: relative;
          padding: 0;
        }

        .door-frame {
          width: 70px;
          height: 100px;
          border: 2.5px solid rgba(196,181,255,0.7);
          border-radius: 35px 35px 4px 4px;
          position: relative;
          background: rgba(124,58,237,0.08);
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 0 20px rgba(124,58,237,0.3), inset 0 0 20px rgba(124,58,237,0.1);
        }

        .portal-door-btn:hover .door-frame {
          transform: scale(1.08);
          box-shadow: 0 0 40px rgba(124,58,237,0.6), inset 0 0 30px rgba(124,58,237,0.2);
        }

        .door-glow {
          position: absolute;
          inset: -8px;
          border-radius: 43px 43px 4px 4px;
          background: radial-gradient(ellipse at 50% 100%, rgba(124,58,237,0.4) 0%, transparent 70%);
          animation: doorPulse 2.5s ease-in-out infinite;
        }

        .door-window {
          position: absolute;
          top: 15px;
          left: 12px;
          right: 12px;
          height: 35px;
          border-radius: 20px 20px 2px 2px;
          border: 1.5px solid rgba(196,181,255,0.3);
          background: linear-gradient(160deg, rgba(196,181,255,0.2) 0%, rgba(124,58,237,0.4) 100%);
        }

        .door-knob {
          position: absolute;
          bottom: 18px;
          right: 12px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(196,181,255,0.7);
          box-shadow: 0 0 6px rgba(196,181,255,0.5);
        }

        .door-crack {
          position: absolute;
          top: 20%;
          right: -1px;
          width: 1px;
          height: 50%;
          background: rgba(124,58,237,0.8);
          box-shadow: 0 0 6px rgba(124,58,237,1);
          animation: crackPulse 3s ease-in-out infinite;
        }

        @keyframes doorPulse {
          0%,100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.03); }
        }
        @keyframes crackPulse {
          0%,100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        .portal-heading {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(36px, 8vw, 72px);
          font-weight: 900;
          color: #faf7f0;
          line-height: 0.95;
          letter-spacing: -0.03em;
          margin-bottom: 16px;
        }

        .portal-heading-outlined {
          -webkit-text-stroke: 2px rgba(196,181,255,0.8);
          -webkit-text-fill-color: transparent;
          color: transparent;
        }

        .portal-subtext {
          font-family: 'Kalam', cursive;
          font-size: 16px;
          color: rgba(196,181,255,0.5);
          letter-spacing: 0.08em;
        }

        .sticky-cluster {
          position: absolute;
          pointer-events: none;
        }

        .sticky {
          position: absolute;
          font-family: 'Caveat', cursive;
          font-size: 13px;
          color: #333;
          padding: 4px 10px;
          box-shadow: 1px 2px 6px rgba(0,0,0,0.2);
          white-space: nowrap;
        }

        .sticky-1 {
          background: #fff9c4;
          top: -140px;
          right: -80px;
          transform: rotate(12deg);
        }

        .sticky-2 {
          background: #c8f5e0;
          top: -100px;
          right: -140px;
          transform: rotate(-6deg);
        }

        @media (max-width: 640px) {
          .sticky-cluster { display: none; }
          .portal-content { padding: 40px 16px 60px; }
        }
      `}</style>
    </section>
  );
}
