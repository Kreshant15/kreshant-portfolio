import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────────────────────
// cn utility — inline so no import path issues
// ─────────────────────────────────────────────────────────────────────────────

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
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
  aspect: "portrait" | "landscape" | "square";
  accentColor: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// PLACEHOLDER DATA — replace src with real image paths
// ─────────────────────────────────────────────────────────────────────────────

const ARTWORKS: Artwork[] = [
  {
    id: 1,
    title: "Midnight Run",
    tag: "character",
    year: "2024",
    src: "https://placehold.co/600x900/1a1a2e/ff00ff?text=Midnight+Run",
    aspect: "portrait",
    accentColor: "#ff00ff",
  },
  {
    id: 2,
    title: "Neon City Dreams",
    tag: "environment",
    year: "2024",
    src: "https://placehold.co/800x500/1a1a2e/00ffff?text=Neon+City",
    aspect: "landscape",
    accentColor: "#00ffff",
  },
  {
    id: 3,
    title: "Pixel Heart",
    tag: "study",
    year: "2024",
    src: "https://placehold.co/600x600/1a1a2e/ff6b9d?text=Pixel+Heart",
    aspect: "square",
    accentColor: "#ff6b9d",
  },
  {
    id: 4,
    title: "Boss Battle",
    tag: "character",
    year: "2024",
    src: "https://placehold.co/600x900/1a1a2e/ffd93d?text=Boss+Battle",
    aspect: "portrait",
    accentColor: "#ffd93d",
  },
  {
    id: 5,
    title: "Synthwave Sunset",
    tag: "illustration",
    year: "2024",
    src: "https://placehold.co/800x500/1a1a2e/ff00ff?text=Synthwave",
    aspect: "landscape",
    accentColor: "#ff6ec7",
  },
  {
    id: 6,
    title: "Glitch Girl",
    tag: "study",
    year: "2024",
    src: "https://placehold.co/600x600/1a1a2e/00ffff?text=Glitch+Girl",
    aspect: "square",
    accentColor: "#00ffff",
  },
  {
    id: 7,
    title: "Arcade Nights",
    tag: "environment",
    year: "2023",
    src: "https://placehold.co/600x900/1a1a2e/7f00ff?text=Arcade",
    aspect: "portrait",
    accentColor: "#7f00ff",
  },
  {
    id: 8,
    title: "Lo-Fi Vibes",
    tag: "illustration",
    year: "2024",
    src: "https://placehold.co/800x500/1a1a2e/6bcf7f?text=Lo-Fi+Vibes",
    aspect: "landscape",
    accentColor: "#6bcf7f",
  },
  {
    id: 9,
    title: "Power Up!",
    tag: "character",
    year: "2024",
    src: "https://placehold.co/600x600/1a1a2e/ff9d00?text=Power+Up",
    aspect: "square",
    accentColor: "#ff9d00",
  },
];

const TAGS = ["all", "character", "illustration", "environment", "study"];

// ─────────────────────────────────────────────────────────────────────────────
// AURORA BACKGROUND — layered gradient orbs with depth
// Inspired by Aceternity's Aurora Background
// ─────────────────────────────────────────────────────────────────────────────

