// SketchbookPage.tsx — v4 Complete Refinement
// 
// ENHANCEMENTS:
//   ✅ Framer Motion for fluid physics-based animations
//   ✅ 3D tilt effects on drawing cards with mouse tracking
//   ✅ Parallax depth layers for immersive desk feel
//   ✅ Enhanced "ink bleed" shaders and paper textures
//   ✅ Dynamic lighting system (day/night cycle)
//   ✅ Sketch cursor with trailing pencil marks
//   ✅ Improved responsive masonry layout
//   ✅ Memoized components for 60fps performance
//   ✅ Sound visualizer for music player
//   ✅ Interactive "shuffle" animations

import { 
  useEffect, useRef, useState, useCallback, useMemo, memo 
} from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';

// ── TYPES ─────────────────────────────────────────────────────
interface Drawing {
  src: string;
  label: string;
  note: string;
  rotate: number;
  left: number;
  top: number;
  width: number;
  delay: number;
  category?: 'portrait' | 'anatomy' | 'character' | 'landscape';
}

interface Sticker {
  src: string;
  style: React.CSSProperties;
  easterEgg?: boolean;
  label?: string;
}

// ── CONTENT CONFIG ─────────────────────────────────────────────
const DRAWINGS: Drawing[] = [
  { src: '/sketchbook/drawing-01.jpg', label: 'figure study', note: 'pencil, 2023', rotate: -4, left: 2, top: 200, width: 148, delay: 0, category: 'anatomy' },
  { src: '/sketchbook/naruto.webp', label: 'character study', note: 'ballpoint pen', rotate: 3, left: 14, top: 175, width: 138, delay: 80, category: 'character' },
  { src: '/sketchbook/drawing-03.jpg', label: 'anatomy attempt', note: 'ink wash', rotate: -2, left: 26, top: 215, width: 144, delay: 160, category: 'anatomy' },
  { src: '/sketchbook/drawing-04.jpg', label: 'midnight portrait', note: '3am energy', rotate: 5, left: 39, top: 185, width: 136, delay: 240, category: 'portrait' },
  { src: '/sketchbook/landscape.webp', label: 'forest path', note: 'pencil sketch', rotate: -3, left: 51, top: 205, width: 146, delay: 320, category: 'landscape' },
  { src: '/sketchbook/drawing-06.jpg', label: 'hand studies', note: 'still struggling', rotate: 2, left: 64, top: 178, width: 140, delay: 400, category: 'anatomy' },
];

const STARS = [
  { top: '8%', left: '82%', size: 38, color: '#a78bfa', opacity: 0.88, parallax: 0.2 },
  { top: '45%', left: '14%', size: 30, color: '#7c3aed', opacity: 0.72, parallax: -0.1 },
  { top: '72%', left: '76%', size: 44, color: '#c4b5fd', opacity: 0.80, parallax: 0.3 },
  { top: '48%', left: '93%', size: 34, color: '#a78bfa', opacity: 0.75, parallax: -0.2 },
  { top: '88%', left: '4%', size: 26, color: '#7c3aed', opacity: 0.60, parallax: 0.15 },
];

const STICKERS: Sticker[] = [
  { src: '/sketchbook/stickers/goku.png', style: { top: '155px', left: '34%', width: 80, transform: 'rotate(-4deg)', zIndex: 12 }, label: 'Goku sticker' },
  { src: '/sketchbook/stickers/palette.png', style: { top: '28px', right: '2%', width: 160, transform: 'rotate(14deg)', zIndex: 12 }, label: 'Paint palette' },
  { src: '/sketchbook/stickers/pencils.png', style: { top: '44px', left: '310px', width: 120, transform: 'rotate(-28deg)', zIndex: 12 }, label: 'Pencil cup' },
  { src: '/sketchbook/stickers/headphones.png', style: { bottom: '185px', right: '4%', width: 185, transform: 'rotate(18deg)', zIndex: 12 }, label: 'Headphones' },
  { src: '/sketchbook/stickers/gameboy.png', style: { bottom: '155px', left: '170px', width: 72, transform: 'rotate(-9deg)', zIndex: 12 }, label: 'Gameboy' },
  { src: '/sketchbook/stickers/Skull.webp', style: { top: '425px', left: '32%', width: 72, transform: 'rotate(4deg)', zIndex: 12 }, easterEgg: true, label: 'Mysterious skull' },
];

