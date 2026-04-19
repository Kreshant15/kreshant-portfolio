import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

// ─── Pixel Era Brand Tokens ────────────────────────────────
const PE = {
  bg:       "#0a0010",   // deep void purple-black
  bgMid:    "#12001f",
  magenta:  "#ff00ff",
  cyan:     "#00ffff",
  violet:   "#9b59ff",
  pink:     "#ff2d78",
  white:    "#f0e6ff",
  muted:    "#7a6899",
  grid:     "#2a0045",
};

// ─── Case Study Data ───────────────────────────────────────
const caseStudy = {
  title: "Pixel Era",
  subtitle: "A Digital Archaeology of the Screen",
  tagline: "When the internet bleeds, it bleeds in pixels.",
  category: "Poster Series",
  date: "2024–2025",
  client: "Personal Series",
  tags: ["Vaporwave", "Glitch Art", "Digital Culture", "Poster Design", "Experimental"],

  overview: `Pixel Era is a poster series that treats the screen as a crime scene — fragments of digital culture, corrupted memories, and technological nostalgia scattered across each composition.

The series explores what happens when the internet breaks down. When the loading bar freezes. When reality gets flagged as 404. Each poster is a different failure mode of the digital world — not a bug report, but a eulogy.`,

  sections: [
    {
      title: "The Concept",
      content: `We live inside screens now. The question Pixel Era asks is: what does it look like when that world starts to glitch?

The series draws from vaporwave's nostalgia, glitch art's controlled chaos, and the visual language of early internet culture — pixel fonts, scan lines, corrupted JPEGs, Windows error dialogs. But it doesn't romanticize them. It autopsies them.

Each poster in the series is named like a diagnosis: Pixel Reborn, Data Breach, Buffering Reality, Digital Skin. Together they map the full emotional spectrum of living in a world mediated by screens.`,
      images: [
        "/images/projects/pixel/Pixel-Reborn.webp",
        "/images/projects/pixel/Digital-Skin.webp",
      ],
    },
    {
      title: "Visual Language",
      content: `The series operates with a tight but flexible visual grammar. Every poster shares the same underlying logic — chromatic aberration, displaced scan lines, corrupted typography — but breaks it in a different direction.

Color is used deliberately: cyan and magenta as the two channels that split when a signal fails. Deep violet backgrounds that feel like staring into a monitor in a dark room. Pink and white for the human element pushing through the static.

Typography across the series mixes pixel fonts with distorted sans-serifs — the tension between the grid and the glitch.`,
      images: [
        "/images/projects/pixel/Missing-Link.webp",
        "/images/projects/pixel/Lo-Fi-Utopia.webp",
      ],
    },
    {
      title: "Key Pieces",
      content: `Pixel Drift — The first piece in the series. A city seen through a corrupted lens, culture bleeding into each other across a broken signal. Mickey Mouse in a lo-fi landscape: pop culture as digital ghost.

Missing Link — The most typographically dense piece. The word "MISSING LINK" repeated until it becomes noise itself. A face beneath the static, only partially visible. About information overload and what gets lost in it.

404: Reality Not Found — The series centerpiece. A classical statue in a vaporwave landscape — ancient marble in a synthetic world. The most direct statement: reality itself has returned a 404.

Buffering Reality — Shot on a dirt road, a motocross rider frozen mid-race. The "LOADING" indicator sits in the corner. The physical world rendered as a stream that can't keep up.

Data Breach — A figure dissolving into pixel blocks. The most personal piece in the series — about digital identity, surveillance, and what it means to exist as data.`,
      images: [
        "/images/projects/pixel/Pixel-Drift.webp",
        "/images/projects/pixel/Buffering-Reality.webp",
        "/images/projects/pixel/Theft-Data-Breach.webp",
      ],
    },
    {
      title: "Process & Execution",
      content: `Each poster begins with a concept word — one idea that needs to be felt visually. From there: source imagery, chromatic split, scan line texture, typographic disruption.

The glitch effects are mostly practical — channel separation in Photoshop, displaced layers, noise filters run multiple times until the corruption feels earned rather than decorative. The goal is always controlled chaos: it should look broken, but nothing should feel accidental.

Pixelation is used sparingly — only when it means something. In Data Breach, the pixellation is the point. In The Cloud, it's the texture of uncertainty itself.`,
      images: [
        "/images/projects/pixel/The-Cloud.webp",
        "/images/projects/pixel/Pixelation.webp",
      ],
    },
    {
      title: "Conclusion",
      content: `Pixel Era is ongoing. The series doesn't have an endpoint because digital culture doesn't either — it just keeps breaking in new ways, producing new glitches, new failures, new aesthetics from the wreckage.

What started as a visual experiment became a language. A way to talk about technology, nostalgia, and the strangeness of existing in a world that was designed for efficiency but keeps producing beauty in its errors.

The next pieces are already forming. The signal isn't done breaking yet.`,
      images: [],
    },
  ],

  posters: [
    { src: "/images/projects/pixel/Pixel-Reborn.webp", name: "Pixel Reborn" },
    { src: "/images/projects/pixel/The-Cloud.webp", name: "The Cloud" },
    { src: "/images/projects/pixel/Digital-Skin.webp", name: "Digital Skin" },
    { src: "/images/projects/pixel/Pixel-Drift.webp", name: "Pixel Drift" },
    { src: "/images/projects/pixel/Missing-Link.webp", name: "Missing Link" },
    { src: "/images/projects/pixel/Lo-Fi-Utopia.webp", name: "Lo-Fi Utopia" },
    { src: "/images/projects/pixel/Buffering-Reality.webp", name: "Buffering Reality" },
    { src: "/images/projects/pixel/Theft-Data-Breach.webp", name: "Data Breach" },
    { src: "/images/projects/pixel/Pixelation.webp", name: "Pixelation" },
  ],
};

