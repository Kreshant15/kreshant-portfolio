import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

// ─── Antaryatra Brand Tokens ───────────────────────────────
const AT = {
  bg:       "#0f0700",   // deep ritual dark
  bgMid:    "#1a0c00",
  saffron:  "#FF6B1A",   // sacred fire
  gold:     "#D4952A",   // temple gold
  red:      "#C0392B",   // sindoor red
  cream:    "#F5E6C8",   // aged paper
  muted:    "#9B7B5A",
  dark:     "#2C1500",
};

// ─── Case Study Data ───────────────────────────────────────
const caseStudy = {
  title: "Antaryatra",
  devanagari: "अन्तर्यात्रा",
  subtitle: "The Journey Inward",
  tagline: "अन्तर्यात्रा — Not a destination. A dissolution.",
  category: "Poster Series",
  date: "2024–2025",
  client: "Personal Series",
  tags: ["Poster Design", "Indian Aesthetics", "Spiritual Art", "Typography", "Visual Storytelling"],

  overview: `Antaryatra — अन्तर्यात्रा — means "the inner journey." Not travel to a place. Travel to a state. The series began as a personal exploration of India's philosophical traditions and became something larger: a visual language for concepts that have no direct translation.

Each poster takes a single Sanskrit concept — Karma, Moksha, Maya, Krodh, Bhaya, Ahimsa, Shakti, Shraddha — and asks: what does this look like if you could see it? How does liberation feel different from illusion? What is the color of devotion?

The series doesn't illustrate religion. It tries to feel it.`,

  sections: [
    {
      title: "The Concept",
      content: `Indian philosophy contains ideas for which Western aesthetics has no visual vocabulary. Concepts like Maya — the illusion that masks reality — or Moksha — liberation not as escape but as return to truth — these resist simple representation.

Antaryatra attempts to build that vocabulary. Working from traditional Indian art forms — Madhubani, Tanjore, Pahari painting, temple iconography — and pulling them forward through contemporary design thinking.

The result is neither purely traditional nor purely modern. It sits in the space between: recognizably Indian, unmistakably contemporary.`,
      images: [
        "/images/projects/antaryatra/antaryatra.webp",
        "/images/projects/antaryatra/Ahinsa.webp",
      ],
    },
    {
      title: "Visual Language",
      content: `Color in Antaryatra is never decorative — it's semantic. Saffron for sacred fire and transformation. Deep crimson for passion, power, and the weight of Krodh (rage). The aged ochre of temple walls for wisdom that has survived centuries. Gold for the divine light that cuts through Maya.

Typography becomes devotional. Sanskrit text in Devanagari sits alongside English translations, the visual contrast itself communicating the gap between the felt and the explained. The Devanagari script is used structurally — not as decoration but as architecture.

Texture carries the memory of the series. The worn paper of old manuscripts, the visible brushwork of traditional painting, the sacred geometry of mandala forms — all present as structural elements, not surface treatment.`,
      images: [
        "/images/projects/antaryatra/Karma.webp",
        "/images/projects/antaryatra/bhaya.webp",
      ],
    },
    {
      title: "Key Pieces",
      content: `Karma — The most typographically restrained piece. Sanskrit verse at the base: कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। A figure from traditional painting at the top. The design trusts the words to do the work.

Krodh (Rage) — The most aggressive composition in the series. The Shiva-Nataraja energy channeled into layered type: Rage, Destruction, Intense, Calm. Krodh is not just anger — it is transformation through fire.

Maya — A deliberately disorienting piece. Nested picture frames within frames, a classical painting inside a modern frame inside an ancient frame. "Maya deludes the mind, masking reality with illusion." The design enacts what it describes.

Moksha — The quietest piece. A figure at peace in a landscape of water and light. "Liberation is not an escape, but a return to truth." The most minimal composition in the series — because liberation is the removal of everything unnecessary.

Shakti — The most devotionally intense. The goddess form in full traditional regalia, text cascading in both scripts. Power rendered as tenderness. The Sanskrit invocation as structural grid.`,
      images: [
        "/images/projects/antaryatra/krodh.webp",
        "/images/projects/antaryatra/Maya.webp",
        "/images/projects/antaryatra/Moksha.webp",
      ],
    },
    {
      title: "Process",
      content: `Each piece begins with the concept. Hours spent reading — the Bhagavad Gita, the Upanishads, secondary scholarship — before a single element is placed. The visual approach only becomes clear when the idea is clear.

Source imagery comes from traditional Indian art archives, temple photography, and classical painting references. Nothing is used without understanding its original context. Respect for the source material is non-negotiable.

The design process is then about translation — taking something that exists in the register of the sacred and finding a visual form that honors it without reducing it. The test: does this feel true?`,
      images: [
        "/images/projects/antaryatra/Shakti.webp",
        "/images/projects/antaryatra/shraddha.webp",
      ],
    },
    {
      title: "Conclusion",
      content: `Antaryatra is the most personal series in Kreshant's body of work. It comes from a question that has no final answer: what does it mean to be Indian in a globalized visual culture? How do you make work that is genuinely rooted without being nostalgic?

The series doesn't answer that. But it keeps asking the question in different forms, through different concepts, with growing clarity.

Antaryatra continues. The journey inward has no destination — only deepening.`,
      images: [],
    },
  ],

  posters: [
    { src: "/images/projects/antaryatra/antaryatra.webp", name: "Antaryatra", devanagari: "अन्तर्यात्रा" },
    { src: "/images/projects/antaryatra/Ahinsa.webp", name: "Ahinsa", devanagari: "अहिंसा" },
    { src: "/images/projects/antaryatra/bhaya.webp", name: "Bhaya", devanagari: "भय" },
    { src: "/images/projects/antaryatra/Karma.webp", name: "Karma", devanagari: "कर्म" },
    { src: "/images/projects/antaryatra/krodh.webp", name: "Krodh", devanagari: "क्रोध" },
    { src: "/images/projects/antaryatra/Maya.webp", name: "Maya", devanagari: "माया" },
    { src: "/images/projects/antaryatra/Moksha.webp", name: "Moksha", devanagari: "मोक्ष" },
    { src: "/images/projects/antaryatra/Shakti.webp", name: "Shakti", devanagari: "शक्ति" },
    { src: "/images/projects/antaryatra/shraddha.webp", name: "Shraddha", devanagari: "श्रद्धा" },
  ],
};