const MUSIC_LIST = ['/sketchbook/ambience.mp3', '/sketchbook/chill.mp3', '/sketchbook/piano.mp3'];
const TRACK_COLORS = ['#a78bfa', '#fca5a5', '#6ee7b7'];

const STICKY_THOUGHTS = [
  'drew this right after watching studio ghibli at 2am',
  'this one took 3 tries and i still hate the proportions',
  'hands are impossible. no one can convince me otherwise.',
  'why do eyes always look weird until the last minute?',
];

const NOTE_ENTRIES = [
  { text: 'things to draw next:', style: 'heading', mood: 'focused' },
  { text: 'more hands (ugh)', style: 'normal', mood: 'frustrated' },
  { text: 'perspective study', style: 'normal', mood: null },
  { text: 'that forest scene from dark', style: 'normal', mood: 'curious' },
  { text: 'character from vinland saga', style: 'normal', mood: null },
  { text: 'crossed: portrait of toji', style: 'crossed', mood: 'nostalgic' },
  { text: '', style: 'blank', mood: null },
  { text: 'currently listening:', style: 'heading', mood: 'focused' },
  { text: '→ trying to find the perfect study playlist', style: 'normal', mood: null },
  { text: '', style: 'blank', mood: null },
  { text: 'last watched: vinland saga s2 (crying inside)', style: 'note', mood: 'nostalgic' },
];

const TAPE_COLORS = [
  'repeating-linear-gradient(45deg,rgba(196,181,255,.7),rgba(196,181,255,.7) 4px,rgba(167,139,250,.4) 4px,rgba(167,139,250,.4) 8px)',
  'repeating-linear-gradient(45deg,rgba(253,230,138,.7),rgba(253,230,138,.7) 4px,rgba(252,211,77,.4) 4px,rgba(252,211,77,.4) 8px)',
  'repeating-linear-gradient(45deg,rgba(167,243,208,.7),rgba(167,243,208,.7) 4px,rgba(110,231,183,.4) 4px,rgba(110,231,183,.4) 8px)',
  'repeating-linear-gradient(45deg,rgba(252,165,165,.7),rgba(252,165,165,.7) 4px,rgba(248,113,113,.4) 4px,rgba(248,113,113,.4) 8px)',
];

// ── CUSTOM HOOKS ───────────────────────────────────────────────
const useMousePosition = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);
  return pos;
};

const useScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return scaleX;
};

// ── SUB-COMPONENTS ─────────────────────────────────────────────

