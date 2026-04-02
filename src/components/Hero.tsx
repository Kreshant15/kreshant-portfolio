import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "motion/react";
import { ArrowUpRight, Download } from "lucide-react";

// ─── Design Tool Icons floating behind name ─────────────────────────────────

const DESIGN_TOOLS = [
  { label: "Ps", color: "#31A8FF", x: "8%",  y: "22%", size: 44, delay: 0 },
  { label: "Ai", color: "#FF9A00", x: "88%", y: "18%", size: 44, delay: 0.4 },
  { label: "Fg", color: "#A259FF", x: "5%",  y: "68%", size: 40, delay: 0.8 },
  { label: "Cv", color: "#00C4CC", x: "90%", y: "65%", size: 40, delay: 0.6 },
  { label: "Cd", color: "#00A950", x: "50%", y: "12%", size: 36, delay: 1.0 },
  { label: "Xd", color: "#FF61F6", x: "75%", y: "80%", size: 36, delay: 1.2 },
];

// ─── Orbital shape decorations ───────────────────────────────────────────────

const ORBITAL_SHAPES = [
  { type: "circle",   cx: "15%", cy: "30%", r: 6,  color: "#c084fc", delay: 0 },
  { type: "square",   cx: "82%", cy: "25%", r: 8,  color: "#f472b6", delay: 0.5 },
  { type: "triangle", cx: "20%", cy: "75%", r: 7,  color: "#818cf8", delay: 1.0 },
  { type: "diamond",  cx: "78%", cy: "72%", r: 6,  color: "#34d399", delay: 0.3 },
  { type: "circle",   cx: "50%", cy: "88%", r: 5,  color: "#fb923c", delay: 0.7 },
  { type: "plus",     cx: "92%", cy: "45%", r: 8,  color: "#e879f9", delay: 1.3 },
  { type: "circle",   cx: "3%",  cy: "50%", r: 4,  color: "#60a5fa", delay: 0.9 },
];

// ─── Floating design tool badge ──────────────────────────────────────────────

const ToolBadge = ({
  label, color, x, y, size, delay, prefersReducedMotion,
}: {
  key?: string | number;
  label: string; color: string; x: string; y: string;
  size: number; delay: number; prefersReducedMotion: boolean | null;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: delay + 0.6, duration: 0.5, type: "spring", stiffness: 200 }}
    style={{ left: x, top: y, position: "absolute", zIndex: 2 }}
  >
    <motion.div
      animate={
        !prefersReducedMotion
          ? { y: [0, -8, 0], rotate: [0, 3, -3, 0] }
          : {}
      }
      transition={{ duration: 3 + delay, repeat: Infinity, ease: "easeInOut" }}
      className="relative group cursor-default select-none"
    >
      {/* Glow */}
      <div
        className="absolute inset-0 rounded-xl blur-md opacity-40 group-hover:opacity-70 transition-opacity"
        style={{ backgroundColor: color, width: size + 8, height: size + 8, top: -4, left: -4 }}
      />
      {/* Badge */}
      <div
        className="relative flex items-center justify-center rounded-xl font-black text-white shadow-lg border border-white/20 backdrop-blur-sm"
        style={{
          width: size, height: size,
          backgroundColor: color + "dd",
          fontSize: size * 0.38,
          letterSpacing: "-0.03em",
        }}
      >
        {label}
      </div>
    </motion.div>
  </motion.div>
);

// ─── Tiny floating shape ─────────────────────────────────────────────────────

const OrbitalShape = ({
  type, cx, cy, r, color, delay, prefersReducedMotion,
}: {
  key?: string | number;
  type: string; cx: string; cy: string; r: number;
  color: string; delay: number; prefersReducedMotion: boolean | null;
}) => {
  const shapes: Record<string, React.ReactNode> = {
    circle:   <div className="rounded-full border-2" style={{ width: r * 2, height: r * 2, borderColor: color }} />,
    square:   <div className="rounded-sm border-2 rotate-12" style={{ width: r * 2, height: r * 2, borderColor: color }} />,
    diamond:  <div className="border-2 rotate-45" style={{ width: r * 2, height: r * 2, borderColor: color }} />,
    triangle: (
      <div style={{ width: 0, height: 0,
        borderLeft: `${r}px solid transparent`,
        borderRight: `${r}px solid transparent`,
        borderBottom: `${r * 1.7}px solid ${color}`,
        opacity: 0.7,
      }} />
    ),
    plus: (
      <div className="relative" style={{ width: r * 2, height: r * 2 }}>
        <div className="absolute" style={{ width: 2, height: r * 2, backgroundColor: color, left: r - 1 }} />
        <div className="absolute" style={{ height: 2, width: r * 2, backgroundColor: color, top: r - 1 }} />
      </div>
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay + 1.2, duration: 0.6 }}
      style={{ left: cx, top: cy, position: "absolute", zIndex: 1, transform: "translate(-50%, -50%)" }}
    >
      <motion.div
        animate={!prefersReducedMotion ? { y: [0, -10, 0], x: [0, 4, 0] } : {}}
        transition={{ duration: 4 + delay * 0.7, repeat: Infinity, ease: "easeInOut" }}
        style={{ opacity: 0.6 }}
      >
        {shapes[type] ?? shapes.circle}
      </motion.div>
    </motion.div>
  );
};

