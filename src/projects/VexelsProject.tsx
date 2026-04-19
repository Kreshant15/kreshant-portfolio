import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { projects } from "../data/projects";

// ─── Vexel Brand Tokens ───────────────────────────────────
const VX = {
  red:    "#FA4C56",
  orange: "#FFB429",
  blue:   "#00AAFF",
  purple: "#BE56F1",
  yellow: "#F3E44B",
  mint:   "#13EC9E",
  dark:   "#231400",
  white:  "#FFFFFF",
};

// Halftone dot pattern SVG background
const halftoneDataUrl = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Ccircle cx='10' cy='10' r='1.5' fill='%23231400' opacity='0.08'/%3E%3C/svg%3E")`;

// ─── Comic burst shape ─────────────────────────────────────
const Burst = ({ color, size = 60 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <polygon
      points="50,0 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35"
      fill={color}
    />
  </svg>
);

// ─── Section label (comic panel style) ────────────────────
const PanelLabel = ({ num, title, color }: { num: string; title: string; color: string }) => (
  <div className="flex items-center gap-3 mb-6">
    <span
      className="w-10 h-10 flex items-center justify-center text-sm font-black rounded-full border-2 border-black text-white shrink-0"
      style={{ background: color, fontFamily: "'Bangers', 'Impact', cursive" }}
    >
      {num}
    </span>
    <span
      className="text-[11px] font-black tracking-[0.3em] uppercase"
      style={{ fontFamily: "'Bangers', cursive", color: VX.dark, letterSpacing: "0.2em", fontSize: "14px" }}
    >
      {title}
    </span>
    <div className="flex-1 flex gap-1">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-1 flex-1 rounded-full" style={{ background: i % 2 === 0 ? color : "transparent", border: `1px solid ${color}`, opacity: 0.4 }} />
      ))}
    </div>
  </div>
);

// Cycling accent colors for sections
const sectionColors = [VX.red, VX.blue, VX.purple, VX.mint, VX.orange, VX.yellow, VX.red];