function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Base dark */}
      <div className="absolute inset-0" style={{ backgroundColor: "#06060f" }} />

      {/* Pixel grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(#ff00ff18 1px, transparent 1px), linear-gradient(90deg, #00ffff18 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Aurora orb 1 — magenta top-left */}
      <motion.div
        className="absolute -top-40 -left-40 h-[700px] w-[700px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,0,255,0.28) 0%, rgba(180,0,255,0.1) 40%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ x: [0, 80, 0], y: [0, 40, 0], scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Aurora orb 2 — cyan bottom-right */}
      <motion.div
        className="absolute -bottom-40 -right-40 h-[800px] w-[800px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0,255,255,0.22) 0%, rgba(0,180,255,0.08) 40%, transparent 70%)",
          filter: "blur(70px)",
        }}
        animate={{ x: [0, -60, 0], y: [0, -50, 0], scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Aurora orb 3 — pink center-right */}
      <motion.div
        className="absolute top-1/3 right-1/4 h-[500px] w-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,105,180,0.18) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />

      {/* Aurora orb 4 — yellow accent */}
      <motion.div
        className="absolute top-3/4 left-1/3 h-[350px] w-[350px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,217,61,0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ x: [0, 40, 0], scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VHS SCANLINES — subtle retro texture
// ─────────────────────────────────────────────────────────────────────────────

function VHSScanlines() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-[100] opacity-[0.025]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, #00ffff 2px, #00ffff 4px)",
        }}
      />
      {/* Occasional horizontal glitch */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-[100] opacity-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent 1px, #ff00ff 1px, #ff00ff 2px)",
        }}
        animate={{ opacity: [0, 0, 0, 0.04, 0, 0.02, 0, 0] }}
        transition={{ duration: 5, repeat: Infinity, repeatDelay: 7 }}
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FILM GRAIN
// ─────────────────────────────────────────────────────────────────────────────

function FilmGrain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[99] opacity-[0.04]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: "180px 180px",
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FLOATING PIXELS — ambient particle drift
// ─────────────────────────────────────────────────────────────────────────────

