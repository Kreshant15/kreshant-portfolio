import React, { useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { projects } from "../data/projects";

// ─── Brand Tokens ─────────────────────────────────────────
const DH = {
  orange: "#FF4500",
  lime:   "#DDFE25",
  blue:   "#007BFF",
  black:  "#000000",
  bg:     "#060606",
  bgMid:  "#0d0d0d",
  white:  "#F5F5F5",
  muted:  "#888888",
};

// ─── Noise grain overlay ──────────────────────────────────
const Grain = () => (
  <div className="pointer-events-none fixed inset-0 z-50 mix-blend-overlay"
    style={{
      opacity: 0.045,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat",
      backgroundSize: "128px 128px",
    }}
  />
);

// ─── Spray-paint drip particles ────────────────────────────
// Memoised so values don't re-randomise on render
const SprayParticles = () => {
  const drops = useMemo(() =>
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      color: [DH.lime, DH.orange, DH.blue, DH.white][i % 4],

      // spread across full screen
      left: `${(i * 4.3) % 100}%`,
      top: `${(i * 6.7) % 100}%`,

      // random-ish sizes
      size: i % 7 === 0 ? 6 : 2 + (i % 4),
      rotate: [0, (i % 2 === 0 ? 15 : -15)],

      // faster motion
      duration: i % 3 === 0 ? 5 : 3 + (i % 2),
      delay: (i * 0.4) % 5,

      // downward motion (gravity feel)
      yRange: 120 + (i % 80),

      // sideways drift
      xDrift: (i % 2 === 0 ? 1 : -1) * (20 + (i % 30)),

      // shape variation
      isCircle: i % 3 !== 0,
    })),
  []);

  return (
    <div className="pointer-events-none fixed inset-0 z-999 overflow-hidden">
      {drops.map((d) => (
        <motion.div
          key={d.id}
          style={{
            position: "absolute",
            left: d.left,
            top: d.top,

            width: d.size,
            height: d.size,

            borderRadius: d.isCircle ? "50%" : "2px",

            background: d.color,
            boxShadow: `0 0 ${d.size * 4}px ${d.color}99`,
            opacity: 0,
          }}

          animate={{
            y: [0, d.yRange],                // fall down
            x: [0, d.xDrift],                // drift sideways
            opacity: [0, 0.9, 0.4, 0],       // fade like spray
            scale: [0.8, 1, 0.95],           // subtle organic feel
          }}

          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            ease: "easeIn",                  // sharp gravity feel
          }}
        />
      ))}
    </div>
  );
};

// ─── Stencil / graffiti section marker ────────────────────
const Marker = ({ num, label }: { num: string; label: string }) => (
  <div className="flex items-center gap-4 mb-7">
    <span
      className="font-black tracking-[0.35em] uppercase px-3 py-1 border shrink-0"
      style={{
        fontFamily: "'Bebas Neue','Impact',sans-serif",
        fontSize: "0.6rem",
        color: DH.lime,
        borderColor: `${DH.lime}70`,
        boxShadow: `0 0 8px ${DH.lime}30`,
      }}
    >
      {num}
    </span>
    <div className="h-px flex-1 opacity-15" style={{ background: DH.lime }} />
    <span className="text-[9px] tracking-[0.3em] uppercase opacity-35" style={{ color: DH.white }}>
      {label}
    </span>
  </div>
);

