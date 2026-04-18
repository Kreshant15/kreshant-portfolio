import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

// ─── Banana Quest Brand Tokens ─────────────────────────────
const BQ = {
  bg:      "#1A3A0A",    // deep jungle green
  bgMid:   "#0F2206",
  banana:  "#FFD93D",    // banana yellow
  green:   "#4CAF50",    // jungle leaf
  brown:   "#8B5E3C",    // tree bark
  sky:     "#87CEEB",    // cartoon sky
  cream:   "#FFF9E6",    // parchment
  wood:    "#C4813A",    // wood panel
  dark:    "#1A0F00",
  red:     "#FF6B6B",    // error red
  white:   "#FFFFFF",
};

// ─── Case Study Data ───────────────────────────────────────
const caseStudy = {
  title: "Banana Quest",
  subtitle: "ABC Fun — A Learning Game for Little Explorers",
  tagline: "Find the letter. Win the banana. Save the jungle.",
  category: "UI Design · Game Design",
  date: "August 2024",
  client: "Academic Project",
  tags: ["UI Design", "Game Design", "Figma", "Kids App", "Education", "Interaction Design"],

  overview: `Banana Quest: ABC Fun is a children's educational game concept designed for young learners ages 3–6. The goal: make learning the alphabet feel like an adventure.

The game follows a lovable monkey mascot through a lush jungle world where letters are the key to progress. Each round presents a challenge — find the matching letter — and rewards success with celebration, animations, and banana-collecting mayhem.

The project was designed entirely in Figma, including a working interactive prototype with real navigation, question flows, success states, and error handling.`,

  sections: [
    {
      title: "The Design Challenge",
      content: `Educational games for young children face a specific tension: they need to be simple enough for a 3-year-old to navigate, but engaging enough to hold attention beyond the first five minutes.

Most educational apps err too far toward "educational" — clean, clinical, forgettable. Banana Quest went the other way. The learning is real, but it's wrapped in a world that feels genuinely fun to be in.

The monkey mascot, the jungle environment, the wood-panel UI, the "YAY!" and "UH OH!" feedback moments — all of it exists to make the act of finding the right letter feel like an actual event worth celebrating.`,
      images: [
        "/images/projects/bquest/Home-Screen.webp",
        "/images/projects/bquest/Question-1.webp",
      ],
    },
    {
      title: "Visual Design System",
      content: `The visual language draws from classic cartoon aesthetics — thick black outlines, saturated fills, wood-panel textures that feel tangible and inviting.

Color is used as an emotional signal system. The jungle greens create a sense of adventure and exploration. Banana yellow serves as the primary accent — reward, attention, delight. Wood browns ground the UI in something warm and tactile. Sky blue appears in success moments, suggesting open space and freedom.

Typography is bold, rounded, and warm — the "Banana Quest ABC Fun" logotype sits in the center of the home screen with the authority of a children's book cover. All instructional text is large, high-contrast, and child-readable.

The monkey mascot appears on every screen — celebrating on the finish screen, looking sad-but-encouraging on error screens, cheering on question screens. He's the emotional anchor of the entire experience.`,
      images: [
        "/images/projects/bquest/Finish-Screen.webp",
        "/images/projects/bquest/Congratulations-screen.webp",
      ],
    },
    {
      title: "Game Flow & Interactions",
      content: `The game loop is deliberately tight: Home → Question → Success/Error → Next Question → Finish → Home.

Each question screen presents three letter choices at large, tappable scale. The challenge text at the top ("Find The Letter — A") is clear and consistent. No visual noise around the choices — just the letters, the monkey, and the jungle backdrop.

Error states are handled warmly: "UH OH! Don't worry! Let's try again." with a RETRY button. No penalty, no discouragement — just an invitation to try once more. The monkey's expression softens to match.

Success states escalate in energy: "AMAZING! YOU DID IT LIL CHAMP" with a YAY button. The language is enthusiastic without being patronizing.

The final CONGRATULATIONS screen is the big payoff — the monkey waves, confetti implied by the composition, and a HOME button closes the loop.`,
      images: [
        "/images/projects/bquest/Question-2.webp",
        "/images/projects/bquest/Error-1.webp",
        "/images/projects/bquest/Question-3.webp",
      ],
    },
    {
      title: "Prototype",
      content: `The Figma prototype implements the full game loop with real interactions — tapping letters triggers responses, retry buttons return to the question, the home button resets the experience.

Every state is connected: the prototype can be walked through as a real product demo, which was a deliberate decision. Static screens are easy. A working prototype demonstrates that the interaction logic holds up, that the experience flows correctly, that a child could actually use it.

The prototype also served as a UX validation tool — tracing through it revealed small friction points (question text placement, button sizing) that were fixed before the final frames were locked.`,
      images: [
        "/images/projects/bquest/Error-2.webp",
        "/images/projects/bquest/Error-3.webp",
      ],
    },
    {
      title: "Reflection",
      content: `Banana Quest was a lesson in designing for an audience that gives you almost no margin for error. Children have zero patience for confusing interfaces and perfect instincts for what feels genuinely fun versus what is designed to seem fun.

The constraints were generative: limited vocabulary, maximum simplicity, complete emotional clarity. Every design decision had to pass the test of "would a 4-year-old immediately understand this?"

The project also proved the value of a complete prototype. Presenting a working game feels fundamentally different from presenting static screens — it shifts the conversation from "what it looks like" to "how it works," which is where good design actually lives.`,
      images: [],
    },
  ],

  screens: [
    { src: "/images/projects/bquest/Home-Screen.webp", label: "Home Screen" },
    { src: "/images/projects/bquest/Question-1.webp", label: "Question — A" },
    { src: "/images/projects/bquest/Question-2.webp", label: "Question — B" },
    { src: "/images/projects/bquest/Question-3.webp", label: "Question — C" },
    { src: "/images/projects/bquest/Error-1.webp", label: "Error State" },
    { src: "/images/projects/bquest/Error-2.webp", label: "Error State 2" },
    { src: "/images/projects/bquest/Error-3.webp", label: "Error State 3" },
    { src: "/images/projects/bquest/Finish-Screen.webp", label: "Round Complete" },
    { src: "/images/projects/bquest/Congratulations-screen.webp", label: "Congratulations" },
  ],
};

