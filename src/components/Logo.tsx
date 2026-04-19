/**
 * kreshrts — Logo Component
 * Full logo system: icon · wordmark · lockup · favicon
 *
 * Usage:
 *   <Logo />                        — full lockup, dark
 *   <Logo variant="wordmark" />     — wordmark only
 *   <Logo variant="icon" />         — square icon mark
 *   <Logo variant="favicon" />      — 32px icon, no animation
 *   <Logo theme="light" />          — soft light palette
 *   <Logo size="sm" />              — nav size (~40px height)
 *   <Logo size="md" />              — default
 *   <Logo size="lg" />              — hero / splash
 *   <Logo animated={false} />       — static, no hover
 */

import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type LogoVariant = "lockup" | "wordmark" | "icon" | "favicon";
type LogoTheme   = "dark" | "light";
type LogoSize    = "sm" | "md" | "lg";

interface LogoProps {
  variant?:  LogoVariant;
  theme?:    LogoTheme;
  size?:     LogoSize;
  animated?: boolean;
  className?: string;
  onClick?:  () => void;
}

// ─── Token maps ───────────────────────────────────────────────────────────────

const SIZE = {
  sm: { icon: 36, lockupHeight: 40, fontSize: 26, gap: 10, divH: 28 },
  md: { icon: 72, lockupHeight: 72, fontSize: 52, gap: 16, divH: 56 },
  lg: { icon: 96, lockupHeight: 96, fontSize: 68, gap: 20, divH: 76 },
} as const;

// Dark theme — vibrant holographic
const DARK = {
  bg:          "#0e0820",
  border:      "rgba(248,114,198,0.35)",
  dot1:        "#22d3ee",
  dot2:        "#818cf8",
  dot3:        "#f472b6",
  gap:         "#0e0820",
  wmGrad: [
    { offset: "0%",   color: "#f9a8d4" },
    { offset: "28%",  color: "#a5b4fc" },
    { offset: "58%",  color: "#67e8f9" },
    { offset: "100%", color: "#f472b6" },
  ],
  iconGrad: [
    { offset: "0%",   color: "#f472b6" },
    { offset: "42%",  color: "#818cf8" },
    { offset: "100%", color: "#22d3ee" },
  ],
  divider: "rgba(132,90,248,0.28)",
};

// Light theme — soft, desaturated, elegant
const LIGHT = {
  bg:          "#f2efe8",
  border:      "rgba(139,92,246,0.2)",
  dot1:        "#7dd3fc",   // sky-300
  dot2:        "#c4b5fd",   // violet-300
  dot3:        "#f9a8d4",   // pink-300
  gap:         "#f2efe8",
  wmGrad: [
    { offset: "0%",   color: "#c084fc" },   // violet-400
    { offset: "30%",  color: "#818cf8" },   // indigo-400
    { offset: "65%",  color: "#38bdf8" },   // sky-400
    { offset: "100%", color: "#a78bfa" },   // violet-400 soft
  ],
  iconGrad: [
    { offset: "0%",   color: "#e879f9" },   // fuchsia-400
    { offset: "42%",  color: "#818cf8" },   // indigo-400
    { offset: "100%", color: "#38bdf8" },   // sky-400
  ],
  divider: "rgba(139,92,246,0.18)",
};

// ─── Gradient ID factory (unique per instance to avoid SVG conflicts) ─────────

let _id = 0;
const uid = () => `kr${++_id}`;

// ─── Sub-components ───────────────────────────────────────────────────────────

/** The K mark — three rounded strokes + junction gap + dissolving dots */
function KMark({
  size,
  theme,
  ids,
}: {
  size: number;
  theme: LogoTheme;
  ids: { ig: string; gf: string };
}) {
  const tk = theme === "dark" ? DARK : LIGHT;
  const sw = Math.max(9, size * 0.138);   // stroke-width scales with icon size
  const r  = size / 96;                    // scale factor from 96px master

  // All coordinates are in 96×96 master space, scaled via transform
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <defs>
        <linearGradient id={ids.ig} x1="0%" y1="0%" x2="100%" y2="100%">
          {tk.iconGrad.map((s) => (
            <stop key={s.offset} offset={s.offset} stopColor={s.color} />
          ))}
        </linearGradient>
        <filter id={ids.gf} x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background square */}
      <rect width="96" height="96" rx="22" fill={tk.bg} />
      <rect
        x="1" y="1" width="94" height="94" rx="21"
        fill="none"
        stroke={`url(#${ids.ig})`}
        strokeWidth="0.75"
        opacity="0.4"
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

      {/* Junction gap — punches clean space at intersection */}
      <circle cx="29" cy="51" r="4.5" fill={tk.gap} />

      {/* Dissolving dot trail off upper arm tip */}
      <circle cx="72" cy="14" r="3.2" fill={tk.dot1} opacity="0.9" filter={`url(#${ids.gf})`} />
      <circle cx="81" cy="10" r="2.1" fill={tk.dot2} opacity="0.6" />
      <circle cx="88" cy="7"  r="1.3" fill={tk.dot3} opacity="0.32" />
    </svg>
  );
}

