/**
 * kreshrts — Logo Component v2
 *
 * Variants:
 *   "lockup"   — icon + wordmark (default)
 *   "wordmark" — text only
 *   "icon"     — square mark only
 *   "favicon"  — 32px static, no animation
 *   "site"     — transparent icon bg, pastel gradient, matches portfolio cream bg
 *
 * Sizes:
 *   "xs"  — mobile / footer small  (icon 24px, font 18px)
 *   "sm"  — navbar                 (icon 32px, font 22px)
 *   "md"  — default                (icon 56px, font 38px)
 *   "lg"  — hero / splash          (icon 80px, font 54px)
 *
 * Props:
 *   responsive  — uses CSS clamp() so the wordmark shrinks on mobile automatically
 *   animated    — enables Framer Motion hover/tap (default true)
 *
 * Quick usage:
 *   Navbar:  <Logo variant="site" size="sm" />
 *   Footer:  <Logo variant="site" size="xs" />
 *   Hero:    <Logo variant="site" size="lg" responsive />
 *   Dark bg: <Logo size="md" />
 *   Icon:    <Logo variant="icon" theme="dark" size="sm" />
 */

import { motion } from "motion/react";
import { useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type LogoVariant = "lockup" | "wordmark" | "icon" | "favicon" | "site";
type LogoTheme   = "dark" | "light";
type LogoSize    = "xs" | "sm" | "md" | "lg";

export interface LogoProps {
  variant?:    LogoVariant;
  theme?:      LogoTheme;
  size?:       LogoSize;
  animated?:   boolean;
  responsive?: boolean;
  className?:  string;
  onClick?:    () => void;
}

// ─── Size tokens ──────────────────────────────────────────────────────────────

const SIZE: Record<LogoSize, { icon: number; font: number; gap: number; divH: number }> = {
  xs: { icon: 24, font: 18, gap: 7,  divH: 14 },
  sm: { icon: 32, font: 22, gap: 9,  divH: 20 },
  md: { icon: 56, font: 38, gap: 14, divH: 40 },
  lg: { icon: 80, font: 54, gap: 18, divH: 58 },
};

// ─── Color themes ─────────────────────────────────────────────────────────────

type GradStop = [string, string]; // [offset, color]

interface ThemeTokens {
  iconBg:     string;
  iconBorder: string;
  gapFill:    string;
  dot1:       string;
  dot2:       string;
  dot3:       string;
  iconGrad:   GradStop[];
  wmGrad:     GradStop[];
  divA:       string; // divider top color
  divB:       string; // divider bottom color
  transparent: boolean;
}

const THEMES: Record<"dark" | "light" | "site", ThemeTokens> = {
  dark: {
    iconBg:      "#0e0820",
    iconBorder:  "rgba(248,114,198,0.38)",
    gapFill:     "#0e0820",
    dot1: "#22d3ee", dot2: "#818cf8", dot3: "#f472b6",
    iconGrad: [["0%","#f472b6"],["42%","#818cf8"],["100%","#22d3ee"]],
    wmGrad:   [["0%","#f9a8d4"],["28%","#a5b4fc"],["58%","#67e8f9"],["100%","#f472b6"]],
    divA: "#818cf8", divB: "#22d3ee",
    transparent: false,
  },
  light: {
    iconBg:      "#f2efe8",
    iconBorder:  "rgba(139,92,246,0.22)",
    gapFill:     "#f2efe8",
    dot1: "#7dd3fc", dot2: "#c4b5fd", dot3: "#f9a8d4",
    iconGrad: [["0%","#e879f9"],["42%","#818cf8"],["100%","#38bdf8"]],
    wmGrad:   [["0%","#c084fc"],["30%","#818cf8"],["65%","#38bdf8"],["100%","#a78bfa"]],
    divA: "#818cf8", divB: "#38bdf8",
    transparent: false,
  },
  // "site" variant — transparent icon bg, soft pastel gradient wordmark
  // designed to sit on your portfolio's cream #f0ece3 background
  site: {
    iconBg:      "transparent",
    iconBorder:  "rgba(167,139,250,0.18)",
    gapFill:     "transparent",          // punches through to whatever bg is behind
    dot1: "#a5b4fc", dot2: "#c4b5fd", dot3: "#f9a8d4",
    iconGrad: [["0%","#f9a8d4"],["45%","#a5b4fc"],["100%","#67e8f9"]],
    // warm pink → violet → sky — soft pastels that match portfolio accent palette
    wmGrad:   [["0%","#f472b6"],["32%","#a78bfa"],["68%","#67e8f9"],["100%","#f9a8d4"]],
    divA: "#a78bfa", divB: "#67e8f9",
    transparent: true,
  },
};

// ─── UID factory — prevents SVG gradient ID collisions across instances ───────

let _counter = 0;
const uid = () => `kr${++_counter}`;

// ─── KMark SVG ────────────────────────────────────────────────────────────────

interface KMarkProps {
  size: number;
  tk:   ThemeTokens;
  ids:  { ig: string; gf: string };
}

function KMark({ size, tk, ids }: KMarkProps) {
  const sw = Math.max(7, size * 0.196); // stroke width scales with size

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", flexShrink: 0 }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={ids.ig} x1="0%" y1="0%" x2="100%" y2="100%">
          {tk.iconGrad.map(([o, c]) => (
            <stop key={o} offset={o} stopColor={c} />
          ))}
        </linearGradient>
        <filter id={ids.gf} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Solid background — only for dark/light, hidden for site */}
      {!tk.transparent && (
        <rect width="96" height="96" rx="22" fill={tk.iconBg} />
      )}

      {/* Border ring */}
      <rect
        x="1" y="1" width="94" height="94" rx="21"
        fill="none"
        stroke={tk.transparent ? tk.iconBorder : `url(#${ids.ig})`}
        strokeWidth={tk.transparent ? "1" : "0.75"}
        opacity={tk.transparent ? "0.5" : "0.4"}
      />

      {/* Stem */}
      <line
        x1="24" y1="18" x2="24" y2="78"
        stroke={`url(#${ids.ig})`}
        strokeWidth={sw}
        strokeLinecap="round"
        filter={`url(#${ids.gf})`}
      />

      {/* Upper arm */}
      <line
        x1="26" y1="50" x2="68" y2="16"
        stroke={`url(#${ids.ig})`}
        strokeWidth={sw}
        strokeLinecap="round"
        filter={`url(#${ids.gf})`}
      />

      {/* Lower arm — curved */}
      <path
        d="M26,52 Q46,62 70,80"
        stroke={`url(#${ids.ig})`}
        strokeWidth={sw}
        strokeLinecap="round"
        fill="none"
        filter={`url(#${ids.gf})`}
      />

      {/* Junction gap — punches clean hole at stroke intersection */}
      <circle cx="29" cy="51" r="5" fill={tk.gapFill} />

      {/* Dissolving dot trail — pixel signature */}
      <circle cx="72" cy="14" r="3.2" fill={tk.dot1} opacity="0.9"  filter={`url(#${ids.gf})`} />
      <circle cx="81" cy="10" r="2.1" fill={tk.dot2} opacity="0.65" />
      <circle cx="88" cy="7"  r="1.3" fill={tk.dot3} opacity="0.35" />
    </svg>
  );
}