// ─── Image grid ────────────────────────────────────────────
const ComicGrid = ({ images, title, accent }: { images: string[]; title: string; accent: string }) => {
  if (!images.length) return null;
  const single = images.length === 1;

  return (
    <div className={`grid gap-4 mt-8 ${single ? "grid-cols-1" : images.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
      {images.map((src, i) => (
        <motion.div
          key={i}
          className="relative overflow-hidden border-2 border-black shadow-[4px_4px_0px_#231400]"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: i * 0.07 }}
          whileHover={{ rotate: i % 2 === 0 ? 0.5 : -0.5, scale: 1.02 }}
          style={{ aspectRatio: single ? "16/9" : "4/3" }}
        >
          <img
            src={src}
            alt={`${title} ${i + 1}`}
            className="w-full h-full object-contain bg-[#fff7de] p-2"
            loading="lazy"
            decoding="async"
          />
          {/* Comic panel corner */}
          <div
            className="absolute top-2 right-2 w-2 h-2 rounded-full border border-black"
            style={{ background: accent }}
          />
        </motion.div>
      ))}
    </div>
  );
};

// ─── MAIN ──────────────────────────────────────────────────
export const VexelsProject = () => {
  const project = projects.find((p) => p.id === "vexel")!;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Vexel — Brand Identity | Kreshant Kumar";
  }, []);

  return (
    <main
      className="relative min-h-screen"
      style={{ background: "#FFFBF0", color: VX.dark }}
    >
      {/* Halftone bg texture */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ backgroundImage: halftoneDataUrl, backgroundRepeat: "repeat" }}
      />

      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <div className="relative pt-32 pb-0 px-6 md:px-12 max-w-7xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back */}
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-12 hover:opacity-70 transition-opacity"
            style={{ color: VX.dark }}
          >
            <ArrowLeft className="w-3 h-3" /> All Projects
          </Link>

          {/* Tag pill */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className="text-xs font-black px-3 py-1 border-2 border-black uppercase tracking-widest"
              style={{ background: VX.yellow, color: VX.dark }}
            >
              BRAND IDENTITY
            </span>
            <span className="text-xs font-bold opacity-50">{project.date}</span>
          </div>

          {/* Giant title with thick stroke */}
          <div className="relative mb-8">
            <h1
              className="text-[clamp(4.5rem,16vw,13rem)] font-black uppercase leading-none tracking-tight"
              style={{
                fontFamily: "'Bangers', 'Impact', cursive",
                WebkitTextStroke: "3px #231400",
                color: VX.red,
                letterSpacing: "0.04em",
              }}
            >
              VEX
              <span style={{ color: VX.blue }}>EL</span>
            </h1>

            {/* Burst decorations */}
            <motion.div
              className="absolute -top-4 -right-4 md:right-32"
              animate={{ rotate: [0, 15, -5, 0] }}
              transition={{ repeat: Infinity, duration: 5 }}
            >
              <Burst color={VX.yellow} size={72} />
            </motion.div>
            <motion.div
              className="absolute bottom-2 left-[40%]"
              animate={{ rotate: [0, -10, 5, 0] }}
              transition={{ repeat: Infinity, duration: 6, delay: 0.5 }}
            >
              <Burst color={VX.mint} size={40} />
            </motion.div>
          </div>

          <p
            className="text-base md:text-lg font-bold max-w-2xl leading-relaxed"
            style={{ color: VX.dark, opacity: 0.7 }}
          >
            {project.description}
          </p>
        </motion.div>
      </div>

      {/* Hero image */}
      <motion.div
        className="relative z-10 mx-6 md:mx-12 mt-10 border-2 border-black shadow-[8px_8px_0px_#231400] overflow-hidden"
        style={{ maxWidth: "calc(100% - 3rem)" }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <img
          src={project.hero || project.image}
          alt={project.title}
          className="w-full h-auto object-cover"
          style={{ maxHeight: "70vh" }}
          loading="eager"
        />
        {/* Comic caption bar */}
        <div
          className="absolute bottom-0 left-0 right-0 px-5 py-2 text-[10px] font-black tracking-widest uppercase border-t-2 border-black"
          style={{ background: VX.yellow, color: VX.dark }}
        >
          A Visual Playground by Kreshant Kumar
        </div>
      </motion.div>

      {/* ── BODY ─────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20">

        {/* Meta cards */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { label: "Client", value: project.client, color: VX.red },
            { label: "Category", value: project.category, color: VX.blue },
            { label: "Date", value: project.date, color: VX.purple },
            { label: "Type", value: project.tags[0], color: VX.mint },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="p-4 border-2 border-black shadow-[3px_3px_0px_#231400]"
              style={{ background: color + "18" }}
            >
              <p
                className="text-[9px] font-black tracking-widest uppercase mb-1"
                style={{ color }}
              >
                {label}
              </p>
              <p className="text-sm font-bold" style={{ color: VX.dark }}>
                {value}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Overview */}
        <div className="mb-20">
          <PanelLabel num="0" title="Overview" color={VX.orange} />
          <p
            className="text-base md:text-lg leading-loose max-w-3xl whitespace-pre-line font-medium"
            style={{ color: VX.dark, opacity: 0.75 }}
          >
            {project.fullDescription}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-20">
          {project.tags.map((tag, i) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_#231400]"
              style={{ background: sectionColors[i % sectionColors.length] + "30", color: VX.dark }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Sections */}
        {project.sections?.map((section, idx) => {
          const accent = sectionColors[idx % sectionColors.length];
          return (
            <motion.div
              key={idx}
              className="mb-20 md:mb-28"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45 }}
            >
              <PanelLabel num={String(idx + 1)} title={section.title} color={accent} />

              <h2
                className="text-[clamp(2rem,5vw,3.5rem)] font-black uppercase leading-none mb-5"
                style={{
                  fontFamily: "'Bangers', cursive",
                  color: accent,
                  WebkitTextStroke: "1.5px #231400",
                  letterSpacing: "0.05em",
                }}
              >
                {section.title}
              </h2>

              <p
                className="text-[15px] leading-loose max-w-3xl whitespace-pre-line font-medium"
                style={{ color: VX.dark, opacity: 0.7 }}
              >
                {section.content}
              </p>

              <ComicGrid images={section.images} title={section.title} accent={accent} />
            </motion.div>
          );
        })}

        {/* Gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="mb-20">
            <PanelLabel num="★" title="Gallery" color={VX.purple} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.gallery.map((src, i) => (
                <motion.div
                  key={i}
                  className="relative overflow-hidden border-2 border-black shadow-[5px_5px_0px_#231400]"
                  style={{ aspectRatio: "16/9" }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <img src={src} alt={`Gallery ${i + 1}`} className="w-full h-full object-contain bg-[#fff7de] p-2" loading="lazy" />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          className="border-t-2 border-black pt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div>
            <p className="text-[10px] font-black tracking-widest uppercase mb-2 opacity-40">
              More work
            </p>
            <h3
              className="text-4xl font-black uppercase"
              style={{ fontFamily: "'Bangers', cursive", color: VX.dark, WebkitTextStroke: "1px #231400", letterSpacing: "0.05em" }}
            >
              See all projects
            </h3>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-3 px-6 py-3 text-xs font-black uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_#231400] transition-transform hover:-translate-y-0.5"
            style={{ background: VX.red, color: VX.white }}
          >
            Back to Projects <ArrowLeft className="w-3 h-3 rotate-180" />
          </Link>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
};