/** Wordmark SVG text — Unbounded 900, full kreshrts, gradient fill */
function Wordmark({
  fontSize,
  theme,
  ids,
  animated,
}: {
  fontSize: number;
  theme: LogoTheme;
  ids: { wg: string; gf: string };
  animated: boolean;
}) {
  const tk = theme === "dark" ? DARK : LIGHT;
  // Approximate text width for viewBox (Unbounded is wide)
  const approxW = fontSize * 7.4;
  const h       = fontSize * 1.28;

  return (
    <svg
      viewBox={`0 0 ${approxW} ${h}`}
      height={fontSize}
      style={{ overflow: "visible" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={ids.wg} x1="0%" y1="20%" x2="100%" y2="80%">
          {tk.wmGrad.map((s) => (
            <stop key={s.offset} offset={s.offset} stopColor={s.color} />
          ))}
        </linearGradient>
        <filter id={ids.gf} x="-5%" y="-10%" width="110%" height="120%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <text
        x="2"
        y={fontSize * 0.88}
        fontFamily="'Unbounded', sans-serif"
        fontWeight="900"
        fontSize={fontSize}
        letterSpacing={-fontSize * 0.03}
        fill={`url(#${ids.wg})`}
        filter={animated ? `url(#${ids.gf})` : undefined}
      >
        kreshrts
      </text>
    </svg>
  );
}

// ─── Main Logo component ──────────────────────────────────────────────────────

export const Logo = ({
  variant  = "lockup",
  theme    = "dark",
  size     = "md",
  animated = true,
  className = "",
  onClick,
}: LogoProps) => {
  const s   = SIZE[size];
  const ids = useRef({
    ig: uid(), gf: uid(), wg: uid(), wg2: uid(), gf2: uid(),
  }).current;

  // ── FAVICON — no animation, smallest footprint
  if (variant === "favicon") {
    return (
      <KMark size={32} theme={theme} ids={{ ig: ids.ig, gf: ids.gf }} />
    );
  }

  // ── ICON ONLY
  if (variant === "icon") {
    return (
      <motion.div
        className={className}
        style={{ display: "inline-flex", cursor: onClick ? "pointer" : "default" }}
        whileHover={animated ? { scale: 1.06, rotate: -1 } : undefined}
        whileTap={animated   ? { scale: 0.94 }             : undefined}
        transition={{ type: "spring", stiffness: 420, damping: 18 }}
        onClick={onClick}
      >
        <KMark size={s.icon} theme={theme} ids={{ ig: ids.ig, gf: ids.gf }} />
      </motion.div>
    );
  }

  // ── WORDMARK ONLY
  if (variant === "wordmark") {
    return (
      <motion.div
        className={className}
        style={{ display: "inline-flex", cursor: onClick ? "pointer" : "default" }}
        whileHover={animated ? { scale: 1.03 } : undefined}
        whileTap={animated   ? { scale: 0.97 } : undefined}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        onClick={onClick}
      >
        <Wordmark
          fontSize={s.fontSize}
          theme={theme}
          ids={{ wg: ids.wg, gf: ids.gf2 }}
          animated={animated}
        />
      </motion.div>
    );
  }

  // ── FULL LOCKUP (default)
  const dividerColor = theme === "dark" ? DARK.divider : LIGHT.divider;

  return (
    <motion.div
      className={className}
      style={{
        display:     "inline-flex",
        alignItems:  "center",
        gap:         s.gap,
        cursor:      onClick ? "pointer" : "default",
        userSelect:  "none",
      }}
      whileHover={animated ? { scale: 1.025 } : undefined}
      whileTap={animated   ? { scale: 0.97  } : undefined}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
      onClick={onClick}
    >
      {/* Icon mark */}
      <motion.div
        whileHover={animated ? { rotate: -2, scale: 1.05 } : undefined}
        transition={{ type: "spring", stiffness: 500, damping: 16 }}
      >
        <KMark size={s.icon} theme={theme} ids={{ ig: ids.ig, gf: ids.gf }} />
      </motion.div>

      {/* Thin gradient divider */}
      <svg
        width="1"
        height={s.divH}
        viewBox={`0 0 1 ${s.divH}`}
        style={{ flexShrink: 0, opacity: 0.3 }}
      >
        <defs>
          <linearGradient id={ids.wg2} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="transparent" />
            <stop offset="30%"  stopColor={theme === "dark" ? "#818cf8" : "#818cf8"} />
            <stop offset="70%"  stopColor={theme === "dark" ? "#22d3ee" : "#38bdf8"} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <rect width="1" height={s.divH} fill={`url(#${ids.wg2})`} />
      </svg>

      {/* Wordmark */}
      <Wordmark
        fontSize={s.fontSize}
        theme={theme}
        ids={{ wg: ids.wg, gf: ids.gf2 }}
        animated={animated}
      />
    </motion.div>
  );
};

export default Logo;
