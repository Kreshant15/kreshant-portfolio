import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { projects } from "../data/projects";

// ─── Aura Brand Tokens ─────────────────────────────────────
const AU = {
  bg:          "#080B1A",   // deep space
  bgMid:       "#0D1130",
  serenity:    "#C8C0FF",   // lavender
  calm:        "#00C8C8",   // teal
  melancholy:  "#5A5EE8",   // periwinkle
  euphoria:    "#FFD700",   // gold
  energy:      "#FF00FF",   // magenta
  text:        "#E8E4FF",
  muted:       "#8B87B8",
};

// Emotion → glow map for section accents
const emotionColors = [AU.serenity, AU.calm, AU.melancholy, AU.euphoria, AU.energy, AU.serenity, AU.calm];

// ─── Orb component ─────────────────────────────────────────
const Orb = ({ color, size = 300, blur = 120, x = "50%", y = "50%", opacity = 0.18 }: {
  color: string; size?: number; blur?: number; x?: string; y?: string; opacity?: number;
}) => (
  <div
    className="absolute pointer-events-none rounded-full"
    style={{
      width: size, height: size,
      left: x, top: y,
      transform: "translate(-50%, -50%)",
      background: color,
      filter: `blur(${blur}px)`,
      opacity,
    }}
  />
);

// ─── Section label (Aura editorial style) ─────────────────
const AuraLabel = ({ num, label, color }: { num: string; label: string; color: string }) => (
  <div className="flex items-center gap-4 mb-6">
    <span
      className="text-[9px] tracking-[0.4em] uppercase font-medium"
      style={{ color, fontFamily: "'DM Sans', sans-serif" }}
    >
      {num} · {label}
    </span>
    <div className="flex-1 h-px opacity-10" style={{ background: color }} />
  </div>
);

// ─── Glass card wrapper ─────────────────────────────────────
const Glass = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`rounded-2xl border ${className}`}
    style={{
      background: "rgba(255,255,255,0.04)",
      borderColor: "rgba(255,255,255,0.08)",
      backdropFilter: "blur(20px)",
    }}
  >
    {children}
  </div>
);

// ─── Image grid (ambient, softly glowing) ─────────────────
const AuraGrid = ({ images, title, accent }: { images: string[]; title: string; accent: string }) => {
  if (!images.length) return null;
  const single = images.length === 1;
  return (
    <div className={`grid gap-4 mt-10 ${single ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
      {images.map((src, i) => (
        <motion.div
          key={i}
          className="relative overflow-hidden rounded-2xl"
          style={{
            ...(single ? {} : { aspectRatio: "4 / 3" }),
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: `0 0 40px ${accent}22`,
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: i * 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <img
            src={src}
            alt={`${title} ${i + 1}`}
            className={`w-full ${single ? "h-auto object-contain" : "h-full object-cover"} transition-transform duration-700 hover:scale-[1.04] bg-[#0D1130] p-2`}
            loading="lazy"
            decoding="async"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(8,11,26,0.5) 0%, transparent 60%)" }}
          />
          {/* Glow edge */}
          <div
            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
            style={{ boxShadow: `inset 0 0 40px ${accent}30` }}
          />
        </motion.div>
      ))}
    </div>
  );
};

// ─── Floating orb cursor follower ─────────────────────────
const CursorGlow = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 60, damping: 20 });
  const sy = useSpring(y, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed z-20 rounded-full"
      style={{
        width: 400, height: 400,
        x: sx, y: sy,
        translateX: "-50%", translateY: "-50%",
        background: `radial-gradient(circle, ${AU.serenity}18 0%, transparent 70%)`,
      }}
    />
  );
};

