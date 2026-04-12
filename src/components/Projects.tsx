import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { useState, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { projects } from "../data/projects";

interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  tag: string; // short mono tag shown on card
}

// const projects: Project[] = [
//   {
//     id: "driphive",
//     title: "Driphive",
//     category: "Branding",
//     image: "/images/projects/driphive/Driphive-cover.webp",
//     tag: "BRAND",
//   },
//   {
//     id: "vexels",
//     title: "Vexels",
//     category: "Branding",
//     image: "https://picsum.photos/seed/vex/800/600",
//     tag: "BRAND",
//   },
//   {
//     id: "banana-quest",
//     title: "Banana Quest",
//     category: "UI Design",
//     image: "/images/projects/bquest/cover.webp",
//     tag: "UI",
//   },
//   {
//     id: "pixel-era",
//     title: "Pixel Era",
//     category: "Poster Design",
//     image: "https://picsum.photos/seed/pixel/800/600",
//     tag: "PRINT",
//   },
// ];

// ─── Individual Project Card ─────────────────────────────────────────────────

const ProjectCard = ({
  project,
  index,
  prefersReducedMotion,
}: {
  project: Project;
  index: number;
  prefersReducedMotion: boolean | null;
}) => {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Subtle 3-D tilt on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 → 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.65,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link
        to={`/projects/${project.id}`}
        className="group block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        aria-label={`View ${project.title} — ${project.category}`}
      >
        {/* ── IMAGE CONTAINER ─────────────────────────────────── */}
        <div
          ref={cardRef}
          className="relative aspect-[4/5] rounded-2xl overflow-hidden
            bg-neutral-100 will-change-transform
            transition-[transform,box-shadow] duration-300 ease-out
            shadow-[0_2px_20px_rgba(0,0,0,0.08)]"
          style={{
            boxShadow: hovered
              ? "0 20px 60px rgba(124,58,237,0.18), 0 4px 20px rgba(0,0,0,0.12)"
              : "0 2px 20px rgba(0,0,0,0.08)",
          }}
        >
          {/* Photo */}
          <motion.img
            src={project.image}
            alt={project.title}
            animate={{ scale: hovered ? 1.08 : 1 }}
            transition={{ duration: 0.55, ease: [0.33, 1, 0.68, 1] }}
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
          />

          {/* Persistent warm vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

          {/* Hover overlay — warm purple tint */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 bg-gradient-to-br from-violet-900/40 to-purple-800/20 pointer-events-none"
          />

          {/* ── Grain texture on card ── */}
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundSize: "128px",
            }}
          />

          {/* ── Corner brackets on hover ── */}
          {(["tl", "tr", "bl", "br"] as const).map((corner) => (
            <motion.div
              key={corner}
              animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.7 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="absolute pointer-events-none"
              style={{
                top:    corner.startsWith("t") ? 16 : "auto",
                bottom: corner.startsWith("b") ? 16 : "auto",
                left:   corner.endsWith("l")   ? 16 : "auto",
                right:  corner.endsWith("r")   ? 16 : "auto",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                {corner === "tl" && <><path d="M0 18 L0 0 L18 0" stroke="#c084fc" strokeWidth="1.5"/></>}
                {corner === "tr" && <><path d="M0 0 L18 0 L18 18" stroke="#c084fc" strokeWidth="1.5"/></>}
                {corner === "bl" && <><path d="M0 0 L0 18 L18 18" stroke="#c084fc" strokeWidth="1.5"/></>}
                {corner === "br" && <><path d="M18 0 L18 18 L0 18" stroke="#c084fc" strokeWidth="1.5"/></>}
              </svg>
            </motion.div>
          ))}

          {/* ── Top-left mono tag ── */}
          <div className="absolute top-4 left-4 z-10">
            <motion.span
              animate={{ opacity: hovered ? 1 : 0.7 }}
              className="font-mono text-[9px] tracking-[0.25em] uppercase
                text-white/90 bg-black/40 backdrop-blur-sm
                px-2.5 py-1 rounded-full border border-white/10"
            >
              {project.tag}
            </motion.span>
          </div>

          {/* ── Arrow icon on hover ── */}
          <motion.div
            animate={{
              opacity: hovered ? 1 : 0,
              x:       hovered ? 0  : 8,
              y:       hovered ? 0  : -8,
            }}
            transition={{ duration: 0.3 }}
            className="absolute top-4 right-4 z-10
              w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm
              flex items-center justify-center shadow-md"
          >
            <ArrowUpRight className="w-4 h-4 text-violet-700" />
          </motion.div>

          {/* ── ID bottom-right ── */}
          <motion.span
            animate={{ opacity: hovered ? 0.9 : 0.5 }}
            className="absolute bottom-4 right-4 font-mono text-[9px]
              tracking-widest text-white/70 z-10"
          >
            {String(project.id).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </motion.span>
        </div>

        {/* ── INFO ROW ──────────────────────────────────────────── */}
        <div className="mt-5 flex items-end justify-between gap-4 px-1">
          <div>
            {/* Title */}
            <h3 className="font-display font-black text-2xl sm:text-3xl
              tracking-tight text-[#111] leading-none
              group-hover:text-violet-700 transition-colors duration-300">
              {project.title}
            </h3>

            {/* Category */}
            <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-neutral-400">
              {project.category}
            </p>
          </div>

          {/* Hairline */}
          <motion.div
            animate={{ scaleX: hovered ? 1 : 0, originX: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 h-px bg-violet-300/60 hidden sm:block"
          />
        </div>
      </Link>
    </motion.div>
  );
};

// ─── Section Header ──────────────────────────────────────────────────────────

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <motion.span
    initial={{ opacity: 0, x: -16 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="inline-flex items-center gap-2
      font-mono text-[10px] uppercase tracking-[0.3em]
      text-purple-600 mb-4"
  >
    <span className="w-4 h-px bg-purple-400" />
    {children}
  </motion.span>
);

// ─── Main Section ────────────────────────────────────────────────────────────

export const Projects = ({
  showExploreButton = true,
}: {
  showExploreButton?: boolean;
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="projects"
      aria-label="Selected Works — Project Gallery"
      className="relative py-28 md:py-36 px-4 sm:px-6 overflow-hidden bg-[#faf7f2]"
    >
      {/* ── BACKGROUND (matches Hero) ──────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {/* Ambient blobs */}
        <div className="absolute -top-32 right-0 w-[400px] md:w-[600px] h-[400px]
          bg-gradient-to-bl from-purple-100/40 to-transparent blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[300px] md:w-[500px] h-[300px]
          bg-gradient-to-tr from-amber-100/30 to-transparent blur-[80px] rounded-full" />

        {/* Same subtle grid as Hero */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(#8b5cf6 1px, transparent 1px),
              linear-gradient(90deg, #8b5cf6 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">

        {/* ── SECTION HEADER ─────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-20">
          <div>
            <SectionLabel>Selected Works</SectionLabel>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-black leading-[0.9] tracking-tight"
            >
              {/* "PROJECT" — solid black, same weight as "KRESHANT" in Hero */}
              <span
                className="block text-[clamp(2.4rem,7vw,5.5rem)] text-[#111111]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                PROJECT
              </span>

              {/* "Gallery" — outline purple, same trick as "KUMAR" in Hero */}
              <span
                className="block text-[clamp(2.4rem,7vw,5.5rem)]"
                style={{
                  color: "transparent",
                  WebkitTextStroke: "2px #7c3aed",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                Gallery
              </span>
            </motion.h2>
          </div>

          {/* Descriptor — right side */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-sm text-sm md:text-base leading-relaxed
              text-neutral-500 font-light md:text-right"
          >
            A curated mix of branding, visual experiments, and concept-driven
            design — where each project explores a different idea, mood, or story.
          </motion.p>
        </div>

        {/* ── GRID ───────────────────────────────────────────────── */}
        {/*
          Smart grid: 4 cards → 2+2 on md, 3+1 on lg.
          On lg we span the orphaned 4th card across 2 columns
          so it never looks abandoned.
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
          {projects.map((project, i) => {
            // On large screens, last card (index 3 of 4) gets col-span-2
            // to prevent orphan. Only when total is 4 (adjust if you add more).
            const isOrphan = projects.length === 4 && i === 3;

            return (
              <div
                key={project.id}
                className={isOrphan ? "lg:col-span-1 lg:col-start-2" : ""}
              >
                <ProjectCard
                  project={project}
                  index={i}
                  prefersReducedMotion={prefersReducedMotion}
                />
              </div>
            );
          })}
        </div>

        {/* ── EXPLORE CTA ─────────────────────────────────────────── */}
        {showExploreButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mt-20 md:mt-24 text-center"
          >
            <Link
              to="/projects"
              aria-label="Explore all projects by Kreshant Kumar"
            >
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center gap-3
                  px-10 py-4 rounded-full
                  border border-neutral-300 bg-white/70 backdrop-blur-sm
                  text-sm font-semibold text-neutral-700
                  hover:border-violet-400 hover:text-violet-700
                  hover:shadow-[0_4px_24px_rgba(124,58,237,0.15)]
                  shadow-sm transition-all duration-300"
              >
                Explore All Projects
                <ArrowUpRight
                  className="w-4 h-4 text-violet-500
                    group-hover:translate-x-0.5 group-hover:-translate-y-0.5
                    transition-transform duration-200"
                />
              </motion.span>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Projects;
