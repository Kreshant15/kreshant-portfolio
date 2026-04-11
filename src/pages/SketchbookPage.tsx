// SketchbookPage.tsx
// Full /sketchbook route page — intentionally chaotic notebook world
// 
// HOW TO ADD YOUR CONTENT:
//   drawings[]   → add your drawing image paths here
//   stickers[]   → add your PNG sticker paths here
//   musicSrc     → replace with your actual audio file path
//
// Image paths: put your files in /public/sketchbook/
// Then reference as: /sketchbook/your-drawing.jpg
//
// React Router setup (in App.tsx):
//   import SketchbookPage from './pages/SketchbookPage';
//   <Route path="/sketchbook" element={<SketchbookPage />} />

import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── CONTENT CONFIG ────────────────────────────────────────────────────────────
// Replace placeholder paths with your actual files in /public/sketchbook/

const drawings = [
  { src: '/sketchbook/drawing-01.jpg', label: 'figure study', note: 'pencil, 2023', rotate: -3, top: 120, left: 8 },
  { src: '/sketchbook/naruto.webp', label: 'character thing', note: 'ballpoint', rotate: 2, top: 80, left: 38 },
  { src: '/sketchbook/drawing-03.jpg', label: 'anatomy attempt', note: 'ink', rotate: -1.5, top: 140, left: 62 },
  { src: '/sketchbook/drawing-04.jpg', label: 'random face', note: '3am energy', rotate: 4, top: 90, left: 18 },
  { src: '/sketchbook/landscape.webp', label: 'landscape thing', note: 'pencil', rotate: -2, top: 110, left: 72 },
  { src: '/sketchbook/drawing-06.jpg', label: 'hands (ugh)', note: 'still struggling', rotate: 1, top: 130, left: 48 },
];

// Your PNG stickers — ransom letters, cutout text, etc.
// Place them in /public/sketchbook/stickers/
const stickers: { src: string; style: React.CSSProperties }[] = [
  { src: '/sketchbook/stickers/skull.webp', style: { top: '5%', left: '70%', width: 120, transform: 'rotate(8deg)' } },
  // { src: '/sketchbook/stickers/ransom-02.png', style: { top: '42%', left: '5%', width: 90, transform: 'rotate(-5deg)' } },
  // Add yours here — uncomment and set your actual paths
];

// Your music file — place in /public/sketchbook/
// Recommended: ~2min ambient lo-fi loop, mp3 format, <3MB
const musicList = [
  '/sketchbook/ambience1.mp3',
  '/sketchbook/ambience2.mp3',
  '/sketchbook/ambience3.mp3'
];

const trackColors = [
  "#a78bfa", // violet
  "#fca5a5", // soft red
  "#6ee7b7", // mint
];

const [currentTrack, setCurrentTrack] = useState(0);

const currentColor = trackColors[currentTrack];

// ─── MARGIN ANNOTATIONS ────────────────────────────────────────────────────────
const annotations = [
  { text: '← need to redo this', top: '18%', left: '2%', rotate: -90, color: '#5a7abf' },
  { text: 'reference from pinterest', top: '35%', right: '2%', rotate: 90, color: '#888' },
  { text: '★ fav', top: '55%', left: '1%', rotate: -90, color: '#d4a017' },
  { text: 'drew this at 2am lol', top: '70%', right: '1%', rotate: 90, color: '#888' },
];

// ─── RANDOM DOODLE PATHS ───────────────────────────────────────────────────────
const doodleElements = [
  // Stars scattered around
  { type: 'star', x: 82, y: 8, size: 14, color: '#c4b5fd', opacity: 0.5 },
  { type: 'star', x: 15, y: 45, size: 10, color: '#7c3aed', opacity: 0.4 },
  { type: 'star', x: 75, y: 72, size: 18, color: '#a78bfa', opacity: 0.35 },
  { type: 'star', x: 5, y: 88, size: 8, color: '#c4b5fd', opacity: 0.4 },
  { type: 'star', x: 92, y: 55, size: 12, color: '#7c3aed', opacity: 0.3 },
  // Circles
  { type: 'circle', x: 30, y: 12, size: 24, color: 'rgba(100,150,200,0.15)', opacity: 1 },
  { type: 'circle', x: 88, y: 30, size: 16, color: 'rgba(200,100,100,0.12)', opacity: 1 },
  { type: 'circle', x: 10, y: 65, size: 30, color: 'rgba(160,200,100,0.1)', opacity: 1 },
  // Squiggly lines via path
  { type: 'squiggle', x: 55, y: 15, opacity: 0.3, color: '#888' },
  { type: 'squiggle2', x: 20, y: 80, opacity: 0.25, color: '#5a7abf' },
  // Arrows
  { type: 'arrow', x: 68, y: 42, opacity: 0.35, color: '#888', rotate: 45 },
];

