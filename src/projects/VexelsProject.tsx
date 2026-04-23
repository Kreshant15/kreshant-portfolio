import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { projects } from "../data/projects";

// ─── Brand Tokens ─────────────────────────────────────────
const VX = {
  red:    "#FA4C56",
  orange: "#FFB429",
  blue:   "#00AAFF",
  purple: "#BE56F1",
  yellow: "#F3E44B",
  mint:   "#13EC9E",
  dark:   "#231400",
  white:  "#FFFFFF",
  cream:  "#FFFBF0",
};

// Cycling accent per section
const ACCENTS = [VX.red, VX.blue, VX.purple, VX.mint, VX.orange, VX.yellow];

// ─── Halftone background ──────────────────────────────────
const halftoneUrl = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Ccircle cx='10' cy='10' r='1.5' fill='%23231400' opacity='0.07'/%3E%3C/svg%3E")`;

// ─── Floating comic panels background ─────────────────────
// Lightweight, memoised — never re-randomises
const ComicBubbles = () => {
  const bubbles = useMemo(() => [
    { text: "POW!",   color: VX.red,    x: "8%",  y: "12%", rot: -8,  size: 52 },
    { text: "ZAP!",   color: VX.blue,   x: "88%", y: "8%",  rot: 6,   size: 44 },
    { text: "WOW!",   color: VX.mint,   x: "92%", y: "35%", rot: -4,  size: 40 },
    { text: "BAM!",   color: VX.orange, x: "5%",  y: "55%", rot: 10,  size: 48 },
    { text: "BOOM!",  color: VX.purple, x: "85%", y: "65%", rot: -6,  size: 42 },
    { text: "YES!",   color: VX.yellow, x: "10%", y: "82%", rot: 5,   size: 38 },
    { text: "NICE!",  color: VX.red,    x: "90%", y: "88%", rot: -10, size: 36 },
  ], []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {bubbles.map((b, i) => (
        <motion.div key={i}
          className="absolute select-none"
          style={{ left: b.x, top: b.y }}
          animate={{ y: [0, -12, 0], rotate: [b.rot, b.rot + 4, b.rot] }}
          transition={{ duration: 4 + i * 0.7, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}>
          {/* speech bubble SVG */}
          <div className="relative flex items-center justify-center"
            style={{ width: b.size * 1.6, height: b.size }}>
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 50">
              <ellipse cx="40" cy="22" rx="38" ry="18" fill={b.color} stroke={VX.dark} strokeWidth="2.5" />
              <polygon points="28,36 20,48 40,36" fill={b.color} stroke={VX.dark} strokeWidth="2.5" strokeLinejoin="round" />
            </svg>
            <span className="relative z-10 font-black text-center leading-none"
              style={{
                fontFamily: "'Bangers','Impact',cursive",
                fontSize: b.size * 0.28,
                color: VX.dark,
                letterSpacing: "0.05em",
                marginBottom: 8,
              }}>
              {b.text}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// ─── Comic burst star ─────────────────────────────────────
const Burst = ({ color, size = 60 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
    <polygon points="50,2 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill={color} stroke={VX.dark} strokeWidth="2" />
  </svg>
);

// ─── Speed lines SVG ──────────────────────────────────────
const SpeedLines = ({ color = VX.yellow, opacity = 0.12 }: { color?: string; opacity?: number }) => (
  <svg width="320" height="120" viewBox="0 0 320 120"
    style={{ opacity, pointerEvents: "none", display: "block" }} fill="none">
    {Array.from({ length: 14 }, (_, i) => {
      const y = 8 + i * 8;
      const len = 80 + (i % 3) * 60;
      return <line key={i} x1="0" y1={y} x2={len} y2={y}
        stroke={color} strokeWidth={i % 2 === 0 ? 2 : 1} strokeLinecap="round" />;
    })}
  </svg>
);

// ─── Section panel label ──────────────────────────────────
const PanelLabel = ({ num, title, color }: { num: string; title: string; color: string }) => (
  <div className="flex items-center gap-3 mb-6">
    <span className="w-10 h-10 flex items-center justify-center text-sm font-black rounded-full border-2 border-black text-white shrink-0"
      style={{ background: color, fontFamily: "'Bangers','Impact',cursive" }}>
      {num}
    </span>
    <span className="font-black tracking-[0.2em] uppercase shrink-0"
      style={{ fontFamily: "'Bangers',cursive", fontSize: "1rem", color: VX.dark }}>
      {title}
    </span>
    {/* dotted connector */}
    <div className="flex-1 flex gap-1 min-w-0">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="h-1 flex-1 rounded-full"
          style={{ background: i % 2 === 0 ? color : "transparent", border: `1px solid ${color}`, opacity: 0.4 }} />
      ))}
    </div>
  </div>
);

// ─── IMAGE GRID — FIXED ───────────────────────────────────
// • NO background on wrapper → no cream rectangle
// • NO aspectRatio on multi-image containers → no crop
// • NO object-cover on content images → use object-contain
// • NO p-2 padding on img → image fills edge to edge
// • 3 images → all in one row (grid-cols-3)
const ComicGrid = ({ images, title, accent }: { images: string[]; title: string; accent: string }) => {
  if (!images.length) return null;
  const n = images.length;
  const grid =
    n === 1 ? "grid-cols-1 max-w-3xl mx-auto" :
    n === 2 ? "grid-cols-1 md:grid-cols-2" :
    n === 3 ? "grid-cols-1 md:grid-cols-3" :
              "grid-cols-1 md:grid-cols-2";

  return (
    <div className={`grid gap-4 mt-8 ${grid}`}>
      {images.map((src, i) => (
        <motion.div key={i}
          className="relative overflow-hidden border-2 border-black"
          style={{ boxShadow: `4px 4px 0px ${VX.dark}` }}
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: i * 0.07 }}
          whileHover={{ rotate: i % 2 === 0 ? 0.6 : -0.6, scale: 1.025, zIndex: 10 }}>

          {/* accent dot corner */}
          <div className="absolute top-2 right-2 z-10 w-2.5 h-2.5 rounded-full border border-black"
            style={{ background: accent }} />

          {/* top panel bar */}
          <div className="absolute top-0 left-0 right-0 h-1 z-10"
            style={{ background: accent }} />

          {/* IMAGE — natural size, no background, no forced dimensions */}
          <img src={src} alt={`${title} ${i + 1}`}
            className="w-full h-auto block object-contain transition-transform duration-500 group-hover:scale-[1.04]"
            loading="lazy" decoding="async" />

          {/* hover overlay */}
          <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
            style={{ background: `linear-gradient(to top,${accent}20 0%,transparent 50%)` }} />
        </motion.div>
      ))}
    </div>
  );
};

// ─── Gallery card ─────────────────────────────────────────
const GalleryCard = ({ src, index, accent }: { src: string; index: number; accent: string }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div className="relative overflow-hidden border-2 border-black"
      style={{ boxShadow: hovered ? `6px 6px 0px ${VX.dark}` : `4px 4px 0px ${VX.dark}`, transition: "box-shadow 0.15s" }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.02, rotate: index % 2 === 0 ? 0.4 : -0.4 }}>

      {/* top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 z-10" style={{ background: accent }} />

      {/* corner burst on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div className="absolute bottom-2 left-2 z-10 pointer-events-none"
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
            <Burst color={accent} size={24} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* NO background, NO padding, NO aspect ratio, NO object-cover */}
      <img src={src} alt={`Gallery ${index + 1}`}
        className="w-full h-auto block object-contain"
        loading="lazy" />
    </motion.div>
  );
};