function FloatingPixels() {
  // Generate stable pixel data once (avoid re-randomizing on render)
  const pixels = useRef(
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: (i * 37 + 11) % 100,
      y: (i * 53 + 7) % 100,
      size: (i % 4) + 2,
      duration: 18 + (i % 10),
      delay: (i * 0.7) % 6,
      color:
        i % 3 === 0 ? "#ff00ff" : i % 3 === 1 ? "#00ffff" : "#ffd93d",
    }))
  ).current;

  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
      {pixels.map((p) => (
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
          animate={{
            y: [0, -120, 0],
            x: [0, (p.id % 2 === 0 ? 1 : -1) * 30, 0],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SPOTLIGHT CURSOR — dual ring with glow trail
// Inspired by Aceternity's Spotlight component
// ─────────────────────────────────────────────────────────────────────────────

function SpotlightCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${e.clientX - 24}px, ${e.clientY - 24}px)`;
      }
      rafRef.current = null;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove]);

  return (
    <>
      {/* Outer glow trail */}
      <div
        ref={trailRef}
        className="pointer-events-none fixed top-0 left-0 z-[200] h-12 w-12 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,0,255,0.35) 0%, rgba(0,255,255,0.15) 50%, transparent 70%)",
          filter: "blur(10px)",
          transition: "transform 0.12s ease-out",
          willChange: "transform",
        }}
      />
      {/* Sharp inner dot */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[201] h-5 w-5 rounded-full"
        style={{
          background: "radial-gradient(circle, #ff00ff 0%, #00ffff 100%)",
          boxShadow: "0 0 14px #ff00ff, 0 0 28px #00ffff44",
          transition: "transform 0.04s linear",
          willChange: "transform",
        }}
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL TRACING BEAM — left-edge progress indicator
// Inspired by Aceternity's Tracing Beam
// ─────────────────────────────────────────────────────────────────────────────

function TracingBeam() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div className="pointer-events-none fixed left-4 top-1/4 z-40 hidden h-1/2 w-[2px] lg:block">
      {/* Track */}
      <div className="h-full w-full rounded-full bg-white/5" />
      {/* Beam */}
      <motion.div
        className="absolute top-0 left-0 w-full origin-top rounded-full"
        style={{
          scaleY,
          height: "100%",
          background: "linear-gradient(to bottom, #ff00ff, #00ffff)",
          boxShadow: "0 0 8px #ff00ff, 0 0 16px #00ffff44",
        }}
      />
      {/* Dot at beam tip */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 h-2 w-2 rounded-full"
        style={{
          top: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
          backgroundColor: "#ff00ff",
          boxShadow: "0 0 8px #ff00ff",
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BACK BUTTON — animated, pixel-style
// ─────────────────────────────────────────────────────────────────────────────

function BackButton() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="fixed top-6 left-6 z-40"
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <motion.button
        onClick={() => navigate("/")}
        className="group flex items-center gap-2 rounded-lg border-2 px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest backdrop-blur-md"
        style={{
          borderColor: "#ff00ff55",
          backgroundColor: "#ff00ff0a",
          color: "#ff00ffbb",
        }}
        whileHover={{
          scale: 1.05,
          borderColor: "#ff00ff",
          backgroundColor: "#ff00ff18",
          boxShadow: "0 0 20px #ff00ff66",
          color: "#ff00ff",
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {/* Animated arrow */}
        <motion.svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          animate={{ x: [0, -3, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M8 2L3 6L8 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
        Back
        {/* Moving border effect */}
        <motion.span
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(90deg, transparent, #ff00ff22, transparent) no-repeat",
            backgroundSize: "200% 100%",
          }}
          animate={{ backgroundPosition: ["-100% 0", "200% 0"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </motion.button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MUSIC VISUALIZER — animated frequency bars
// ─────────────────────────────────────────────────────────────────────────────

function MusicVisualizer() {
  const barColors = ["#ff00ff", "#00ffff", "#ffd93d", "#ff6ec7"];

  return (
    <motion.div
      className="flex items-end gap-[2px] h-14"
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
      transition={{ duration: 0.7, delay: 1.3, ease: "backOut" }}
    >
      {Array.from({ length: 32 }, (_, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-t-sm"
          style={{
            background: `linear-gradient(to top, ${barColors[i % 4]}, transparent)`,
            minHeight: "6px",
          }}
          animate={{
            height: [
              `${8 + (i * 7) % 24}px`,
              `${20 + (i * 11) % 40}px`,
              `${8 + (i * 7) % 24}px`,
            ],
          }}
          transition={{
            duration: 0.6 + (i % 5) * 0.1,
            repeat: Infinity,
            delay: i * 0.025,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PIXEL BADGES — sticker decorations in the hero
// ─────────────────────────────────────────────────────────────────────────────

function PixelBadges() {
  const badges = [
    { emoji: "🎮", label: "GAMER", color: "#ff00ff", rotation: -5 },
    { emoji: "🎵", label: "MUSIC", color: "#00ffff", rotation: 3 },
    { emoji: "⚡", label: "VIBES", color: "#ffd93d", rotation: -2 },
  ];

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {badges.map((badge, i) => (
        <motion.div
          key={i}
          className="relative flex items-center gap-2 rounded-lg border-2 px-3 py-1.5 font-mono text-xs font-bold uppercase"
          style={{
            borderColor: badge.color,
            backgroundColor: `${badge.color}15`,
            color: badge.color,
            rotate: badge.rotation,
            boxShadow: `0 0 12px ${badge.color}33`,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 + i * 0.1, type: "spring" }}
          whileHover={{
            scale: 1.12,
            rotate: badge.rotation + 5,
            boxShadow: `0 0 25px ${badge.color}88`,
          }}
        >
          <span className="text-base">{badge.emoji}</span>
          {badge.label}
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO SECTION — glitch title, badges, visualizer
// ─────────────────────────────────────────────────────────────────────────────

function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 80]);
  const opacity = useTransform(scrollY, [0, 250], [1, 0.2]);

  return (
    <motion.section
      className="relative z-10 flex min-h-[72vh] flex-col items-center justify-center px-6 pt-32 pb-12 text-center"
      style={{ y, opacity }}
    >
      {/* Eyebrow — pixel text decoration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-6 flex items-center gap-3"
      >
        <motion.span
          className="block h-[2px] w-12"
          style={{
            background: "linear-gradient(to right, transparent, #ff00ff)",
          }}
          animate={{ scaleX: [1, 1.3, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        <span
          className="font-mono text-xs tracking-[0.3em] uppercase select-none"
          style={{
            color: "#00ffff",
            textShadow: "0 0 12px #00ffff, 2px 2px 0 #ff00ff44",
          }}
        >
          ░▒▓ SKETCHBOOK ▓▒░
        </span>
        <motion.span
          className="block h-[2px] w-12"
          style={{
            background: "linear-gradient(to left, transparent, #00ffff)",
          }}
          animate={{ scaleX: [1, 1.3, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 1.25 }}
        />
      </motion.div>

      {/* Main title with glitch layers */}
      <div className="relative mb-4">
        {/* DOODLE */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative font-black uppercase leading-none tracking-tighter"
          style={{
            fontFamily: "'Press Start 2P', 'Courier New', monospace",
            fontSize: "clamp(2.4rem, 9vw, 6.5rem)",
            color: "#fff",
            textShadow: "0 0 40px #ff00ff, 0 0 80px #00ffff44",
          }}
        >
          <span className="relative inline-block">
            DOODLE
            {/* Glitch layer magenta */}
            <motion.span
              className="absolute inset-0 select-none"
              style={{ color: "#ff00ff", opacity: 0.65 }}
              animate={{ x: [-2, 2, -2, 0], y: [0, 1, 0] }}
              transition={{ duration: 0.25, repeat: Infinity, repeatDelay: 5 }}
            >
              DOODLE
            </motion.span>
            {/* Glitch layer cyan */}
            <motion.span
              className="absolute inset-0 select-none"
              style={{ color: "#00ffff", opacity: 0.65 }}
              animate={{ x: [2, -2, 2, 0], y: [1, 0, 1] }}
              transition={{ duration: 0.25, repeat: Infinity, repeatDelay: 5, delay: 0.12 }}
            >
              DOODLE
            </motion.span>
          </span>
        </motion.h1>

        {/* ARCHIVE — gradient animated */}
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-1 font-black uppercase leading-none tracking-tighter"
          style={{
            fontFamily: "'Press Start 2P', 'Courier New', monospace",
            fontSize: "clamp(1.4rem, 5.5vw, 3.8rem)",
            background: "linear-gradient(90deg, #ff00ff, #00ffff, #ffd93d, #ff6ec7, #ff00ff)",
            backgroundSize: "300% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "sketchbook-gradient 5s ease infinite",
          }}
        >
          ARCHIVE
        </motion.h2>
      </div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="mb-8 max-w-md font-mono text-sm leading-relaxed"
        style={{ color: "#ffffff88", textShadow: "0 0 10px rgba(255,0,255,0.2)" }}
      >
        late night sketches ✦ anime feels ✦ pixel dreams
        <br />
        <span style={{ color: "#00ffff", textShadow: "0 0 10px #00ffff55" }}>
          where art meets arcade
        </span>
      </motion.p>

      {/* Pixel sticker badges */}
      <PixelBadges />

      {/* Music visualizer */}
      <div className="mt-10">
        <MusicVisualizer />
      </div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAG FILTER PILLS — with animated active indicator
// ─────────────────────────────────────────────────────────────────────────────

interface TagFilterProps {
  active: string;
  onChange: (tag: string) => void;
}

function TagFilter({ active, onChange }: TagFilterProps) {
  const tagColors = ["#ff00ff", "#00ffff", "#ffd93d", "#ff6ec7", "#6bcf7f"];

  return (
    <motion.div
      className="relative z-10 flex flex-wrap justify-center gap-3 px-6 pb-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.1 }}
    >
      {TAGS.map((tag, i) => {
        const color = tagColors[i % tagColors.length];
        const isActive = active === tag;

        return (
          <motion.button
            key={tag}
            onClick={() => onChange(tag)}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="relative rounded-lg border-2 px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-colors duration-200"
            style={{
              borderColor: isActive ? color : "#ffffff1a",
              backgroundColor: isActive ? `${color}22` : "#ffffff06",
              color: isActive ? color : "#ffffff55",
              boxShadow: isActive ? `0 0 20px ${color}55, 0 4px 15px ${color}22` : "none",
              textShadow: isActive ? `0 0 10px ${color}` : "none",
            }}
          >
            {/* Shared layout-id for the active highlight */}
            {isActive && (
              <motion.div
                layoutId="activeTagHighlight"
                className="absolute inset-0 rounded-lg"
                style={{
                  border: `2px solid ${color}`,
                  boxShadow: `inset 0 0 16px ${color}22`,
                }}
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
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
// ARTWORK CARD — 3D tilt, holographic shimmer, scanline sweep
// Combines Aceternity's 3D Card + Card Spotlight patterns
// ─────────────────────────────────────────────────────────────────────────────

interface ArtworkCardProps {
  artwork: Artwork;
  index: number;
  onClick: (artwork: Artwork) => void;
}

function ArtworkCard({ artwork, index, onClick }: ArtworkCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
    // 3D tilt: max ±12deg
    setTilt({ x: (y - 0.5) * -12, y: (x - 0.5) * 12 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setMousePos({ x: 0.5, y: 0.5 });
  };

  const delay = (index % 9) * 0.055;

  return (
    <motion.div
  ref={cardRef}
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-50px" }}
  className={cn(
    "group relative cursor-pointer overflow-hidden",
    artwork.aspect === "portrait" && "row-span-2",
    artwork.aspect === "landscape" && "col-span-2"
  )}
  onClick={() => onClick(artwork)}
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={handleMouseLeave}
  onMouseMove={handleMouseMove}
  animate={{
    scale: isHovered ? 1.03 : 1,
    rotateX: tilt.x,
    rotateY: tilt.y,
    zIndex: isHovered ? 20 : 1,
  }}
  transition={{
    // entry animation
    opacity: { duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] },
    y: { duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] },

    // hover physics
    scale: { type: "spring", stiffness: 300, damping: 25 },
    rotateX: { type: "spring", stiffness: 300, damping: 25 },
    rotateY: { type: "spring", stiffness: 300, damping: 25 },
  }}
  style={{
    borderRadius: "16px",
    border: `3px solid ${isHovered ? artwork.accentColor : "#ffffff0e"}`,
    boxShadow: isHovered
      ? `0 0 50px ${artwork.accentColor}55, 0 12px 40px ${artwork.accentColor}22, inset 0 0 60px ${artwork.accentColor}11`
      : "0 4px 24px #00000066",
    transformStyle: "preserve-3d",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
    perspective: "800px",
  }}
>
      {/* Holographic shimmer — follows mouse position */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay"
          style={{
            background: `radial-gradient(ellipse at ${mousePos.x * 100}% ${mousePos.y * 100}%, #ff00ff55, #00ffff33, transparent 70%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* Image */}
      <motion.img
        src={artwork.src}
        alt={artwork.title}
        className="h-full w-full object-cover"
        style={{
          minHeight: artwork.aspect === "landscape" ? "240px" : "320px",
        }}
        animate={{
          scale: isHovered ? 1.1 : 1,
          filter: isHovered
            ? "saturate(1.4) brightness(1.05)"
            : "saturate(0.9) brightness(0.95)",
        }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Scanline sweep on hover */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 z-[2] pointer-events-none opacity-[0.12]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, #00ffff 3px, #00ffff 6px)",
          }}
          initial={{ y: "-100%" }}
          animate={{ y: "100%" }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Gradient overlay for readability */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none transition-opacity duration-300"
        style={{
          background: `linear-gradient(to top, ${artwork.accentColor}cc 0%, ${artwork.accentColor}44 30%, transparent 60%)`,
          opacity: isHovered ? 1 : 0.5,
        }}
      />

      {/* Info — slides up on hover */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-[4] p-4"
        animate={{ y: isHovered ? 0 : 16, opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.28 }}
      >
        <div className="flex items-end justify-between">
          <div>
            <p
              className="mb-1 font-mono text-[9px] uppercase tracking-widest"
              style={{
                color: artwork.accentColor,
                textShadow: `0 0 8px ${artwork.accentColor}`,
              }}
            >
              [{artwork.tag}]
            </p>
            <h3
              className="font-mono text-sm font-bold uppercase leading-tight tracking-wide text-white"
              style={{ textShadow: `0 0 12px ${artwork.accentColor}, 0 2px 4px #000` }}
            >
              {artwork.title}
            </h3>
          </div>
          <span
            className="font-mono text-xs font-bold"
            style={{
              color: artwork.accentColor,
              textShadow: `0 0 8px ${artwork.accentColor}`,
            }}
          >
            {artwork.year}
          </span>
        </div>
      </motion.div>

      {/* Corner brackets — game UI target reticle */}
      {(["top-2 left-2 border-l-2 border-t-2", "top-2 right-2 border-r-2 border-t-2",
        "bottom-2 left-2 border-l-2 border-b-2", "bottom-2 right-2 border-r-2 border-b-2"] as const
      ).map((pos, i) => (
        <div
          key={i}
          className={cn(
            "absolute z-[4] h-3 w-3 transition-opacity duration-200",
            pos,
            isHovered ? "opacity-100" : "opacity-0"
          )}
          style={{ borderColor: artwork.accentColor }}
        />
      ))}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LIGHTBOX MODAL
// ─────────────────────────────────────────────────────────────────────────────

interface LightboxProps {
  artwork: Artwork | null;
  onClose: () => void;
}

function Lightbox({ artwork, onClose }: LightboxProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {artwork && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/92 backdrop-blur-2xl" />

          {/* Modal */}
          <motion.div
            className="relative z-10 max-h-[92vh] max-w-5xl overflow-hidden"
            initial={{ scale: 0.85, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              borderRadius: "20px",
              border: `3px solid ${artwork.accentColor}`,
              boxShadow: `0 0 80px ${artwork.accentColor}88, 0 20px 60px ${artwork.accentColor}44, inset 0 0 60px ${artwork.accentColor}11`,
            }}
          >
            {/* Animated top + bottom accent strips */}
            <motion.div
              className="absolute top-0 left-0 right-0 z-10 h-[3px]"
              style={{ backgroundColor: artwork.accentColor }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-0 left-0 right-0 z-10 h-[3px]"
              style={{ backgroundColor: artwork.accentColor }}
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />

            {/* Image */}
            <div className="relative overflow-hidden bg-black/80">
              <img
                src={artwork.src}
                alt={artwork.title}
                className="max-h-[76vh] w-full object-contain"
              />
            </div>

            {/* Footer info */}
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{
                background: "linear-gradient(to bottom, #000000cc, #000000)",
                borderTop: `2px solid ${artwork.accentColor}33`,
              }}
            >
              <div>
                <p
                  className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em]"
                  style={{
                    color: artwork.accentColor,
                    textShadow: `0 0 10px ${artwork.accentColor}`,
                  }}
                >
                  [{artwork.tag}] • {artwork.year}
                </p>
                <h2
                  className="font-mono text-xl font-bold uppercase tracking-wide text-white"
                  style={{ textShadow: `0 0 20px ${artwork.accentColor}` }}
                >
                  {artwork.title}
                </h2>
              </div>

              <motion.button
                onClick={onClose}
                className="flex h-12 w-12 items-center justify-center rounded-lg border-2 font-mono text-base font-bold transition-all"
                style={{
                  borderColor: artwork.accentColor,
                  backgroundColor: `${artwork.accentColor}15`,
                  color: artwork.accentColor,
                }}
                whileHover={{
                  scale: 1.1,
                  rotate: 90,
                  backgroundColor: `${artwork.accentColor}30`,
                  boxShadow: `0 0 24px ${artwork.accentColor}66`,
                }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GALLERY GRID
// ─────────────────────────────────────────────────────────────────────────────

interface GalleryGridProps {
  artworks: Artwork[];
  onCardClick: (artwork: Artwork) => void;
}

function GalleryGrid({ artworks, onCardClick }: GalleryGridProps) {
  return (
    <div
      className="grid auto-rows-[240px] gap-5"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
    >
      <AnimatePresence mode="popLayout">
        {artworks.map((artwork, index) => (
          <ArtworkCard
            key={artwork.id}
            artwork={artwork}
            index={index}
            onClick={onCardClick}
          />
        ))}
      </AnimatePresence>

      {artworks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="col-span-full flex flex-col items-center justify-center py-32 text-center"
        >
          <span className="mb-3 text-4xl">🎮</span>
          <p className="font-mono text-sm text-white/40">
            no pieces found — try another filter
          </p>
        </motion.div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HUD COUNTER — game UI piece count
// ─────────────────────────────────────────────────────────────────────────────

function HUDCounter({ count, total }: { count: number; total: number }) {
  return (
    <motion.div
      className="relative z-10 mb-10 flex items-center gap-4 px-0"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.3, duration: 0.6 }}
    >
      <motion.div
        className="h-3 w-3 rounded-sm flex-shrink-0"
        style={{ backgroundColor: "#ff00ff", boxShadow: "0 0 10px #ff00ff" }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      />
      <span
        className="font-mono text-xs font-bold uppercase tracking-[0.25em] shrink-0"
        style={{ color: "#00ffff", textShadow: "0 0 10px #00ffff" }}
      >
        {String(count).padStart(2, "0")} / {String(total).padStart(2, "0")} ARTWORKS
      </span>
      <div
        className="h-0.5 flex-1 rounded-full"
        style={{ background: "linear-gradient(to right, #ff00ff, #00ffff, transparent)" }}
      />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function SketchbookPage() {
  const [activeTag, setActiveTag] = useState("all");
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  // Inject Google Fonts + global styles
  // — cleans up on unmount so cursor: none doesn't bleed into other pages
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Space+Mono:wght@400;700&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.id = "sketchbook-globals";
    style.textContent = `
      .sketchbook-root * { cursor: none !important; }
      html { scrollbar-width: thin; scrollbar-color: #ff00ff #06060f; }

      @keyframes sketchbook-gradient {
        0%   { background-position: 0% 50%; }
        50%  { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      ::selection { background: #ff00ff; color: #fff; }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
      const el = document.getElementById("sketchbook-globals");
      if (el && document.head.contains(el)) document.head.removeChild(el);
    };
  }, []);

  const filteredArtworks =
    activeTag === "all" ? ARTWORKS : ARTWORKS.filter((a) => a.tag === activeTag);

  return (
    <div
      className="sketchbook-root relative min-h-screen w-full overflow-x-hidden text-white"
      style={{
        backgroundColor: "#06060f",
        fontFamily: "'Space Mono', 'Courier New', monospace",
      }}
    >
      {/* ── Ambient layers ── */}
      <AuroraBackground />
      <FloatingPixels />
      <FilmGrain />
      <VHSScanlines />

      {/* ── Interactive overlays ── */}
      <SpotlightCursor />
      <TracingBeam />

      {/* ── Navigation ── */}
      <BackButton />

      {/* ── Content ── */}
      <Hero />
      <TagFilter active={activeTag} onChange={setActiveTag} />

      <main className="relative z-10 px-6 pb-40 lg:px-20">
        <HUDCounter count={filteredArtworks.length} total={ARTWORKS.length} />
        <GalleryGrid artworks={filteredArtworks} onCardClick={setSelectedArtwork} />
      </main>

      {/* ── Footer ── */}
      <motion.footer
        className="relative z-10 border-t-2 px-6 py-10 lg:px-20"
        style={{
          borderColor: "#ff00ff33",
          background: "linear-gradient(to bottom, transparent, #06060f)",
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <motion.span
              className="font-mono text-xs uppercase tracking-[0.2em]"
              style={{ color: "#00ffff", textShadow: "0 0 10px #00ffff" }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ⚡ KRESHANT KUMAR
            </motion.span>
            <span className="font-mono text-xs text-white/30">@kreshrts</span>
          </div>
          <span
            className="font-mono text-xs italic"
            style={{ color: "#ff00ff66", textShadow: "0 0 8px #ff00ff44" }}
          >
            pixel dreams • late night vibes • endless creativity
          </span>
        </div>
      </motion.footer>

      {/* ── Lightbox ── */}
      <Lightbox
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
      />
    </div>
  );
}