// ─── Mandala decoration ────────────────────────────────────
const Mandala = ({ size = 300, opacity = 0.04 }: { size?: number; opacity?: number }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ opacity }}>
    {[0, 30, 60, 90, 120, 150].map((angle) => (
      <g key={angle} transform={`rotate(${angle} 100 100)`}>
        <ellipse cx="100" cy="40" rx="6" ry="20" fill="none" stroke={AT.gold} strokeWidth="0.5" />
        <circle cx="100" cy="20" r="3" fill="none" stroke={AT.gold} strokeWidth="0.5" />
      </g>
    ))}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
      <line
        key={angle}
        x1="100" y1="100"
        x2={100 + 90 * Math.cos((angle * Math.PI) / 180)}
        y2={100 + 90 * Math.sin((angle * Math.PI) / 180)}
        stroke={AT.gold} strokeWidth="0.3" opacity="0.5"
      />
    ))}
    <circle cx="100" cy="100" r="80" fill="none" stroke={AT.gold} strokeWidth="0.4" />
    <circle cx="100" cy="100" r="55" fill="none" stroke={AT.saffron} strokeWidth="0.3" opacity="0.6" />
    <circle cx="100" cy="100" r="30" fill="none" stroke={AT.gold} strokeWidth="0.3" />
    <circle cx="100" cy="100" r="8" fill="none" stroke={AT.saffron} strokeWidth="0.5" />
    <circle cx="100" cy="100" r="3" fill={AT.gold} />
  </svg>
);

// ─── Section label ─────────────────────────────────────────
const SacredLabel = ({ num, label, devanagari }: { num: string; label: string; devanagari?: string }) => (
  <div className="flex items-center gap-4 mb-6">
    <div className="flex flex-col items-center">
      <div className="w-px h-4" style={{ background: AT.gold }} />
      <div className="w-2 h-2 rounded-full" style={{ background: AT.saffron }} />
      <div className="w-px h-4" style={{ background: AT.gold }} />
    </div>
    <div>
      <p className="text-[9px] tracking-[0.4em] uppercase" style={{ color: AT.gold, fontFamily: "serif" }}>
        {num} · {label}
      </p>
      {devanagari && (
        <p className="text-sm" style={{ color: AT.saffron, fontFamily: "'Noto Sans Devanagari', serif" }}>
          {devanagari}
        </p>
      )}
    </div>
    <div className="flex-1 h-px opacity-20" style={{ background: AT.gold }} />
  </div>
);

