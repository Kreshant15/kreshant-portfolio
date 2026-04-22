import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronRight } from "lucide-react";

// ─── Pixel Era Brand Tokens ────────────────────────────────
const PE = {
  bg:       "#0a0010",   // deep void purple-black
  bgMid:    "#12001f",
  bgCard:   "#1a0030",
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
      backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 3px)`,
      mixBlendMode: "screen",
      opacity: 0.4,
    }}
  />
);

// ─── Glitch text effect ────────────────────────────────────
const GlitchText = ({ text, color = PE.white }: { text: string; color?: string }) => {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 120);
    }, 2500 + Math.random() * 3000);
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
              style={{ color: PE.cyan, mixBlendMode: "screen", clipPath: "polygon(0 15%, 100% 15%, 100% 35%, 0 35%)" }}
              animate={{ x: [0, -3, 2, 0], y: [0, 1, -1, 0] }}
              transition={{ duration: 0.12 }}
            >
              {text}
            </motion.span>
            <motion.span
              className="absolute inset-0 pointer-events-none"
              style={{ color: PE.magenta, mixBlendMode: "screen", clipPath: "polygon(0 65%, 100% 65%, 100% 80%, 0 80%)" }}
              animate={{ x: [0, 3, -2, 0], y: [0, -1, 1, 0] }}
              transition={{ duration: 0.12 }}
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
  <div className="flex items-center gap-3 mb-8">
    <span
      className="text-[9px] tracking-[0.3em] uppercase px-2.5 py-1 font-mono"
      style={{ 
        background: `linear-gradient(135deg, ${PE.magenta}20, ${PE.cyan}10)`,
        color: PE.magenta, 
        border: `1px solid ${PE.magenta}60`,
        boxShadow: `0 0 10px ${PE.magenta}30`,
      }}
    >
      {num}
    </span>
    <span className="font-mono text-[9px] tracking-[0.3em] uppercase" style={{ color: PE.muted }}>
      {label}
    </span>
    <div className="flex-1 h-px relative" style={{ background: `linear-gradient(to right, ${PE.magenta}50, transparent)` }}>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1" style={{ background: PE.magenta }} />
    </div>
  </div>
);

// ─── Poster card ───────────────────────────────────────────
const PosterCard = ({ src, name, index }: { src: string; name: string; index: number }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative overflow-hidden cursor-pointer group"
      style={{
        background: PE.bgCard,
        border: `1px solid ${PE.magenta}30`,
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.04 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ 
        scale: 1.02,
        boxShadow: `0 0 40px ${PE.magenta}30, 0 0 60px ${PE.cyan}20`,
      }}
    >
      <div className="relative overflow-hidden">
        {/* RGB split on hover */}
        <AnimatePresence>
          {hovered && (
            <>
              <motion.div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{ 
                  backgroundImage: `url(${src})`, 
                  backgroundSize: "cover", 
                  backgroundPosition: "center", 
                  mixBlendMode: "screen", 
                  opacity: 0.5,
                  filter: "hue-rotate(180deg)",
                }}
                initial={{ x: 0, opacity: 0 }}
                animate={{ x: [-2, 2, -1], opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, repeat: 2 }}
              />
            </>
          )}
        </AnimatePresence>
        
        <img
          src={src}
          alt={name}
          className="w-full h-auto block"
          loading="lazy"
        />
        
        {/* Pixel corner accents */}
        <div className="absolute top-0 right-0 flex gap-px">
          <div className="w-2 h-2" style={{ background: PE.magenta }} />
          <div className="w-2 h-2" style={{ background: PE.cyan }} />
        </div>
        <div className="absolute bottom-0 left-0 flex gap-px">
          <div className="w-2 h-2" style={{ background: PE.cyan }} />
          <div className="w-2 h-2" style={{ background: PE.magenta }} />
        </div>

        {/* Glitch bars on hover */}
        <AnimatePresence>
          {hovered && (
            <>
              <motion.div
                className="absolute left-0 right-0 h-1 pointer-events-none"
                style={{ background: PE.cyan, top: "30%", mixBlendMode: "screen" }}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: [0, 0.6, 0], scaleX: [0, 1, 0] }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                className="absolute left-0 right-0 h-1 pointer-events-none"
                style={{ background: PE.magenta, top: "70%", mixBlendMode: "screen" }}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: [0, 0.6, 0], scaleX: [0, 1, 0] }}
                transition={{ duration: 0.3, delay: 0.1 }}
              />
            </>
          )}
        </AnimatePresence>
      </div>
      
      <motion.div
        className="absolute inset-0 flex items-end p-4"
        style={{ background: "linear-gradient(to top, rgba(10,0,16,0.98) 0%, rgba(10,0,16,0.8) 30%, transparent 65%)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="w-full">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: PE.cyan }}>
              {name}
            </span>
            <ChevronRight className="w-4 h-4" style={{ color: PE.magenta }} />
          </div>
          <motion.div 
            className="h-px w-full mt-2" 
            style={{ background: `linear-gradient(to right, ${PE.magenta}, ${PE.cyan})` }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Image grid (IMPROVED) ─────────────────────────────────
const PixelGrid = ({ images, title }: { images: string[]; title: string }) => {
  if (!images.length) return null;
  
  const count = images.length;
  
  // Determine grid layout based on image count
  let gridClass = "";
  if (count === 1) {
    gridClass = "grid-cols-1 max-w-4xl mx-auto";
  } else if (count === 2) {
    gridClass = "grid-cols-1 md:grid-cols-2";
  } else if (count === 3) {
    gridClass = "grid-cols-1 md:grid-cols-3";
  } else {
    gridClass = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  }
  
  return (
    <div className={`grid gap-5 mt-12 ${gridClass}`}>
      {images.map((src, i) => (
        <motion.div
          key={i}
          className="relative overflow-hidden group"
          style={{
            background: PE.bgCard,
            border: `1px solid ${PE.violet}30`,
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          whileHover={{ 
            scale: 1.015,
            borderColor: PE.magenta + "60",
          }}
        >
          <div className="relative">
            <img 
              src={src} 
              alt={`${title} ${i + 1}`} 
              className="w-full h-auto block"
              loading="lazy" 
            />
            {/* Gradient overlay */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
              style={{ 
                background: `linear-gradient(to top, ${PE.bg}80 0%, transparent 50%)`,
              }} 
            />
            {/* Top scan line */}
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${PE.cyan}60, transparent)` }} />
            {/* Bottom scan line */}
            <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${PE.magenta}60, transparent)` }} />
          </div>
          
          {/* Pixel accents */}
          <div className="absolute top-2 right-2 flex gap-1">
            <div className="w-1.5 h-1.5" style={{ background: PE.magenta }} />
            <div className="w-1.5 h-1.5" style={{ background: PE.cyan }} />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// ─── Floating Pixel Particles ──────────────────────────────
const PixelParticles = () => {
  const particles = Array.from({ length: 20 });
  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1"
          style={{
            background: i % 2 === 0 ? PE.magenta : PE.cyan,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

// ─── MAIN ──────────────────────────────────────────────────
export default function App() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Pixel Era — Digital Archaeology | Case Study";
  }, []);

  return (
    <main style={{ background: PE.bg, color: PE.white }} className="relative min-h-screen">
      <ScanLines />
      <PixelParticles />

      {/* ── CRT vignette ──────────────────────────────────── */}
      <div
        className="pointer-events-none fixed inset-0 z-20"
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.8) 100%)",
        }}
      />

      {/* ── Grid bg ───────────────────────────────────────── */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(${PE.magenta} 1px, transparent 1px),
            linear-gradient(90deg, ${PE.magenta} 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* ── HERO ─────────────────────────────────────────── */}
      <div ref={heroRef} className="relative flex items-center justify-center overflow-hidden" style={{ height: "100vh" }}>
        {/* Hero BG — featured poster */}
        <motion.div className="absolute inset-0" style={{ y: heroY, opacity: heroOpacity }}>
          <img
            src="/images/projects/pixel/Pixelation.webp"
            alt="Pixel Era"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, ${PE.bg}DD 0%, ${PE.bg}70 25%, ${PE.bg}90 60%, ${PE.bg} 100%)`,
            }}
          />
        </motion.div>

        {/* Chromatic orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: PE.magenta, filter: "blur(160px)", opacity: 0.1 }} />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: PE.cyan, filter: "blur(140px)", opacity: 0.08 }} />

        {/* Hero text */}
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${PE.magenta})` }} />
              <p className="font-mono text-[9px] tracking-[0.5em] uppercase" style={{ color: PE.magenta }}>
                POSTER SERIES · 2024–2025
              </p>
              <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${PE.magenta})` }} />
            </div>

            <h1
              className="text-[clamp(4rem,12vw,10rem)] font-black leading-[0.9] tracking-tight mb-6"
              style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
            >
              <GlitchText text="PIXEL" color={PE.white} />
              <br />
              <GlitchText text="ERA" color={PE.violet} />
            </h1>

            <p className="font-mono text-[13px] leading-relaxed max-w-md mx-auto mt-8" style={{ color: PE.muted }}>
              {caseStudy.tagline}
            </p>

            <motion.div 
              className="flex items-center justify-center gap-2 mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {caseStudy.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[8px] tracking-[0.2em] uppercase px-2.5 py-1"
                  style={{ border: `1px solid ${PE.violet}40`, color: PE.violet }}
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 font-mono text-[8px] tracking-[0.5em] uppercase flex flex-col items-center gap-3"
          style={{ color: PE.muted }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
        >
          <span>SCROLL</span>
          <div className="w-px h-8" style={{ background: `linear-gradient(to bottom, ${PE.magenta}, transparent)` }} />
        </motion.div>
      </div>

      {/* ── BODY ─────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20">

        {/* Back */}
        <a
          href="#"
          className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.3em] uppercase mb-20 opacity-40 hover:opacity-100 transition-all duration-300 group"
          style={{ color: PE.cyan }}
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> 
          ALL PROJECTS
        </a>

        {/* Meta strip */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-px mb-28"
          style={{ background: `linear-gradient(135deg, ${PE.magenta}30, ${PE.cyan}20)` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {[
            { label: "TYPE", value: caseStudy.category },
            { label: "CLIENT", value: caseStudy.client },
            { label: "YEAR", value: caseStudy.date },
            { label: "MEDIUM", value: "Digital Posters" },
          ].map(({ label, value }) => (
            <div key={label} className="p-6 relative group" style={{ background: PE.bgMid }}>
              <p className="font-mono text-[8px] tracking-[0.4em] mb-2" style={{ color: PE.magenta }}>
                {label}
              </p>
              <p className="text-sm font-semibold" style={{ color: PE.white }}>
                {value}
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity" 
                style={{ background: `linear-gradient(to right, ${PE.magenta}, ${PE.cyan})` }} />
            </div>
          ))}
        </motion.div>

        {/* Overview */}
        <div className="mb-28">
          <PixelLabel num="00" label="Overview" />
          <h2
            className="text-[clamp(2rem,4vw,3rem)] font-black mb-8 leading-tight"
            style={{ color: PE.white }}
          >
            {caseStudy.subtitle}
          </h2>
          <p className="text-[15px] leading-loose max-w-3xl whitespace-pre-line" style={{ color: PE.muted }}>
            {caseStudy.overview}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2.5 mb-28">
          {caseStudy.tags.map((tag, idx) => (
            <motion.span
              key={tag}
              className="font-mono text-[9px] tracking-[0.2em] uppercase px-3.5 py-2 relative overflow-hidden group cursor-default"
              style={{ border: `1px solid ${PE.violet}40`, color: PE.violet }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + idx * 0.05 }}
              whileHover={{ 
                borderColor: PE.magenta + "80",
                color: PE.magenta,
                scale: 1.05,
              }}
            >
              {tag}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(135deg, ${PE.magenta}10, ${PE.cyan}05)` }} />
            </motion.span>
          ))}
        </div>

        {/* Sections */}
        {caseStudy.sections.map((section, idx) => (
          <motion.div
            key={idx}
            className="mb-28 md:mb-36"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <PixelLabel num={String(idx + 1).padStart(2, "0")} label={section.title} />
            <h2
              className="text-[clamp(2rem,5vw,3.5rem)] font-black leading-tight mb-8"
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

        {/* ── POSTER GALLERY ─────────────────────────────── */}
        <div className="mb-28">
          <PixelLabel num="XX" label="Full Series" />
          <h2 className="text-3xl font-black mb-12" style={{ color: PE.white }}>
            Complete Poster Collection
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseStudy.posters.map((poster, i) => (
              <PosterCard key={i} src={poster.src} name={poster.name} index={i} />
            ))}
          </div>
        </div>

        {/* Bottom nav */}
        <motion.div
          className="border-t pt-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
          style={{ borderColor: `${PE.magenta}30` }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div>
            <p className="font-mono text-[8px] tracking-[0.4em] uppercase mb-3 opacity-40" style={{ color: PE.cyan }}>
              SIGNAL_END
            </p>
            <h3 className="text-4xl font-black" style={{ color: PE.white }}>
              <GlitchText text="More Projects" />
            </h3>
          </div>
          <a
            href="#"
            className="font-mono text-[10px] tracking-[0.3em] uppercase px-7 py-3.5 transition-all duration-300 group relative overflow-hidden"
            style={{ border: `1px solid ${PE.magenta}50`, color: PE.magenta }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <ArrowLeft className="w-3 h-3" /> 
              VIEW ALL
            </span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: `linear-gradient(135deg, ${PE.magenta}20, ${PE.cyan}10)` }} />
          </a>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t py-12" style={{ borderColor: `${PE.magenta}20` }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-mono text-[9px] tracking-[0.3em] uppercase" style={{ color: PE.muted }}>
              PIXEL ERA © 2024–2025
            </p>
            <div className="flex gap-6">
              {["Instagram", "Behance", "Twitter"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="font-mono text-[9px] tracking-[0.2em] uppercase opacity-40 hover:opacity-100 transition-opacity"
                  style={{ color: PE.cyan }}
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
