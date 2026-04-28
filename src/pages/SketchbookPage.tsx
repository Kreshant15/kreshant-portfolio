/**
 * SketchbookPage.tsx — Enhanced Edition
 *
 * DESIGN CONCEPT: "Pinned Sketchbook"
 * Drawings feel like physical sketches pinned to a dark corkboard —
 * slightly rotated, each with its own washi-tape corner, ink-reveal entrance.
 * Mobile-first. Heavy effects gated behind useIsDesktop().
 *
 * PERFORMANCE STRATEGY:
 * - All purely decorative animations are disabled on mobile / prefers-reduced-motion
 * - Images use loading="lazy" + decoding="async"
 * - Cursor / tracing beam are desktop-only, zero cost on touch devices
 * - Particle count is small and stable (no Math.random in render)
 * - will-change only applied during active animation
 * - Aurora uses CSS animation instead of Framer JS on both platforms
 * - Masonry via CSS columns — no JS layout, no ResizeObserver
 */

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  memo,
} from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────────────────────
// INLINE UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Returns true only on devices with a fine pointer (mouse) + min 768px width.
 * Used to gate all heavy desktop-only effects.
 */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine) and (min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isDesktop;
}

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface Artwork {
  id: number;
  title: string;
  tag: string;
  year: string;
  src: string;
  accentColor: string;
  /** One-line shown in the Now Playing bar + lightbox */
  caption?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// ARTWORK DATA
// Replace `src` with your actual image paths, e.g. "/drawings/midnight-run.jpg"
// or import them: import midnightRun from "../assets/drawings/midnight-run.jpg"
// ─────────────────────────────────────────────────────────────────────────────

const ARTWORKS: Artwork[] = [
  {
    id: 1,
    title: "Midnight Run",
    tag: "character",
    year: "2024",
    src: "https://placehold.co/600x900/1a1a2e/ff00ff?text=Midnight+Run",
    accentColor: "#ff00ff",
    caption: "late night sprint through neon streets",
  },
  {
    id: 2,
    title: "Neon City Dreams",
    tag: "environment",
    year: "2024",
    src: "https://placehold.co/800x500/1a1a2e/00ffff?text=Neon+City",
    accentColor: "#00ffff",
    caption: "a city that never dims",
  },
  {
    id: 3,
    title: "Pixel Heart",
    tag: "study",
    year: "2024",
    src: "https://placehold.co/600x600/1a1a2e/ff6b9d?text=Pixel+Heart",
    accentColor: "#ff6b9d",
    caption: "8-bit feelings, real emotions",
  },
  {
    id: 4,
    title: "Boss Battle",
    tag: "character",
    year: "2024",
    src: "https://placehold.co/600x900/1a1a2e/ffd93d?text=Boss+Battle",
    accentColor: "#ffd93d",
    caption: "final form unlocked",
  },
  {
    id: 5,
    title: "Synthwave Sunset",
    tag: "illustration",
    year: "2024",
    src: "https://placehold.co/800x500/1a1a2e/ff6ec7?text=Synthwave",
    accentColor: "#ff6ec7",
    caption: "retrowave horizon, somewhere in 1987",
  },
  {
    id: 6,
    title: "Glitch Girl",
    tag: "study",
    year: "2024",
    src: "https://placehold.co/600x600/1a1a2e/00ffff?text=Glitch+Girl",
    accentColor: "#00ffff",
    caption: "corrupted memory, beautiful remnants",
  },
  {
    id: 7,
    title: "Arcade Nights",
    tag: "environment",
    year: "2023",
    src: "https://placehold.co/600x900/1a1a2e/7f00ff?text=Arcade",
    accentColor: "#7f00ff",
    caption: "tokens in pocket, nothing else matters",
  },
  {
    id: 8,
    title: "Lo-Fi Vibes",
    tag: "illustration",
    year: "2024",
    src: "https://placehold.co/800x500/1a1a2e/6bcf7f?text=Lo-Fi+Vibes",
    accentColor: "#6bcf7f",
    caption: "study girl with a playlist and rain",
  },
  {
    id: 9,
    title: "Power Up!",
    tag: "character",
    year: "2024",
    src: "https://placehold.co/600x600/1a1a2e/ff9d00?text=Power+Up",
    accentColor: "#ff9d00",
    caption: "1UP — extra life acquired",
  },
];

const TAGS = ["all", "character", "illustration", "environment", "study"];

// Stable per-card rotation — "pinned sketch" feel, consistent across renders
const CARD_ROTATIONS = [-2.1, 1.4, -0.8, 2.3, -1.6, 0.9, -2.8, 1.1, -0.5];

// Washi tape accent colors per card
const WASHI_COLORS = [
  "rgba(255,0,255,0.55)",
  "rgba(0,255,255,0.55)",
  "rgba(255,217,61,0.55)",
  "rgba(255,110,199,0.55)",
  "rgba(107,207,127,0.55)",
];

// Tag filter colors
const TAG_COLORS = ["#ff00ff", "#00ffff", "#ffd93d", "#ff6ec7", "#6bcf7f"];

// Badges in the hero
const BADGES = [
  { emoji: "🎮", label: "GAMER",  color: "#ff00ff", rot: -5 },
  { emoji: "🎵", label: "MUSIC",  color: "#00ffff", rot:  3 },
  { emoji: "✏️", label: "ARTIST", color: "#ffd93d", rot: -2 },
];

// Music visualizer bar data — stable, no random
const BAR_HEIGHTS: [number, number, number][] = Array.from({ length: 28 }, (_, i) => [
  8 + (i * 7) % 22,
  18 + (i * 11) % 40,
  8 + (i * 7) % 22,
]);
const BAR_DURATIONS = Array.from({ length: 28 }, (_, i) => 0.55 + (i % 5) * 0.09);
const BAR_COLORS = ["#ff00ff", "#00ffff", "#ffd93d", "#ff6ec7"];

// Floating pixels — stable positions
const PIXEL_DATA = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  x: (i * 41 + 13) % 95,
  y: (i * 67 + 5) % 90,
  size: (i % 3) + 2,
  dur: 20 + (i % 8) * 2,
  delay: (i * 0.9) % 7,
  color: i % 3 === 0 ? "#ff00ff" : i % 3 === 1 ? "#00ffff" : "#ffd93d",
}));

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL CSS — injected once via useEffect, scoped to .sb-root
// Using CSS animations (not Framer) for the aurora orbs = zero JS overhead
// ─────────────────────────────────────────────────────────────────────────────

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

  .sb-root { scrollbar-width: thin; scrollbar-color: #ff00ff #06060f; }
  .sb-root *::selection { background: #ff00ff; color: #fff; }

  @keyframes sb-gradient {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes sb-aurora1 {
    0%,100% { transform: translate(0,0) scale(1);         opacity: 0.5; }
    50%     { transform: translate(80px,40px) scale(1.15); opacity: 0.85; }
  }
  @keyframes sb-aurora2 {
    0%,100% { transform: translate(0,0) scale(1);           opacity: 0.4; }
    50%     { transform: translate(-60px,-50px) scale(1.2);  opacity: 0.75; }
  }
  @keyframes sb-aurora3 {
    0%,100% { opacity: 0.25; transform: scale(1); }
    50%     { opacity: 0.55; transform: scale(1.3); }
  }

  /* Paper texture on cards via ::before */
  .sb-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.055'/%3E%3C/svg%3E");
    background-size: 120px 120px;
    pointer-events: none;
    z-index: 6;
    mix-blend-mode: overlay;
  }

  /* Desktop: hide system cursor */
  @media (pointer: fine) {
    .sb-root * { cursor: none !important; }
  }

  /* Respect reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    .sb-aurora1, .sb-aurora2, .sb-aurora3 { animation: none !important; }
    .sb-pixels { display: none !important; }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// AURORA BACKGROUND
// Three CSS-animated orbs — no JS, no requestAnimationFrame, no Framer
// ─────────────────────────────────────────────────────────────────────────────

const AuroraBackground = memo(function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0" style={{ backgroundColor: "#06060f" }} />
      {/* Pixel grid */}
      <div
        className="absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage:
            "linear-gradient(#ff00ff15 1px, transparent 1px), linear-gradient(90deg, #00ffff15 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      {/* Orbs */}
      <div
        className="sb-aurora1 absolute -top-48 -left-48 h-[650px] w-[650px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,0,255,0.26) 0%, rgba(160,0,255,0.07) 45%, transparent 70%)",
          filter: "blur(70px)",
          animation: "sb-aurora1 14s ease-in-out infinite",
          willChange: "transform, opacity",
        }}
      />
      <div
        className="sb-aurora2 absolute -bottom-48 -right-48 h-[750px] w-[750px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(0,255,255,0.2) 0%, rgba(0,140,255,0.06) 45%, transparent 70%)",
          filter: "blur(80px)",
          animation: "sb-aurora2 17s ease-in-out infinite 2s",
          willChange: "transform, opacity",
        }}
      />
      <div
        className="sb-aurora3 absolute top-1/3 right-1/4 h-[460px] w-[460px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,100,180,0.15) 0%, transparent 70%)",
          filter: "blur(90px)",
          animation: "sb-aurora3 11s ease-in-out infinite 4s",
        }}
      />
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// FILM GRAIN — static SVG, zero JS cost
// ─────────────────────────────────────────────────────────────────────────────

