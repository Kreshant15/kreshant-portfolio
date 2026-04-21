// SketchbookPage.tsx — v3 Visual Upgrade
//
// KEY CHANGES FROM v2:
//   ✅ SVG doodle stars → fixed-px DOM elements (no more stretching)
//   ✅ Lamp glow is CSS-only via ::after pseudo-element (no inline SVG)
//   ✅ Desk stains as absolute divs with blur
//   ✅ Torn paper notes positioned around the notebook
//   ✅ Mobile: scatter switches to CSS Grid automatically
//   ✅ Night mode toggle preserved
//   ✅ All easter eggs, typewriter, sticky thoughts intact

import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// ── CONTENT CONFIG ────────────────────────────────────────────
const drawings = [
  { src: '/sketchbook/drawing-01.jpg', label: 'figure study',    note: 'pencil, 2023',    rotate: -4, left: 2,  top: 200, width: 148, delay: 0   },
  { src: '/sketchbook/naruto.webp',    label: 'character thing', note: 'ballpoint',        rotate: 3,  left: 14, top: 175, width: 138, delay: 80  },
  { src: '/sketchbook/drawing-03.jpg', label: 'anatomy attempt', note: 'ink',              rotate: -2, left: 26, top: 215, width: 144, delay: 160 },
  { src: '/sketchbook/drawing-04.jpg', label: 'random face',     note: '3am energy',       rotate: 5,  left: 39, top: 185, width: 136, delay: 240 },
  { src: '/sketchbook/landscape.webp', label: 'landscape thing', note: 'pencil',           rotate: -3, left: 51, top: 205, width: 146, delay: 320 },
  { src: '/sketchbook/drawing-06.jpg', label: 'hands (ugh)',     note: 'still struggling', rotate: 2,  left: 64, top: 178, width: 140, delay: 400 },
];

// ── FIXED-SIZE STARS — positioned in viewport %, size in px (no SVG viewBox)
const STARS = [
  { top: '8%',  left: '82%', size: 38, color: '#a78bfa', opacity: 0.88 },
  { top: '45%', left: '14%', size: 30, color: '#7c3aed', opacity: 0.72 },
  { top: '72%', left: '76%', size: 44, color: '#c4b5fd', opacity: 0.80 },
  { top: '48%', left: '93%', size: 34, color: '#a78bfa', opacity: 0.75 },
  { top: '88%', left: '4%',  size: 26, color: '#7c3aed', opacity: 0.60 },
];

// Stickers — physical desk objects
const stickers: { src: string; style: React.CSSProperties; easterEgg?: boolean }[] = [
  { src: '/sketchbook/stickers/goku.png',     style: { top: '155px', left: '34%',  width: 80,  transform: 'rotate(-4deg)', zIndex: 12 } },
  { src: '/sketchbook/stickers/palette.png',  style: { top: '28px',  right: '2%',  width: 160, transform: 'rotate(14deg)', zIndex: 12 } },
  { src: '/sketchbook/stickers/pencils.png',  style: { top: '44px',  left: '310px', width: 120, transform: 'rotate(-28deg)',zIndex: 12 } },
  { src: '/sketchbook/stickers/headphones.png',style:{ bottom:'185px',right: '4%', width: 185, transform: 'rotate(18deg)', zIndex: 12 } },
  { src: '/sketchbook/stickers/gameboy.png',  style: { bottom:'155px',left: '170px',width: 72,  transform: 'rotate(-9deg)', zIndex: 12 } },
  {
    src: '/sketchbook/stickers/Skull.webp',
    style: { top: '425px', left: '32%', width: 72, transform: 'rotate(4deg)', zIndex: 12 },
    easterEgg: true,
  },
];

const musicList   = ['/sketchbook/ambience.mp3','/sketchbook/chill.mp3','/sketchbook/piano.mp3'];
const trackColors = ['#a78bfa','#fca5a5','#6ee7b7'];

const stickyThoughts = [
  'drew this right after watching studio ghibli at 2am',
  'this one took 3 tries and i still hate the proportions',
  'hands are impossible. no one can convince me otherwise.',
];