// ─── Scan line overlay ─────────────────────────────────────
const ScanLines = () => (
  <div
    className="pointer-events-none fixed inset-0 z-30"
    style={{
      backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 4px)`,
      mixBlendMode: "screen",
      opacity: 0.2,
    }}
  />
);

// ─── Glitch text effect ────────────────────────────────────
const GlitchText = ({ text, color = PE.white }: { text: string; color?: string }) => {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 150);
    }, 3000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="relative inline-block" style={{ color }}>
      {text}
      <AnimatePresence>
        {glitching && (
          <>
            <motion.span
              className="absolute inset-0 pointer-events-none"
              style={{ color: PE.cyan, mixBlendMode: "screen", clipPath: "polygon(0 20%, 100% 20%, 100% 40%, 0 40%)" }}
              animate={{ x: [0, -4, 2, 0] }}
              transition={{ duration: 0.15 }}
            >
              {text}
            </motion.span>
            <motion.span
              className="absolute inset-0 pointer-events-none"
              style={{ color: PE.magenta, mixBlendMode: "screen", clipPath: "polygon(0 60%, 100% 60%, 100% 75%, 0 75%)" }}
              animate={{ x: [0, 3, -2, 0] }}
              transition={{ duration: 0.15 }}
            >
              {text}
            </motion.span>
          </>
        )}
      </AnimatePresence>
    </span>
  );
};

// ─── Section label ─────────────────────────────────────────
const PixelLabel = ({ num, label }: { num: string; label: string }) => (
  <div className="flex items-center gap-3 mb-6">
    <span
      className="text-[10px] tracking-[0.3em] uppercase px-2 py-0.5 font-mono"
      style={{ background: PE.magenta + "20", color: PE.magenta, border: `1px solid ${PE.magenta}40` }}
    >
      {num}
    </span>
    <span className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: PE.muted }}>
      {label}
    </span>
    <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${PE.magenta}40, transparent)` }} />
  </div>
);