const FilmGrain = memo(function FilmGrain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[99] opacity-[0.036]"
      aria-hidden
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.0' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "160px 160px",
      }}
    />
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// VHS SCANLINES — pure CSS, no JS
// ─────────────────────────────────────────────────────────────────────────────

const VHSScanlines = memo(function VHSScanlines() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[98] opacity-[0.02]"
      aria-hidden
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, #00ffff 2px, #00ffff 4px)",
      }}
    />
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// FLOATING PIXELS — desktop only, 10 particles max
// ─────────────────────────────────────────────────────────────────────────────

const FloatingPixels = memo(function FloatingPixels() {
  const shouldReduce = useReducedMotion();
  if (shouldReduce) return null;

  return (
    <div className="sb-pixels pointer-events-none fixed inset-0 z-[5] overflow-hidden hidden md:block" aria-hidden>
      {PIXEL_DATA.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
          animate={{ y: [0, -100, 0], opacity: [0, 0.6, 0] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// PENCIL CURSOR — SVG pencil, desktop only
// More unique than a generic orb — conceptually matches "sketchbook"
// Uses RAF for zero-lag tracking, willChange only on the element that moves
// ─────────────────────────────────────────────────────────────────────────────

function PencilCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef  = useRef<HTMLDivElement>(null);
  const rafRef    = useRef<number | null>(null);

  const onMove = useCallback((e: MouseEvent) => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      if (cursorRef.current)
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      if (trailRef.current)
        trailRef.current.style.transform = `translate(${e.clientX - 14}px, ${e.clientY - 14}px)`;
      rafRef.current = null;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onMove]);

  return (
    <>
      {/* Soft glow trail */}
      <div
        ref={trailRef}
        className="pointer-events-none fixed top-0 left-0 z-[200] h-7 w-7 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,0,255,0.28) 0%, rgba(0,255,255,0.1) 60%, transparent 80%)",
          filter: "blur(8px)",
          transition: "transform 0.1s ease-out",
          willChange: "transform",
        }}
      />
      {/* Pencil SVG */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[201]"
        style={{
          willChange: "transform",
          transition: "transform 0.03s linear",
          marginLeft: "-4px",
          marginTop: "-22px",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
          style={{ filter: "drop-shadow(0 0 5px #ff00ff)" }}>
          <path d="M14.5 2.5L17.5 5.5L7 16H4V13L14.5 2.5Z"
            fill="#ff00ff" stroke="#fff" strokeWidth="0.7" />
          <path d="M4 16L4.5 13.5" stroke="#ffd93d" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TRACING BEAM — scroll progress, desktop only
// ─────────────────────────────────────────────────────────────────────────────

function TracingBeam() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const dotTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div
      className="pointer-events-none fixed left-5 top-[20%] z-40 hidden h-[60%] w-[2px] lg:block"
      aria-hidden
    >
      <div className="h-full w-full rounded-full bg-white/[0.05]" />
      <motion.div
        className="absolute top-0 left-0 w-full origin-top rounded-full"
        style={{
          scaleY,
          height: "100%",
          background: "linear-gradient(to bottom, #ff00ff, #00ffff)",
          boxShadow: "0 0 6px #ff00ff77",
        }}
      />
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 h-[7px] w-[7px] rounded-full"
        style={{
          top: dotTop,
          backgroundColor: "#ff00ff",
          boxShadow: "0 0 8px #ff00ff, 0 0 16px #ff00ff44",
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BACK BUTTON
// ─────────────────────────────────────────────────────────────────────────────

function BackButton() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="fixed top-5 left-5 z-50"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: 0.15 }}
    >
      <motion.button
        onClick={() => navigate("/")}
        className="relative flex items-center gap-2 overflow-hidden rounded-lg border px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-widest backdrop-blur-md"
        style={{ borderColor: "#ff00ff44", backgroundColor: "#ff00ff08", color: "#ff00ffaa" }}
        whileHover={{
          borderColor: "#ff00ff",
          backgroundColor: "#ff00ff14",
          color: "#ff00ff",
          boxShadow: "0 0 18px #ff00ff44",
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.18 }}
      >
        <motion.svg width="11" height="11" viewBox="0 0 11 11" fill="none"
          animate={{ x: [0, -3, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
          <path d="M7.5 1.5L2.5 5.5L7.5 9.5" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
        Back
      </motion.button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MUSIC VISUALIZER — deterministic heights, no Math.random in render
// ─────────────────────────────────────────────────────────────────────────────

const MusicVisualizer = memo(function MusicVisualizer() {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      className="flex items-end gap-[2px] h-11"
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
      transition={{ duration: 0.55, delay: 1.05, ease: "backOut" }}
    >
      {BAR_HEIGHTS.map(([lo, hi], i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-t-sm flex-shrink-0"
          style={{
            background: `linear-gradient(to top, ${BAR_COLORS[i % 4]}, transparent)`,
            minHeight: "5px",
          }}
          animate={shouldReduce ? {} : { height: [`${lo}px`, `${hi}px`, `${lo}px`] }}
          transition={{
            duration: BAR_DURATIONS[i],
            repeat: Infinity,
            delay: i * 0.022,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// PIXEL BADGES
// ─────────────────────────────────────────────────────────────────────────────

function PixelBadges() {
  return (
    <div className="flex flex-wrap gap-2 justify-center mt-5 sm:gap-3">
      {BADGES.map((b, i) => (
        <motion.div
          key={i}
          className="flex items-center gap-1.5 rounded-lg border-2 px-2.5 py-1.5 font-mono text-[9px] font-bold uppercase sm:px-3 sm:text-[10px]"
          style={{
            borderColor: b.color,
            backgroundColor: `${b.color}12`,
            color: b.color,
            rotate: b.rot,
            boxShadow: `0 0 10px ${b.color}28`,
          }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.85 + i * 0.1, type: "spring" }}
          whileHover={{ scale: 1.1, rotate: b.rot + 5, boxShadow: `0 0 20px ${b.color}66` }}
        >
          <span className="text-sm leading-none">{b.emoji}</span>
          {b.label}
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO — parallax disabled on mobile for performance
// ─────────────────────────────────────────────────────────────────────────────

function Hero() {
  const isDesktop = useIsDesktop();
  const { scrollY } = useScroll();
  const y       = useTransform(scrollY, [0, 300], [0, isDesktop ? 70 : 0]);
  const opacity = useTransform(scrollY, [0, 260], [1, isDesktop ? 0.15 : 1]);

  return (
    <motion.section
      className="relative z-10 flex min-h-[65vh] flex-col items-center justify-center px-6 pt-28 pb-10 text-center"
      style={{ y, opacity }}
    >
      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-5 flex items-center gap-3"
      >
        <span className="block h-[2px] w-8 sm:w-10"
          style={{ background: "linear-gradient(to right, transparent, #ff00ff)" }} />
        <span
          className="font-mono text-[9px] tracking-[0.26em] uppercase select-none sm:text-[10px] sm:tracking-[0.3em]"
          style={{ color: "#00ffff", textShadow: "0 0 12px #00ffff, 2px 2px 0 #ff00ff33" }}
        >
          ░▒▓ SKETCHBOOK ▓▒░
        </span>
        <span className="block h-[2px] w-8 sm:w-10"
          style={{ background: "linear-gradient(to left, transparent, #00ffff)" }} />
      </motion.div>

      {/* DOODLE title with glitch */}
      <div className="relative mb-3 select-none">
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
          className="relative font-black uppercase leading-none"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "clamp(2rem, 9vw, 6rem)",
            color: "#fff",
            textShadow: "0 0 40px #ff00ff88, 0 0 70px #00ffff22",
            letterSpacing: "-0.02em",
          }}
        >
          <span className="relative inline-block">
            DOODLE
            <motion.span aria-hidden className="absolute inset-0" style={{ color: "#ff00ff", opacity: 0.6 }}
              animate={{ x: [-2, 2, 0] }}
              transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 6 }}
            >DOODLE</motion.span>
            <motion.span aria-hidden className="absolute inset-0" style={{ color: "#00ffff", opacity: 0.6 }}
              animate={{ x: [2, -2, 0] }}
              transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 6, delay: 0.1 }}
            >DOODLE</motion.span>
          </span>
        </motion.h1>

        {/* ARCHIVE — animated gradient text */}
        <motion.p
          aria-hidden
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.52 }}
          className="mt-1 font-black uppercase leading-none"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "clamp(1.1rem, 5vw, 3.2rem)",
            background: "linear-gradient(90deg, #ff00ff, #00ffff, #ffd93d, #ff6ec7, #ff00ff)",
            backgroundSize: "300% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "sb-gradient 5s ease infinite",
          }}
        >
          ARCHIVE
        </motion.p>
      </div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.65, delay: 0.78 }}
        className="mb-1 max-w-[260px] font-mono text-[11px] leading-relaxed sm:max-w-sm sm:text-xs"
        style={{ color: "#ffffff66" }}
      >
        late night sketches ✦ anime feels ✦ pixel dreams
        <br />
        <span style={{ color: "#00ffff", textShadow: "0 0 8px #00ffff33" }}>
          where art meets arcade
        </span>
      </motion.p>

      <PixelBadges />
      <div className="mt-7"><MusicVisualizer /></div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAG FILTER
// ─────────────────────────────────────────────────────────────────────────────

interface TagFilterProps { active: string; onChange: (t: string) => void; }

function TagFilter({ active, onChange }: TagFilterProps) {
  return (
    <motion.div
      className="relative z-10 flex flex-wrap justify-center gap-2 px-4 pb-10 sm:gap-3"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.95 }}
    >
      {TAGS.map((tag, i) => {
        const color    = TAG_COLORS[i % TAG_COLORS.length];
        const isActive = active === tag;
        return (
          <motion.button
            key={tag}
            onClick={() => onChange(tag)}
            whileHover={{ scale: 1.07, y: -2 }}
            whileTap={{ scale: 0.94 }}
            className="relative rounded-lg border-2 px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-wider sm:px-5 sm:py-2 sm:text-xs"
            style={{
              borderColor: isActive ? color : "#ffffff16",
              backgroundColor: isActive ? `${color}1e` : "#ffffff05",
              color: isActive ? color : "#ffffff40",
              boxShadow: isActive ? `0 0 14px ${color}40` : "none",
              transition: "border-color 0.2s, background-color 0.2s, color 0.2s, box-shadow 0.2s",
            }}
          >
            {isActive && (
              <motion.div
                layoutId="tagHL"
                className="absolute inset-0 rounded-[6px]"
                style={{ border: `2px solid ${color}`, boxShadow: `inset 0 0 12px ${color}16` }}
                transition={{ type: "spring", stiffness: 340, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tag}</span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WASHI TAPE decoration — the sticky tape on top of each card
// ─────────────────────────────────────────────────────────────────────────────

function WashiTape({ color, left }: { color: string; left: boolean }) {
  return (
    <div
      aria-hidden
      className="absolute z-10 h-5 w-12 sm:h-6 sm:w-14"
      style={{
        top: "-7px",
        left: left ? "14px" : "auto",
        right: left ? "auto" : "14px",
        backgroundColor: color,
        borderRadius: "2px",
        transform: `rotate(${left ? -6 : 5}deg)`,
        boxShadow: `0 2px 5px ${color}44`,
        opacity: 0.85,
        backgroundImage:
          "repeating-linear-gradient(45deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 2px, transparent 2px, transparent 8px)",
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ARTWORK CARD
// Desktop: 3D tilt + holographic shimmer
// Mobile: clean tap-to-open, no tilt, base rotation still gives the pinned feel
// Both: washi tape, ink-reveal entrance, corner brackets
// ─────────────────────────────────────────────────────────────────────────────

interface ArtworkCardProps {
  artwork: Artwork;
  index: number;
  onClick: (a: Artwork) => void;
}

const ArtworkCard = memo(function ArtworkCard({ artwork, index, onClick }: ArtworkCardProps) {
  const isDesktop    = useIsDesktop();
  const shouldReduce = useReducedMotion();
  const cardRef      = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [tilt,      setTilt]      = useState({ x: 0, y: 0 });
  const [mPos,      setMPos]      = useState({ x: 0.5, y: 0.5 });

  const baseRot     = CARD_ROTATIONS[index % CARD_ROTATIONS.length];
  const washerColor = WASHI_COLORS[index % WASHI_COLORS.length];

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isDesktop) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMPos({ x, y });
    setTilt({ x: (y - 0.5) * -10, y: (x - 0.5) * 10 });
  }, [isDesktop]);

  const handleLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setMPos({ x: 0.5, y: 0.5 });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className="sb-card relative cursor-pointer overflow-visible"
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: (index % 9) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      animate={
        isDesktop
          ? { rotateX: tilt.x, rotateY: tilt.y, scale: isHovered ? 1.03 : 1 }
          : {}
      }
      style={{
        rotate: shouldReduce ? 0 : baseRot,
        transformStyle: "preserve-3d",
        perspective: "900px",
        willChange: isHovered ? "transform" : "auto",
        zIndex: isHovered ? 20 : "auto",
      }}
      onClick={() => onClick(artwork)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Washi tape */}
      <WashiTape color={washerColor} left={index % 2 === 0} />

      {/* Card body */}
      <div
        className="relative overflow-hidden rounded-[10px]"
        style={{
          border: `2px solid ${isHovered ? artwork.accentColor : "#ffffff0b"}`,
          boxShadow: isHovered
            ? `0 0 36px ${artwork.accentColor}44, 0 10px 28px #00000088`
            : "0 5px 20px #00000077",
          transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        {/* Holographic shimmer — desktop hover only */}
        {isDesktop && isHovered && (
          <div
            className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay"
            style={{
              background: `radial-gradient(ellipse at ${mPos.x * 100}% ${mPos.y * 100}%, #ff00ff44, #00ffff22, transparent 70%)`,
              opacity: 0.4,
            }}
          />
        )}

        {/* Image — lazy loaded so page load is fast */}
        <motion.img
          src={artwork.src}
          alt={artwork.title}
          loading="lazy"
          decoding="async"
          className="block w-full object-cover"
          style={{ minHeight: "200px" }}
          animate={{
            scale: isHovered ? 1.07 : 1,
            filter: isHovered
              ? "saturate(1.3) brightness(1.05)"
              : "saturate(0.88) brightness(0.9)",
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Scanline sweep — desktop hover only */}
        {isDesktop && isHovered && (
          <motion.div
            className="absolute inset-0 z-[2] pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(0,255,255,0.06) 4px, rgba(0,255,255,0.06) 8px)",
            }}
            initial={{ y: "-100%" }}
            animate={{ y: "100%" }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
          />
        )}

        {/* Bottom gradient */}
        <div
          className="absolute inset-0 z-[3] pointer-events-none"
          style={{
            background: `linear-gradient(to top, ${artwork.accentColor}cc 0%, ${artwork.accentColor}33 28%, transparent 60%)`,
            opacity: isHovered ? 1 : 0.5,
            transition: "opacity 0.3s",
          }}
        />

        {/* Info — slides up on hover */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-[4] p-3 sm:p-4"
          animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.24 }}
        >
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0">
              <p
                className="mb-0.5 font-mono text-[8px] uppercase tracking-widest truncate"
                style={{ color: artwork.accentColor, textShadow: `0 0 8px ${artwork.accentColor}` }}
              >
                [{artwork.tag}]
              </p>
              <h3
                className="font-mono text-xs font-bold uppercase leading-tight text-white truncate sm:text-sm"
                style={{ textShadow: `0 0 10px ${artwork.accentColor}` }}
              >
                {artwork.title}
              </h3>
            </div>
            <span
              className="font-mono text-[10px] font-bold flex-shrink-0"
              style={{ color: artwork.accentColor }}
            >
              {artwork.year}
            </span>
          </div>
        </motion.div>

        {/* Corner brackets */}
        {(["tl", "tr", "bl", "br"] as const).map((pos) => (
          <div
            key={pos}
            aria-hidden
            className="absolute z-[4] h-3 w-3 transition-opacity duration-200"
            style={{
              top:    pos.startsWith("t") ? "8px" : "auto",
              bottom: pos.startsWith("b") ? "8px" : "auto",
              left:   pos.endsWith("l") ? "8px" : "auto",
              right:  pos.endsWith("r") ? "8px" : "auto",
              borderTop:    pos.startsWith("t") ? `2px solid ${artwork.accentColor}` : "none",
              borderBottom: pos.startsWith("b") ? `2px solid ${artwork.accentColor}` : "none",
              borderLeft:   pos.endsWith("l") ? `2px solid ${artwork.accentColor}` : "none",
              borderRight:  pos.endsWith("r") ? `2px solid ${artwork.accentColor}` : "none",
              opacity: isHovered ? 1 : 0,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// NOW PLAYING BAR
// Shows hovered artwork like a music track — unique to this portfolio
// Desktop only (no hover on touch devices)
// ─────────────────────────────────────────────────────────────────────────────

function NowPlayingBar({ artwork }: { artwork: Artwork | null }) {
  return (
    <AnimatePresence>
      {artwork && (
        <motion.div
          key={artwork.id}
          className="fixed bottom-0 left-0 right-0 z-[60] border-t backdrop-blur-xl"
          style={{ borderColor: `${artwork.accentColor}44`, backgroundColor: "#06060fee" }}
          initial={{ y: 70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 70, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex items-center gap-4 px-6 py-3 max-w-screen-xl mx-auto sm:px-10">
            {/* Thumbnail */}
            <div
              className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border-2 sm:h-11 sm:w-11"
              style={{ borderColor: artwork.accentColor, boxShadow: `0 0 10px ${artwork.accentColor}44` }}
            >
              <img src={artwork.src} alt="" aria-hidden loading="lazy" decoding="async"
                className="h-full w-full object-cover" />
            </div>
            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[8px] uppercase tracking-widest truncate sm:text-[9px]"
                style={{ color: artwork.accentColor }}>
                now viewing · {artwork.tag} · {artwork.year}
              </p>
              <p className="font-mono text-xs font-bold uppercase text-white truncate sm:text-sm">
                {artwork.title}
              </p>
              {artwork.caption && (
                <p className="font-mono text-[9px] text-white/30 italic truncate hidden sm:block">
                  "{artwork.caption}"
                </p>
              )}
            </div>
            {/* Mini visualizer */}
            <div className="flex items-end gap-[2px] h-5 flex-shrink-0">
              {[4, 7, 5, 10, 6, 9, 4].map((h, i) => (
                <motion.div key={i}
                  className="w-[2px] rounded-t-sm"
                  style={{ backgroundColor: artwork.accentColor, minHeight: "3px" }}
                  animate={{ height: [`${h}px`, `${h + 7}px`, `${h}px`] }}
                  transition={{ duration: 0.45 + i * 0.07, repeat: Infinity, delay: i * 0.04, ease: "easeInOut" }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LIGHTBOX — with keyboard arrow navigation between artworks
// ─────────────────────────────────────────────────────────────────────────────

interface LightboxProps {
  artwork: Artwork | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

function Lightbox({ artwork, onClose, onPrev, onNext, hasPrev, hasNext }: LightboxProps) {
  useEffect(() => {
    if (!artwork) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowLeft")  onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [artwork, onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {artwork && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal
          aria-label={artwork.title}
        >
          <div className="absolute inset-0 bg-black/93 backdrop-blur-2xl" />

          <motion.div
            className="relative z-10 max-h-[90vh] max-w-4xl w-full overflow-hidden"
            initial={{ scale: 0.88, y: 28, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              borderRadius: "16px",
              border: `3px solid ${artwork.accentColor}`,
              boxShadow: `0 0 64px ${artwork.accentColor}66, 0 16px 50px #00000099`,
            }}
          >
            {/* Accent strip */}
            <motion.div className="absolute top-0 left-0 right-0 h-[3px] z-10"
              style={{ backgroundColor: artwork.accentColor }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.8, repeat: Infinity }} />

            {/* Image */}
            <div className="bg-black/80 overflow-hidden">
              <img src={artwork.src} alt={artwork.title}
                className="max-h-[65vh] w-full object-contain"
                loading="lazy" decoding="async" />
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-between gap-3 px-5 py-4 sm:px-7"
              style={{ background: "linear-gradient(to bottom, #000000cc, #000)", borderTop: `2px solid ${artwork.accentColor}28` }}
            >
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] truncate"
                  style={{ color: artwork.accentColor }}>
                  [{artwork.tag}] · {artwork.year}
                </p>
                <h2 className="font-mono text-sm font-bold uppercase tracking-wide text-white sm:text-xl"
                  style={{ textShadow: `0 0 14px ${artwork.accentColor}` }}>
                  {artwork.title}
                </h2>
                {artwork.caption && (
                  <p className="font-mono text-[9px] text-white/35 italic mt-0.5 truncate hidden sm:block">
                    "{artwork.caption}"
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {hasPrev && (
                  <motion.button
                    onClick={(e) => { e.stopPropagation(); onPrev(); }}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border font-mono text-lg"
                    style={{ borderColor: `${artwork.accentColor}55`, color: artwork.accentColor }}
                    whileHover={{ borderColor: artwork.accentColor, scale: 1.06 }}
                    whileTap={{ scale: 0.92 }}
                    aria-label="Previous"
                  >‹</motion.button>
                )}
                {hasNext && (
                  <motion.button
                    onClick={(e) => { e.stopPropagation(); onNext(); }}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border font-mono text-lg"
                    style={{ borderColor: `${artwork.accentColor}55`, color: artwork.accentColor }}
                    whileHover={{ borderColor: artwork.accentColor, scale: 1.06 }}
                    whileTap={{ scale: 0.92 }}
                    aria-label="Next"
                  >›</motion.button>
                )}
                <motion.button
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border font-mono text-sm"
                  style={{ borderColor: artwork.accentColor, backgroundColor: `${artwork.accentColor}12`, color: artwork.accentColor }}
                  whileHover={{ rotate: 90, scale: 1.08, boxShadow: `0 0 16px ${artwork.accentColor}44` }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close"
                >✕</motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MASONRY GALLERY
// CSS columns — true masonry for real photos of varying heights.
// No JS layout calc. Responsive via inline style + class injection.
// ─────────────────────────────────────────────────────────────────────────────

interface GalleryProps {
  artworks: Artwork[];
  onCardClick: (a: Artwork) => void;
  onCardHover: (a: Artwork | null) => void;
}

function MasonryGallery({ artworks, onCardClick, onCardHover }: GalleryProps) {
  if (artworks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-28 text-center"
      >
        <span className="mb-3 text-4xl">🎮</span>
        <p className="font-mono text-sm text-white/40">no pieces here — try another filter</p>
      </motion.div>
    );
  }

  return (
    <>
      {/* Responsive column count via injected style — avoids Tailwind config dependency */}
      <style>{`
        .sb-masonry { column-count: 1; column-gap: 20px; }
        @media (min-width: 640px)  { .sb-masonry { column-count: 2; } }
        @media (min-width: 1024px) { .sb-masonry { column-count: 3; } }
      `}</style>
      <div className="sb-masonry w-full">
        {artworks.map((artwork, index) => (
          <div
            key={artwork.id}
            className="mb-5 break-inside-avoid"
            onMouseEnter={() => onCardHover(artwork)}
            onMouseLeave={() => onCardHover(null)}
          >
            <ArtworkCard artwork={artwork} index={index} onClick={onCardClick} />
          </div>
        ))}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HUD COUNTER
// ─────────────────────────────────────────────────────────────────────────────

function HUDCounter({ count, total }: { count: number; total: number }) {
  return (
    <motion.div
      className="relative z-10 mb-8 flex items-center gap-3"
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.15, duration: 0.5 }}
    >
      <motion.div
        className="h-2.5 w-2.5 flex-shrink-0 rounded-sm"
        style={{ backgroundColor: "#ff00ff", boxShadow: "0 0 8px #ff00ff" }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      />
      <span
        className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] flex-shrink-0 sm:text-xs"
        style={{ color: "#00ffff", textShadow: "0 0 8px #00ffff" }}
      >
        {String(count).padStart(2, "0")} / {String(total).padStart(2, "0")} ARTWORKS
      </span>
      <div className="h-[2px] flex-1 rounded-full"
        style={{ background: "linear-gradient(to right, #ff00ff, #00ffff, transparent)" }} />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE ROOT
// ─────────────────────────────────────────────────────────────────────────────

export default function SketchbookPage() {
  const isDesktop = useIsDesktop();

  const [activeTag,       setActiveTag]       = useState("all");
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [hoveredArtwork,  setHoveredArtwork]  = useState<Artwork | null>(null);

  const filtered = useMemo(
    () => activeTag === "all" ? ARTWORKS : ARTWORKS.filter((a) => a.tag === activeTag),
    [activeTag]
  );

  // Keyboard navigation in lightbox
  const currentIdx = selectedArtwork
    ? filtered.findIndex((a) => a.id === selectedArtwork.id)
    : -1;
  const handlePrev = useCallback(() => {
    if (currentIdx > 0) setSelectedArtwork(filtered[currentIdx - 1]);
  }, [currentIdx, filtered]);
  const handleNext = useCallback(() => {
    if (currentIdx < filtered.length - 1) setSelectedArtwork(filtered[currentIdx + 1]);
  }, [currentIdx, filtered]);

  // Inject + clean up global CSS
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "sb-globals";
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById("sb-globals");
      if (el && document.head.contains(el)) document.head.removeChild(el);
    };
  }, []);

  return (
    <div
      className="sb-root relative min-h-screen w-full overflow-x-hidden text-white"
      style={{ backgroundColor: "#06060f", fontFamily: "'Space Mono', 'Courier New', monospace" }}
    >
      {/* Ambient layers */}
      <AuroraBackground />
      <FloatingPixels />
      <FilmGrain />
      <VHSScanlines />

      {/* Desktop-only interactive overlays */}
      {isDesktop && <PencilCursor />}
      {isDesktop && <TracingBeam />}

      {/* Nav */}
      <BackButton />

      {/* Content */}
      <Hero />
      <TagFilter active={activeTag} onChange={setActiveTag} />

      <main className="relative z-10 px-5 pb-36 sm:px-8 lg:px-16">
        <HUDCounter count={filtered.length} total={ARTWORKS.length} />
        <MasonryGallery
          artworks={filtered}
          onCardClick={setSelectedArtwork}
          onCardHover={isDesktop ? setHoveredArtwork : () => {}}
        />
      </main>

      {/* Footer */}
      <motion.footer
        className="relative z-10 border-t px-5 py-8 sm:px-8 lg:px-16"
        style={{ borderColor: "#ff00ff22", background: "linear-gradient(to bottom, transparent, #06060f)" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-3">
            <motion.span
              className="font-mono text-[9px] uppercase tracking-[0.2em] sm:text-[10px]"
              style={{ color: "#00ffff", textShadow: "0 0 8px #00ffff" }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ⚡ Kreshant Kumar
            </motion.span>
            <span className="font-mono text-[10px] text-white/22">@kreshrts</span>
          </div>
          <span className="font-mono text-[9px] italic" style={{ color: "#ff00ff44" }}>
            pixel dreams · late night vibes · endless creativity
          </span>
        </div>
      </motion.footer>

      {/* Now Playing bar — desktop hover only */}
      {isDesktop && <NowPlayingBar artwork={hoveredArtwork} />}

      {/* Lightbox */}
      <Lightbox
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
        onPrev={handlePrev}
        onNext={handleNext}
        hasPrev={currentIdx > 0}
        hasNext={currentIdx < filtered.length - 1}
      />
    </div>
  );
}