// ─── MAIN ──────────────────────────────────────────────────
export const AuraProject = () => {
  const project = projects.find((p) => p.id === "aura-app")!;
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Aura — Emotional Music UI | Kreshant Kumar";
  }, []);

  return (
    <main
      className="relative min-h-screen"
      style={{ background: AU.bg, color: AU.text }}
    >
      <CursorGlow />

      {/* ── Global ambient orbs ──────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <Orb color={AU.serenity} size={600} blur={180} x="15%" y="20%" opacity={0.10} />
        <Orb color={AU.calm} size={400} blur={140} x="80%" y="60%" opacity={0.08} />
        <Orb color={AU.melancholy} size={500} blur={160} x="50%" y="80%" opacity={0.07} />
      </div>

      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <div
        ref={heroRef}
        className="relative flex items-center justify-center"
        style={{ height: "100dvh", overflow: "hidden" }}
      >
        {/* Hero image parallax */}
        <motion.div className="absolute inset-0" style={{ y: heroY, opacity: heroOpacity }}>
          <img
            src={project.hero || project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, ${AU.bg}CC 0%, ${AU.bg}80 40%, ${AU.bg}EE 80%, ${AU.bg} 100%)`,
            }}
          />
        </motion.div>

        {/* Centered hero text */}
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Label */}
            <p
              className="text-[10px] tracking-[0.5em] uppercase mb-8 opacity-50"
              style={{ color: AU.serenity, fontFamily: "'DM Sans', sans-serif" }}
            >
              UI Design · Interaction · Product Concept
            </p>

            {/* Main title — Syne */}
            <h1
              className="text-[clamp(4rem,14vw,11rem)] font-black leading-none tracking-[-0.03em] mb-6"
              style={{ fontFamily: "'Syne', sans-serif", color: AU.text }}
            >
              AURA
            </h1>

            {/* Subtitle */}
            <p
              className="text-sm md:text-base max-w-lg mx-auto leading-relaxed"
              style={{ color: AU.muted, fontFamily: "'DM Sans', sans-serif" }}
            >
              {project.description}
            </p>

            {/* CTA */}
            {project.prototypeUrl && (
              <motion.div
                className="mt-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  to={project.prototypeUrl}
                  className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-sm font-medium transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${AU.serenity}30, ${AU.calm}20)`,
                    border: `1px solid ${AU.serenity}40`,
                    color: AU.serenity,
                    backdropFilter: "blur(20px)",
                  }}
                >
                  <span>Experience Prototype</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
        >
          <div className="w-px h-12" style={{ background: `linear-gradient(to bottom, transparent, ${AU.serenity})` }} />
          <p className="text-[9px] tracking-[0.4em] uppercase" style={{ color: AU.muted }}>scroll</p>
        </motion.div>
      </div>

      {/* ── BODY ─────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-24">

        {/* Back link */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-xs tracking-widest uppercase mb-20 transition-opacity hover:opacity-60"
          style={{ color: AU.muted, fontFamily: "'DM Sans', sans-serif" }}
        >
          <ArrowLeft className="w-3 h-3" /> All Projects
        </Link>

        {/* Meta cards — glass surface */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {[
            { label: "Client", value: project.client, glow: AU.serenity },
            { label: "Category", value: project.category, glow: AU.calm },
            { label: "Year", value: project.date, glow: AU.melancholy },
            { label: "Type", value: project.tags[0], glow: AU.euphoria },
          ].map(({ label, value, glow }) => (
            <Glass key={label} className="p-5">
              <p
                className="text-[9px] tracking-[0.35em] uppercase mb-1.5"
                style={{ color: glow, fontFamily: "'DM Sans', sans-serif", opacity: 0.7 }}
              >
                {label}
              </p>
              <p className="text-sm font-semibold" style={{ color: AU.text, fontFamily: "'Syne', sans-serif" }}>
                {value}
              </p>
            </Glass>
          ))}
        </motion.div>

        {/* Emotion color system showcase */}
        <motion.div
          className="mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <AuraLabel num="00" label="Emotional Color System" color={AU.serenity} />
          <div className="flex flex-wrap gap-4 mt-6">
            {[
              { name: "Serenity", hex: AU.serenity, bpm: "40–65 BPM" },
              { name: "Calm", hex: AU.calm, bpm: "60–90 BPM" },
              { name: "Melancholy", hex: AU.melancholy, bpm: "50–80 BPM" },
              { name: "Euphoria", hex: AU.euphoria, bpm: "120–160 BPM" },
              { name: "Energy", hex: AU.energy, bpm: "140–180 BPM" },
            ].map(({ name, hex, bpm }) => (
              <motion.div
                key={name}
                className="flex flex-col items-center gap-2"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className="w-14 h-14 md:w-16 md:h-16 rounded-full"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, ${hex}, ${hex}88)`,
                    boxShadow: `0 8px 32px ${hex}60, inset 0 -4px 8px rgba(0,0,0,0.3)`,
                  }}
                />
                <p className="text-[10px] font-semibold" style={{ color: hex, fontFamily: "'Syne', sans-serif" }}>
                  {name}
                </p>
                <p className="text-[9px] opacity-40" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {bpm}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Overview */}
        <div className="mb-24">
          <AuraLabel num="01" label="Overview" color={AU.calm} />
          <p
            className="text-base md:text-lg leading-[1.9] max-w-3xl whitespace-pre-line"
            style={{ color: AU.muted, fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
          >
            {project.fullDescription}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-24">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 rounded-full text-[10px] tracking-[0.2em] uppercase"
              style={{
                background: "rgba(200,192,255,0.08)",
                border: "1px solid rgba(200,192,255,0.2)",
                color: AU.serenity,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Sections */}
        {project.sections?.map((section, idx) => {
          const accent = emotionColors[idx % emotionColors.length];
          return (
            <motion.div
              key={idx}
              className="relative mb-24 md:mb-32"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              {/* Section ambient orb */}
              <div
                className="absolute -left-12 top-0 w-40 h-40 rounded-full pointer-events-none"
                style={{ background: accent, filter: "blur(80px)", opacity: 0.06 }}
              />

              <AuraLabel num={String(idx + 1).padStart(2, "0")} label={section.title} color={accent} />

              <h2
                className="text-[clamp(2rem,4.5vw,3.5rem)] font-black leading-none mb-6 tracking-[-0.02em]"
                style={{ fontFamily: "'Syne', sans-serif", color: AU.text }}
              >
                {section.title}
              </h2>

              <p
                className="text-[15px] leading-[1.95] max-w-3xl whitespace-pre-line"
                style={{ color: AU.muted, fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
              >
                {section.content}
              </p>

              <AuraGrid images={section.images} title={section.title} accent={accent} />
            </motion.div>
          );
        })}

        {/* Gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="mb-24">
            <AuraLabel num="GL" label="Visual Gallery" color={AU.euphoria} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.gallery.map((src, i) => (
                <motion.div
                  key={i}
                  className="relative overflow-hidden rounded-2xl"
                  style={{
                    border: "1px solid rgba(255,255,255,0.06)",
                    boxShadow: `0 0 60px ${AU.serenity}18`,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <img src={src} alt={`Gallery ${i + 1}`} className="w-full h-auto object-contain bg-[#0D1130] p-2" loading="lazy" />
                  <div className="absolute inset-0 bg-linear-to-t from-[#080B1A]/60 to-transparent" />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Prototype CTA (if exists) */}
        {project.prototypeUrl && (
          <motion.div
            className="mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Glass className="p-10 text-center relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${AU.serenity}30, transparent 70%)`,
                }}
              />
              <p
                className="relative z-10 text-[10px] tracking-[0.4em] uppercase mb-4 opacity-50"
                style={{ color: AU.serenity }}
              >
                Interactive Experience
              </p>
              <h3
                className="relative z-10 text-3xl font-black mb-4"
                style={{ fontFamily: "'Syne', sans-serif", color: AU.text }}
              >
                Try the Prototype
              </h3>
              <p className="relative z-10 text-sm mb-8 max-w-md mx-auto" style={{ color: AU.muted }}>
                The prototype goes beyond static screens — interact with mood switching, live calibration, and dynamic UI responses.
              </p>
              <Link
                to={project.prototypeUrl}
                className="relative z-10 inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: `linear-gradient(135deg, ${AU.serenity}, ${AU.calm})`,
                  color: AU.bg,
                  fontWeight: 600,
                }}
              >
                Open Prototype <ExternalLink className="w-4 h-4" />
              </Link>
            </Glass>
          </motion.div>
        )}

        {/* Bottom nav */}
        <motion.div
          className="border-t pt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase mb-2 opacity-30" style={{ color: AU.serenity }}>
              Continue exploring
            </p>
            <h3
              className="text-3xl font-black"
              style={{ fontFamily: "'Syne', sans-serif", color: AU.text }}
            >
              All Projects
            </h3>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:scale-[1.02]"
            style={{
              border: `1px solid ${AU.serenity}40`,
              color: AU.serenity,
              background: `${AU.serenity}10`,
            }}
          >
            <ArrowLeft className="w-4 h-4" /> View All Work
          </Link>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
};