// ─── Wordmark (CSS gradient text — no SVG, works at all sizes) ────────────────

interface WordmarkProps {
  fontSize:   number;
  tk:         ThemeTokens;
  responsive: boolean;
}

function Wordmark({ fontSize, tk, responsive }: WordmarkProps) {
  // CSS clamp: scales fluidly between ~75% size on mobile → full size on desktop
  const fz = responsive
    ? `clamp(${Math.round(fontSize * 0.72)}px, ${+(fontSize / 14).toFixed(2)}vw, ${fontSize}px)`
    : `${fontSize}px`;

  const gradientCss = `linear-gradient(110deg, ${tk.wmGrad
    .map(([o, c]) => `${c} ${o}`)
    .join(", ")})`;

  return (
    <span
      style={{
        fontFamily:            "'Unbounded', sans-serif",
        fontWeight:            900,
        fontSize:              fz,
        letterSpacing:         "-0.03em",
        lineHeight:            1,
        background:            gradientCss,
        WebkitBackgroundClip:  "text",
        WebkitTextFillColor:   "transparent",
        backgroundClip:        "text",
        // small bottom padding so descenders don't clip the gradient
        paddingBottom:         "0.1em",
        display:               "inline-block",
        whiteSpace:            "nowrap",
      }}
    >
      kreshrts
    </span>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

function Divider({ height, tk, id }: { height: number; tk: ThemeTokens; id: string }) {
  return (
    <svg
      width="1"
      height={height}
      viewBox={`0 0 1 ${height}`}
      style={{ flexShrink: 0, opacity: tk.transparent ? 0.18 : 0.28 }}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="transparent" />
          <stop offset="35%"  stopColor={tk.divA} />
          <stop offset="65%"  stopColor={tk.divB} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <rect width="1" height={height} fill={`url(#${id})`} />
    </svg>
  );
}

// ─── Main Logo export ─────────────────────────────────────────────────────────

export const Logo = ({
  variant    = "lockup",
  theme      = "dark",
  size       = "md",
  animated   = true,
  responsive = false,
  className  = "",
  onClick,
}: LogoProps) => {
  const s   = SIZE[size];
  const tk  = variant === "site" ? THEMES.site : THEMES[theme];
  const ids = useRef({
    ig: uid(), gf: uid(), dg: uid(),
  }).current;

  const spring = { type: "spring" as const, stiffness: 420, damping: 20 };
  const hoverScale = animated ? { whileHover: { scale: 1.04 }, whileTap: { scale: 0.96 }, transition: spring } : {};

  // ── favicon: smallest static mark, no wrapper motion
  if (variant === "favicon") {
    return <KMark size={32} tk={THEMES.dark} ids={{ ig: ids.ig, gf: ids.gf }} />;
  }

  // ── icon only
  if (variant === "icon") {
    return (
      <motion.div
        className={className}
        style={{ display: "inline-flex", cursor: onClick ? "pointer" : "default" }}
        onClick={onClick}
        {...(animated
          ? { whileHover: { scale: 1.06, rotate: -2 }, whileTap: { scale: 0.94 }, transition: { type: "spring", stiffness: 500, damping: 18 } }
          : {})}
      >
        <KMark size={s.icon} tk={tk} ids={{ ig: ids.ig, gf: ids.gf }} />
      </motion.div>
    );
  }

  // ── wordmark only
  if (variant === "wordmark") {
    return (
      <motion.div
        className={className}
        style={{ display: "inline-flex", cursor: onClick ? "pointer" : "default" }}
        onClick={onClick}
        {...hoverScale}
      >
        <Wordmark fontSize={s.font} tk={tk} responsive={responsive} />
      </motion.div>
    );
  }

  // ── lockup + site: icon · divider · wordmark
  return (
    <motion.div
      className={className}
      style={{
        display:    "inline-flex",
        alignItems: "center",
        gap:        s.gap,
        cursor:     onClick ? "pointer" : "default",
        userSelect: "none",
      }}
      onClick={onClick}
      {...hoverScale}
    >
      <motion.div
        style={{ flexShrink: 0 }}
        {...(animated
          ? { whileHover: { rotate: -3, scale: 1.07 }, transition: { type: "spring", stiffness: 500, damping: 16 } }
          : {})}
      >
        <KMark size={s.icon} tk={tk} ids={{ ig: ids.ig, gf: ids.gf }} />
      </motion.div>

      <Divider height={s.divH} tk={tk} id={ids.dg} />

      <Wordmark fontSize={s.font} tk={tk} responsive={responsive} />
    </motion.div>
  );
};

export default Logo;