// ─── NOTEBOOK LINES ────────────────────────────────────────────────────────────
// Controls the ruled-line section visual
const NOTE_ENTRIES = [
  { text: 'things to draw next:', style: 'heading' },
  { text: 'more hands (ugh)', style: 'normal' },
  { text: 'perspective study', style: 'normal' },
  { text: 'that forest scene from dark', style: 'normal' },
  { text: 'character from vinland saga', style: 'normal' },
  { text: 'crossed: portrait of toji', style: 'crossed' },
  { text: '', style: 'blank' },
  { text: 'currently listening:', style: 'heading' },
  { text: '→ trying to find the perfect study playlist', style: 'normal' },
  { text: '', style: 'blank' },
  { text: 'last watched: vinland saga s2 (crying inside)', style: 'note' },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function SketchbookPage() {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicReady, setMusicReady] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [entryAnim, setEntryAnim] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });

  // Entry animation
  useEffect(() => {
    const t = setTimeout(() => setEntryAnim(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Custom pencil cursor
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Audio handlers
  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicPlaying) {
      audio.pause();
      setMusicPlaying(false);
    } else {
      audio.play().catch(() => {});
      setMusicPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  // Back — glitch out
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      {/* ── CUSTOM PENCIL CURSOR ── */}
      <div
        className="pencil-cursor"
        style={{ left: cursorPos.x, top: cursorPos.y }}
        aria-hidden="true"
      />

      {/* ── AUDIO ── */}
      <audio
  ref={audioRef}
  src={musicList[currentTrack]}
  onEnded={() =>
    setCurrentTrack((prev) => (prev + 1) % musicList.length)
  }
  onCanPlayThrough={() => setMusicReady(true)}
  preload="none"
/>

      {/* ── MUSIC PLAYER ── */}
      <div className="music-player">
  <div
    className="music-player-inner transition-all duration-500"
    style={{
      boxShadow: musicPlaying
        ? `0 0 20px ${currentColor}40, 0 0 40px ${currentColor}20`
        : "none",
      borderColor: currentColor,
    }}
  >
    {/* EQ */}
    <div className="music-eq" aria-hidden="true">
      {musicPlaying ? (
        <>
          <span
            className="eq-bar"
            style={{ animationDelay: "0ms", background: currentColor }}
          />
          <span
            className="eq-bar"
            style={{ animationDelay: "150ms", background: currentColor }}
          />
          <span
            className="eq-bar"
            style={{ animationDelay: "75ms", background: currentColor }}
          />
          <span
            className="eq-bar"
            style={{ animationDelay: "225ms", background: currentColor }}
          />
        </>
      ) : (
        <span className="music-note" style={{ color: currentColor }}>
          ♪
        </span>
      )}
    </div>

    {/* Play Button */}
    <button
      className="music-btn transition-colors duration-300"
      onClick={toggleMusic}
      aria-label={musicPlaying ? "Pause music" : "Play ambient music"}
      style={{ color: currentColor }}
    >
      {musicPlaying ? "⏸" : "▶"}
    </button>

    {/* Label */}
    <div className="music-label">
      {musicPlaying ? `track ${currentTrack + 1}` : "ambient"}
    </div>

    {/* Track indicator */}
    {musicPlaying && (
      <div className="text-[10px] opacity-50 ml-1">
        {currentTrack + 1} · {musicList.length}
      </div>
    )}

    {/* Volume */}
    {musicPlaying && (
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={volume}
        onChange={handleVolumeChange}
        className="vol-slider"
        aria-label="Volume"
        style={{ accentColor: currentColor }}
      />
    )}
  </div>
</div>

      {/* ── BACK BUTTON ── */}
      <button className="back-btn" onClick={handleBack} aria-label="Back to portfolio">
        ← back to the real world
      </button>

      {/* ── MAIN PAGE ── */}
      <main
        className={`sketchbook-main ${entryAnim ? 'entered' : ''}`}
        aria-label="Kreshant's sketchbook world"
      >
        {/* SVG doodle layer — scattered across the page */}
        <div className="doodle-layer" aria-hidden="true">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="doodle-svg">
            {doodleElements.map((d, i) => {
              if (d.type === 'star') return (
                <text key={i} x={`${d.x}%`} y={`${d.y}%`} fontSize={d.size} fill={d.color} opacity={d.opacity} textAnchor="middle">✦</text>
              );
              if (d.type === 'circle') return (
                <circle key={i} cx={`${d.x}%`} cy={`${d.y}%`} r={`${d.size / 2}%`} fill={d.color} stroke="none" />
              );
              if (d.type === 'squiggle') return (
                <path key={i} d={`M${d.x}% ${d.y}% Q${d.x+3}% ${d.y-2}% ${d.x+6}% ${d.y}% Q${d.x+9}% ${d.y+2}% ${d.x+12}% ${d.y}%`}
                  stroke={d.color} strokeWidth="0.4%" fill="none" opacity={d.opacity} strokeLinecap="round"/>
              );
              if (d.type === 'squiggle2') return (
                <path key={i} d={`M${d.x}% ${d.y}% Q${d.x+2}% ${d.y-1.5}% ${d.x+4}% ${d.y}% Q${d.x+6}% ${d.y+1.5}% ${d.x+8}% ${d.y}%`}
                  stroke={d.color} strokeWidth="0.3%" fill="none" opacity={d.opacity} strokeLinecap="round"/>
              );
              if (d.type === 'arrow') return (
                <g key={i} transform={`translate(${d.x} ${d.y}) rotate(${d.rotate || 0})`} opacity={d.opacity}>
                  <line x1="-3" y1="0" x2="3" y2="0" stroke={d.color} strokeWidth="0.4" />
                  <path d="M1.5,-1 L3,0 L1.5,1" fill="none" stroke={d.color} strokeWidth="0.4" />
                </g>
              );
              return null;
            })}
          </svg>
        </div>

        {/* Margin annotations */}
        {annotations.map((a, i) => (
          <div
            key={i}
            className="margin-annotation"
            style={{
              top: a.top,
              left: 'left' in a ? a.left : undefined,
              right: 'right' in a ? (a as typeof a & { right: string }).right : undefined,
              transform: `rotate(${a.rotate}deg)`,
              color: a.color,
            }}
            aria-hidden="true"
          >
            {a.text}
          </div>
        ))}

        {/* ── HERO HEADER ── */}
        <div className="sk-header">
          {/* Washi tape strip */}
          <div className="washi-tape washi-1" aria-hidden="true" />
          <div className="washi-tape washi-2" aria-hidden="true" />

          <p className="sk-volume">Vol. I — 2024</p>
          <h1 className="sk-title">Kresh's<br /><span className="sk-title-messy">Sketchbook</span></h1>
          <p className="sk-desc">
            drawings · doodles · 3am thoughts
            <br />
            <span className="sk-desc-small">not everything here is finished. that's the point.</span>
          </p>

          {/* Sticky notes cluster */}
          <div className="sticky-cluster" aria-hidden="true">
            <div className="sticky-note sn-1">these r wip ok</div>
            <div className="sticky-note sn-2">↑ obsessed w this one</div>
            <div className="sticky-note sn-3">trying to get better at hands 🫠</div>
          </div>

          {/* Coffee ring */}
          <div className="coffee-ring" aria-hidden="true" />
        </div>

        {/* ── DRAWINGS SECTION ── */}
        <section className="drawings-section" aria-label="Drawings">
          <div className="section-label">
            <span className="section-label-text">// drawings</span>
            <span className="section-label-underline" />
          </div>

          <div className="drawings-chaos">
            {drawings.map((drawing, i) => (
              <DrawingCard
                key={i}
                drawing={drawing}
                index={i}
                onClick={() => setLightboxSrc(drawing.src)}
              />
            ))}

            {/* "more coming" placeholder */}
            <div
              className="drawing-placeholder-card"
              style={{ transform: 'rotate(3deg)' }}
              aria-hidden="true"
            >
              <div className="placeholder-inner">
                <span className="placeholder-plus">+</span>
                <span className="placeholder-text">more coming<br />when i stop<br />being lazy</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── STICKERS LAYER ── */}
        {stickers.map((s, i) => (
          <img
            key={i}
            src={s.src}
            style={{ position: 'absolute', ...s.style, pointerEvents: 'none' }}
            alt=""
            aria-hidden="true"
          />
        ))}

        {/* ── NOTEBOOK SECTION ── */}
        <section className="notebook-section" aria-label="Notes">
          <div className="notebook-wrap">
            <div className="notebook-margin" aria-hidden="true" />
            <div className="notebook-lines">
              {NOTE_ENTRIES.map((entry, i) => (
                <div key={i} className={`note-line note-${entry.style}`}>
                  {entry.style === 'crossed' ? (
                    <span className="note-crossed">{entry.text.replace('crossed: ', '')}</span>
                  ) : (
                    entry.text
                  )}
                </div>
              ))}
            </div>
            {/* Doodles in the notebook margins */}
            <div className="nb-doodles" aria-hidden="true">
              <div className="nb-star nb-star-1">✦</div>
              <div className="nb-star nb-star-2">✧</div>
              <div className="nb-star nb-star-3">★</div>
              <div className="nb-face">
                <svg width="30" height="30" viewBox="0 0 30 30">
                  <circle cx="15" cy="15" r="12" stroke="#bbb" strokeWidth="1" fill="none"/>
                  <circle cx="11" cy="13" r="1.5" fill="#bbb"/>
                  <circle cx="19" cy="13" r="1.5" fill="#bbb"/>
                  <path d="M10,19 Q15,23 20,19" stroke="#bbb" strokeWidth="1" fill="none" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* ── CURRENTLY INTO ── */}
        <section className="currently-section" aria-label="Currently into">
          <div className="currently-wrap">
            <h2 className="currently-title">currently into</h2>
            <div className="currently-grid">
              <CurrentlyCard emoji="🎵" label="music" value="looking for the perfect study playlist" color="#c4b5fd" />
              <CurrentlyCard emoji="📺" label="watching" value="Vinland Saga S2 — it's destroying me" color="#fcd34d" />
              <CurrentlyCard emoji="🎮" label="playing" value="whatever runs on an RTX 3050" color="#6ee7b7" />
              <CurrentlyCard emoji="✏️" label="drawing" value="anatomy, hands, hating myself" color="#fca5a5" />
            </div>
          </div>
        </section>

        {/* ── FOOTER OF THE SKETCHBOOK ── */}
        <div className="sk-footer">
          <div className="sk-footer-line" aria-hidden="true" />
          <p className="sk-footer-text">
            this is the part of me that doesn't make it to the portfolio
          </p>
          <p className="sk-footer-sub">@kreshrts · kreshantkumar.com</p>
          <button className="sk-footer-back" onClick={handleBack}>
            ← back to the professional version of me
          </button>
        </div>
      </main>

      {/* ── LIGHTBOX ── */}
      {lightboxSrc && (
        <div
          className="lightbox"
          onClick={() => setLightboxSrc(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Drawing enlarged"
        >
          <button className="lightbox-close" onClick={() => setLightboxSrc(null)} aria-label="Close">✕</button>
          <img src={lightboxSrc} alt="Drawing enlarged" className="lightbox-img" onClick={e => e.stopPropagation()} />
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Kalam:wght@300;400;700&family=Patrick+Hand&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── CUSTOM CURSOR ── */
        body:has(.sketchbook-main) { cursor: none !important; }

        .pencil-cursor {
          position: fixed;
          pointer-events: none;
          z-index: 99999;
          width: 20px;
          height: 20px;
          transform: translate(-4px, -18px);
          font-size: 18px;
        }
        .pencil-cursor::after {
          content: '✏️';
          font-size: 18px;
          display: block;
        }

        /* ── PAGE BASE ── */
        .sketchbook-main {
          min-height: 100vh;
          background: #faf7f0;
          position: relative;
          overflow-x: hidden;
          opacity: 0;
          transform: scale(0.98);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .sketchbook-main.entered {
          opacity: 1;
          transform: scale(1);
        }

        /* Paper texture via repeating lines */
        .sketchbook-main::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            repeating-linear-gradient(
              transparent,
              transparent 27px,
              rgba(180,200,220,0.18) 27px,
              rgba(180,200,220,0.18) 28px
            );
          pointer-events: none;
          z-index: 0;
        }

        /* Slight paper noise */
        .sketchbook-main::after {
          content: '';
          position: fixed;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }

        /* ── DOODLE LAYER ── */
        .doodle-layer {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }

        .doodle-svg {
          width: 100%;
          height: 100%;
        }

        /* ── MARGIN ANNOTATIONS ── */
        .margin-annotation {
          position: fixed;
          font-family: 'Caveat', cursive;
          font-size: 11px;
          writing-mode: vertical-rl;
          pointer-events: none;
          z-index: 2;
          white-space: nowrap;
        }

        @media (max-width: 640px) {
          .margin-annotation { display: none; }
        }

        /* ── BACK BUTTON ── */
        .back-btn {
          position: fixed;
          top: 16px;
          left: 16px;
          z-index: 1000;
          font-family: 'Caveat', cursive;
          font-size: 15px;
          color: #666;
          background: #fff9c4;
          border: none;
          padding: 6px 14px;
          cursor: pointer;
          transform: rotate(-1.5deg);
          box-shadow: 1px 2px 6px rgba(0,0,0,0.12);
          transition: transform 0.2s;
        }

        .back-btn:hover { transform: rotate(1deg) scale(1.03); }

        /* ── MUSIC PLAYER ── */
        .music-player {
          position: fixed;
          top: 16px;
          right: 16px;
          z-index: 1000;
        }

        .music-player-inner {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(250,247,240,0.92);
          backdrop-filter: blur(8px);
          border: 1px dashed rgba(124,58,237,0.3);
          border-radius: 4px;
          padding: 6px 10px;
          box-shadow: 1px 2px 8px rgba(0,0,0,0.08);
          transform: rotate(1deg);
        }

        .music-btn {
          font-size: 14px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 2px;
          color: #7c3aed;
          transition: transform 0.15s;
        }
        .music-btn:hover { transform: scale(1.2); }

        .music-label {
          font-family: 'Caveat', cursive;
          font-size: 13px;
          color: #9b8fa0;
        }

        .music-note { font-size: 16px; color: #c4b5fd; }

        .music-eq {
          display: flex;
          align-items: flex-end;
          gap: 2px;
          height: 16px;
          width: 20px;
        }

        .eq-bar {
          display: block;
          width: 3px;
          background: #7c3aed;
          border-radius: 1px;
          animation: eqBounce 0.8s ease-in-out infinite alternate;
        }

        @keyframes eqBounce {
          from { height: 4px; }
          to { height: 14px; }
        }

        .vol-slider {
          width: 60px;
          accent-color: #7c3aed;
          cursor: pointer;
        }

        /* ── HEADER ── */
        .sk-header {
          position: relative;
          z-index: 3;
          padding: 80px 80px 40px;
          max-width: 900px;
        }

        @media (max-width: 640px) {
          .sk-header { padding: 80px 24px 32px; }
        }

        .washi-tape {
          position: absolute;
          height: 22px;
          border-radius: 2px;
          opacity: 0.7;
        }

        .washi-1 {
          background: repeating-linear-gradient(
            45deg,
            rgba(196,181,255,0.5),
            rgba(196,181,255,0.5) 4px,
            rgba(167,139,250,0.3) 4px,
            rgba(167,139,250,0.3) 8px
          );
          width: 100px;
          top: 60px;
          left: 60px;
          transform: rotate(-3deg);
        }

        .washi-2 {
          background: repeating-linear-gradient(
            45deg,
            rgba(253,230,138,0.5),
            rgba(253,230,138,0.5) 4px,
            rgba(252,211,77,0.3) 4px,
            rgba(252,211,77,0.3) 8px
          );
          width: 80px;
          top: 56px;
          left: 180px;
          transform: rotate(2deg);
        }

        .sk-volume {
          font-family: 'Patrick Hand', cursive;
          font-size: 12px;
          color: #bbb;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .sk-title {
          font-family: 'Caveat', cursive;
          font-size: clamp(52px, 12vw, 96px);
          font-weight: 700;
          color: #1a0a2e;
          line-height: 0.9;
          margin-bottom: 16px;
        }

        .sk-title-messy {
          color: #7c3aed;
          display: inline-block;
          transform: rotate(-1.5deg);
          position: relative;
        }

        .sk-title-messy::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          right: 0;
          height: 3px;
          background: rgba(124,58,237,0.4);
          transform: rotate(-0.5deg);
          border-radius: 2px;
        }

        .sk-desc {
          font-family: 'Kalam', cursive;
          font-size: 17px;
          color: #555;
          line-height: 1.6;
        }

        .sk-desc-small {
          font-size: 14px;
          color: #999;
          font-family: 'Patrick Hand', cursive;
        }

        /* Sticky notes */
        .sticky-cluster {
          position: absolute;
          top: 60px;
          right: 20px;
          pointer-events: none;
        }

        .sticky-note {
          position: absolute;
          font-family: 'Caveat', cursive;
          font-size: 13px;
          color: #333;
          padding: 8px 12px;
          box-shadow: 2px 3px 8px rgba(0,0,0,0.12);
          max-width: 140px;
          line-height: 1.4;
        }

        .sn-1 { background: #fff9c4; top: 0; left: 0; transform: rotate(8deg); }
        .sn-2 { background: #c8f5e0; top: 60px; left: 30px; transform: rotate(-5deg); }
        .sn-3 { background: #ffd6e0; top: 120px; left: -10px; transform: rotate(3deg); font-size: 12px; }

        @media (max-width: 640px) {
          .sticky-cluster { display: none; }
        }

        /* Coffee ring */
        .coffee-ring {
          position: absolute;
          width: 90px;
          height: 90px;
          border-radius: 50%;
          border: 7px solid rgba(160,120,80,0.1);
          bottom: 10px;
          right: 140px;
          pointer-events: none;
        }
        .coffee-ring::after {
          content: '';
          position: absolute;
          inset: 5px;
          border-radius: 50%;
          border: 3px solid rgba(160,120,80,0.06);
        }

        @media (max-width: 640px) {
          .coffee-ring { display: none; }
        }

        /* ── DRAWINGS SECTION ── */
        .drawings-section {
          position: relative;
          z-index: 3;
          padding: 20px 80px 60px;
        }

        @media (max-width: 640px) {
          .drawings-section { padding: 20px 24px 40px; }
        }

        .section-label {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
        }

        .section-label-text {
          font-family: 'Patrick Hand', cursive;
          font-size: 14px;
          color: #bbb;
          letter-spacing: 0.08em;
        }

        .section-label-underline {
          flex: 1;
          height: 1px;
          background: repeating-linear-gradient(
            90deg,
            rgba(180,200,220,0.4) 0,
            rgba(180,200,220,0.4) 6px,
            transparent 6px,
            transparent 10px
          );
        }

        /* CHAOTIC GRID — intentionally unorganised */
        .drawings-chaos {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 40px 32px;
          align-items: start;
        }

        @media (max-width: 640px) {
          .drawings-chaos {
            grid-template-columns: repeat(2, 1fr);
            gap: 28px 16px;
          }
        }

        /* ── DRAWING CARD ── */
        .drawing-card-wrap {
          position: relative;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .drawing-card-wrap:hover {
          z-index: 10;
          transform: scale(1.06) rotate(0deg) !important;
        }

        .drawing-tape {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          height: 18px;
          z-index: 2;
          border-radius: 2px;
          opacity: 0.75;
        }

        .drawing-img-box {
          background: white;
          padding: 8px 8px 24px;
          box-shadow: 3px 4px 12px rgba(0,0,0,0.12);
          border: 1px solid rgba(0,0,0,0.05);
        }

        .drawing-img {
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
          display: block;
        }

        /* Placeholder when no image */
        .drawing-img-placeholder {
          width: 100%;
          aspect-ratio: 3/4;
          background: #f0ebe0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border: 1px dashed rgba(0,0,0,0.1);
        }

        .placeholder-pencil {
          font-size: 24px;
          opacity: 0.3;
        }

        .placeholder-info {
          font-family: 'Patrick Hand', cursive;
          font-size: 10px;
          color: #ccc;
          text-align: center;
          padding: 0 8px;
          line-height: 1.4;
        }

        .drawing-caption {
          margin-top: 8px;
          padding: 0 4px;
        }

        .drawing-caption-label {
          font-family: 'Caveat', cursive;
          font-size: 14px;
          color: #333;
          line-height: 1;
        }

        .drawing-caption-note {
          font-family: 'Patrick Hand', cursive;
          font-size: 11px;
          color: #aaa;
        }

        /* MORE COMING PLACEHOLDER */
        .drawing-placeholder-card {
          cursor: default;
        }

        .placeholder-inner {
          background: white;
          padding: 8px;
          box-shadow: 2px 3px 8px rgba(0,0,0,0.06);
          border: 2px dashed rgba(180,200,220,0.4);
          aspect-ratio: 3/4;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .placeholder-plus {
          font-family: 'Caveat', cursive;
          font-size: 32px;
          color: rgba(180,200,220,0.6);
          line-height: 1;
        }

        .placeholder-text {
          font-family: 'Caveat', cursive;
          font-size: 13px;
          color: rgba(180,200,220,0.8);
          text-align: center;
          line-height: 1.4;
        }

        /* ── NOTEBOOK SECTION ── */
        .notebook-section {
          position: relative;
          z-index: 3;
          padding: 20px 80px 60px;
          max-width: 700px;
        }

        @media (max-width: 640px) {
          .notebook-section { padding: 20px 24px 40px; }
        }

        .notebook-wrap {
          position: relative;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.08);
          box-shadow: 3px 4px 16px rgba(0,0,0,0.08);
          overflow: hidden;
          transform: rotate(-0.5deg);
        }

        .notebook-margin {
          position: absolute;
          left: 60px;
          top: 0;
          bottom: 0;
          width: 1.5px;
          background: rgba(220,100,100,0.25);
        }

        .notebook-lines {
          padding: 20px 20px 20px 75px;
          background-image: repeating-linear-gradient(
            transparent,
            transparent 27px,
            rgba(180,200,220,0.25) 27px,
            rgba(180,200,220,0.25) 28px
          );
          background-size: 100% 28px;
          min-height: 340px;
        }

        .note-line {
          font-family: 'Kalam', cursive;
          font-size: 16px;
          color: #2a2a3e;
          line-height: 28px;
          min-height: 28px;
        }

        .note-heading {
          font-family: 'Caveat', cursive;
          font-size: 18px;
          font-weight: 700;
          color: #7c3aed;
        }

        .note-note {
          font-family: 'Patrick Hand', cursive;
          font-size: 14px;
          color: #888;
          font-style: italic;
        }

        .note-crossed {
          position: relative;
          color: #aaa;
          display: inline-block;
        }

        .note-crossed::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 1.5px;
          background: rgba(200,80,80,0.6);
        }

        .nb-doodles {
          position: absolute;
          top: 10px;
          right: 12px;
          pointer-events: none;
        }

        .nb-star {
          font-size: 18px;
          position: absolute;
          color: rgba(124,58,237,0.25);
        }

        .nb-star-1 { top: 10px; right: 10px; transform: rotate(15deg); }
        .nb-star-2 { top: 50px; right: 30px; font-size: 12px; transform: rotate(-8deg); }
        .nb-star-3 { top: 80px; right: 8px; font-size: 10px; color: rgba(255,200,50,0.3); }

        .nb-face { position: absolute; top: 120px; right: 6px; opacity: 0.4; }

        /* ── CURRENTLY INTO ── */
        .currently-section {
          position: relative;
          z-index: 3;
          padding: 20px 80px 60px;
        }

        @media (max-width: 640px) {
          .currently-section { padding: 20px 24px 40px; }
        }

        .currently-wrap { max-width: 800px; }

        .currently-title {
          font-family: 'Caveat', cursive;
          font-size: 32px;
          font-weight: 700;
          color: #1a0a2e;
          margin-bottom: 24px;
          display: inline-block;
          transform: rotate(-1deg);
        }

        .currently-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
          gap: 16px;
        }

        @media (max-width: 640px) {
          .currently-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
        }

        /* ── SKETCHBOOK FOOTER ── */
        .sk-footer {
          position: relative;
          z-index: 3;
          padding: 40px 80px 80px;
          text-align: center;
        }

        @media (max-width: 640px) {
          .sk-footer { padding: 40px 24px 60px; }
        }

        .sk-footer-line {
          width: 60%;
          max-width: 400px;
          height: 1px;
          background: rgba(180,200,220,0.4);
          margin: 0 auto 24px;
        }

        .sk-footer-text {
          font-family: 'Caveat', cursive;
          font-size: 18px;
          color: #888;
          margin-bottom: 8px;
        }

        .sk-footer-sub {
          font-family: 'Patrick Hand', cursive;
          font-size: 13px;
          color: #bbb;
          margin-bottom: 24px;
        }

        .sk-footer-back {
          font-family: 'Caveat', cursive;
          font-size: 16px;
          color: #7c3aed;
          background: none;
          border: 1.5px dashed rgba(124,58,237,0.4);
          padding: 8px 20px;
          cursor: pointer;
          border-radius: 4px;
          transition: transform 0.2s, background 0.2s;
        }

        .sk-footer-back:hover {
          background: rgba(124,58,237,0.05);
          transform: rotate(-1deg);
        }

        /* ── LIGHTBOX ── */
        .lightbox {
          position: fixed;
          inset: 0;
          background: rgba(10,0,20,0.9);
          z-index: 9998;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 20px;
        }

        .lightbox-close {
          position: absolute;
          top: 20px;
          right: 24px;
          font-size: 24px;
          color: rgba(255,255,255,0.6);
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.15s;
        }

        .lightbox-close:hover { color: white; }

        .lightbox-img {
          max-width: 90vw;
          max-height: 85vh;
          object-fit: contain;
          cursor: default;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
      `}</style>
    </>
  );
}

// ─── SUB COMPONENTS ────────────────────────────────────────────────────────────

const tapeColors = [
  'repeating-linear-gradient(45deg, rgba(196,181,255,0.5), rgba(196,181,255,0.5) 4px, rgba(167,139,250,0.3) 4px, rgba(167,139,250,0.3) 8px)',
  'repeating-linear-gradient(45deg, rgba(253,230,138,0.5), rgba(253,230,138,0.5) 4px, rgba(252,211,77,0.3) 4px, rgba(252,211,77,0.3) 8px)',
  'repeating-linear-gradient(45deg, rgba(167,243,208,0.5), rgba(167,243,208,0.5) 4px, rgba(110,231,183,0.3) 4px, rgba(110,231,183,0.3) 8px)',
  'repeating-linear-gradient(45deg, rgba(252,165,165,0.5), rgba(252,165,165,0.5) 4px, rgba(248,113,113,0.3) 4px, rgba(248,113,113,0.3) 8px)',
];

function DrawingCard({ drawing, index, onClick }: {
  drawing: typeof drawings[0];
  index: number;
  onClick: () => void;
}) {
  const tape = tapeColors[index % tapeColors.length];
  const tapeWidth = 36 + (index % 3) * 12;

  return (
    <div
      className="drawing-card-wrap"
      style={{ transform: `rotate(${drawing.rotate}deg)` }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`View drawing: ${drawing.label}`}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      {/* Tape */}
      <div
        className="drawing-tape"
        style={{ width: tapeWidth, background: tape }}
        aria-hidden="true"
      />

      <div className="drawing-img-box">
        {/* Try to load the image; fall back to placeholder */}
        <ImageWithFallback src={drawing.src} alt={drawing.label} />
      </div>

      <div className="drawing-caption">
        <div className="drawing-caption-label">{drawing.label}</div>
        <div className="drawing-caption-note">{drawing.note}</div>
      </div>
    </div>
  );
}

function ImageWithFallback({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="drawing-img-placeholder">
        <span className="placeholder-pencil">✏️</span>
        <span className="placeholder-info">add {alt}<br />to /public/sketchbook/</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="drawing-img"
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}

function CurrentlyCard({ emoji, label, value, color }: {
  emoji: string; label: string; value: string; color: string;
}) {
  return (
    <div className="currently-card" style={{ '--card-color': color } as React.CSSProperties}>
      <div className="cc-emoji">{emoji}</div>
      <div className="cc-label">{label}</div>
      <div className="cc-value">{value}</div>
      <style>{`
        .currently-card {
          background: white;
          border: 1px solid rgba(0,0,0,0.06);
          padding: 14px;
          box-shadow: 2px 3px 10px rgba(0,0,0,0.06);
          position: relative;
          transition: transform 0.2s;
        }
        .currently-card:hover { transform: translateY(-3px) rotate(-0.5deg); }
        .currently-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--card-color);
          opacity: 0.7;
        }
        .cc-emoji { font-size: 22px; margin-bottom: 6px; }
        .cc-label {
          font-family: 'Patrick Hand', cursive;
          font-size: 11px;
          color: #bbb;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 4px;
        }
        .cc-value {
          font-family: 'Caveat', cursive;
          font-size: 15px;
          color: #333;
          line-height: 1.3;
        }
      `}</style>
    </div>
  );
}