// ─── MAIN ─────────────────────────────────────────────────
export const VexelsProject = () => {
  // ID is "vexels" (with s) in projects.ts
  const project = projects.find((p) => p.id === "vexel")!;
  const heroRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Vexel — Brand Identity | Kreshant Kumar";
  }, []);

  if (!project) return null;

  return (
    <main className="relative min-h-screen" style={{ background: VX.cream, color: VX.dark }}>

      {/* halftone bg */}
      <div className="pointer-events-none fixed inset-0 z-0"
        style={{ backgroundImage: halftoneUrl, backgroundRepeat: "repeat" }} />

      {/* floating speech bubbles */}
      <ComicBubbles />

      <Navbar />

      {/* ── HERO ──────────────────────────────────────────── */}
      <div ref={heroRef} className="relative pt-32 pb-0 px-6 md:px-12 max-w-7xl mx-auto z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

          {/* back */}
          <Link to="/projects"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-12 hover:opacity-70 transition-opacity"
            style={{ color: VX.dark }}>
            <ArrowLeft className="w-3 h-3" /> All Projects
          </Link>

          {/* tag + date */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-black px-3 py-1 border-2 border-black uppercase tracking-widest"
              style={{ background: VX.yellow, color: VX.dark }}>
              BRAND IDENTITY
            </span>
            <span className="text-xs font-bold opacity-50">{project.date}</span>
          </div>

          {/* hero title */}
          <div className="relative mb-6">
            <h1 className="font-black uppercase leading-none tracking-tight"
              style={{
                fontFamily: "'Bangers','Impact',cursive",
                fontSize: "clamp(4.5rem,16vw,13rem)",
                WebkitTextStroke: "3px #231400",
                color: VX.red,
                letterSpacing: "0.04em",
              }}>
              VEX<span style={{ color: VX.blue }}>ELS</span>
            </h1>

            {/* spinning burst — top right */}
            <motion.div className="absolute -top-4 right-0 md:right-32 z-10"
              animate={{ rotate: [0, 20, -8, 0] }} transition={{ repeat: Infinity, duration: 5 }}>
              <Burst color={VX.yellow} size={76} />
            </motion.div>

            {/* smaller burst — mid left */}
            <motion.div className="absolute bottom-0 left-[38%] z-10"
              animate={{ rotate: [0, -12, 6, 0] }} transition={{ repeat: Infinity, duration: 6.5, delay: 0.4 }}>
              <Burst color={VX.mint} size={42} />
            </motion.div>

            {/* speed lines — decorative */}
            <div className="absolute bottom-0 left-0 -translate-y-2 opacity-20 hidden md:block">
              <SpeedLines color={VX.red} opacity={1} />
            </div>
          </div>

          <p className="text-base md:text-lg font-bold max-w-2xl leading-relaxed"
            style={{ color: VX.dark, opacity: 0.7 }}>
            {project.description}
          </p>
        </motion.div>
      </div>

      {/* hero image — natural aspect, no forced height cut */}
      <motion.div
        className="relative z-10 mx-6 md:mx-12 mt-10 border-2 border-black overflow-hidden"
        style={{
          maxWidth: "calc(100% - 3rem)",
          boxShadow: `8px 8px 0px ${VX.dark}`,
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}>
        <motion.img
          src={project.hero || project.image}
          alt={project.title}
          className="w-full h-auto block"
          style={{ scale: heroScale }}
          loading="eager" />
        {/* comic caption bar */}
        <div className="absolute bottom-0 left-0 right-0 px-5 py-2 border-t-2 border-black"
          style={{ background: VX.yellow, color: VX.dark }}>
          <span className="text-[10px] font-black tracking-widest uppercase">
            A Visual Playground by Kreshant Kumar
          </span>
        </div>
      </motion.div>

      {/* ── BODY ──────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20">

        {/* meta cards */}
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          {[
            { label: "Client",   value: project.client,   color: VX.red    },
            { label: "Category", value: project.category, color: VX.blue   },
            { label: "Date",     value: project.date,     color: VX.purple  },
            { label: "Type",     value: project.tags[0],  color: VX.mint   },
          ].map(({ label, value, color }) => (
            <motion.div key={label}
              className="p-4 border-2 border-black"
              style={{ background: color + "18", boxShadow: `3px 3px 0px ${VX.dark}` }}
              whileHover={{ y: -3, boxShadow: `5px 5px 0px ${VX.dark}` }}
              transition={{ duration: 0.15 }}>
              <p className="text-[9px] font-black tracking-widest uppercase mb-1" style={{ color }}>
                {label}
              </p>
              <p className="text-sm font-bold" style={{ color: VX.dark }}>{value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* overview */}
        <div className="mb-20">
          <PanelLabel num="0" title="Overview" color={VX.orange} />
          <p className="text-base md:text-lg leading-loose max-w-3xl whitespace-pre-line font-medium"
            style={{ color: VX.dark, opacity: 0.75 }}>
            {project.fullDescription}
          </p>
        </div>

        {/* tags */}
        <div className="flex flex-wrap gap-2 mb-20">
          {project.tags.map((tag, i) => (
            <motion.span key={tag}
              className="px-3 py-1 text-xs font-black uppercase border-2 border-black cursor-default"
              style={{
                background: ACCENTS[i % ACCENTS.length] + "30",
                color: VX.dark,
                boxShadow: `2px 2px 0px ${VX.dark}`,
              }}
              whileHover={{ y: -2, boxShadow: `3px 4px 0px ${VX.dark}`, scale: 1.04 }}
              transition={{ duration: 0.12 }}>
              {tag}
            </motion.span>
          ))}
        </div>

        {/* sections */}
        {project.sections?.map((section, idx) => {
          const accent = ACCENTS[idx % ACCENTS.length];
          return (
            <motion.div key={idx} className="mb-20 md:mb-28 relative"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45 }}>

              {/* decorative speed lines on alternating sections */}
              {idx % 2 !== 0 && (
                <div className="absolute -right-2 top-2 hidden lg:block opacity-15 pointer-events-none">
                  <SpeedLines color={accent} opacity={1} />
                </div>
              )}

              <PanelLabel num={String(idx + 1)} title={section.title} color={accent} />

              <h2 className="font-black uppercase leading-none mb-5"
                style={{
                  fontFamily: "'Bangers',cursive",
                  fontSize: "clamp(2rem,5vw,3.5rem)",
                  color: accent,
                  WebkitTextStroke: "1.5px #231400",
                  letterSpacing: "0.05em",
                }}>
                {section.title}
              </h2>

              <p className="text-[15px] leading-loose max-w-3xl whitespace-pre-line font-medium"
                style={{ color: VX.dark, opacity: 0.7 }}>
                {section.content}
              </p>

              <ComicGrid images={section.images} title={section.title} accent={accent} />
            </motion.div>
          );
        })}

        {/* gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="mb-20">
            <PanelLabel num="★" title="Gallery" color={VX.purple} />

            {/* animated burst row above gallery */}
            <div className="flex gap-3 mb-6 items-center">
              {[VX.red, VX.blue, VX.mint, VX.orange].map((c, i) => (
                <motion.div key={i}
                  animate={{ rotate: [0, i % 2 === 0 ? 15 : -15, 0] }}
                  transition={{ repeat: Infinity, duration: 3 + i * 0.5, delay: i * 0.3 }}>
                  <Burst color={c} size={28} />
                </motion.div>
              ))}
              <div className="flex-1 h-0.5 border-t-2 border-dashed border-black opacity-20" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.gallery.map((src, i) => (
                <GalleryCard key={i} src={src} index={i} accent={ACCENTS[i % ACCENTS.length]} />
              ))}
            </div>
          </div>
        )}

        {/* ── BOTTOM CTA ──────────────────────────────────── */}
        <motion.div
          className="border-t-2 border-black pt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <div>
            <p className="text-[10px] font-black tracking-widest uppercase mb-2 opacity-40">
              More work
            </p>
            <h3 className="font-black uppercase"
              style={{
                fontFamily: "'Bangers',cursive",
                fontSize: "clamp(2rem,4vw,3rem)",
                color: VX.dark,
                WebkitTextStroke: "1px #231400",
                letterSpacing: "0.05em",
              }}>
              See all projects
            </h3>
          </div>
          <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.15 }}>
            <Link to="/projects"
              className="inline-flex items-center gap-3 px-6 py-3 text-xs font-black uppercase tracking-widest border-2 border-black"
              style={{ background: VX.red, color: VX.white, boxShadow: `4px 4px 0px ${VX.dark}` }}>
              Back to Projects <ArrowLeft className="w-3 h-3 rotate-180" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
};