// ─── Poster card ───────────────────────────────────────────
const SacredCard = ({ src, name, devanagari, index }: { src: string; name: string; devanagari: string; index: number }) => (
  <motion.div
    className="relative overflow-hidden group cursor-pointer"
    style={{
      border: `1px solid ${AT.gold}30`,
    }}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: index * 0.07 }}
    whileHover={{ scale: 1.02 }}
  >
    <img src={src} alt={name} className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105 bg-[#1a0c00] p-2" loading="lazy" />
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col items-center justify-end p-4"
      style={{ background: `linear-gradient(to top, ${AT.bg}EE 0%, transparent 60%)` }}
    >
      <p style={{ color: AT.saffron, fontFamily: "'Noto Sans Devanagari', serif", fontSize: "1.1rem" }}>{devanagari}</p>
      <p className="text-xs tracking-widest uppercase" style={{ color: AT.cream }}>{name}</p>
    </div>
    {/* Gold corner ornament */}
    <div className="absolute top-2 left-2 w-4 h-4 pointer-events-none" style={{ opacity: 0.6 }}>
      <div className="absolute top-0 left-0 w-full h-px" style={{ background: AT.gold }} />
      <div className="absolute top-0 left-0 w-px h-full" style={{ background: AT.gold }} />
    </div>
    <div className="absolute bottom-2 right-2 w-4 h-4 pointer-events-none" style={{ opacity: 0.6 }}>
      <div className="absolute bottom-0 right-0 w-full h-px" style={{ background: AT.gold }} />
      <div className="absolute bottom-0 right-0 w-px h-full" style={{ background: AT.gold }} />
    </div>
  </motion.div>
);