const NOTE_ENTRIES = [
  { text: 'things to draw next:', style: 'heading', mood: 'focused' },
  { text: 'more hands (ugh)',      style: 'normal',  mood: 'frustrated' },
  { text: 'perspective study',     style: 'normal',  mood: null },
  { text: 'that forest scene from dark', style: 'normal', mood: 'curious' },
  { text: 'character from vinland saga', style: 'normal', mood: null },
  { text: 'crossed: portrait of toji',   style: 'crossed', mood: 'nostalgic' },
  { text: '',                      style: 'blank',   mood: null },
  { text: 'currently listening:',  style: 'heading', mood: 'focused' },
  { text: '→ trying to find the perfect study playlist', style: 'normal', mood: null },
  { text: '',                      style: 'blank',   mood: null },
  { text: 'last watched: vinland saga s2 (crying inside)', style: 'note', mood: 'nostalgic' },
];

const annotations = [
  { text: '← need to redo this',     top: '18%', left: '2%',  rotate: -90, color: '#5a7abf' },
  { text: 'reference from pinterest', top: '35%', right: '2%', rotate: 90,  color: '#8a8070' },
  { text: '★ fav',                   top: '55%', left: '1%',  rotate: -90, color: '#c4900a' },
  { text: 'drew this at 2am lol',    top: '70%', right: '1%', rotate: 90,  color: '#8a8070' },
];

const tapeColors = [
  'repeating-linear-gradient(45deg,rgba(196,181,255,.55),rgba(196,181,255,.55) 4px,rgba(167,139,250,.3) 4px,rgba(167,139,250,.3) 8px)',
  'repeating-linear-gradient(45deg,rgba(253,230,138,.55),rgba(253,230,138,.55) 4px,rgba(252,211,77,.3)  4px,rgba(252,211,77,.3)  8px)',
  'repeating-linear-gradient(45deg,rgba(167,243,208,.55),rgba(167,243,208,.55) 4px,rgba(110,231,183,.3) 4px,rgba(110,231,183,.3) 8px)',
  'repeating-linear-gradient(45deg,rgba(252,165,165,.55),rgba(252,165,165,.55) 4px,rgba(248,113,113,.3) 4px,rgba(248,113,113,.3) 8px)',
];

// ── COMPONENT ──────────────────────────────────────────────────