// ─── Text scramble hook ──────────────────────────────────────────────────────

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&";

function useTextScramble(target: string, trigger: boolean) {
  const [display, setDisplay] = useState(target);
  const frame = useRef(0);
  const raf = useRef<number>();

  useEffect(() => {
    if (!trigger) return;
    let iteration = 0;
    const total = target.length * 3;
    const animate = () => {
      setDisplay(
        target
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < Math.floor(iteration / 3)) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );
      iteration++;
      if (iteration < total) {
        raf.current = requestAnimationFrame(animate);
      } else {
        setDisplay(target);
      }
    };
    cancelAnimationFrame(raf.current!);
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current!);
  }, [trigger, target]);

  return display;
}

// ─── Cursor follower (desktop only) ─────────────────────────────────────────

const CursorGlow = () => {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 80, damping: 20 });
  const springY = useSpring(y, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <motion.div
      className="pointer-events-none fixed z-0 hidden md:block"
      style={{
        left: springX, top: springY,
        x: "-50%", y: "-50%",
        width: 320, height: 320,
        background: "radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%)",
        borderRadius: "50%",
      }}
    />
  );
};

// ─── Main Hero ───────────────────────────────────────────────────────────────

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [nameHovered, setNameHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity   = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const translateY = useTransform(scrollYProgress, [0, 0.65], [0, -60]);

  const kreshantDisplay = useTextScramble("KRESHANT", nameHovered);
  const kumarDisplay    = useTextScramble("KUMAR",    nameHovered);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => setIsDownloading(false), 3000);
  };

  return (
    <>
      {/* structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Kreshant Kumar",
            jobTitle: "Graphic Designer",
            url: "https://kreshrts-portfolio.vercel.app",
            sameAs: ["https://instagram.com/kreshrts"],
            description:
              "Graphic designer specialising in bold, concept-driven visuals — branding, poster design, and digital aesthetics.",
          }),
        }}
      />

      <CursorGlow />

      <section
        ref={containerRef}
        aria-label="Hero — Kreshant Kumar, Graphic Designer"
        className="relative min-h-[100svh] flex items-center justify-center overflow-hidden
          pt-[72px] pb-20 md:pb-28
          bg-[#faf7f2]"
      >
        {/* ── BACKGROUND ── */}
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
          {/* Grain texture via SVG filter */}
          <svg width="0" height="0" className="absolute">
            <filter id="grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
              <feBlend in="SourceGraphic" mode="multiply" />
            </filter>
          </svg>
          <div className="absolute inset-0 opacity-[0.04]" style={{ filter: "url(#grain)", background: "#000" }} />

          {/* Ambient blobs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] md:w-[700px] h-[340px]
            bg-gradient-to-br from-purple-200/30 via-pink-100/20 to-transparent
            blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-1/4 w-[300px] md:w-[500px] h-[300px]
            bg-gradient-to-tr from-violet-200/25 to-transparent blur-[80px] rounded-full" />
          <div className="absolute bottom-1/4 right-0 w-[250px] md:w-[400px] h-[250px]
            bg-gradient-to-tl from-amber-100/30 to-transparent blur-[70px] rounded-full" />

          {/* Subtle grid lines */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(#8b5cf6 1px, transparent 1px),
                linear-gradient(90deg, #8b5cf6 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* ── DESIGN TOOL BADGES (behind name) ── */}
        <div className="absolute inset-0 z-[2] pointer-events-none hidden sm:block" aria-hidden>
          {DESIGN_TOOLS.map((t) => (
            <ToolBadge key={t.label} {...t} prefersReducedMotion={prefersReducedMotion} />
          ))}
        </div>

        {/* ── ORBITAL SHAPES ── */}
        <div className="absolute inset-0 z-[1] pointer-events-none" aria-hidden>
          {ORBITAL_SHAPES.map((s, i) => (
            <OrbitalShape key={i} {...s} prefersReducedMotion={prefersReducedMotion} />
          ))}
        </div>

        {/* ── CONTENT ── */}
        <motion.div
          style={{ opacity, y: translateY }}
          className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-8 text-center"
        >
          {/* Availability pill */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-7 md:mb-10
              px-4 py-1.5 rounded-full
              bg-white/80 backdrop-blur-md
              border border-purple-200/60 shadow-sm
              text-[10px] md:text-xs uppercase tracking-[0.18em] font-mono text-purple-700"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-500" />
            </span>
            Available for Freelance
          </motion.div>

          {/* ── NAME ── */}
          <div
            className="mb-4 md:mb-6 relative"
            onMouseEnter={() => !prefersReducedMotion && setNameHovered(true)}
            onMouseLeave={() => setNameHovered(false)}
          >
            {/* Background "DESIGN" watermark text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              aria-hidden
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            >
              <span
                className="font-black text-[clamp(1.2rem,8vw,5rem)] tracking-[0.5em] uppercase"
                style={{
                  color: "transparent",
                  WebkitTextStroke: "1px rgba(139,92,246,0.10)",
                  letterSpacing: "0.45em",
                }}
              >
                DESIGNER
              </span>
            </motion.div>

            <h1 className="font-display font-black leading-[0.88] tracking-tight select-none">
              {/* KRESHANT */}
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <span
                  className="text-[clamp(3rem,11vw,8.5rem)] text-[#111111]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {prefersReducedMotion ? "KRESHANT" : kreshantDisplay}
                </span>
              </motion.span>

              {/* KUMAR — outline style */}
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                <span
                  className="text-[clamp(3rem,11vw,8.5rem)]"
                  style={{
                    color: "transparent",
                    WebkitTextStroke: "2px #7c3aed",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {prefersReducedMotion ? "KUMAR" : kumarDisplay}
                </span>
              </motion.span>
            </h1>

            {/* Hover hint */}
            <AnimatePresence>
              {!nameHovered && !prefersReducedMotion && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 2.5 }}
                  className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px]
                    text-purple-400 tracking-widest uppercase font-mono whitespace-nowrap"
                >
                  hover to glitch ✦
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Role */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-[10px] sm:text-xs md:text-sm tracking-[0.4em] uppercase
              text-purple-600 font-semibold"
          >
            [ Graphic Designer ]
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-5 max-w-xl mx-auto text-sm md:text-base leading-relaxed
              text-neutral-600 px-2 font-light"
          >
            I design bold, concept-driven visuals that blend culture, emotion,
            and digital aesthetics. From glitchy experiments to meaningful visual
            stories — ideas that feel something.
          </motion.p>

          {/* ── CTAs ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {/* PRIMARY */}
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="group relative px-7 py-3.5 md:px-9 md:py-4 rounded-full
                font-semibold text-sm md:text-base text-white overflow-hidden
                shadow-[0_4px_24px_rgba(124,58,237,0.35)]
                hover:shadow-[0_6px_32px_rgba(124,58,237,0.5)]
                transition-shadow duration-300 flex items-center gap-2.5"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #a855f7, #c084fc)",
              }}
              aria-label="Let's work together — jump to contact"
            >
              {/* shine sweep */}
              <span
                className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%]
                  transition-transform duration-700 ease-in-out
                  bg-gradient-to-r from-transparent via-white/25 to-transparent"
              />
              <span className="relative">Let's Work Together</span>
              <ArrowUpRight
                className="relative w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </motion.a>

            {/* SECONDARY */}
            <motion.a
              href="/doc/Kreshant_Fresher_Designer_CV.pdf"
              download
              onClick={handleDownload}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="group px-7 py-3.5 md:px-9 md:py-4 rounded-full
                font-semibold text-sm md:text-base
                border border-purple-300 bg-white/80 backdrop-blur-sm
                text-purple-700 hover:bg-white hover:border-purple-400
                shadow-sm hover:shadow-md
                transition-all duration-200
                flex items-center gap-2.5"
              aria-label="Download Kreshant Kumar's graphic design resume"
            >
              <Download
                className={`w-4 h-4 md:w-5 md:h-5 text-purple-500
                  ${isDownloading && !prefersReducedMotion ? "animate-bounce" : ""}`}
              />
              <span>{isDownloading ? "Downloading…" : "Download Resume"}</span>
            </motion.a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="mt-16 md:mt-20 flex flex-col items-center gap-2"
            aria-hidden
          >
            <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-mono">
              Scroll
            </span>
            <motion.div
              animate={!prefersReducedMotion ? { y: [0, 8, 0] } : {}}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="w-px h-8 bg-gradient-to-b from-purple-400 to-transparent"
            />
          </motion.div>
        </motion.div>
      </section>
    </>
  );
};

export default Hero;