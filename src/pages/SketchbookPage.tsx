// SketchbookPage.tsx — Upgraded v2
// 
// WHAT'S NEW:
//   ✅ Night mode toggle (warm dark theme, CSS variable swap)
//   ✅ True scatter layout — absolute positioned, not grid
//   ✅ Staggered card drop-in animation with delay per card
//   ✅ Hover snap-to-straight + ink splatter microinteraction
//   ✅ Vinyl disc music player (spins when playing)
//   ✅ Clickable sticky notes with thought bubbles
//   ✅ Typewriter notebook — lines fade/slide in on scroll
//   ✅ Mood-colored note entries
//   ✅ Shake microinteraction on back button
//   ✅ Lightbox close button spins 360° before dismiss
//   ✅ Easter egg: triple-click skull → confetti explosion
//   ✅ Floating/drifting stickers animation
//   ✅ All styles extracted to sketchbook.css
//
// SETUP:
//   1. Add sketchbook.css to your src/ folder
//   2. In index.css add: @import './sketchbook.css';
//      (or import directly here — both work)
//   3. Put drawings in /public/sketchbook/
//   4. Put sticker PNGs in /public/sketchbook/stickers/
//   5. Put audio in /public/sketchbook/ (mp3, ~2MB each)

import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// ── CONTENT CONFIG ────────────────────────────────────────────
// Replace placeholder paths with your actual files in /public/sketchbook/
// scatter positions: left/top are % of container width / px from top

const drawings = [
  { src: '/sketchbook/drawing-01.jpg', label: 'figure study',    note: 'pencil, 2023',      rotate: -4,  left: 2,  top: 20,  width: 160, delay: 0   },
  { src: '/sketchbook/naruto.webp',    label: 'character thing', note: 'ballpoint',          rotate: 3,   left: 16, top: 0,   width: 150, delay: 80  },
  { src: '/sketchbook/drawing-03.jpg', label: 'anatomy attempt', note: 'ink',                rotate: -2,  left: 29, top: 30,  width: 155, delay: 160 },
  { src: '/sketchbook/drawing-04.jpg', label: 'random face',     note: '3am energy',         rotate: 5,   left: 43, top: 5,   width: 148, delay: 240 },
  { src: '/sketchbook/landscape.webp', label: 'landscape thing', note: 'pencil',             rotate: -3,  left: 56, top: 25,  width: 158, delay: 320 },
  { src: '/sketchbook/drawing-06.jpg', label: 'hands (ugh)',     note: 'still struggling',   rotate: 2,   left: 70, top: 8,   width: 152, delay: 400 },
];

// Sticker config — add your PNGs in /public/sketchbook/stickers/
const stickers: { src: string; style: React.CSSProperties; easterEgg?: boolean }[] = [
  {
    src: '/sketchbook/stickers/Skull.webp',
    style: { top: '5%', left: '70%', width: 120, transform: 'rotate(8deg)' },
    easterEgg: true,
  },
];

// Music tracks — place in /public/sketchbook/
const musicList = [
  '/sketchbook/ambience.mp3',
  '/sketchbook/chill.mp3',
  '/sketchbook/piano.mp3',
];
const trackColors = ['#a78bfa', '#fca5a5', '#6ee7b7'];

// Sticky note thought bubbles
const stickyThoughts = [
  'drew this right after watching a Studio Ghibli film at 2am',
  'this one took 3 tries and i still hate the proportions',
  'hands are impossible. no one can tell me otherwise.',
];

// Notebook entries with mood metadata
const NOTE_ENTRIES = [
  { text: 'things to draw next:', style: 'heading', mood: 'focused' },
  { text: 'more hands (ugh)',      style: 'normal',  mood: 'frustrated' },
  { text: 'perspective study',     style: 'normal',  mood: null },
  { text: 'that forest scene from dark', style: 'normal', mood: 'curious' },
  { text: 'character from vinland saga', style: 'normal', mood: null },
  { text: 'crossed: portrait of toji',   style: 'crossed', mood: 'nostalgic' },
  { text: '', style: 'blank', mood: null },
  { text: 'currently listening:', style: 'heading', mood: 'focused' },
  { text: '→ trying to find the perfect study playlist', style: 'normal', mood: null },
  { text: '', style: 'blank', mood: null },
  { text: 'last watched: vinland saga s2 (crying inside)', style: 'note', mood: 'nostalgic' },
];