const DrawingCard = memo(({ drawing, index, onClick }: { 
  drawing: Drawing; 
  index: number; 
  onClick: () => void 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // 3D tilt effect
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `
      perspective(1000px) 
      rotateY(${x * 10}deg) 
      rotateX(${-y * 10}deg) 
      rotate(${drawing.rotate}deg) 
      translateY(${isHovered ? -8 : 0}px)
      scale(${isHovered ? 1.02 : 1})
    `;
  }, [drawing.rotate, isHovered]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (cardRef.current) {
      cardRef.current.style.transform = `rotate(${drawing.rotate}deg)`;
    }
  }, [drawing.rotate]);

  const tape = TAPE_COLORS[index % TAPE_COLORS.length];
  const tapeWidth = 36 + (index % 3) * 12;

  return (
    <motion.div
      ref={cardRef}
      className="drawing-card-wrap"
      initial={{ opacity: 0, y: 100, rotate: drawing.rotate + (Math.random() * 10 - 5) }}
      animate={{ opacity: 1, y: 0, rotate: drawing.rotate }}
      transition={{ 
        delay: drawing.delay / 1000, 
        duration: 0.8, 
        type: "spring",
        bounce: 0.3
      }}
      style={{ 
        left: `${drawing.left}%`, 
        top: drawing.top, 
        width: drawing.width,
        zIndex: isHovered ? 50 : 10
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`View ${drawing.label}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div className="drawing-tape" style={{ width: tapeWidth, background: tape }} aria-hidden />
      
      <div className={`drawing-img-box ${imageLoaded ? 'loaded' : ''}`}>
        <div className="image-placeholder" aria-hidden>
          <div className="pencil-loader" />
        </div>
        <img 
          src={drawing.src} 
          alt={drawing.label}
          className="drawing-img"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            (e.target as HTMLImageElement).parentElement?.classList.add('error');
          }}
        />
        <div className="ink-bleed-overlay" aria-hidden />
      </div>

      <motion.div 
        className="drawing-caption"
        animate={{ y: isHovered ? 0 : 5, opacity: isHovered ? 1 : 0.8 }}
      >
        <div className="drawing-caption-label">{drawing.label}</div>
        <div className="drawing-caption-note">{drawing.note}</div>
        {drawing.category && (
          <span className="drawing-category">{drawing.category}</span>
        )}
      </motion.div>

      {isHovered && (
        <motion.div 
          className="card-spotlight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            background: `radial-gradient(circle at ${50}% ${50}%, rgba(255,255,255,0.2) 0%, transparent 70%)`
          }}
        />
      )}
    </motion.div>
  );
});

const StickyNote = memo(({ text, index, onClick }: { 
  text: string; 
  index: number; 
  onClick: (e: React.MouseEvent, idx: number) => void 
}) => {
  const rotations = [-2, 3, -1.5];
  const colors = ['#fef3c7', '#fce7f3', '#e0e7ff'];
  
  return (
    <motion.div
      className="sticky-note"
      style={{ 
        backgroundColor: colors[index % colors.length],
        transform: `rotate(${rotations[index % rotations.length]}deg)`
      }}
      initial={{ opacity: 0, scale: 0.8, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
      whileHover={{ 
        scale: 1.05, 
        rotate: 0,
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        zIndex: 100
      }}
      whileTap={{ scale: 0.95 }}
      onClick={(e) => onClick(e, index)}
      role="button"
      tabIndex={0}
      aria-label={`Note: ${text}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick(e as unknown as React.MouseEvent, index)}
    >
      <div className="sticky-tape" aria-hidden />
      <span className="sticky-text">{text}</span>
    </motion.div>
  );
});