// ─── IMAGE GRID — FIXED ───────────────────────────────────
// Rules (same pattern as Antaryatra / PixelEra fixes):
// • NO background on wrapper   → no dark rectangle
// • NO forced aspectRatio      → wide images show fully
// • NO object-cover            → use object-contain
// • NO p-2 padding             → image fills edge to edge
// • 1 img  → centred, natural height
// • 2 imgs → side by side
// • 3 imgs → all 3 in one row
// • 4+ imgs → 2-col grid
const ImgGrid = ({ images, title }: { images: string[]; title: string }) => {
  if (!images.length) return null;
  const n = images.length;
  const grid =
    n === 1 ? "grid-cols-1 max-w-4xl mx-auto" :
    n === 2 ? "grid-cols-1 md:grid-cols-2" :
    n === 3 ? "grid-cols-1 md:grid-cols-3" :
              "grid-cols-1 md:grid-cols-2";

  return (
    <div className={`grid gap-3 mt-10 ${grid}`}>
      {images.map((src, i) => (
        <motion.div key={i} className="relative overflow-hidden group"
          style={{ border: `1px solid ${DH.lime}20` }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: i * 0.07 }}
          whileHover={{ scale: 1.01, borderColor: `${DH.lime}60` }}>

          {/* lime top-left corner bracket */}
          <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 z-10"
            style={{ borderColor: DH.lime }} />
          {/* orange bottom-right corner bracket */}
          <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 z-10"
            style={{ borderColor: DH.orange }} />

          {/* IMAGE — natural size, no background, no aspect ratio lock */}
          <img src={src} alt={`${title} ${i + 1}`}
            className="w-full h-auto block object-contain transition-transform duration-700 group-hover:scale-[1.03]"
            loading="lazy" decoding="async" />

          {/* subtle bottom gradient on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
            style={{ background: `linear-gradient(to top,rgba(0,0,0,0.35) 0%,transparent 50%)` }} />
        </motion.div>
      ))}
    </div>
  );
};

// ─── Gallery image (no forced sizing) ─────────────────────
const GalleryImg = ({ src, index }: { src: string; index: number }) => (
  <motion.div className="relative overflow-hidden group"
    style={{ border: `1px solid ${DH.lime}18` }}
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.08 }}
    whileHover={{ scale: 1.01 }}>
    <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 z-10" style={{ borderColor: DH.lime }} />
    {/* NO background, NO padding, NO aspect ratio, NO object-cover */}
    <img src={src} alt={`Gallery ${index + 1}`}
      className="w-full h-auto block object-contain"
      loading="lazy" />
  </motion.div>
);

// ─── Street tag — decorative SVG graffiti squiggle ────────
const StreetTag = ({ color = DH.lime, opacity = 0.07 }: { color?: string; opacity?: number }) => (
  <svg width="220" height="60" viewBox="0 0 220 60"
    style={{ opacity, pointerEvents: "none", display: "block" }}
    fill="none">
    <path
      d="M10 42 C20 18 35 48 52 28 C68 8 80 50 98 30 C116 10 128 44 145 24 C162 4 175 46 195 26 C205 18 210 32 215 28"
      stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
    />
    <path
      d="M8 50 C30 38 50 52 72 44 C94 36 115 52 138 42 C162 32 183 50 210 40"
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5"
    />
  </svg>
);

// ─── Spray drip SVG — decorative corner deco ──────────────
const SprayDrip = ({ color = DH.lime, size = 48 }: { color?: string; size?: number }) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 48 68"
    style={{ pointerEvents: "none", display: "block" }} fill="none">
    <circle cx="24" cy="18" r="14" fill={color} opacity="0.85" />
    <path d="M21 30 Q22 46 20 56 Q22 62 24 64 Q26 62 28 56 Q26 46 27 30"
      fill={color} opacity="0.75" />
    <circle cx="19" cy="34" r="2" fill={color} opacity="0.4" />
    <circle cx="29" cy="40" r="1.5" fill={color} opacity="0.35" />
  </svg>
);

// ─── MAIN ─────────────────────────────────────────────────
export const DripHiveProject = () => {
  const project = projects.find((p) => p.id === "driphive")!;
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY       = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "DripHive — Brand Identity | Kreshant Kumar";
  }, []);

  return (
    <main style={{ background: DH.bg, color: DH.white }} className="relative min-h-screen">
      <Grain />
      <SprayParticles />

      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <div ref={heroRef} className="relative h-dvh flex items-end overflow-hidden">

        <motion.div className="absolute inset-0" style={{ y: heroY, opacity: heroOpacity }}>
          <img src={project.hero || project.image} alt={project.title}
            className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0"
            style={{ background: `linear-gradient(to top,${DH.black} 0%,${DH.black}CC 18%,transparent 58%)` }} />
        </motion.div>

        {/* decorative spray drip — top right */}
        <div className="absolute top-24 right-8 md:right-16 z-10 opacity-60 hidden md:block">
          <SprayDrip color={DH.lime} size={56} />
        </div>
        <div className="absolute top-32 right-24 z-10 opacity-30 hidden md:block">
          <SprayDrip color={DH.orange} size={32} />
        </div>

        {/* hero text */}
        <div className="relative z-10 px-6 md:px-12 pb-16 w-full max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}>

            <div className="flex items-center gap-3 mb-5">
              <span className="text-[10px] font-black tracking-[0.4em] uppercase px-3 py-1"
                style={{ background: DH.lime, color: DH.black }}>
                BRAND IDENTITY
              </span>
              <span className="text-[10px] tracking-[0.3em] uppercase opacity-50" style={{ color: DH.white }}>
                {project.date}
              </span>
            </div>

            <h1 className="leading-none font-black uppercase"
              style={{
                fontFamily: "'Bebas Neue','Impact',sans-serif",
                fontSize: "clamp(4rem,14vw,10rem)",
                color: DH.white,
                textShadow: `4px 4px 0 ${DH.orange}`,
              }}>
              DRIP
              <span style={{ color: DH.lime, textShadow: `4px 4px 0 ${DH.orange}` }}>HIVE</span>
            </h1>

            {/* street tag squiggle under the title */}
            <StreetTag color={DH.lime} opacity={0.35} />

            <p className="text-sm md:text-base max-w-xl mt-3 leading-relaxed opacity-70" style={{ color: DH.white }}>
              {project.description}
            </p>
          </motion.div>
        </div>

        {/* scroll cue */}
        <motion.div className="absolute bottom-6 right-8 flex flex-col items-center gap-2 opacity-40"
          animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <span className="text-[9px] tracking-[0.3em] uppercase" style={{ color: DH.lime }}>SCROLL</span>
          <div className="w-px h-10" style={{ background: DH.lime }} />
        </motion.div>
      </div>

      {/* ── BODY ─────────────────────────────────────────── */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-24">

        {/* back */}
        <Link to="/projects"
          className="inline-flex items-center gap-2 text-xs tracking-widest uppercase mb-20 opacity-50 hover:opacity-100 transition-opacity"
          style={{ color: DH.lime }}>
          <ArrowLeft className="w-3 h-3" /> All Projects
        </Link>

        {/* meta strip */}
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-px mb-24"
          style={{ background: "#ffffff12" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          {[
            { label: "Client",   value: project.client     },
            { label: "Category", value: project.category   },
            { label: "Year",     value: project.date       },
            { label: "Type",     value: project.tags[0]    },
          ].map(({ label, value }) => (
            <div key={label} className="p-5 group transition-colors duration-300"
              style={{ background: DH.bgMid }}>
              <p className="text-[9px] tracking-[0.35em] uppercase mb-1.5 opacity-40"
                style={{ color: DH.lime }}>{label}</p>
              <p className="text-sm font-semibold" style={{ color: DH.white }}>{value}</p>
              {/* lime bottom border on hover */}
              <div className="h-px w-0 group-hover:w-full transition-all duration-400 mt-2"
                style={{ background: DH.lime }} />
            </div>
          ))}
        </motion.div>

        {/* overview */}
        <div className="mb-24">
          <Marker num="00" label="Overview" />
          <p className="text-base md:text-lg leading-loose max-w-3xl whitespace-pre-line"
            style={{ color: "#c0c0c0" }}>
            {project.fullDescription}
          </p>
        </div>

        {/* tags */}
        <div className="flex flex-wrap gap-2 mb-24">
          {project.tags.map((tag) => (
            <motion.span key={tag}
              className="px-3 py-1 text-[9px] tracking-[0.2em] uppercase font-bold border cursor-default"
              style={{ borderColor: "#2a2a2a", color: DH.lime }}
              whileHover={{ borderColor: DH.lime, boxShadow: `0 0 8px ${DH.lime}30`, scale: 1.04 }}>
              {tag}
            </motion.span>
          ))}
        </div>

        {/* sections */}
        {project.sections?.map((section, idx) => (
          <motion.div key={idx} className="mb-24 md:mb-32 relative"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}>

            {/* decorative graffiti squiggle every other section */}
            {idx % 2 === 0 && (
              <div className="absolute -right-4 top-0 opacity-[0.06] hidden lg:block pointer-events-none">
                <StreetTag color={idx % 4 === 0 ? DH.lime : DH.orange} opacity={1} />
              </div>
            )}

            <Marker num={String(idx + 1).padStart(2, "0")} label={section.title} />

            <h2 className="font-black uppercase leading-none mb-6"
              style={{
                fontFamily: "'Bebas Neue','Impact',sans-serif",
                fontSize: "clamp(2rem,5vw,4rem)",
                color: DH.white,
              }}>
              {section.title}
            </h2>

            <p className="text-[15px] leading-loose max-w-3xl whitespace-pre-line"
              style={{ color: "#aaaaaa" }}>
              {section.content}
            </p>

            {/* ── IMAGE GRID ────────────── */}
            <ImgGrid images={section.images} title={section.title} />
          </motion.div>
        ))}

        {/* gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="mb-24">
            <Marker num="GL" label="Gallery" />

            {/* spray-drip accent above gallery */}
            <div className="flex gap-3 mb-6 opacity-40">
              <SprayDrip color={DH.lime} size={28} />
              <SprayDrip color={DH.orange} size={20} />
              <SprayDrip color={DH.blue} size={24} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {project.gallery.map((src, i) => (
                <GalleryImg key={i} src={src} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* bottom divider with graffiti tag */}
        <div className="flex items-center gap-4 mb-16 opacity-20">
          <div className="h-px flex-1" style={{ background: DH.lime }} />
          <StreetTag color={DH.lime} opacity={1} />
          <div className="h-px flex-1" style={{ background: DH.orange }} />
        </div>

        {/* CTA strip */}
        <motion.div className="border-t pt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          style={{ borderColor: "#1a1a1a" }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>

          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase mb-2 opacity-40" style={{ color: DH.lime }}>
              Next up
            </p>
            <h3 className="font-black uppercase"
              style={{
                fontFamily: "'Bebas Neue','Impact',sans-serif",
                fontSize: "clamp(1.8rem,4vw,3rem)",
                color: DH.white,
              }}>
              See more work
            </h3>
          </div>

          <Link to="/projects"
            className="inline-flex items-center gap-3 px-6 py-3 text-xs font-bold tracking-[0.2em] uppercase transition-all hover:gap-4"
            style={{ background: DH.lime, color: DH.black }}>
            All Projects <ExternalLink className="w-3 h-3" />
          </Link>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
};