export default function SketchbookPage() {
  const navigate      = useNavigate();
  const audioRef      = useRef<HTMLAudioElement>(null);
  const shouldResume  = useRef(false);
  const notebookRef   = useRef<HTMLDivElement>(null);

  const [showCursor, setShowCursor]       = useState(false);
  const [cursorPos,  setCursorPos]        = useState({ x: -100, y: -100 });
  const [entryAnim,  setEntryAnim]        = useState(false);
  const [nightMode,  setNightMode]        = useState(false);
  const [lightboxSrc,setLightboxSrc]      = useState<string | null>(null);

  const [musicPlaying, setMusicPlaying]   = useState(false);
  const [musicError,   setMusicError]     = useState<string | null>(null);
  const [currentTrack, setCurrentTrack]   = useState(0);
  const [volume,       setVolume]         = useState(0.4);
  const currentColor = trackColors[currentTrack];

  const [visibleCards, setVisibleCards]   = useState<boolean[]>(new Array(drawings.length).fill(false));
  const [visibleLines, setVisibleLines]   = useState<boolean[]>(new Array(NOTE_ENTRIES.length).fill(false));
  const [activeStickyIdx, setActiveStickyIdx] = useState<number | null>(null);
  const [stickyPos, setStickyPos]         = useState({ x: 0, y: 0 });

  const skullClicks = useRef(0);
  const skullTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Entry
  useEffect(() => { const t = setTimeout(() => setEntryAnim(true), 80); return () => clearTimeout(t); }, []);

  // Staggered card drop-in
  useEffect(() => {
    drawings.forEach((d, i) => {
      const t = setTimeout(() => {
        setVisibleCards(prev => { const n=[...prev]; n[i]=true; return n; });
      }, 400 + d.delay);
      return () => clearTimeout(t);
    });
  }, []);

  // Notebook typewriter on scroll
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      NOTE_ENTRIES.forEach((_, i) => {
        const t = setTimeout(() => {
          setVisibleLines(prev => { const n=[...prev]; n[i]=true; return n; });
        }, i * 95);
        return () => clearTimeout(t);
      });
      obs.disconnect();
    }, { threshold: 0.15 });
    if (notebookRef.current) obs.observe(notebookRef.current);
    return () => obs.disconnect();
  }, []);

  // Pencil cursor
  const onMouseMove = useCallback((e: MouseEvent) => { setCursorPos({ x: e.clientX, y: e.clientY }); }, []);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(pointer: fine)');
    const update = () => setShowCursor(mq.matches);
    update(); mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (!showCursor) return;
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [showCursor, onMouseMove]);

  // Volume
  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume, currentTrack]);

  // Auto next track
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !shouldResume.current) return;
    const play = async () => {
      try { audio.load(); await audio.play(); setMusicError(null); }
      catch { shouldResume.current=false; setMusicPlaying(false); setMusicError('Unable to play.'); }
    };
    void play();
  }, [currentTrack]);

  const playAudio = async () => {
    const audio = audioRef.current; if (!audio) return;
    audio.volume = volume; audio.muted = false; audio.load();
    try { await audio.play(); setMusicError(null); }
    catch { shouldResume.current=false; setMusicPlaying(false); setMusicError('Unable to play.'); }
  };
  const toggleMusic = async () => {
    const audio = audioRef.current; if (!audio) return;
    if (musicPlaying) { shouldResume.current=false; audio.pause(); }
    else { shouldResume.current=true; await playAudio(); }
  };
  const handleEnded = () => {
    const keep = shouldResume.current; setMusicPlaying(false);
    if (musicList.length <= 1) { shouldResume.current=false; return; }
    shouldResume.current = keep;
    setCurrentTrack(p => (p+1) % musicList.length);
  };

  // Confetti
  const triggerConfetti = (x: number, y: number) => {
    const colors = ['#c4b5fd','#fca5a5','#6ee7b7','#fcd34d','#a78bfa','#f0abfc'];
    for (let i=0; i<44; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.cssText = `left:${x+(Math.random()-.5)*70}px;top:${y}px;background:${colors[Math.floor(Math.random()*colors.length)]};transform:rotate(${Math.random()*360}deg);animation-delay:${Math.random()*.3}s;animation-duration:${1.2+Math.random()*.8}s;border-radius:${Math.random()>.5?'50%':'2px'};`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2600);
    }
  };

  const handleStickerClick = (e: React.MouseEvent, isEgg: boolean) => {
    if (!isEgg) return;
    skullClicks.current += 1;
    if (skullTimer.current) clearTimeout(skullTimer.current);
    skullTimer.current = setTimeout(() => { skullClicks.current=0; }, 1500);
    if (skullClicks.current >= 3) { skullClicks.current=0; triggerConfetti(e.clientX, e.clientY); }
  };

  const handleStickyClick = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    const r = (e.target as HTMLElement).getBoundingClientRect();
    setStickyPos({ x: r.left, y: r.top });
    setActiveStickyIdx(activeStickyIdx === idx ? null : idx);
  };

  useEffect(() => {
    const close = () => setActiveStickyIdx(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const scatterHeight = Math.max(...drawings.map(d => d.top + 300));

  return (
    <>
      {/* Pencil cursor */}
      {showCursor && (
        <div className="pencil-cursor" style={{ left: cursorPos.x, top: cursorPos.y }} aria-hidden />
      )}

      {/* Audio */}
      <audio
        key={musicList[currentTrack]}
        ref={audioRef} src={musicList[currentTrack]} playsInline preload="auto"
        onCanPlay={() => setMusicError(null)}
        onPlay={() => setMusicPlaying(true)}
        onPause={() => setMusicPlaying(false)}
        onEnded={handleEnded}
        onError={() => { shouldResume.current=false; setMusicPlaying(false); setMusicError('Audio file could not be loaded.'); }}
      />

      {/* Night mode button */}
      <button className="night-mode-btn" onClick={() => setNightMode(n => !n)} aria-label="Toggle night mode">
        {nightMode ? '☀️ day mode' : '🌙 night mode'}
      </button>

      {/* Vinyl music player */}
      <div className="music-player">
        <div className={`music-player-inner ${musicPlaying ? 'is-playing' : ''}`} style={{ borderColor: musicPlaying ? currentColor : undefined }}>
          <div
            className={`vinyl-disc ${musicPlaying ? 'spinning' : ''}`}
            onClick={toggleMusic} role="button" tabIndex={0}
            aria-label={musicPlaying ? 'Pause' : 'Play ambient music'}
            onKeyDown={e => e.key==='Enter' && toggleMusic()}
            style={{ boxShadow: musicPlaying ? `0 0 14px ${currentColor}55` : undefined }}
          />
          {musicPlaying && (
            <div className="track-dots" aria-hidden>
              {musicList.map((_,i) => (
                <div key={i} className={`track-dot ${i===currentTrack?'active':''}`}
                  style={i===currentTrack ? { background: currentColor } : undefined} />
              ))}
            </div>
          )}
          <div className="music-label">{musicPlaying ? `track ${currentTrack+1}` : 'ambient'}</div>
          {musicError && <div className="music-error" role="status">{musicError}</div>}
          {musicPlaying && (
            <input type="range" min="0" max="1" step="0.05" value={volume} className="vol-slider"
              aria-label="Volume" style={{ accentColor: currentColor }}
              onChange={e => { const v=parseFloat(e.target.value); setVolume(v); if(audioRef.current) audioRef.current.volume=v; }} />
          )}
        </div>
      </div>

      {/* Back button */}
      <button className="back-btn" onClick={() => navigate(-1)} aria-label="Back">← back to the real world</button>

      {/* Sticky thought bubble */}
      {activeStickyIdx !== null && (
        <div className="sticky-thought" style={{ left: stickyPos.x, top: stickyPos.y - 85 }} onClick={e => e.stopPropagation()}>
          {stickyThoughts[activeStickyIdx]}
        </div>
      )}

      {/* SVG filters for ink bleed effect */}
      <svg style={{ position:'absolute', width:0, height:0, pointerEvents:'none' }} aria-hidden>
        <defs>
          <filter id="ink-bleed">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="6"/>
          </filter>
        </defs>
      </svg>

      {/* ── MAIN ── */}
      <main className={`sketchbook-main ${entryAnim?'entered':''} ${nightMode?'sb-night':''}`} aria-label="Kreshant's sketchbook">

        {/* Desk stains */}
        <div className="desk-stains" aria-hidden>
          <div className="stain-coffee" style={{ width:110, height:110, bottom:'48px', right:'320px' }} />
          <div className="stain-coffee" style={{ width:70, height:70, top:'200px', left:'48%', opacity:0.6 }} />
          <div className="stain-watercolor" style={{ width:260, height:260, top:'140px',  left:'40%',  background:'radial-gradient(circle,rgba(124,58,237,0.22),transparent 70%)',    opacity:0.22 }} />
          <div className="stain-watercolor" style={{ width:340, height:340, top:'48%',    left:'4%',   background:'radial-gradient(circle,rgba(44,24,16,0.18),transparent 70%)',      opacity:0.18 }} />
          <div className="stain-watercolor" style={{ width:300, height:300, bottom:'180px',right:'14%', background:'radial-gradient(circle,rgba(180,100,40,0.12),transparent 70%)',   opacity:0.16 }} />
        </div>

        {/* ── FIXED-PX DOODLE STARS (no SVG viewBox, no stretching) ── */}
        {STARS.map((s,i) => (
          <span
            key={i}
            className="doodle-star"
            aria-hidden
            style={{ top:s.top, left:s.left, fontSize:`${s.size}px`, color:s.color, '--star-opacity':s.opacity } as React.CSSProperties}
          >
            ✦
          </span>
        ))}

        {/* Squiggle lines — fixed size SVG, not scaled */}
        <svg className="doodle-squiggle-svg" aria-hidden style={{ top:'15%', left:'54%', width:120, height:30 }}>
          <path d="M0,15 Q15,5 30,15 Q45,25 60,15 Q75,5 90,15 Q105,25 120,15"
            stroke="#8b4513" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </svg>
        <svg className="doodle-squiggle-svg" aria-hidden style={{ top:'80%', left:'19%', width:90, height:22 }}>
          <path d="M0,11 Q11,3 22,11 Q33,19 44,11 Q55,3 66,11 Q77,19 88,11"
            stroke="#5a7abf" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        </svg>
        {/* Arrow doodle */}
        <svg className="doodle-squiggle-svg" aria-hidden style={{ top:'38%', left:'67%', width:40, height:40, opacity:0.42 }}>
          <line x1="5" y1="20" x2="35" y2="20" stroke="#8b4513" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M28,13 L35,20 L28,27" fill="none" stroke="#8b4513" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        {/* Margin annotations */}
        {annotations.map((a,i) => (
          <div key={i} className="margin-annotation" aria-hidden
            style={{ top:a.top, left:'left' in a?a.left:undefined, right:'right' in a?(a as typeof a & {right:string}).right:undefined, transform:`rotate(${a.rotate}deg)`, color:a.color }}>
            {a.text}
          </div>
        ))}

        {/* ── HEADER ── */}
        <div className="sk-header">
          <div className="washi-tape washi-1" aria-hidden />
          <div className="washi-tape washi-2" aria-hidden />
          <p className="sk-volume">Vol. I · 2024</p>
          <h1 className="sk-title">Kresh's<br /><span className="sk-title-messy">Sketchbook</span></h1>
          <p className="sk-desc">
            drawings / doodles / 3am thoughts<br />
            <span className="sk-desc-small">not everything here is finished. that's the point.</span>
          </p>
          <div className="sticky-cluster" aria-label="Artist notes">
            {(['these r wip ok','↑ obsessed w this one','trying to get better at hands...'] as const).map((text,i) => (
              <div key={i} className={`sticky-note sn-${i+1}`}
                onClick={e => handleStickyClick(e, i)}
                role="button" tabIndex={0} aria-label={`Note: ${text}`}
                onKeyDown={e => e.key==='Enter' && handleStickyClick(e as unknown as React.MouseEvent,i)}>
                {text}
              </div>
            ))}
          </div>
          <div className="coffee-ring" aria-hidden />
        </div>

        {/* ── DRAWINGS ── */}
        <section className="drawings-section" aria-label="Drawings">
          <div className="section-label">
            <span className="section-label-text">// drawings</span>
            <span className="section-label-underline" />
          </div>
          <div className="drawings-scatter" style={{ height: scatterHeight }}>
            {drawings.map((d,i) => (
              <DrawingCard key={i} drawing={d} index={i} visible={visibleCards[i]}
                onClick={() => setLightboxSrc(d.src)} />
            ))}
            {/* Placeholder card */}
            <div className="drawing-card-wrap drawing-placeholder-card"
              style={{
                left:'82%', top:180, width:138,
                '--card-rot':'3deg',
                opacity: visibleCards[drawings.length-1] ? 1 : 0,
                transition:'opacity .5s ease .65s',
              } as React.CSSProperties} aria-hidden>
              <div className="placeholder-inner">
                <span className="placeholder-plus">+</span>
                <span className="placeholder-text">more coming<br />when i stop<br />being lazy</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── STICKERS / DESK OBJECTS ── */}
        {stickers.map((s,i) => (
          <img key={i} src={s.src} className="sb-sticker"
            style={{ ...s.style, position:'absolute' } as React.CSSProperties}
            alt="" aria-hidden
            onClick={e => s.easterEgg && handleStickerClick(e,true)}
            title={s.easterEgg ? 'click me...' : undefined}
          />
        ))}

        {/* Phone music player sticker */}
        <div className="sb-sticker sticker-phone"
          style={{ bottom:'265px', right:'17%', width:145, transform:'rotate(-5deg)', position:'absolute', zIndex:15, cursor:'pointer' }}
          onClick={toggleMusic} role="button" aria-label="Toggle music">
          <img src="/sketchbook/stickers/phone.png" alt="Phone music player"
            style={{ width:'100%', filter:'drop-shadow(4px 10px 20px rgba(42,26,12,0.3))' }} />
          {musicPlaying && (
            <div style={{ position:'absolute', top:'12%', left:'10%', right:'10%', bottom:'12%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6 }}>
              <div className="music-eq">
                <div className="eq-bar" style={{ animationDelay:'.1s', background:'#a78bfa' }}/>
                <div className="eq-bar" style={{ animationDelay:'.3s', background:'#a78bfa' }}/>
                <div className="eq-bar" style={{ animationDelay:'0s',  background:'#a78bfa' }}/>
              </div>
            </div>
          )}
        </div>

        {/* ── TORN PAPER NOTES ── */}
        <TornNote
          text="things to draw next:"
          lines={['more hands (ugh)','perspective study','that forest scene from dark','character from vinland saga']}
          style={{ top:'700px', left:'5%', width:265, transform:'rotate(-1.5deg)' }}
        />
        <TornNote
          text="more coming soon..."
          lines={['trying to get better','at hands. slowly.','maybe.']}
          style={{ bottom:'400px', right:'40%', width:150, transform:'rotate(4deg)' }}
          small
        />

        {/* ── NOTEBOOK ── */}
        <section className="notebook-section" aria-label="Notes">
          <div className="notebook-wrap" ref={notebookRef}>
            <div className="notebook-margin" aria-hidden />
            <div className="notebook-lines">
              {NOTE_ENTRIES.map((entry,i) => (
                <div key={i}
                  className={['note-line',`note-${entry.style}`,entry.mood?`note-mood-${entry.mood}`:'',visibleLines[i]?'line-visible':''].join(' ')}
                  style={{ transitionDelay:`${i*60}ms` }}>
                  {entry.style==='crossed'
                    ? <span className="note-crossed">{entry.text.replace('crossed:','').trim()}</span>
                    : entry.text}
                </div>
              ))}
            </div>
            <div className="nb-doodles" aria-hidden>
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
              <CurrentlyCard emoji="🎵" label="music"    value="looking for the perfect study playlist" color="#a78bfa" />
              <CurrentlyCard emoji="📺" label="watching" value="Vinland Saga S2 — it's destroying me"    color="#fbbf24" />
              <CurrentlyCard emoji="🎮" label="playing"  value="whatever runs on an RTX 3050"            color="#34d399" />
              <CurrentlyCard emoji="✏️" label="drawing"  value="anatomy, hands, hating myself"           color="#f87171" />
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <div className="sk-footer">
          <div className="sk-footer-line" aria-hidden />
          <p className="sk-footer-text">this is the part of me that doesn't make it to the portfolio</p>
          <p className="sk-footer-sub">@kreshrts · kreshantkumar.com</p>
          <button className="sk-footer-back" onClick={() => navigate(-1)}>← back to the professional version of me</button>
        </div>
      </main>

      {/* ── LIGHTBOX ── */}
      {lightboxSrc && (
        <div className="lightbox" onClick={() => setLightboxSrc(null)} role="dialog" aria-modal aria-label="Drawing enlarged">
          <button className="lightbox-close" onClick={() => setLightboxSrc(null)} aria-label="Close">✕</button>
          <img src={lightboxSrc} alt="Drawing enlarged" className="lightbox-img" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}

// ── SUB-COMPONENTS ─────────────────────────────────────────────

function DrawingCard({ drawing, index, visible, onClick }: {
  drawing: typeof drawings[0]; index: number; visible: boolean; onClick: () => void;
}) {
  const tape      = tapeColors[index % tapeColors.length];
  const tapeWidth = 36 + (index % 3) * 12;
  return (
    <div
      className={`drawing-card-wrap ${visible?'card-visible':''}`}
      style={{ left:`${drawing.left}%`, top:drawing.top, width:drawing.width, '--card-rot':`${drawing.rotate}deg`, animationDelay:`${drawing.delay}ms` } as React.CSSProperties}
      onClick={onClick} role="button" tabIndex={0}
      aria-label={`View drawing: ${drawing.label}`}
      onKeyDown={e => e.key==='Enter' && onClick()}>
      <div className="drawing-tape" style={{ width:tapeWidth, background:tape }} aria-hidden />
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
        <span className="placeholder-info">add {alt}<br/>to /public/sketchbook/</span>
      </div>
    );
  }
  return <img src={src} alt={alt} className="drawing-img" onError={() => setFailed(true)} loading="lazy" />;
}

function TornNote({ text, lines, style, small }: {
  text: string; lines: string[]; style: React.CSSProperties; small?: boolean;
}) {
  return (
    <div className="torn-paper" style={style}>
      <div style={{ fontFamily:"'Caveat',cursive", fontSize: small?14:17, fontWeight:700, color:'#7c3aed', marginBottom:6, paddingBottom:4, borderBottom:'1px dashed rgba(0,0,0,0.1)' }}>
        {text}
      </div>
      {lines.map((l,i) => (
        <div key={i} style={{ fontFamily:"'Caveat',cursive", fontSize:small?12:14, opacity:.82, lineHeight:1.5, color:'#2a1a0c' }}>{l}</div>
      ))}
    </div>
  );
}

function CurrentlyCard({ emoji, label, value, color }: {
  emoji: string; label: string; value: string; color: string;
}) {
  return (
    <div className="currently-card" style={{ '--card-color':color } as React.CSSProperties}>
      <div className="currently-card-header">
        <div className="cc-emoji">{emoji}</div>
        <div className="cc-label">{label}</div>
      </div>
      <div className="cc-body">
        <div className="cc-value">{value}</div>
      </div>
    </div>
  );
}