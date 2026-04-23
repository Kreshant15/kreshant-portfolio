import { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

// ─── Brand Tokens ─────────────────────────────────────────
const PE = {
  bg:      "#0a0010",
  bgMid:   "#12001f",
  magenta: "#ff00ff",
  cyan:    "#00ffff",
  violet:  "#9b59ff",
  pink:    "#ff2d78",
  white:   "#f0e6ff",
  muted:   "#7a6899",
};

// ─── Case Study Data ──────────────────────────────────────
const caseStudy = {
  subtitle: "A Digital Archaeology of the Screen",
  tagline:  "When the internet bleeds, it bleeds in pixels.",
  category: "Poster Series",
  date:     "2024–2025",
  client:   "Personal Series",
  tags:     ["Vaporwave", "Glitch Art", "Digital Culture", "Poster Design", "Experimental"],
  overview: `Pixel Era is a poster series that treats the screen as a crime scene — fragments of digital culture, corrupted memories, and technological nostalgia scattered across each composition.\n\nThe series explores what happens when the internet breaks down. When the loading bar freezes. When reality gets flagged as 404. Each poster is a different failure mode of the digital world — not a bug report, but a eulogy.`,
  sections: [
    {
      title: "The Concept",
      content: `We live inside screens now. The question Pixel Era asks is: what does it look like when that world starts to glitch?\n\nThe series draws from vaporwave's nostalgia, glitch art's controlled chaos, and the visual language of early internet culture — pixel fonts, scan lines, corrupted JPEGs, Windows error dialogs. But it doesn't romanticize them. It autopsies them.\n\nEach poster in the series is named like a diagnosis: Pixel Reborn, Data Breach, Buffering Reality, Digital Skin. Together they map the full emotional spectrum of living in a world mediated by screens.`,
      images: ["/images/projects/pixel/Pixel-Reborn.webp", "/images/projects/pixel/Digital-Skin.webp"],
    },
    {
      title: "Visual Language",
      content: `The series operates with a tight but flexible visual grammar. Every poster shares the same underlying logic — chromatic aberration, displaced scan lines, corrupted typography — but breaks it in a different direction.\n\nColor is used deliberately: cyan and magenta as the two channels that split when a signal fails. Deep violet backgrounds that feel like staring into a monitor in a dark room. Pink and white for the human element pushing through the static.\n\nTypography across the series mixes pixel fonts with distorted sans-serifs — the tension between the grid and the glitch.`,
      images: ["/images/projects/pixel/Missing-Link.webp", "/images/projects/pixel/Lo-Fi-Utopia.webp"],
    },
    {
      title: "Key Pieces",
      content: `Pixel Drift — The first piece in the series. A city seen through a corrupted lens, culture bleeding into each other across a broken signal. Mickey Mouse in a lo-fi landscape: pop culture as digital ghost.\n\nMissing Link — The most typographically dense piece. The word "MISSING LINK" repeated until it becomes noise itself. A face beneath the static, only partially visible.\n\n404: Reality Not Found — The series centerpiece. A classical statue in a vaporwave landscape — ancient marble in a synthetic world.\n\nBuffering Reality — A motocross rider frozen mid-race. The "LOADING" indicator sits in the corner. The physical world rendered as a stream that can't keep up.\n\nData Breach — A figure dissolving into pixel blocks. About digital identity, surveillance, and what it means to exist as data.`,
      images: ["/images/projects/pixel/Pixel-Drift.webp", "/images/projects/pixel/Buffering-Reality.webp", "/images/projects/pixel/Theft-Data-Breach.webp"],
    },
    {
      title: "Process & Execution",
      content: `Each poster begins with a concept word — one idea that needs to be felt visually. From there: source imagery, chromatic split, scan line texture, typographic disruption.\n\nThe glitch effects are mostly practical — channel separation in Photoshop, displaced layers, noise filters run multiple times until the corruption feels earned rather than decorative. The goal is always controlled chaos: it should look broken, but nothing should feel accidental.\n\nPixelation is used sparingly — only when it means something. In Data Breach, the pixellation is the point. In The Cloud, it's the texture of uncertainty itself.`,
      images: ["/images/projects/pixel/The-Cloud.webp", "/images/projects/pixel/Pixelation.webp"],
    },
    {
      title: "Conclusion",
      content: `Pixel Era is ongoing. The series doesn't have an endpoint because digital culture doesn't either — it just keeps breaking in new ways, producing new glitches, new failures, new aesthetics from the wreckage.\n\nWhat started as a visual experiment became a language. A way to talk about technology, nostalgia, and the strangeness of existing in a world that was designed for efficiency but keeps producing beauty in its errors.\n\nThe next pieces are already forming. The signal isn't done breaking yet.`,
      images: [],
    },
  ],
  posters: [
    { src: "/images/projects/pixel/Pixel-Reborn.webp",      name: "Pixel Reborn"    },
    { src: "/images/projects/pixel/The-Cloud.webp",         name: "The Cloud"       },
    { src: "/images/projects/pixel/Digital-Skin.webp",      name: "Digital Skin"    },
    { src: "/images/projects/pixel/Pixel-Drift.webp",       name: "Pixel Drift"     },
    { src: "/images/projects/pixel/Missing-Link.webp",      name: "Missing Link"    },
    { src: "/images/projects/pixel/Lo-Fi-Utopia.webp",      name: "Lo-Fi Utopia"    },
    { src: "/images/projects/pixel/Buffering-Reality.webp", name: "Buffering Reality"},
    { src: "/images/projects/pixel/Theft-Data-Breach.webp", name: "Data Breach"     },
    { src: "/images/projects/pixel/Pixelation.webp",        name: "Pixelation"      },
  ],
};

// ─── CRT scan lines ───────────────────────────────────────
const ScanLines = () => (
  <div className="pointer-events-none fixed inset-0 z-30"
    style={{
      backgroundImage: `repeating-linear-gradient(0deg,rgba(255,255,255,0.025) 0,rgba(255,255,255,0.025) 1px,transparent 1px,transparent 3px)`,
      mixBlendMode: "screen",
    }}
  />
);

// ─── Pixel particles — memoised so they never re-randomise
const PixelParticles = () => {
  // Stable random values computed once
  const particles = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: 2 + Math.floor(Math.random() * 4),          // 2–5 px square
      color: [PE.magenta, PE.cyan, PE.violet][i % 3],
      left: `${(i * 6.8) % 100}%`,                       // spread evenly
      initialTop: `${Math.random() * 100}%`,
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 6,
      xRange: Math.random() * 60 - 30,                   // –30 to +30 px horizontal drift
    })), []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            background: p.color,
            left: p.left,
            top: p.initialTop,
            opacity: 0,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          }}
          animate={{
            y: [0, -120, 0],
            x: [0, p.xRange, 0],
            opacity: [0, 0.55, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// ─── Glitch text ──────────────────────────────────────────
const GlitchText = ({ text, color = PE.white }: { text: string; color?: string }) => {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const schedule = () => {
      const timer = setTimeout(() => {
        setGlitching(true);
        setTimeout(() => {
          setGlitching(false);
          schedule();
        }, 130);
      }, 2800 + Math.random() * 3500);
      return timer;
    };
    const t = schedule();
    return () => clearTimeout(t);
  }, []);

  return (
    <span className="relative inline-block" style={{ color }}>
      {text}
      <AnimatePresence>
        {glitching && (
          <>
            <motion.span className="absolute inset-0 pointer-events-none select-none"
              style={{ color: PE.cyan, mixBlendMode: "screen", clipPath: "polygon(0 15%,100% 15%,100% 35%,0 35%)" }}
              animate={{ x: [0,-3,2,0], y:[0,1,-1,0] }} transition={{ duration: 0.13 }}>
              {text}
            </motion.span>
            <motion.span className="absolute inset-0 pointer-events-none select-none"
              style={{ color: PE.magenta, mixBlendMode: "screen", clipPath: "polygon(0 65%,100% 65%,100% 80%,0 80%)" }}
              animate={{ x: [0,3,-2,0], y:[0,-1,1,0] }} transition={{ duration: 0.13 }}>
              {text}
            </motion.span>
          </>
        )}
      </AnimatePresence>
    </span>
  );
};

// ─── Section label ────────────────────────────────────────
const PixelLabel = ({ num, label }: { num: string; label: string }) => (
  <div className="flex items-center gap-3 mb-8">
    <span className="font-mono text-[9px] tracking-[0.3em] uppercase px-2.5 py-1"
      style={{ background: `linear-gradient(135deg,${PE.magenta}22,${PE.cyan}10)`, color: PE.magenta, border: `1px solid ${PE.magenta}55`, boxShadow: `0 0 10px ${PE.magenta}25` }}>
      {num}
    </span>
    <span className="font-mono text-[9px] tracking-[0.3em] uppercase" style={{ color: PE.muted }}>
      {label}
    </span>
    <div className="flex-1 h-px relative" style={{ background: `linear-gradient(to right,${PE.magenta}45,transparent)` }}>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1" style={{ background: PE.magenta }} />
    </div>
  </div>
);

// ─── IMAGE GRID ───────────────────────────────────────────
// KEY: no background on wrapper, no fixed aspect ratio, object-contain
// 3 images → all in one row (grid-cols-3)
const PixelGrid = ({ images, title }: { images: string[]; title: string }) => {
  if (!images.length) return null;
  const n = images.length;
  const grid =
    n === 1 ? "grid-cols-1 max-w-3xl mx-auto" :
    n === 2 ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto" :
              "grid-cols-1 md:grid-cols-3";   // 3 → single row, no orphan

  return (
    <div className={`grid gap-4 mt-12 ${grid}`}>
      {images.map((src, i) => (
        <motion.div key={i} className="relative overflow-hidden group"
          style={{ border: `1px solid ${PE.violet}30` }}
          initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
          whileHover={{ scale: 1.015, borderColor: PE.magenta + "55" }}>

          {/* top / bottom scan line accents */}
          <div className="absolute top-0 left-0 right-0 h-px z-10"
            style={{ background: `linear-gradient(to right,transparent,${PE.cyan}55,transparent)` }} />
          <div className="absolute bottom-0 left-0 right-0 h-px z-10"
            style={{ background: `linear-gradient(to right,transparent,${PE.magenta}55,transparent)` }} />

          {/* pixel corner accents */}
          <div className="absolute top-2 right-2 z-10 flex gap-1">
            <div className="w-1.5 h-1.5" style={{ background: PE.magenta }} />
            <div className="w-1.5 h-1.5" style={{ background: PE.cyan }} />
          </div>

          {/* IMAGE — natural size, no background behind it, no forced aspect ratio */}
          <img src={src} alt={`${title} ${i + 1}`}
            className="w-full h-auto block object-contain"
            loading="lazy" />

          {/* hover gradient overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: `linear-gradient(to top,${PE.bg}70 0%,transparent 55%)` }} />

          {/* glitch bars on hover */}
          <AnimatePresence>
            {/* rendered via CSS group-hover — no JS state needed */}
          </AnimatePresence>
          <motion.div className="absolute left-0 right-0 h-0.5 opacity-0 group-hover:opacity-60 pointer-events-none"
            style={{ background: PE.cyan, top: "28%", mixBlendMode: "screen" }}
            initial={false}
            whileHover={{ scaleX: [0, 1, 0.8] }}
            transition={{ duration: 0.25 }} />
          <motion.div className="absolute left-0 right-0 h-0.5 opacity-0 group-hover:opacity-60 pointer-events-none"
            style={{ background: PE.magenta, top: "68%", mixBlendMode: "screen" }}
            initial={false}
            transition={{ duration: 0.25, delay: 0.1 }} />
        </motion.div>
      ))}
    </div>
  );
};

// ─── POSTER CARD ─────────────────────────────────────────
// No background on card — image fills the space cleanly
const PosterCard = ({ src, name, index }: { src: string; name: string; index: number }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div className="relative overflow-hidden cursor-pointer group"
      style={{ border: `1px solid ${PE.magenta}28` }}
      initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.04 }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.02, boxShadow: `0 0 36px ${PE.magenta}28,0 0 55px ${PE.cyan}18` }}>

      {/* pixel corner accents */}
      <div className="absolute top-0 right-0 z-20 flex gap-px">
        <div className="w-2 h-2" style={{ background: PE.magenta }} />
        <div className="w-2 h-2" style={{ background: PE.cyan }} />
      </div>
      <div className="absolute bottom-0 left-0 z-20 flex gap-px">
        <div className="w-2 h-2" style={{ background: PE.cyan }} />
        <div className="w-2 h-2" style={{ background: PE.magenta }} />
      </div>

      {/* RGB shift overlay on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div className="absolute inset-0 z-10 pointer-events-none"
            style={{ backgroundImage: `url(${src})`, backgroundSize: "cover", backgroundPosition: "center", mixBlendMode: "screen", opacity: 0, filter: "hue-rotate(180deg)" }}
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: [-2, 2, -1, 0], opacity: [0, 0.45, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, times: [0, 0.33, 0.66, 1] }}
          />
        )}
      </AnimatePresence>

      {/* IMAGE — no background, natural dimensions */}
      <img src={src} alt={name} className="w-full h-auto block" loading="lazy" />

      {/* Glitch bars on hover */}
      <AnimatePresence>
        {hovered && (
          <>
            <motion.div className="absolute left-0 right-0 h-0.5 z-10 pointer-events-none"
              style={{ background: PE.cyan, top: "30%", mixBlendMode: "screen" }}
              initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: [0,1,0], opacity: [0,0.7,0] }}
              transition={{ duration: 0.3 }} />
            <motion.div className="absolute left-0 right-0 h-0.5 z-10 pointer-events-none"
              style={{ background: PE.magenta, top: "68%", mixBlendMode: "screen" }}
              initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: [0,1,0], opacity: [0,0.7,0] }}
              transition={{ duration: 0.3, delay: 0.1 }} />
          </>
        )}
      </AnimatePresence>

      {/* bottom name overlay */}
      <motion.div className="absolute inset-0 flex flex-col items-start justify-end p-4 z-10"
        style={{ background: "linear-gradient(to top,rgba(10,0,16,0.96) 0%,rgba(10,0,16,0.65) 35%,transparent 65%)" }}
        initial={{ opacity: 0 }} animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.2 }}>
        <div className="w-full">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: PE.cyan }}>
              {name}
            </span>
            <ChevronRight className="w-3.5 h-3.5" style={{ color: PE.magenta }} />
          </div>
          {/* animated progress bar */}
          <motion.div className="h-px w-full mt-2"
            style={{ background: `linear-gradient(to right,${PE.magenta},${PE.cyan})` }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }} />
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────
export const PixelEraProject = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY       = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Pixel Era — Poster Series | Kreshant Kumar";
  }, []);

  return (
    <main style={{ background: PE.bg, color: PE.white }} className="relative min-h-screen">
      <ScanLines />
      <PixelParticles />

      {/* CRT vignette */}
      <div className="pointer-events-none fixed inset-0 z-20"
        style={{ background: "radial-gradient(ellipse at center,transparent 50%,rgba(0,0,0,0.78) 100%)" }} />

      {/* grid bg */}
      <div className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(${PE.magenta} 1px,transparent 1px),linear-gradient(90deg,${PE.magenta} 1px,transparent 1px)`,
          backgroundSize: "50px 50px",
          opacity: 0.022,
        }} />

      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <div ref={heroRef} className="relative flex items-center justify-center overflow-hidden" style={{ height: "100dvh" }}>
        <motion.div className="absolute inset-0" style={{ y: heroY, opacity: heroOpacity }}>
          <img src="/images/projects/pixel/phero.png" alt="Pixel Era"
            className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0"
            style={{ background: `linear-gradient(to bottom,${PE.bg}CC 0%,${PE.bg}60 30%,${PE.bg}99 65%,${PE.bg} 100%)` }} />
        </motion.div>

        {/* chromatic orbs */}
        <div className="absolute top-1/3 left-1/4 rounded-full pointer-events-none"
          style={{ width: 500, height: 500, background: PE.magenta, filter: "blur(160px)", opacity: 0.09 }} />
        <div className="absolute top-1/2 right-1/4 rounded-full pointer-events-none"
          style={{ width: 400, height: 400, background: PE.cyan, filter: "blur(140px)", opacity: 0.07 }} />

        <div className="relative z-10 text-center px-6">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-12" style={{ background: `linear-gradient(to right,transparent,${PE.magenta})` }} />
              <p className="font-mono text-[9px] tracking-[0.5em] uppercase" style={{ color: PE.magenta }}>
                POSTER SERIES · 2024–2025
              </p>
              <div className="h-px w-12" style={{ background: `linear-gradient(to left,transparent,${PE.magenta})` }} />
            </div>

            <h1 className="font-black leading-[0.9] tracking-tight mb-6"
              style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: "clamp(4rem,12vw,10rem)" }}>
              <GlitchText text="PIXEL" color={PE.white} />
              <br />
              <GlitchText text="ERA" color={PE.violet} />
            </h1>

            <p className="font-mono text-sm leading-relaxed max-w-sm mx-auto mt-8" style={{ color: PE.muted }}>
              {caseStudy.tagline}
            </p>

            <motion.div className="flex items-center justify-center gap-2 mt-10 flex-wrap"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              {caseStudy.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="font-mono text-[8px] tracking-[0.2em] uppercase px-2.5 py-1"
                  style={{ border: `1px solid ${PE.violet}40`, color: PE.violet }}>
                  {tag}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* scroll cue */}
        <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 font-mono text-[8px] tracking-[0.5em] uppercase"
          style={{ color: PE.muted }}
          animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2.5 }}>
          <span>SCROLL</span>
          <div className="w-px h-8" style={{ background: `linear-gradient(to bottom,${PE.magenta},transparent)` }} />
        </motion.div>
      </div>

      {/* ── BODY ─────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20">

        {/* back */}
        <Link to="/projects"
          className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.3em] uppercase mb-20 opacity-40 hover:opacity-100 transition-all duration-300 group"
          style={{ color: PE.cyan }}>
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          ALL PROJECTS
        </Link>

        {/* meta strip — dual-tone gradient border */}
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-px mb-28"
          style={{ background: `linear-gradient(135deg,${PE.magenta}35,${PE.cyan}22)` }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          {[
            { label: "TYPE",   value: caseStudy.category   },
            { label: "CLIENT", value: caseStudy.client     },
            { label: "YEAR",   value: caseStudy.date       },
            { label: "MEDIUM", value: "Digital Posters"    },
          ].map(({ label, value }) => (
            <div key={label} className="p-6 relative group transition-colors duration-300"
              style={{ background: PE.bgMid }}>
              <p className="font-mono text-[8px] tracking-[0.4em] mb-2" style={{ color: PE.magenta }}>{label}</p>
              <p className="text-sm font-semibold" style={{ color: PE.white }}>{value}</p>
              {/* cyan bottom border on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(to right,${PE.magenta},${PE.cyan})` }} />
            </div>
          ))}
        </motion.div>

        {/* overview */}
        <div className="mb-28">
          <PixelLabel num="00" label="Overview" />
          <h2 className="font-black mb-8 leading-tight"
            style={{ color: PE.white, fontSize: "clamp(1.8rem,4vw,3rem)" }}>
            {caseStudy.subtitle}
          </h2>
          <p className="text-[15px] leading-loose max-w-3xl whitespace-pre-line" style={{ color: PE.muted }}>
            {caseStudy.overview}
          </p>
        </div>

        {/* tags */}
        <div className="flex flex-wrap gap-2.5 mb-28">
          {caseStudy.tags.map((tag, idx) => (
            <motion.span key={tag}
              className="font-mono text-[9px] tracking-[0.2em] uppercase px-3.5 py-2 cursor-default relative overflow-hidden group"
              style={{ border: `1px solid ${PE.violet}40`, color: PE.violet }}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + idx * 0.05 }}
              whileHover={{ borderColor: PE.magenta + "80", color: PE.magenta, scale: 1.05 }}>
              {tag}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(135deg,${PE.magenta}10,${PE.cyan}06)` }} />
            </motion.span>
          ))}
        </div>

        {/* sections */}
        {caseStudy.sections.map((section, idx) => (
          <motion.div key={idx} className="mb-28 md:mb-36"
            initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
            <PixelLabel num={String(idx + 1).padStart(2, "0")} label={section.title} />
            <h2 className="font-black leading-tight mb-8"
              style={{ color: PE.white, fontSize: "clamp(1.8rem,5vw,3.2rem)" }}>
              {section.title}
            </h2>
            <p className="text-[15px] leading-loose max-w-3xl whitespace-pre-line" style={{ color: PE.muted }}>
              {section.content}
            </p>
            <PixelGrid images={section.images} title={section.title} />
          </motion.div>
        ))}

        {/* gallery */}
        <div className="mb-28">
          <PixelLabel num="XX" label="Full Series" />
          <h2 className="text-3xl font-black mb-12" style={{ color: PE.white }}>
            Complete Poster Collection
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {caseStudy.posters.map((poster, i) => (
              <PosterCard key={i} src={poster.src} name={poster.name} index={i} />
            ))}
          </div>
        </div>

        {/* bottom CTA */}
        <motion.div className="border-t pt-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
          style={{ borderColor: `${PE.magenta}25` }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <div>
            <p className="font-mono text-[8px] tracking-[0.4em] uppercase mb-3 opacity-35" style={{ color: PE.cyan }}>
              SIGNAL_END
            </p>
            <h3 className="text-4xl font-black" style={{ color: PE.white }}>
              <GlitchText text="More Projects" />
            </h3>
          </div>
          <Link to="/projects"
            className="font-mono text-[10px] tracking-[0.3em] uppercase px-7 py-3.5 transition-all duration-300 group relative overflow-hidden"
            style={{ border: `1px solid ${PE.magenta}50`, color: PE.magenta }}>
            <span className="relative z-10 flex items-center gap-2">
              <ArrowLeft className="w-3 h-3" /> VIEW ALL
            </span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: `linear-gradient(135deg,${PE.magenta}20,${PE.cyan}10)` }} />
          </Link>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
};