// ─── Floating leaves ───────────────────────────────────────
const Leaf = ({ x, delay, size }: { x: string; delay: number; size: number }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ left: x, top: "-10%", fontSize: size, zIndex: 1 }}
    animate={{ y: ["0vh", "110vh"], rotate: [0, 360], x: [0, 30, -20, 10, 0] }}
    transition={{ duration: 8 + Math.random() * 6, delay, repeat: Infinity, ease: "linear" }}
  >
    🍃
  </motion.div>
);

// ─── Section label ─────────────────────────────────────────
const JungleLabel = ({ num, label }: { num: string; label: string }) => (
  <div className="flex items-center gap-3 mb-6">
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 border-black shrink-0"
      style={{ background: BQ.banana, color: BQ.dark }}
    >
      {num}
    </div>
    <span
      className="text-sm font-black uppercase tracking-widest"
      style={{ color: BQ.banana, fontFamily: "'Fredoka One', 'Nunito', cursive" }}
    >
      {label}
    </span>
    <div className="flex-1 flex gap-1 items-center">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="h-1 rounded-full"
          style={{ width: i % 2 === 0 ? "12px" : "6px", background: BQ.green, opacity: 0.4 }}
        />
      ))}
    </div>
  </div>
);

// ─── Wood panel card ───────────────────────────────────────
const WoodCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`rounded-2xl border-2 border-black p-6 shadow-[4px_4px_0px_#1A0F00] ${className}`}
    style={{
      background: `linear-gradient(135deg, ${BQ.wood} 0%, #A0652A 50%, ${BQ.wood} 100%)`,
      backgroundImage: `
        linear-gradient(135deg, rgba(255,255,255,0.05) 25%, transparent 25%),
        linear-gradient(225deg, rgba(255,255,255,0.05) 25%, transparent 25%),
        linear-gradient(135deg, ${BQ.wood}, #A0652A)
      `,
    }}
  >
    {children}
  </div>
);

