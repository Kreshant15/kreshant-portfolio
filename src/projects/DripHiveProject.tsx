import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { projects } from "../data/projects";

// ─── DripHive Brand Tokens ─────────────────────────────────
const DH = {
  orange:  "#FF4500",
  lime:    "#DDFE25",
  blue:    "#007BFF",
  black:   "#000000",
  white:   "#F5F5F5",
};

// ─── Grain overlay ─────────────────────────────────────────
const Grain = () => (
  <div
    className="pointer-events-none fixed inset-0 z-50 opacity-[0.04] mix-blend-overlay"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat",
      backgroundSize: "128px 128px",
    }}
  />
);

// ─── Section marker (stencil-style) ────────────────────────
const Marker = ({ num, label }: { num: string; label: string }) => (
  <div className="flex items-center gap-4 mb-6">
    <span
      className="text-[10px] font-black tracking-[0.4em] uppercase px-3 py-1 border"
      style={{
        fontFamily: "'Bebas Neue', 'Impact', sans-serif",
        color: DH.lime,
        borderColor: DH.lime,
        letterSpacing: "0.4em",
      }}
    >
      {num}
    </span>
    <div className="h-px flex-1 opacity-20" style={{ background: DH.lime }} />
    <span
      className="text-[10px] tracking-[0.25em] uppercase opacity-40"
      style={{ color: DH.white }}
    >
      {label}
    </span>
  </div>
);

// ─── Image grid ────────────────────────────────────────────
const ImgGrid = ({ images, title }: { images: string[]; title: string }) => {
  if (!images.length) return null;
  const single = images.length === 1;
  const triple = images.length === 3;

  return (
    <div
      className={`grid gap-3 mt-8 ${
        single ? "grid-cols-1" : triple ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1 md:grid-cols-2"
      }`}
    >
      {images.map((src, i) => (
        <motion.div
          key={i}
          className="relative overflow-hidden"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: i * 0.08 }}
          whileHover={{ scale: 1.01 }}
        >
          {/* corner marks */}
          <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 z-10" style={{ borderColor: DH.lime }} />
          <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 z-10" style={{ borderColor: DH.orange }} />
          <img
            src={src}
            alt={`${title} ${i + 1}`}
            className="w-full h-auto object-contain transition-transform duration-700 hover:scale-105 bg-[#0a0a0a] p-2"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </motion.div>
      ))}
    </div>
  );
};

// ─── MAIN ──────────────────────────────────────────────────
export const DripHiveProject = () => {
  const project = projects.find((p) => p.id === "driphive")!;
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "DripHive — Brand Identity | Kreshant Kumar";
  }, []);

  return (
    <main style={{ background: DH.black, color: DH.white }} className="relative min-h-screen">
      <Grain />

      {/* Navbar (shared, unchanged) */}
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <div ref={heroRef} className="relative h-[100dvh] flex items-end overflow-hidden">

        {/* Parallax hero image */}
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <img
            src={project.hero || project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, ${DH.black} 0%, ${DH.black}99 20%, transparent 60%)`,
            }}
          />
        </motion.div>

        {/* Hero text */}
        <div className="relative z-10 px-6 md:px-12 pb-16 w-full max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Tag */}
            <div className="flex items-center gap-3 mb-5">
              <span
                className="text-[10px] font-black tracking-[0.4em] uppercase px-3 py-1"
                style={{ background: DH.lime, color: DH.black }}
              >
                BRAND IDENTITY
              </span>
              <span className="text-[10px] tracking-[0.3em] uppercase opacity-50" style={{ color: DH.white }}>
                {project.date}
              </span>
            </div>

            {/* Title — Bebas Neue */}
            <h1
              className="text-[clamp(4rem,14vw,10rem)] leading-none font-black uppercase"
              style={{
                fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                color: DH.white,
                textShadow: `4px 4px 0 ${DH.orange}`,
              }}
            >
              DRIP
              <span style={{ color: DH.lime, textShadow: `4px 4px 0 ${DH.orange}` }}>HIVE</span>
            </h1>

            <p
              className="text-sm md:text-base max-w-xl mt-4 leading-relaxed opacity-70"
              style={{ color: DH.white }}
            >
              {project.description}
            </p>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-6 right-8 flex flex-col items-center gap-2 opacity-40"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span className="text-[9px] tracking-[0.3em] uppercase" style={{ color: DH.lime }}>SCROLL</span>
          <div className="w-px h-10" style={{ background: DH.lime }} />
        </motion.div>
      </div>

      {/* ── BODY ─────────────────────────────────────────── */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-24">

        {/* Back link */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-xs tracking-widest uppercase mb-20 opacity-50 hover:opacity-100 transition-opacity"
          style={{ color: DH.lime }}
        >
          <ArrowLeft className="w-3 h-3" /> All Projects
        </Link>

        {/* Meta strip */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-px mb-24"
          style={{ background: "#ffffff15" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {[
            { label: "Client", value: project.client },
            { label: "Category", value: project.category },
            { label: "Year", value: project.date },
            { label: "Type", value: project.tags[0] },
          ].map(({ label, value }) => (
            <div key={label} className="p-5" style={{ background: "#0a0a0a" }}>
              <p className="text-[9px] tracking-[0.35em] uppercase mb-1 opacity-40" style={{ color: DH.lime }}>
                {label}
              </p>
              <p className="text-sm font-semibold" style={{ color: DH.white }}>
                {value}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Overview */}
        <div className="mb-24">
          <Marker num="00" label="Overview" />
          <p
            className="text-base md:text-lg leading-loose max-w-3xl whitespace-pre-line"
            style={{ color: "#c0c0c0" }}
          >
            {project.fullDescription}
          </p>
        </div>

        {/* Tags row */}
        <div className="flex flex-wrap gap-2 mb-24">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-bold border"
              style={{ borderColor: "#333", color: DH.lime }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Sections */}
        {project.sections?.map((section, idx) => (
          <motion.div
            key={idx}
            className="mb-24 md:mb-32"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <Marker
              num={String(idx + 1).padStart(2, "0")}
              label={section.title}
            />

            <h2
              className="text-[clamp(2rem,5vw,4rem)] font-black uppercase leading-none mb-6"
              style={{
                fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                color: DH.white,
              }}
            >
              {section.title}
            </h2>

            <p
              className="text-[15px] leading-loose max-w-3xl whitespace-pre-line"
              style={{ color: "#aaaaaa" }}
            >
              {section.content}
            </p>

            <ImgGrid images={section.images} title={section.title} />
          </motion.div>
        ))}

        {/* Gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="mb-24">
            <Marker num="GL" label="Gallery" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {project.gallery.map((src, i) => (
                <motion.div
                  key={i}
                  className="relative overflow-hidden"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 z-10" style={{ borderColor: DH.lime }} />
                  <img
                    src={src}
                    alt={`Gallery ${i + 1}`}
                    className="w-full h-auto object-contain bg-[#0a0a0a] p-2"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA strip */}
        <motion.div
          className="border-t pt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          style={{ borderColor: "#1a1a1a" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div>
            <p
              className="text-[10px] tracking-[0.35em] uppercase mb-2 opacity-40"
              style={{ color: DH.lime }}
            >
              Next up
            </p>
            <h3
              className="text-3xl font-black uppercase"
              style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif", color: DH.white }}
            >
              See more work
            </h3>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-3 px-6 py-3 text-xs font-bold tracking-[0.2em] uppercase transition-colors"
            style={{ background: DH.lime, color: DH.black }}
          >
            All Projects <ExternalLink className="w-3 h-3" />
          </Link>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
};