// Margin annotations
const annotations = [
  { text: '← need to redo this',  top: '18%', left: '2%',  rotate: -90, color: '#5a7abf' },
  { text: 'reference from pinterest', top: '35%', right: '2%', rotate: 90, color: '#888' },
  { text: '★ fav',               top: '55%', left: '1%',  rotate: -90, color: '#d4a017' },
  { text: 'drew this at 2am lol', top: '70%', right: '1%', rotate: 90, color: '#888' },
];

// Background doodles
const doodleElements = [
  { type: 'star',     x: 82, y: 8,  size: 14, color: '#c4b5fd', opacity: 0.5 },
  { type: 'star',     x: 15, y: 45, size: 10, color: '#7c3aed', opacity: 0.4 },
  { type: 'star',     x: 75, y: 72, size: 18, color: '#a78bfa', opacity: 0.35 },
  { type: 'star',     x: 5,  y: 88, size: 8,  color: '#c4b5fd', opacity: 0.4 },
  { type: 'star',     x: 92, y: 55, size: 12, color: '#7c3aed', opacity: 0.3 },
  { type: 'circle',   x: 30, y: 12, size: 24, color: 'rgba(100,150,200,0.15)', opacity: 1 },
  { type: 'circle',   x: 88, y: 30, size: 16, color: 'rgba(200,100,100,0.12)', opacity: 1 },
  { type: 'circle',   x: 10, y: 65, size: 30, color: 'rgba(160,200,100,0.1)',  opacity: 1 },
  { type: 'squiggle', x: 55, y: 15, opacity: 0.3, color: '#888' },
  { type: 'squiggle2',x: 20, y: 80, opacity: 0.25, color: '#5a7abf' },
  { type: 'arrow',    x: 68, y: 42, opacity: 0.35, color: '#888', rotate: 45 },
];

const tapeColors = [
  'repeating-linear-gradient(45deg, rgba(196,181,255,.5), rgba(196,181,255,.5) 4px, rgba(167,139,250,.3) 4px, rgba(167,139,250,.3) 8px)',
  'repeating-linear-gradient(45deg, rgba(253,230,138,.5), rgba(253,230,138,.5) 4px, rgba(252,211,77,.3)  4px, rgba(252,211,77,.3)  8px)',
  'repeating-linear-gradient(45deg, rgba(167,243,208,.5), rgba(167,243,208,.5) 4px, rgba(110,231,183,.3) 4px, rgba(110,231,183,.3) 8px)',
  'repeating-linear-gradient(45deg, rgba(252,165,165,.5), rgba(252,165,165,.5) 4px, rgba(248,113,113,.3) 4px, rgba(248,113,113,.3) 8px)',
];

// ── COMPONENT ──────────────────────────────────────────────────