// ─── Image grid ────────────────────────────────────────────
const GameGrid = ({ images, title }: { images: string[]; title: string }) => {
  if (!images.length) return null;
  const single = images.length === 1;
  const triple = images.length === 3;

  return (
    <div className={`grid gap-4 mt-10 ${single ? "grid-cols-1" : triple ? "grid-cols-3" : "grid-cols-2"}`}>
      {images.map((src, i) => (
        <motion.div
          key={i}
          className="relative overflow-hidden rounded-2xl border-2 border-black shadow-[3px_3px_0px_#1A0F00]"
          style={{ aspectRatio: single ? "16/9" : "4/3" }}
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          whileHover={{ scale: 1.03, rotate: i % 2 === 0 ? 0.5 : -0.5 }}
        >
          <img src={src} alt={`${title} ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
        </motion.div>
      ))}
    </div>
  );
};

// ─── Screen showcase card ──────────────────────────────────
const ScreenCard = ({ src, label, index }: { src: string; label: string; index: number }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border-2 border-black cursor-pointer"
      style={{
        aspectRatio: "4/3",
        boxShadow: hovered ? `0 8px 0 #1A0F00` : `4px 4px 0 #1A0F00`,
        transition: "box-shadow 0.15s",
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -4 }}
    >
      <img src={src} alt={label} className="w-full h-full object-cover" loading="lazy" />
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute inset-0 flex items-end p-3"
            style={{ background: "rgba(26,15,0,0.75)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <span
              className="text-[10px] font-black uppercase tracking-widest"
              style={{ color: BQ.banana, fontFamily: "'Fredoka One', cursive" }}
            >
              {label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── MAIN ──────────────────────────────────────────────────
export const BananaQuestProject = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Banana Quest — Kids UI Design | Kreshant Kumar";
  }, []);

  return (
    <main style={{ background: BQ.bg }} className="relative min-h-screen overflow-x-hidden">
      {/* ── Jungle atmosphere ─────────────────────────────── */}
      {/* Sky gradient at top */}
      <div
        className="absolute top-0 left-0 right-0 h-[100dvh] pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, #87CEEB 0%, #4a9e60 40%, ${BQ.bg} 80%)`,
          opacity: 0.15,
          zIndex: 0,
        }}
      />

      {/* Falling leaves */}
      {[
        { x: "5%", delay: 0, size: 20 },
        { x: "25%", delay: 3, size: 16 },
        { x: "55%", delay: 1.5, size: 22 },
        { x: "75%", delay: 4, size: 18 },
        { x: "90%", delay: 2, size: 14 },
      ].map((leaf, i) => <Leaf key={i} {...leaf} />)}

      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 min-h-[100dvh]">

        {/* Tree canopy arch illustration (CSS) */}
        <div className="absolute top-20 left-0 right-0 flex justify-between pointer-events-none px-4">
          <div className="text-[6rem] opacity-40 -ml-8" style={{ filter: "blur(2px)" }}>🌳</div>
          <div className="text-[5rem] opacity-30 mt-8" style={{ filter: "blur(1px)" }}>🎋</div>
          <div className="text-[7rem] opacity-35 -mr-8" style={{ filter: "blur(2px)" }}>🌴</div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Monkey emoji hero */}
          <motion.div
            className="text-[5rem] mb-4"
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            🐒
          </motion.div>

          {/* Category */}
          <p
            className="text-[10px] tracking-[0.4em] uppercase mb-4 font-bold"
            style={{ color: BQ.green, fontFamily: "'Fredoka One', cursive" }}
          >
            UI Design · Game Design · Figma Prototype
          </p>

          {/* Title — wood-sign style */}
          <div
            className="inline-block px-8 py-4 rounded-2xl border-4 border-black mb-6 shadow-[6px_6px_0px_#1A0F00]"
            style={{ background: `linear-gradient(135deg, ${BQ.wood}, #C4913A)` }}
          >
            <h1
              className="text-[clamp(2.5rem,10vw,6rem)] font-black leading-none"
              style={{
                fontFamily: "'Fredoka One', 'Nunito', cursive",
                color: BQ.banana,
                textShadow: `3px 3px 0 #5A3010, -1px -1px 0 #8B5E2A`,
                WebkitTextStroke: "1px #5A3010",
              }}
            >
              BANANA QUEST
            </h1>
            <p
              className="text-base font-black uppercase tracking-widest mt-1"
              style={{ color: BQ.cream, fontFamily: "'Fredoka One', cursive" }}
            >
              ABC FUN
            </p>
          </div>

          <p
            className="text-base md:text-lg max-w-md mx-auto font-bold"
            style={{ color: BQ.cream, fontFamily: "'Nunito', sans-serif", opacity: 0.85 }}
          >
            {caseStudy.tagline}
          </p>

          {/* Banana emoji row */}
          <div className="flex justify-center gap-2 mt-6 text-2xl">
            {["🍌", "🅰️", "🍌", "🅱️", "🍌"].map((e, i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
              >
                {e}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <span className="text-2xl">👇</span>
        </motion.div>
      </div>

      {/* ── BODY ─────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-24">

        {/* Back */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase mb-16 opacity-50 hover:opacity-100 transition-opacity"
          style={{ color: BQ.banana, fontFamily: "'Fredoka One', cursive" }}
        >
          <ArrowLeft className="w-3 h-3" /> All Projects
        </Link>

        {/* Meta cards — wood panels */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {[
            { label: "Type", value: "UI + Game Design", emoji: "🎮" },
            { label: "Tool", value: "Figma", emoji: "✏️" },
            { label: "Year", value: caseStudy.date, emoji: "📅" },
            { label: "Audience", value: "Ages 3–6", emoji: "👶" },
          ].map(({ label, value, emoji }) => (
            <WoodCard key={label}>
              <p className="text-lg mb-1">{emoji}</p>
              <p className="text-[9px] tracking-widest uppercase font-bold mb-1" style={{ color: BQ.banana }}>
                {label}
              </p>
              <p className="text-sm font-black" style={{ color: BQ.cream }}>
                {value}
              </p>
            </WoodCard>
          ))}
        </motion.div>

        {/* Overview */}
        <div className="mb-20">
          <JungleLabel num="0" label="Overview" />
          <p
            className="text-base leading-loose max-w-3xl whitespace-pre-line font-medium"
            style={{ color: BQ.cream, fontFamily: "'Nunito', sans-serif", opacity: 0.85 }}
          >
            {caseStudy.overview}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-20">
          {caseStudy.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-black"
              style={{ background: BQ.banana + "25", color: BQ.banana, fontFamily: "'Fredoka One', cursive" }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Sections */}
        {caseStudy.sections.map((section, idx) => (
          <motion.div
            key={idx}
            className="mb-20 md:mb-28"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <JungleLabel num={String(idx + 1)} label={section.title} />
            <h2
              className="text-[clamp(1.8rem,4vw,3rem)] font-black leading-tight mb-5"
              style={{ fontFamily: "'Fredoka One', 'Nunito', cursive", color: BQ.banana }}
            >
              {section.title}
            </h2>
            <p
              className="text-[15px] leading-loose max-w-3xl whitespace-pre-line font-medium"
              style={{ color: BQ.cream, fontFamily: "'Nunito', sans-serif", opacity: 0.85 }}
            >
              {section.content}
            </p>
            <GameGrid images={section.images} title={section.title} />
          </motion.div>
        ))}

        {/* ── SCREEN SHOWCASE ──────────────────────────────── */}
        <div className="mb-20">
          <JungleLabel num="★" label="All Screens" />
          <h2
            className="text-2xl font-black mb-8"
            style={{ fontFamily: "'Fredoka One', cursive", color: BQ.banana }}
          >
            The Complete Game 🎮
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {caseStudy.screens.map((screen, i) => (
              <ScreenCard key={i} src={screen.src} label={screen.label} index={i} />
            ))}
          </div>
        </div>

        {/* Prototype CTA */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <WoodCard className="text-center relative overflow-hidden">
            <div className="text-5xl mb-4">🐒🍌</div>
            <h3
              className="text-2xl font-black mb-2"
              style={{ fontFamily: "'Fredoka One', cursive", color: BQ.banana }}
            >
              Try the Prototype!
            </h3>
            <p
              className="text-sm mb-6 max-w-sm mx-auto font-medium"
              style={{ color: BQ.cream, fontFamily: "'Nunito', sans-serif" }}
            >
              The full interactive game flow is available as a working Figma prototype — tap through the screens like a real app.
            </p>
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full border-2 border-black font-black text-sm transition-transform hover:scale-105 shadow-[3px_3px_0px_#1A0F00]"
              style={{ background: BQ.green, color: BQ.white, fontFamily: "'Fredoka One', cursive" }}
            >
              Open in Figma <ExternalLink className="w-4 h-4" />
            </a>
          </WoodCard>
        </motion.div>

        {/* Bottom nav */}
        <motion.div
          className="border-t-2 border-dashed pt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          style={{ borderColor: `${BQ.green}40` }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div>
            <p
              className="text-[10px] tracking-widest uppercase mb-2 font-black opacity-40"
              style={{ color: BQ.banana, fontFamily: "'Fredoka One', cursive" }}
            >
              More Adventures →
            </p>
            <h3
              className="text-3xl font-black"
              style={{ fontFamily: "'Fredoka One', cursive", color: BQ.banana }}
            >
              All Projects 🗺️
            </h3>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full border-2 border-black font-black text-sm shadow-[3px_3px_0px_#1A0F00] transition-transform hover:-translate-y-0.5"
            style={{ background: BQ.banana, color: BQ.dark, fontFamily: "'Fredoka One', cursive" }}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Projects
          </Link>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
};