// ─── Poster card ───────────────────────────────────────────
const PosterCard = ({ src, name, index }: { src: string; name: string; index: number }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative overflow-hidden cursor-pointer"
      style={{ aspectRatio: "2/3" }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.03 }}
    >
      {/* RGB split on hover */}
      {hovered && (
        <>
          <motion.div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{ backgroundImage: `url(${src})`, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center", mixBlendMode: "screen", opacity: 0.5 }}
            animate={{ x: [-3, 3, -3] }}
            transition={{ duration: 0.2, repeat: 2 }}
            onAnimationComplete={() => {}}
          />
        </>
      )}
      <img
        src={src}
        alt={name}
        className="w-full h-full object-contain bg-[#12001f]"
        loading="lazy"
      />
      <motion.div
        className="absolute inset-0 flex items-end p-3"
        style={{ background: "linear-gradient(to top, rgba(10,0,16,0.9) 0%, transparent 50%)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: PE.cyan }}>
          {name}
        </span>
      </motion.div>
      {/* Corner pixel */}
      <div className="absolute top-2 right-2 w-2 h-2" style={{ background: PE.magenta }} />
    </motion.div>
  );
};

// ─── Image grid ────────────────────────────────────────────
const PixelGrid = ({ images, title }: { images: string[]; title: string }) => {
  if (!images.length) return null;
  const single = images.length === 1;
  const triple = images.length === 3;

  return (
    <div className={`grid gap-3 mt-10 ${single ? "grid-cols-1" : triple ? "grid-cols-3" : "grid-cols-2"}`}>
      {images.map((src, i) => (
        <motion.div
          key={i}
          className="relative overflow-hidden bg-[#12001f] p-2"
          style={{
            aspectRatio: single ? "16/9" : "3/4",
            border: `1px solid ${PE.magenta}30`,
            boxShadow: `0 0 20px ${PE.magenta}15, inset 0 0 20px rgba(0,0,0,0.5)`,
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          whileHover={{ scale: 1.02 }}
        >
          <img src={src} alt={`${title} ${i + 1}`} className="w-full h-full object-contain" loading="lazy" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,0,16,0.4) 0%, transparent 60%)" }} />
          {/* Scan line accent */}
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, ${PE.cyan}60, transparent)` }} />
        </motion.div>
      ))}
    </div>
  );
};

// ─── MAIN ──────────────────────────────────────────────────
export const PixelEraProject = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Pixel Era — Poster Series | Kreshant Kumar";
  }, []);

  return (
    <main style={{ background: PE.bg, color: PE.white }} className="relative min-h-screen">
      <ScanLines />

      {/* ── CRT vignette ──────────────────────────────────── */}
      <div
        className="pointer-events-none fixed inset-0 z-20"
        style={{
          background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* ── Grid bg ───────────────────────────────────────── */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(${PE.magenta} 1px, transparent 1px),
            linear-gradient(90deg, ${PE.magenta} 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <div ref={heroRef} className="relative flex items-center justify-center overflow-hidden" style={{ height: "100dvh" }}>
        {/* Hero BG — featured poster blurred */}
        <motion.div className="absolute inset-0" style={{ y: heroY, opacity: heroOpacity }}>
          <img
            src="/images/projects/pixel/cover.webp"
            alt="Pixel Era"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, ${PE.bg}AA 0%, ${PE.bg}60 30%, ${PE.bg}CC 70%, ${PE.bg} 100%)`,
            }}
          />
        </motion.div>

        {/* Chromatic orbs */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: PE.magenta, filter: "blur(150px)", opacity: 0.08 }} />
        <div className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: PE.cyan, filter: "blur(130px)", opacity: 0.07 }} />

        {/* Hero text */}
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-mono text-[10px] tracking-[0.5em] uppercase mb-6" style={{ color: PE.magenta }}>
              POSTER SERIES · 2024–2025
            </p>

            <h1
              className="text-[clamp(4.5rem,15vw,12rem)] font-black leading-none tracking-tight mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <GlitchText text="PIXEL" color={PE.white} />
              <br />
              <GlitchText text="ERA" color={PE.violet} />
            </h1>

            <p className="font-mono text-sm max-w-sm mx-auto mt-6" style={{ color: PE.muted }}>
              {caseStudy.tagline}
            </p>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-[0.5em] uppercase"
          style={{ color: PE.muted }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          SCROLL_
        </motion.div>
      </div>

      {/* ── BODY ─────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-24">

        {/* Back */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase mb-20 opacity-40 hover:opacity-100 transition-opacity"
          style={{ color: PE.cyan }}
        >
          <ArrowLeft className="w-3 h-3" /> ALL PROJECTS
        </Link>

        {/* Meta strip */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-px mb-24"
          style={{ background: `${PE.magenta}20` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {[
            { label: "TYPE", value: caseStudy.category },
            { label: "CLIENT", value: caseStudy.client },
            { label: "YEAR", value: caseStudy.date },
            { label: "MEDIUM", value: "Digital Posters" },
          ].map(({ label, value }) => (
            <div key={label} className="p-5" style={{ background: PE.bgMid }}>
              <p className="font-mono text-[8px] tracking-[0.4em] mb-1.5" style={{ color: PE.magenta }}>
                {label}
              </p>
              <p className="text-sm font-semibold" style={{ color: PE.white }}>
                {value}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Overview */}
        <div className="mb-24">
          <PixelLabel num="00" label="Overview" />
          <h2
            className="text-[clamp(1.5rem,3vw,2.5rem)] font-black mb-6 leading-tight"
            style={{ color: PE.white }}
          >
            {caseStudy.subtitle}
          </h2>
          <p className="text-base leading-loose max-w-3xl whitespace-pre-line" style={{ color: PE.muted }}>
            {caseStudy.overview}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-24">
          {caseStudy.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[9px] tracking-[0.2em] uppercase px-3 py-1.5"
              style={{ border: `1px solid ${PE.violet}50`, color: PE.violet }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Sections */}
        {caseStudy.sections.map((section, idx) => (
          <motion.div
            key={idx}
            className="mb-24 md:mb-32"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <PixelLabel num={String(idx + 1).padStart(2, "0")} label={section.title} />
            <h2
              className="text-[clamp(1.8rem,4vw,3rem)] font-black leading-tight mb-6"
              style={{ color: PE.white }}
            >
              {section.title}
            </h2>
            <p className="text-[15px] leading-loose max-w-3xl whitespace-pre-line" style={{ color: PE.muted }}>
              {section.content}
            </p>
            <PixelGrid images={section.images} title={section.title} />
          </motion.div>
        ))}

        {/* ── POSTER GRID ─────────────────────────────────── */}
        <div className="mb-24">
          <PixelLabel num="GL" label="Full Series" />
          <h2 className="text-2xl font-black mb-10" style={{ color: PE.white }}>
            All Posters
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {caseStudy.posters.map((poster, i) => (
              <PosterCard key={i} src={poster.src} name={poster.name} index={i} />
            ))}
          </div>
        </div>

        {/* Bottom nav */}
        <motion.div
          className="border-t pt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          style={{ borderColor: `${PE.magenta}20` }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div>
            <p className="font-mono text-[9px] tracking-[0.4em] uppercase mb-2 opacity-30" style={{ color: PE.cyan }}>
              SIGNAL_END
            </p>
            <h3 className="text-3xl font-black" style={{ color: PE.white }}>
              <GlitchText text="More Work" />
            </h3>
          </div>
          <Link
            to="/projects"
            className="font-mono text-[10px] tracking-widest uppercase px-6 py-3 transition-colors"
            style={{ border: `1px solid ${PE.magenta}60`, color: PE.magenta }}
          >
            ← ALL PROJECTS
          </Link>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
};