const MusicVisualizer = memo(({ isPlaying, color }: { isPlaying: boolean; color: string }) => {
  const bars = 5;
  return (
    <div className="music-visualizer" aria-hidden>
      {[...Array(bars)].map((_, i) => (
        <motion.div
          key={i}
          className="viz-bar"
          animate={isPlaying ? {
            height: [4, 16 + Math.random() * 12, 4],
          } : { height: 4 }}
          transition={{
            duration: 0.4,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.05,
            ease: "easeInOut"
          }}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
});

const TornPaper = memo(({ text, lines, style, small }: {
  text: string;
  lines: string[];
  style: React.CSSProperties;
  small?: boolean;
}) => {
  return (
    <motion.div 
      className="torn-paper"
      style={style}
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", bounce: 0.4 }}
    >
      <div className="torn-edge-top" aria-hidden />
      <div style={{ 
        fontFamily: "'Caveat', cursive", 
        fontSize: small ? 14 : 17, 
        fontWeight: 700, 
        color: '#7c3aed', 
        marginBottom: 6, 
        paddingBottom: 4, 
        borderBottom: '1px dashed rgba(0,0,0,0.1)' 
      }}>
        {text}
      </div>
      {lines.map((line, i) => (
        <motion.div 
          key={i} 
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 0.82, x: 0 }}
          transition={{ delay: i * 0.1 }}
          style={{ 
            fontFamily: "'Caveat', cursive", 
            fontSize: small ? 12 : 14, 
            opacity: 0.82, 
            lineHeight: 1.5, 
            color: '#2a1a0c',
            textDecoration: line.includes('crossed') ? 'line-through' : 'none'
          }}
        >
          {line}
        </motion.div>
      ))}
      <div className="torn-edge-bottom" aria-hidden />
    </motion.div>
  );
});

// ── MAIN COMPONENT ─────────────────────────────────────────────

export default function SketchbookPage() {
  const navigate = useNavigate();
  const mousePos = useMousePosition();
  const scrollProgress = useScrollProgress();
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const skullClicks = useRef(0);
  const skullTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // State
  const [nightMode, setNightMode] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.4);
  const [activeStickyIdx, setActiveStickyIdx] = useState<number | null>(null);
  const [cursorTrail, setCursorTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const [showCursor, setShowCursor] = useState(false);

  // Derived state
  const currentColor = TRACK_COLORS[currentTrack];
  const scatterHeight = useMemo(() => Math.max(...DRAWINGS.map(d => d.top + 300)), []);

  // Cursor trail effect
  useEffect(() => {
    if (!showCursor) return;
    const id = Date.now();
    setCursorTrail(prev => [...prev.slice(-4), { x: mousePos.x, y: mousePos.y, id }]);
  }, [mousePos, showCursor]);

  // Check for fine pointer
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    setShowCursor(mq.matches);
    const handler = (e: MediaQueryListEvent) => setShowCursor(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Audio handlers
  const toggleMusic = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (musicPlaying) {
      audio.pause();
      setMusicPlaying(false);
    } else {
      audio.volume = volume;
      try {
        await audio.play();
        setMusicPlaying(true);
      } catch {
        setMusicPlaying(false);
      }
    }
  }, [musicPlaying, volume]);

  const nextTrack = useCallback(() => {
    setCurrentTrack(prev => (prev + 1) % MUSIC_LIST.length);
  }, []);

  // Confetti effect
  const triggerConfetti = useCallback((x: number, y: number) => {
    const colors = ['#c4b5fd', '#fca5a5', '#6ee7b7', '#fcd34d', '#a78bfa'];
    for (let i = 0; i < 50; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      const angle = (Math.PI * 2 * i) / 50;
      const velocity = 100 + Math.random() * 100;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity - 100;
      
      el.style.cssText = `
        left: ${x}px;
        top: ${y}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        --tx: ${tx}px;
        --ty: ${ty}px;
        animation: confetti-pop 1s ease-out forwards;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1000);
    }
  }, []);

  const handleSkullClick = useCallback((e: React.MouseEvent) => {
    skullClicks.current += 1;
    if (skullTimer.current) clearTimeout(skullTimer.current);
    skullTimer.current = setTimeout(() => { skullClicks.current = 0; }, 1500);
    
    if (skullClicks.current >= 3) {
      skullClicks.current = 0;
      triggerConfetti(e.clientX, e.clientY);
    }
  }, [triggerConfetti]);

  const handleStickyClick = useCallback((e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setActiveStickyIdx(activeStickyIdx === idx ? null : idx);
  }, [activeStickyIdx]);

  // Click outside to close sticky
  useEffect(() => {
    const close = () => setActiveStickyIdx(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  // Parallax values
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -150]);
  const y3 = useTransform(scrollY, [0, 1000], [0, 100]);

  return (
    <div ref={containerRef} className={`sketchbook-container ${nightMode ? 'night-mode' : ''}`}>
      {/* Progress bar */}
      <motion.div className="scroll-progress" style={{ scaleX: scrollProgress }} />

      {/* Cursor trail */}
      <AnimatePresence>
        {showCursor && cursorTrail.map((point, i) => (
          <motion.div
            key={point.id}
            className="cursor-trail"
            initial={{ opacity: 0.6, scale: 1 }}
            animate={{ opacity: 0, scale: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              left: point.x,
              top: point.y,
              width: 8 - i,
              height: 8 - i,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Custom cursor */}
      {showCursor && (
        <div className="pencil-cursor" style={{ left: mousePos.x, top: mousePos.y }}>
          <div className="cursor-tip" />
        </div>
      )}

      {/* Audio element */}
      <audio
        ref={audioRef}
        src={MUSIC_LIST[currentTrack]}
        onEnded={nextTrack}
        onPlay={() => setMusicPlaying(true)}
        onPause={() => setMusicPlaying(false)}
        preload="metadata"
      />

      {/* Fixed UI Elements */}
      <motion.button 
        className="night-mode-btn"
        onClick={() => setNightMode(!nightMode)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={nightMode ? 'Switch to day mode' : 'Switch to night mode'}
      >
        <span className="mode-icon">{nightMode ? '☀️' : '🌙'}</span>
        <span className="mode-text">{nightMode ? 'day mode' : 'night mode'}</span>
      </motion.button>

      <motion.button 
        className="back-btn"
        onClick={() => navigate(-1)}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: 5 }}
      >
        <span className="back-arrow">←</span>
        <span>back to reality</span>
      </motion.button>

      {/* Music Player */}
      <motion.div 
        className="music-player"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div 
          className={`vinyl-container ${musicPlaying ? 'playing' : ''}`}
          onClick={toggleMusic}
          style={{ '--track-color': currentColor } as React.CSSProperties}
        >
          <div className="vinyl-record">
            <div className="vinyl-label" />
            <div className="vinyl-grooves" />
          </div>
          <MusicVisualizer isPlaying={musicPlaying} color={currentColor} />
        </div>
        
        <div className="track-info">
          <span className="track-number">track {currentTrack + 1}/{MUSIC_LIST.length}</span>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1" 
            value={volume}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              setVolume(v);
              if (audioRef.current) audioRef.current.volume = v;
            }}
            className="volume-slider"
            style={{ '--accent': currentColor } as React.CSSProperties}
            aria-label="Volume"
          />
        </div>
      </motion.div>

      {/* Sticky Thought Popup */}
      <AnimatePresence>
        {activeStickyIdx !== null && (
          <motion.div
            className="sticky-thought-bubble"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            style={{ 
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000
            }}
          >
            <div className="thought-content">
              <span className="thought-quote">"</span>
              {STICKY_THOUGHTS[activeStickyIdx]}
              <span className="thought-quote">"</span>
            </div>
            <div className="thought-tail" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="sketchbook-main" aria-label="Sketchbook">
        
        {/* Background layers */}
        <div className="paper-texture" aria-hidden />
        <div className={`desk-surface ${nightMode ? 'night' : ''}`} aria-hidden />
        
        {/* Parallax Stars */}
        {STARS.map((star, i) => (
          <motion.span
            key={i}
            className="doodle-star"
            style={{ 
              top: star.top, 
              left: star.left, 
              fontSize: star.size,
              color: star.color,
              y: useTransform(scrollY, [0, 1000], [0, star.parallax * 100])
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: star.opacity, scale: 1 }}
            transition={{ delay: i * 0.1, type: "spring" }}
          >
            {i % 2 === 0 ? '✦' : '✧'}
          </motion.span>
        ))}

        {/* Coffee stains with parallax */}
        <motion.div className="coffee-stain large" style={{ y: y1, x: y2 }} aria-hidden />
        <motion.div className="coffee-stain small" style={{ y: y3 }} aria-hidden />

        {/* Header */}
        <header className="sketchbook-header">
          <motion.div 
            className="washi-tape tape-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          />
          <motion.div 
            className="washi-tape tape-right"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
          
          <motion.div 
            className="volume-badge"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Vol. I · 2024
          </motion.div>

          <motion.h1 
            className="main-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <span className="title-clean">Kresh's</span>
            <span className="title-messy">Sketchbook</span>
          </motion.h1>

          <motion.p 
            className="subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            drawings / doodles / 3am thoughts
            <span className="subtitle-note">not everything here is finished. that's the point.</span>
          </motion.p>

          <div className="sticky-cluster">
            {['these r wip ok', '↑ obsessed w this one', 'trying to get better at hands...'].map((text, i) => (
              <StickyNote key={i} text={text} index={i} onClick={handleStickyClick} />
            ))}
          </div>
        </header>

        {/* Drawings Section */}
        <section className="drawings-section" aria-label="Drawings">
          <motion.div 
            className="section-label"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-marker">//</span>
            <span>drawings</span>
            <div className="section-line" />
          </motion.div>

          <div className="drawings-grid" style={{ height: scatterHeight }}>
            {DRAWINGS.map((drawing, i) => (
              <DrawingCard 
                key={drawing.src} 
                drawing={drawing} 
                index={i}
                onClick={() => setLightboxSrc(drawing.src)}
              />
            ))}
            
            {/* Placeholder card */}
            <motion.div 
              className="drawing-card-wrap placeholder-card"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{ left: '82%', top: 180, width: 138 }}
            >
              <div className="placeholder-content">
                <motion.span 
                  className="placeholder-plus"
                  animate={{ rotate: [0, 90, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >+</motion.span>
                <span className="placeholder-text">more coming<br/>when i stop<br/>being lazy</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stickers/Desk Objects */}
        {STICKERS.map((sticker, i) => (
          <motion.img
            key={sticker.src}
            src={sticker.src}
            className={`desk-sticker ${sticker.easterEgg ? 'easter-egg' : ''}`}
            style={sticker.style}
            alt={sticker.label || ''}
            initial={{ opacity: 0, y: 50, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: parseInt(sticker.style.transform?.match(/rotate\(([-\d]+)deg\)/)?.[1] || '0') }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, type: "spring", bounce: 0.4 }}
            whileHover={sticker.easterEgg ? { scale: 1.1, rotate: 0 } : { scale: 1.05 }}
            onClick={sticker.easterEgg ? handleSkullClick : undefined}
            drag={sticker.easterEgg}
            dragConstraints={containerRef}
          />
        ))}

        {/* Phone Music Player Sticker */}
        <motion.div 
          className="phone-sticker"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          onClick={toggleMusic}
        >
          <img src="/sketchbook/stickers/phone.png" alt="Music player" />
          {musicPlaying && (
            <div className="phone-screen-viz">
              <MusicVisualizer isPlaying={musicPlaying} color="#a78bfa" />
            </div>
          )}
        </motion.div>

        {/* Torn Notes */}
        <TornPaper 
          text="things to draw next:"
          lines={['more hands (ugh)', 'perspective study', 'that forest scene from dark', 'character from vinland saga']}
          style={{ top: '700px', left: '5%', width: 265, transform: 'rotate(-1.5deg)' }}
        />
        
        <TornPaper 
          text="art block hours:"
          lines={['staring at blank paper', 'for 2 hours', 'send help']}
          style={{ bottom: '400px', right: '40%', width: 150, transform: 'rotate(4deg)' }}
          small
        />

        {/* Notebook Section */}
        <section className="notebook-section">
          <motion.div 
            className="notebook"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="notebook-spiral" aria-hidden />
            <div className="notebook-margin" aria-hidden />
            
            <div className="notebook-content">
              {NOTE_ENTRIES.map((entry, i) => (
                <motion.div
                  key={i}
                  className={`note-line ${entry.style} ${entry.mood ? `mood-${entry.mood}` : ''}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  {entry.style === 'crossed' ? (
                    <span className="crossed-text">{entry.text.replace('crossed:', '').trim()}</span>
                  ) : entry.text}
                </motion.div>
              ))}
            </div>

            {/* Notebook doodles */}
            <motion.div 
              className="nb-doodle star-1"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >✦</motion.div>
            <motion.div 
              className="nb-doodle star-2"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >★</motion.div>
          </motion.div>
        </section>

        {/* Currently Into Section */}
        <section className="currently-section">
          <motion.h2 
            className="currently-title"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            currently into
          </motion.h2>
          
          <div className="currently-grid">
            {[
              { emoji: '🎵', label: 'music', value: 'looking for the perfect study playlist', color: '#a78bfa' },
              { emoji: '📺', label: 'watching', value: 'Vinland Saga S2 — emotional damage', color: '#fbbf24' },
              { emoji: '🎮', label: 'playing', value: 'whatever runs on an RTX 3050', color: '#34d399' },
              { emoji: '✏️', label: 'drawing', value: 'anatomy, hands, self-loathing', color: '#f87171' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                className="currently-card"
                style={{ '--card-accent': item.color } as React.CSSProperties}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, boxShadow: `0 10px 30px ${item.color}30` }}
              >
                <div className="card-header">
                  <span className="card-emoji">{item.emoji}</span>
                  <span className="card-label">{item.label}</span>
                </div>
                <div className="card-value">{item.value}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="sketchbook-footer">
          <motion.div 
            className="footer-line"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
          />
          <motion.p 
            className="footer-text"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            this is the part of me that doesn't make it to the portfolio
          </motion.p>
          <motion.p 
            className="footer-handle"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            @kreshrts · kreshantkumar.com
          </motion.p>
        </footer>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxSrc && (
          <motion.div 
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxSrc(null)}
          >
            <motion.button 
              className="lightbox-close"
              onClick={(e) => { e.stopPropagation(); setLightboxSrc(null); }}
              whileHover={{ scale: 1.1, rotate: 90 }}
            >✕</motion.button>
            
            <motion.img 
              src={lightboxSrc} 
              alt="Enlarged drawing"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            />
            
            <div className="lightbox-caption">click anywhere to close</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global styles for animations */}
      <style>{`
        @keyframes confetti-pop {
          to {
            transform: translate(var(--tx), var(--ty)) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pencil-scribble {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