// ─── Image grid ────────────────────────────────────────────
const SacredGrid = ({ images, title }: { images: string[]; title: string }) => {
  if (!images.length) return null;
  const single = images.length === 1;
  return (
    <div className={`grid gap-4 mt-10 ${single ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
      {images.map((src, i) => (
        <motion.div
          key={i}
          className="relative overflow-hidden group bg-[#1a0c00] p-2"
          style={{
            ...(single ? {} : { aspectRatio: "3 / 4" }),
            border: `1px solid ${AT.gold}25`,
            boxShadow: `0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 ${AT.gold}15`,
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: i * 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <img src={src} alt={`${title} ${i + 1}`} className={`w-full ${single ? "h-auto object-contain" : "h-full object-cover"} transition-transform duration-700 group-hover:scale-105`} loading="lazy" />
        </motion.div>
      ))}
    </div>
  );
};

// ─── MAIN ──────────────────────────────────────────────────
export const AntaryatraProject = () => {
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const mandalaRotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Antaryatra — Poster Series | Kreshant Kumar";
  }, []);

  return (
    <main style={{ background: AT.bg, color: AT.cream }} className="relative min-h-screen">
      {/* ── Texture overlay ───────────────────────────────── */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='1' height='1' fill='%23D4952A'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "4px 4px",
        }}
      />

      {/* Radial warm glow center */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${AT.saffron}12 0%, transparent 60%)`,
        }}
      />

      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <div ref={heroRef} className="relative flex flex-col items-center justify-center text-center overflow-hidden" style={{ height: "100dvh" }}>

        {/* BG hero image */}
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <img
            src="/images/projects/antaryatra/antaryatra.webp"
            alt="Antaryatra"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, ${AT.bg}CC 0%, ${AT.bg}70 40%, ${AT.bg}DD 75%, ${AT.bg} 100%)`,
            }}
          />
        </motion.div>

        {/* Mandala decoration — slowly rotating */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ rotate: mandalaRotate }}
        >
          <Mandala size={600} opacity={0.14} />
        </motion.div>

        <motion.div
          className="absolute top-[18%] right-[10%] pointer-events-none"
          animate={prefersReducedMotion ? undefined : { rotate: [0, -360] }}
          transition={prefersReducedMotion ? undefined : { duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <Mandala size={180} opacity={0.1} />
        </motion.div>

        {/* Hero text */}
        <div className="relative z-10 px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <p
              className="text-[10px] tracking-[0.5em] uppercase mb-6"
              style={{ color: AT.gold, fontFamily: "serif" }}
            >
              Poster Series · Personal Work
            </p>

            {/* Devanagari title */}
            <p
              className="text-[clamp(2rem,6vw,4rem)] leading-none mb-2"
              style={{
                fontFamily: "'Noto Sans Devanagari', serif",
                color: AT.saffron,
                textShadow: `0 0 40px ${AT.saffron}60`,
              }}
            >
              {caseStudy.devanagari}
            </p>

            {/* Latin title */}
            <h1
              className="text-[clamp(3.5rem,12vw,9rem)] font-black leading-none tracking-tight"
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                color: AT.cream,
              }}
            >
              ANTARYATRA
            </h1>

            <p
              className="text-base md:text-lg mt-6 max-w-md mx-auto leading-relaxed"
              style={{ color: AT.muted, fontFamily: "Georgia, serif", fontStyle: "italic" }}
            >
              {caseStudy.subtitle}
            </p>
          </motion.div>
        </div>

        {/* Flame-flicker scroll cue */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <div className="w-px h-12" style={{ background: `linear-gradient(to bottom, transparent, ${AT.saffron})` }} />
          <p className="text-[9px] tracking-[0.4em] uppercase" style={{ color: AT.gold, fontFamily: "serif" }}>
            ↓ scroll
          </p>
        </motion.div>
      </div>

      {/* ── BODY ─────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-24">

        {/* Back */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase mb-20 opacity-40 hover:opacity-100 transition-opacity"
          style={{ color: AT.gold, fontFamily: "serif" }}
        >
          <ArrowLeft className="w-3 h-3" /> All Projects
        </Link>

        {/* Meta strip */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-px mb-24"
          style={{ background: `${AT.gold}20` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {[
            { label: "Type", value: caseStudy.category },
            { label: "Client", value: caseStudy.client },
            { label: "Year", value: caseStudy.date },
            { label: "Language", value: "Sanskrit · Hindi · English" },
          ].map(({ label, value }) => (
            <div key={label} className="p-5" style={{ background: AT.bgMid }}>
              <p className="text-[9px] tracking-[0.4em] uppercase mb-1.5" style={{ color: AT.gold, fontFamily: "serif" }}>
                {label}
              </p>
              <p className="text-sm font-medium" style={{ color: AT.cream }}>
                {value}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Tagline */}
        <div className="mb-10 text-center py-12 border-y" style={{ borderColor: `${AT.gold}20` }}>
          <p
            className="text-lg md:text-2xl italic max-w-2xl mx-auto"
            style={{ fontFamily: "Georgia, serif", color: AT.saffron }}
          >
            "{caseStudy.tagline}"
          </p>
        </div>

        {/* Overview */}
        <div className="mb-24 mt-16">
          <SacredLabel num="00" label="Overview" />
          <p className="text-base leading-loose max-w-3xl whitespace-pre-line" style={{ color: AT.muted, fontFamily: "Georgia, serif" }}>
            {caseStudy.overview}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-24">
          {caseStudy.tags.map((tag) => (
            <span
              key={tag}
              className="text-[9px] tracking-[0.2em] uppercase px-3 py-1.5"
              style={{ border: `1px solid ${AT.gold}30`, color: AT.gold, fontFamily: "serif" }}
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
            transition={{ duration: 0.6 }}
          >
            <SacredLabel num={String(idx + 1).padStart(2, "0")} label={section.title} />
            <h2
              className="text-[clamp(1.8rem,4vw,3rem)] font-bold leading-tight mb-6"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: AT.cream }}
            >
              {section.title}
            </h2>
            <p
              className="text-[15px] leading-loose max-w-3xl whitespace-pre-line"
              style={{ color: AT.muted, fontFamily: "Georgia, serif" }}
            >
              {section.content}
            </p>
            <SacredGrid images={section.images} title={section.title} />
          </motion.div>
        ))}

        {/* ── POSTER SHRINE ───────────────────────────────── */}
        <div className="mb-24">
          <SacredLabel num="GL" label="The Full Series" />
          <p
            className="text-2xl font-bold mb-10"
            style={{ fontFamily: "Georgia, serif", color: AT.cream }}
          >
            All Nine Concepts
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {caseStudy.posters.map((poster, i) => (
              <SacredCard
                key={i}
                src={poster.src}
                name={poster.name}
                devanagari={poster.devanagari}
                index={i}
              />
            ))}
          </div>
        </div>

        {/* Bottom ornament + nav */}
        <div className="flex justify-center gap-6 mb-16">
          {[120, 90, 120].map((size, index) => (
            <motion.div
              key={size + index}
              animate={prefersReducedMotion ? undefined : { rotate: index % 2 === 0 ? 360 : -360 }}
              transition={prefersReducedMotion ? undefined : { duration: 28 + index * 6, repeat: Infinity, ease: "linear" }}
            >
              <Mandala size={size} opacity={index === 1 ? 0.4 : 0.28} />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="border-t pt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          style={{ borderColor: `${AT.gold}20` }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase mb-2 opacity-30" style={{ color: AT.gold, fontFamily: "serif" }}>
              Continue
            </p>
            <h3
              className="text-3xl font-bold"
              style={{ fontFamily: "Georgia, serif", color: AT.cream }}
            >
              All Projects
            </h3>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-3 px-6 py-3 text-[10px] tracking-widest uppercase transition-colors hover:opacity-80"
            style={{ border: `1px solid ${AT.gold}40`, color: AT.gold, fontFamily: "serif" }}
          >
            <ArrowLeft className="w-3 h-3" /> Return
          </Link>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
};