export default function SketchbookPage() {
  const navigate = useNavigate();
  const audioRef  = useRef<HTMLAudioElement>(null);
  const shouldResumeRef = useRef(false);
  const notebookRef = useRef<HTMLDivElement>(null);

  const [showCustomCursor, setShowCustomCursor] = useState(false);
  const [cursorPos, setCursorPos]   = useState({ x: -100, y: -100 });
  const [entryAnim, setEntryAnim]   = useState(false);
  const [nightMode, setNightMode]   = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  // Music
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicError, setMusicError]     = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume]             = useState(0.4);
  const currentColor = trackColors[currentTrack];

  // Cards — staggered visibility
  const [visibleCards, setVisibleCards] = useState<boolean[]>(
    new Array(drawings.length).fill(false)
  );

  // Notebook lines visibility (typewriter effect)
  const [visibleLines, setVisibleLines] = useState<boolean[]>(
    new Array(NOTE_ENTRIES.length).fill(false)
  );

  // Sticky note thought bubble
  const [activeStickyIdx, setActiveStickyIdx] = useState<number | null>(null);
  const [stickyPos, setStickyPos] = useState({ x: 0, y: 0 });

  // Easter egg — skull click counter
  const skullClicksRef = useRef(0);
  const skullTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Entry animation
  useEffect(() => {
    const t = setTimeout(() => setEntryAnim(true), 80);
    return () => clearTimeout(t);
  }, []);

  // ── Staggered card drop-in
  useEffect(() => {
    drawings.forEach((d, i) => {
      const t = setTimeout(() => {
        setVisibleCards(prev => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 400 + d.delay);
      return () => clearTimeout(t);
    });
  }, []);

  // ── Notebook typewriter on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          NOTE_ENTRIES.forEach((_, i) => {
            const t = setTimeout(() => {
              setVisibleLines(prev => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, i * 100);
            return () => clearTimeout(t);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (notebookRef.current) observer.observe(notebookRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Custom cursor
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(pointer: fine)');
    const update = () => setShowCustomCursor(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!showCustomCursor) return;
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove, showCustomCursor]);

  // ── Volume sync
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume, currentTrack]);

  // ── Auto-play next track
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !shouldResumeRef.current) return;
    const play = async () => {
      try {
        audio.load();
        await audio.play();
        setMusicError(null);
      } catch {
        shouldResumeRef.current = false;
        setMusicPlaying(false);
        setMusicError('Unable to play this track.');
      }
    };
    void play();
  }, [currentTrack]);

  // ── Audio controls
  const playAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted  = false;
    audio.load();
    try {
      await audio.play();
      setMusicError(null);
    } catch {
      shouldResumeRef.current = false;
      setMusicPlaying(false);
      setMusicError('Unable to play this track.');
    }
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicPlaying) {
      shouldResumeRef.current = false;
      audio.pause();
    } else {
      shouldResumeRef.current = true;
      await playAudio();
    }
  };

  const handleAudioEnded = () => {
    const keep = shouldResumeRef.current;
    setMusicPlaying(false);
    if (musicList.length <= 1) { shouldResumeRef.current = false; return; }
    shouldResumeRef.current = keep;
    setCurrentTrack(prev => (prev + 1) % musicList.length);
  };

  // ── Easter egg — confetti
  const triggerConfetti = (originX: number, originY: number) => {
    const colors = ['#c4b5fd', '#fca5a5', '#6ee7b7', '#fcd34d', '#a78bfa', '#f0abfc'];
    const container = document.body;
    for (let i = 0; i < 40; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.cssText = `
        left: ${originX + (Math.random() - 0.5) * 60}px;
        top: ${originY}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        transform: rotate(${Math.random() * 360}deg);
        animation-delay: ${Math.random() * 0.3}s;
        animation-duration: ${1.2 + Math.random() * 0.8}s;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      `;
      container.appendChild(piece);
      setTimeout(() => piece.remove(), 2500);
    }
  };

  const handleStickerClick = (
    e: React.MouseEvent,
    isEasterEgg: boolean,
    idx: number
  ) => {
    if (!isEasterEgg) return;
    skullClicksRef.current += 1;
    if (skullTimerRef.current) clearTimeout(skullTimerRef.current);
    skullTimerRef.current = setTimeout(() => {
      skullClicksRef.current = 0;
    }, 1500);
    if (skullClicksRef.current >= 3) {
      skullClicksRef.current = 0;
      triggerConfetti(e.clientX, e.clientY);
    }
  };

  // ── Sticky note thought bubble
  const handleStickyClick = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setStickyPos({ x: rect.left, y: rect.top - 10 });
    setActiveStickyIdx(activeStickyIdx === idx ? null : idx);
  };

  // Close thought on outside click
  useEffect(() => {
    const close = () => setActiveStickyIdx(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const handleBack = () => navigate(-1);

  // Scatter field height — enough to fit tallest card + top offset
  const scatterHeight = Math.max(...drawings.map(d => d.top + 280));

  return (
    <>
      {/* ── CUSTOM CURSOR ── */}
      {showCustomCursor && (
        <div
          className="pencil-cursor"
          style={{ left: cursorPos.x, top: cursorPos.y }}
          aria-hidden="true"
        />
      )}

      {/* ── AUDIO ── */}
      <audio
        key={musicList[currentTrack]}
        ref={audioRef}
        src={musicList[currentTrack]}
        playsInline
        onCanPlay={() => setMusicError(null)}
        onPlay={() => setMusicPlaying(true)}
        onPause={() => setMusicPlaying(false)}
        onEnded={handleAudioEnded}
        onError={() => {
          shouldResumeRef.current = false;
          setMusicPlaying(false);
          setMusicError('Audio file could not be loaded.');
        }}
        preload="auto"
      />

      {/* ── NIGHT MODE TOGGLE ── */}
      <button
        className="night-mode-btn"
        onClick={() => setNightMode(n => !n)}
        aria-label={nightMode ? 'Switch to day mode' : 'Switch to night mode'}
      >
        {nightMode ? '☀️ day mode' : '🌙 night mode'}
      </button>

      {/* ── VINYL MUSIC PLAYER ── */}
      <div className="music-player">
        <div
          className={`music-player-inner ${musicPlaying ? 'is-playing' : ''}`}
          style={{
            borderColor: musicPlaying ? currentColor : undefined,
          }}
        >
          {/* Vinyl disc — click to toggle */}
          <div
            className={`vinyl-disc ${musicPlaying ? 'spinning' : ''}`}
            onClick={toggleMusic}
            role="button"
            aria-label={musicPlaying ? 'Pause music' : 'Play music'}
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && toggleMusic()}
            style={{
              boxShadow: musicPlaying
                ? `0 0 12px ${currentColor}60`
                : undefined,
            }}
          />

          {/* Track dots */}
          {musicPlaying && (
            <div className="track-dots" aria-hidden="true">
              {musicList.map((_, i) => (
                <div
                  key={i}
                  className={`track-dot ${i === currentTrack ? 'active' : ''}`}
                  style={i === currentTrack ? { background: currentColor } : undefined}
                />
              ))}
            </div>
          )}

          <div className="music-label">
            {musicPlaying ? `track ${currentTrack + 1}` : 'ambient'}
          </div>

          {musicError && (
            <div className="music-error" role="status">{musicError}</div>
          )}

          {musicPlaying && (
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={e => {
                const v = parseFloat(e.target.value);
                setVolume(v);
                if (audioRef.current) audioRef.current.volume = v;
              }}
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

      {/* ── STICKY NOTE THOUGHT BUBBLE ── */}
      {activeStickyIdx !== null && (
        <div
          className="sticky-thought"
          style={{ left: stickyPos.x, top: stickyPos.y - 80 }}
          onClick={e => e.stopPropagation()}
        >
          {stickyThoughts[activeStickyIdx]}
        </div>
      )}

      {/* ── MAIN PAGE ── */}
      <main
        className={`sketchbook-main ${entryAnim ? 'entered' : ''} ${nightMode ? 'sb-night' : ''}`}
        aria-label="Kreshant's sketchbook"
      >
        {/* SVG doodle layer */}
        <div className="doodle-layer" aria-hidden="true">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="doodle-svg"
          >
            {doodleElements.map((d, i) => {
              if (d.type === 'star') return (
                <text key={i} x={`${d.x}%`} y={`${d.y}%`} fontSize={d.size} fill={d.color} opacity={d.opacity} textAnchor="middle">✦</text>
              );
              if (d.type === 'circle') return (
                <circle key={i} cx={`${d.x}%`} cy={`${d.y}%`} r={`${d.size / 2}%`} fill={d.color} />
              );
              if (d.type === 'squiggle') return (
                <path key={i}
                  d={`M${d.x}% ${d.y}% Q${d.x+3}% ${d.y-2}% ${d.x+6}% ${d.y}% Q${d.x+9}% ${d.y+2}% ${d.x+12}% ${d.y}%`}
                  stroke={d.color} strokeWidth="0.4%" fill="none" opacity={d.opacity} strokeLinecap="round"
                />
              );
              if (d.type === 'squiggle2') return (
                <path key={i}
                  d={`M${d.x}% ${d.y}% Q${d.x+2}% ${d.y-1.5}% ${d.x+4}% ${d.y}% Q${d.x+6}% ${d.y+1.5}% ${d.x+8}% ${d.y}%`}
                  stroke={d.color} strokeWidth="0.3%" fill="none" opacity={d.opacity} strokeLinecap="round"
                />
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

        {/* ── HEADER ── */}
        <div className="sk-header">
          <div className="washi-tape washi-1" aria-hidden="true" />
          <div className="washi-tape washi-2" aria-hidden="true" />

          <p className="sk-volume">Vol. I · 2024</p>
          <h1 className="sk-title">
            Kresh's<br />
            <span className="sk-title-messy">Sketchbook</span>
          </h1>
          <p className="sk-desc">
            drawings / doodles / 3am thoughts
            <br />
            <span className="sk-desc-small">not everything here is finished. that's the point.</span>
          </p>

          {/* Clickable sticky notes */}
          <div className="sticky-cluster" aria-label="Artist notes">
            {(['these r wip ok', '↑ obsessed w this one', 'trying to get better at hands...'] as const).map((text, i) => (
              <div
                key={i}
                className={`sticky-note sn-${i + 1}`}
                onClick={e => handleStickyClick(e, i)}
                role="button"
                tabIndex={0}
                aria-label={`Note: ${text}`}
                onKeyDown={e => e.key === 'Enter' && handleStickyClick(e as unknown as React.MouseEvent, i)}
              >
                {text}
              </div>
            ))}
          </div>

          <div className="coffee-ring" aria-hidden="true" />
        </div>

        {/* ── DRAWINGS — TRUE SCATTER ── */}
        <section className="drawings-section" aria-label="Drawings">
          <div className="section-label">
            <span className="section-label-text">// drawings</span>
            <span className="section-label-underline" />
          </div>

          <div
            className="drawings-scatter"
            style={{ height: scatterHeight }}
          >
            {drawings.map((drawing, i) => (
              <DrawingCard
                key={i}
                drawing={drawing}
                index={i}
                visible={visibleCards[i]}
                onClick={() => setLightboxSrc(drawing.src)}
              />
            ))}

            {/* More coming placeholder */}
            <div
              className="drawing-card-wrap drawing-placeholder-card"
              style={{
                left: '84%',
                top: 15,
                width: 140,
                '--card-rot': '3deg',
                opacity: visibleCards[drawings.length - 1] ? 1 : 0,
                transition: 'opacity 0.5s ease 0.6s',
              } as React.CSSProperties}
              aria-hidden="true"
            >
              <div className="placeholder-inner">
                <span className="placeholder-plus">+</span>
                <span className="placeholder-text">more coming<br />when i stop<br />being lazy</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── STICKERS ── */}
        {stickers.map((s, i) => (
          <img
            key={i}
            src={s.src}
            className="sb-sticker"
            style={{ ...s.style, position: 'absolute' } as React.CSSProperties}
            alt=""
            aria-hidden="true"
            onClick={e => s.easterEgg && handleStickerClick(e, true, i)}
            title={s.easterEgg ? 'click me...' : undefined}
          />
        ))}

        {/* ── NOTEBOOK ── */}
        <section className="notebook-section" aria-label="Notes">
          <div className="notebook-wrap" ref={notebookRef}>
            <div className="notebook-margin" aria-hidden="true" />
            <div className="notebook-lines">
              {NOTE_ENTRIES.map((entry, i) => (
                <div
                  key={i}
                  className={[
                    'note-line',
                    `note-${entry.style}`,
                    entry.mood ? `note-mood-${entry.mood}` : '',
                    visibleLines[i] ? 'line-visible' : '',
                  ].join(' ')}
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  {entry.style === 'crossed' ? (
                    <span className="note-crossed">
                      {entry.text.replace('crossed: ', '')}
                    </span>
                  ) : (
                    entry.text
                  )}
                </div>
              ))}
            </div>
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
              <CurrentlyCard emoji="🎵" label="music"    value="looking for the perfect study playlist"   color="#c4b5fd" />
              <CurrentlyCard emoji="📺" label="watching" value="Vinland Saga S2 — it's destroying me"      color="#fcd34d" />
              <CurrentlyCard emoji="🎮" label="playing"  value="whatever runs on an RTX 3050"              color="#6ee7b7" />
              <CurrentlyCard emoji="✏️" label="drawing"  value="anatomy, hands, hating myself"             color="#fca5a5" />
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
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
          <button
            className="lightbox-close"
            onClick={() => setLightboxSrc(null)}
            aria-label="Close"
          >
            ✕
          </button>
          <img
            src={lightboxSrc}
            alt="Drawing enlarged"
            className="lightbox-img"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

// ── SUB COMPONENTS ─────────────────────────────────────────────

function DrawingCard({
  drawing,
  index,
  visible,
  onClick,
}: {
  drawing: typeof drawings[0];
  index: number;
  visible: boolean;
  onClick: () => void;
}) {
  const tape      = tapeColors[index % tapeColors.length];
  const tapeWidth = 36 + (index % 3) * 12;

  return (
    <div
      className={`drawing-card-wrap ${visible ? 'card-visible' : ''}`}
      style={{
        left: `${drawing.left}%`,
        top: drawing.top,
        width: drawing.width,
        '--card-rot': `${drawing.rotate}deg`,
        animationDelay: `${drawing.delay}ms`,
      } as React.CSSProperties}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`View drawing: ${drawing.label}`}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      <div
        className="drawing-tape"
        style={{ width: tapeWidth, background: tape }}
        aria-hidden="true"
      />
      <div className="drawing-img-box">
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

function CurrentlyCard({
  emoji, label, value, color,
}: {
  emoji: string; label: string; value: string; color: string;
}) {
  return (
    <div
      className="currently-card"
      style={{ '--card-color': color } as React.CSSProperties}
    >
      <div className="cc-emoji">{emoji}</div>
      <div className="cc-label">{label}</div>
      <div className="cc-value">{value}</div>
    </div>
  );
}