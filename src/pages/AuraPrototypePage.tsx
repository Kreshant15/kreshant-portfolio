import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

// ─── TYPES ────────────────────────────────────────────────────────────────────

type Screen =
  | "splash"
  | "moodSelect"
  | "permissions"
  | "home"
  | "calibration"
  | "player"
  | "timeline"
  | "you";

type PermissionKey = "music" | "motion" | "notifications";

// ─── AURA DESIGN TOKENS ───────────────────────────────────────────────────────

const MOODS = {
  serenity: {
    id: "serenity",
    label: "Serenity",
    desc: "Peace · Airy · Translucent",
    emoji: "◇",
    // Orb gradient stops
    orb: ["rgba(230,225,255,0.98)", "rgba(160,140,255,0.9)", "rgba(120,90,230,0.85)", "rgba(74,78,200,0.8)", "rgba(20,10,80,0.7)"],
    // Glow colors
    glow1: "rgba(200,192,255,0.55)",
    glow2: "rgba(74,78,200,0.4)",
    glow3: "rgba(40,20,160,0.25)",
    // Aurora blobs
    blob1: "rgba(46,49,146,0.65)",
    blob2: "rgba(60,20,160,0.5)",
    blob3: "rgba(0,30,100,0.35)",
    // Progress / accent
    accent: "#C8C0FF",
    accentDim: "#4A4EC8",
    gradStart: "rgba(200,185,255,0.9)",
    gradEnd: "rgba(74,78,200,0.95)",
    // Ring color
    ring: "rgba(200,192,255,VAL)",
    // Stats
    stats: { tempo: 32, vocal: 55, depth: 78, intensity: 20 },
  },
  calm: {
    id: "calm",
    label: "Calm",
    desc: "Focus · Rhythmic · Stable",
    emoji: "〜",
    orb: ["rgba(200,255,255,0.98)", "rgba(0,210,210,0.9)", "rgba(0,160,160,0.82)", "rgba(0,100,120,0.75)", "rgba(0,40,60,0.6)"],
    glow1: "rgba(0,212,212,0.5)",
    glow2: "rgba(0,140,140,0.35)",
    glow3: "rgba(0,80,100,0.2)",
    blob1: "rgba(0,100,120,0.65)",
    blob2: "rgba(0,70,90,0.5)",
    blob3: "rgba(0,40,60,0.35)",
    accent: "#00C8C8",
    accentDim: "#006060",
    gradStart: "rgba(180,255,255,0.9)",
    gradEnd: "rgba(0,140,140,0.95)",
    ring: "rgba(0,200,200,VAL)",
    stats: { tempo: 48, vocal: 40, depth: 60, intensity: 25 },
  },
  melancholy: {
    id: "melancholy",
    label: "Melancholy",
    desc: "Depth · Nostalgic · Heavy",
    emoji: "◐",
    orb: ["rgba(180,180,255,0.95)", "rgba(80,80,200,0.88)", "rgba(46,49,146,0.82)", "rgba(20,20,100,0.75)", "rgba(5,5,40,0.65)"],
    glow1: "rgba(100,100,220,0.5)",
    glow2: "rgba(46,49,146,0.38)",
    glow3: "rgba(20,20,80,0.22)",
    blob1: "rgba(20,20,100,0.7)",
    blob2: "rgba(30,10,80,0.55)",
    blob3: "rgba(10,10,50,0.4)",
    accent: "#8888E8",
    accentDim: "#1a1a60",
    gradStart: "rgba(180,180,255,0.9)",
    gradEnd: "rgba(46,49,146,0.95)",
    ring: "rgba(136,136,232,VAL)",
    stats: { tempo: 22, vocal: 65, depth: 92, intensity: 18 },
  },
  euphoria: {
    id: "euphoria",
    label: "Euphoria",
    desc: "Joy · Expansive · Radiant",
    emoji: "✦",
    orb: ["rgba(255,248,160,0.98)", "rgba(255,200,0,0.92)", "rgba(220,130,0,0.8)", "rgba(160,80,0,0.7)", "rgba(80,30,0,0.55)"],
    glow1: "rgba(255,215,0,0.55)",
    glow2: "rgba(200,130,0,0.38)",
    glow3: "rgba(120,60,0,0.22)",
    blob1: "rgba(120,70,0,0.6)",
    blob2: "rgba(140,50,0,0.5)",
    blob3: "rgba(80,30,0,0.35)",
    accent: "#FFD700",
    accentDim: "#B86000",
    gradStart: "rgba(255,240,120,0.9)",
    gradEnd: "rgba(180,96,0,0.95)",
    ring: "rgba(255,215,0,VAL)",
    stats: { tempo: 88, vocal: 72, depth: 35, intensity: 85 },
  },
  energy: {
    id: "energy",
    label: "Energy",
    desc: "Passion · Intense · Drive",
    emoji: "⚡",
    orb: ["rgba(255,180,255,0.98)", "rgba(255,0,255,0.9)", "rgba(180,0,200,0.8)", "rgba(100,0,140,0.7)", "rgba(40,0,60,0.6)"],
    glow1: "rgba(255,0,255,0.55)",
    glow2: "rgba(180,0,200,0.4)",
    glow3: "rgba(80,0,120,0.25)",
    blob1: "rgba(120,0,120,0.65)",
    blob2: "rgba(100,0,160,0.55)",
    blob3: "rgba(60,0,80,0.4)",
    accent: "#FF66FF",
    accentDim: "#600060",
    gradStart: "rgba(255,150,255,0.9)",
    gradEnd: "rgba(120,0,180,0.95)",
    ring: "rgba(255,0,255,VAL)",
    stats: { tempo: 95, vocal: 80, depth: 30, intensity: 98 },
  },
} as const;

type MoodId = keyof typeof MOODS;
type MoodData = (typeof MOODS)[MoodId];

const MOOD_ORDER: MoodId[] = ["serenity", "calm", "melancholy", "euphoria", "energy"];

const RECOMMENDATIONS = [
  { title: "Holocene", artist: "Bon Iver", mood: "Melancholy", moodId: "melancholy" as MoodId },
  { title: "Intro", artist: "The xx", mood: "Calm", moodId: "calm" as MoodId },
  { title: "Weightless", artist: "Marconi Union", mood: "Serenity", moodId: "serenity" as MoodId },
];

const SPECTRUM = [
  { label: "Serenity", value: 42, moodId: "serenity" as MoodId },
  { label: "Calm", value: 26, moodId: "calm" as MoodId },
  { label: "Melancholy", value: 18, moodId: "melancholy" as MoodId },
  { label: "Euphoria", value: 9, moodId: "euphoria" as MoodId },
  { label: "Energy", value: 5, moodId: "energy" as MoodId },
];

const TIMELINE_TRACKS = [
  { name: "Breathe", artist: "Pink Floyd", moodId: "energy" as MoodId, intensity: 0.88, duration: "5:42", time: "0:00" },
  { name: "Holocene", artist: "Bon Iver", moodId: "melancholy" as MoodId, intensity: 0.55, duration: "5:37", time: "5:42" },
  { name: "Intro", artist: "The xx", moodId: "calm" as MoodId, intensity: 0.28, duration: "2:07", time: "11:19" },
  { name: "Weightless", artist: "Marconi Union", moodId: "serenity" as MoodId, intensity: 0.08, duration: "8:09", time: "13:26" },
];

const NAV_ITEMS: Array<{ key: Screen; label: string }> = [
  { key: "home", label: "HOME" },
  { key: "calibration", label: "ORB" },
  { key: "player", label: "NOW" },
  { key: "timeline", label: "ARC" },
  { key: "you", label: "YOU" },
];

const NAV_ICONS: Record<Screen, string> = {
  home: "⌂", calibration: "◎", player: "▷", timeline: "〰", you: "☽",
  splash: "", moodSelect: "", permissions: "",
};

function formatTime(value: number) {
  const m = Math.floor(value);
  const s = Math.floor((value - m) * 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ─── AURA ORB ─────────────────────────────────────────────────────────────────
// The core visual — multi-layer radial gradient + specular highlights + glow stack

function AuraOrb({ mood, size = 192, breathe = true }: { mood: MoodData; size?: number; breathe?: boolean }) {
  const stops = mood.orb.join(", ");
  return (
    <div
      className="relative shrink-0 rounded-full select-none"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 36% 30%, ${stops})`,
        boxShadow: [
          `0 0 ${size * 0.3}px ${mood.glow1}`,
          `0 0 ${size * 0.6}px ${mood.glow2}`,
          `0 0 ${size * 1.0}px ${mood.glow3}`,
          "inset 0 0 20px rgba(255,255,255,0.08)",
        ].join(", "),
        animation: breathe ? "orbBreathe 4s ease-in-out infinite" : undefined,
      }}
    >
      {/* Primary specular — top-left */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          top: "14%", left: "18%",
          width: "30%", height: "20%",
          background: "rgba(255,255,255,0.48)",
          filter: "blur(7px)",
          transform: "rotate(-30deg)",
        }}
      />
      {/* Secondary specular — bottom-right */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          bottom: "18%", right: "18%",
          width: "14%", height: "10%",
          background: "rgba(255,255,255,0.15)",
          filter: "blur(5px)",
        }}
      />
      {/* Inner ring */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          border: `1px solid rgba(255,255,255,0.18)`,
          animation: breathe ? "orbBreathe 4s ease-in-out infinite reverse" : undefined,
        }}
      />
    </div>
  );
}

// ─── AURORA BACKGROUND ────────────────────────────────────────────────────────

function PhoneBg({ mood }: { mood: MoodData }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute rounded-full"
        style={{
          width: "120%", height: "55%",
          top: "-15%", left: "-15%",
          background: `radial-gradient(circle, ${mood.blob1}, transparent 68%)`,
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: "100%", height: "55%",
          bottom: "-10%", right: "-20%",
          background: `radial-gradient(circle, ${mood.blob2}, transparent 68%)`,
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: "80%", height: "45%",
          top: "30%", left: "20%",
          background: `radial-gradient(circle, ${mood.blob3}, transparent 68%)`,
          filter: "blur(70px)",
        }}
      />
    </div>
  );
}

// ─── GLASS CARD ──────────────────────────────────────────────────────────────

function Glass({
  children,
  className = "",
  onClick,
  accent,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  accent?: string; // left border color
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={`relative overflow-hidden ${onClick ? "w-full text-left transition-all active:scale-[0.99]" : ""} ${className}`}
      style={{
        background: "rgba(255,255,255,0.055)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 20,
        backdropFilter: "blur(32px)",
        WebkitBackdropFilter: "blur(32px)",
        ...(accent ? { borderLeft: `3px solid ${accent}` } : {}),
      }}
    >
      {children}
    </Tag>
  );
}

// ─── CTA BUTTON ──────────────────────────────────────────────────────────────

function CtaButton({ mood, label, onClick }: { mood: MoodData; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full relative overflow-hidden transition-transform active:scale-[0.98]"
      style={{
        borderRadius: 18,
        padding: "18px 0",
        background: `linear-gradient(135deg, ${mood.gradStart}, ${mood.gradEnd})`,
        color: "rgba(5,5,14,0.9)",
        fontFamily: "'Syne', sans-serif",
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: "0.07em",
        boxShadow: `0 8px 32px ${mood.glow2}, 0 2px 0 rgba(255,255,255,0.15) inset`,
      }}
    >
      {/* shimmer */}
      <div
        className="absolute inset-y-0 pointer-events-none"
        style={{
          width: "60%",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
          animation: "shimmer 2.8s ease-in-out infinite",
        }}
      />
      {label}
    </button>
  );
}

// ─── DYNAMIC ISLAND ──────────────────────────────────────────────────────────

function DI() {
  return (
    <div
      className="absolute top-3.5 left-1/2 -translate-x-1/2 z-30"
      style={{
        width: 120, height: 34,
        background: "#000",
        borderRadius: 22,
      }}
    />
  );
}

// ─── STATUS BAR ──────────────────────────────────────────────────────────────

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-7 pt-4.5 relative z-10">
      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
        9:41
      </span>
      <div className="flex gap-1.5">
        {[0.85, 0.6, 0.38].map((op, i) => (
          <div key={i} className="rounded-full" style={{ width: 8, height: 8, background: `rgba(255,255,255,${op})` }} />
        ))}
      </div>
    </div>
  );
}

// ─── BOTTOM NAV ──────────────────────────────────────────────────────────────

function BottomNav({ current, onChange }: { current: Screen; onChange: (s: Screen) => void }) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-around"
      style={{
        height: 88,
        background: "rgba(4,4,14,0.85)",
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        paddingBottom: 22,
      }}
    >
      {NAV_ITEMS.map((item) => {
        const active = item.key === current;
        return (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            className="flex flex-col items-center gap-1 min-w-12"
          >
            <span style={{ fontSize: 19, color: active ? "#C8C0FF" : "rgba(255,255,255,0.22)" }}>
              {NAV_ICONS[item.key]}
            </span>
            <span style={{
              fontSize: 7.5,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: active ? "rgba(200,192,255,0.85)" : "rgba(255,255,255,0.2)",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {item.label}
            </span>
            {active && (
              <div className="rounded-full" style={{ width: 4, height: 4, background: "#C8C0FF", marginTop: 1 }} />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── PROGRESS DOTS ────────────────────────────────────────────────────────────

function ProgressDots({ active }: { active: number }) {
  return (
    <div className="flex justify-center gap-2 mb-4">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width: i === active ? 22 : 5,
            height: 5,
            background: i === active ? "rgba(200,180,255,0.75)" : "rgba(200,180,255,0.22)",
          }}
        />
      ))}
    </div>
  );
}

// ─── BACK HEADER ─────────────────────────────────────────────────────────────

function BackHeader({ label, title, onBack, right = "···" }: {
  label: string; title: string; onBack: () => void; right?: string;
}) {
  return (
    <div className="flex items-center justify-between px-6 pt-17">
      <button
        onClick={onBack}
        className="flex items-center justify-center rounded-full"
        style={{ width: 36, height: 36, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.55)", fontSize: 16 }}
      >
        ←
      </button>
      <div className="text-center">
        <div style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: 2 }}>
          {label}
        </div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, color: "#ede8ff" }}>
          {title}
        </div>
      </div>
      <div
        className="flex items-center justify-center rounded-full"
        style={{ width: 36, height: 36, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.45)", fontSize: 14 }}
      >
        {right}
      </div>
    </div>
  );
}

// ─── SECTION LABEL ───────────────────────────────────────────────────────────

function SLabel({ children }: { children: string }) {
  return (
    <div style={{ fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginTop: 20, marginBottom: 10 }}>
      {children}
    </div>
  );
}

// ─── SLIDER ROW ──────────────────────────────────────────────────────────────

function SliderRow({ icon, label, value, onChange, accent }: {
  icon: string; label: string; value: number; onChange: (v: number) => void; accent: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span style={{ fontSize: 13, width: 20, textAlign: "center", color: "rgba(255,255,255,0.5)", flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.35)", width: 56, flexShrink: 0 }}>{label}</span>
      <div className="flex-1 relative" style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
        <div
          style={{
            position: "absolute", left: 0, top: 0, bottom: 0,
            width: `${value}%`,
            background: `linear-gradient(90deg, rgba(74,78,200,0.9), ${accent})`,
            borderRadius: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: `${value}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 11, height: 11,
            borderRadius: "50%",
            background: accent,
            boxShadow: `0 0 8px ${accent}`,
          }}
        />
        <input
          type="range" min={0} max={100} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          style={{ height: "100%" }}
        />
      </div>
      <span style={{ fontSize: 10, color: accent, width: 32, textAlign: "right", flexShrink: 0 }}>{value}%</span>
    </div>
  );
}

// ─── STAT CARD ───────────────────────────────────────────────────────────────

function StatCard({ value, label, color }: { value: string; label: string; color?: string }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 14,
      padding: "12px 8px",
      textAlign: "center",
    }}>
      <div style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: 15, fontWeight: 800,
        letterSpacing: "-0.02em",
        color: color ?? "#ede8ff",
      }}>
        {value}
      </div>
      <div style={{ fontSize: 7.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginTop: 3 }}>
        {label}
      </div>
    </div>
  );
}

// ─── MOOD TAB STRIP ──────────────────────────────────────────────────────────

function MoodTabStrip({ selected, onChange }: { selected: MoodId; onChange: (id: MoodId) => void }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
      {MOOD_ORDER.map((id) => {
        const m = MOODS[id];
        const active = id === selected;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className="shrink-0 rounded-full px-3 py-1.5 transition-all"
            style={{
              fontSize: 11,
              letterSpacing: "0.05em",
              background: active ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${active ? m.accent : "rgba(255,255,255,0.08)"}`,
              color: active ? "#ede8ff" : "rgba(255,255,255,0.35)",
              boxShadow: active ? `0 0 12px ${m.glow3}` : "none",
            }}
          >
            {active ? "◦ " : ""}{m.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── WAVEFORM ─────────────────────────────────────────────────────────────────

function Waveform({ progress, accent }: { progress: number; accent: string }) {
  const bars = 52;
  const playedCount = Math.floor(progress * bars);
  const heights = Array.from({ length: bars }, (_, i) =>
    10 + Math.abs(Math.sin(i * 0.55)) * 22
  );
  return (
    <div className="flex items-center gap-[2.5px]" style={{ height: 40 }}>
      {heights.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-full"
          style={{
            height: h,
            background: i < playedCount
              ? `linear-gradient(to top, rgba(74,78,200,0.9), ${accent})`
              : "rgba(255,255,255,0.12)",
          }}
        />
      ))}
    </div>
  );
}

// ─── MINI ARC (Home mood today) ──────────────────────────────────────────────

function MiniArc({ mood }: { mood: MoodData }) {
  const pts = [
    { x: 20, y: 72, moodId: "energy" as MoodId },
    { x: 80, y: 86, moodId: "melancholy" as MoodId },
    { x: 140, y: 99, moodId: "calm" as MoodId },
    { x: 200, y: 112, moodId: "serenity" as MoodId },
  ];
  return (
    <svg width="220" height="130" viewBox="0 0 220 130" className="overflow-visible">
      {/* gradient fill */}
      <defs>
        <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={MOODS.energy.accent} stopOpacity={0.2} />
          <stop offset="40%" stopColor={MOODS.melancholy.accent} stopOpacity={0.15} />
          <stop offset="70%" stopColor={MOODS.calm.accent} stopOpacity={0.1} />
          <stop offset="100%" stopColor={MOODS.serenity.accent} stopOpacity={0.06} />
        </linearGradient>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={MOODS.energy.accent} stopOpacity={0.95} />
          <stop offset="40%" stopColor={MOODS.melancholy.accent} stopOpacity={0.9} />
          <stop offset="70%" stopColor={MOODS.calm.accent} stopOpacity={0.9} />
          <stop offset="100%" stopColor={MOODS.serenity.accent} stopOpacity={0.9} />
        </linearGradient>
      </defs>
      {/* fill area */}
      <path
        d={`M${pts[0].x},120 ${pts.map(p => `L${p.x},${p.y}`).join(" ")} L${pts[pts.length-1].x},120 Z`}
        fill="url(#arcGrad)"
      />
      {/* arc line */}
      <polyline
        points={pts.map(p => `${p.x},${p.y}`).join(" ")}
        fill="none"
        stroke="url(#lineGrad)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* nodes */}
      {pts.map((p, i) => {
        const m = MOODS[p.moodId];
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={8} fill={m.accent} opacity={0.18} />
            <circle cx={p.x} cy={p.y} r={4} fill={m.accent} />
            <circle cx={p.x} cy={p.y} r={1.5} fill="rgba(255,255,255,0.8)" />
          </g>
        );
      })}
    </svg>
  );
}

// ─── FLOW TIMELINE ARC ───────────────────────────────────────────────────────

function TimelineArc({ selectedIdx, onSelect }: { selectedIdx: number; onSelect: (i: number) => void }) {
  const W = 330, H = 180, PAD = { l: 24, r: 24, t: 20, b: 48 };
  const uw = W - PAD.l - PAD.r;
  const uh = H - PAD.t - PAD.b;

  const pts = TIMELINE_TRACKS.map((t, i) => ({
    x: PAD.l + (i / (TIMELINE_TRACKS.length - 1)) * uw,
    y: PAD.t + (1 - t.intensity) * uh,
    m: MOODS[t.moodId],
    t,
    i,
  }));

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
      <defs>
        <linearGradient id="tlFill" x1="0%" y1="0%" x2="100%" y2="0%">
          {TIMELINE_TRACKS.map((t, i) => (
            <stop key={i} offset={`${(i / (TIMELINE_TRACKS.length - 1)) * 100}%`}
              stopColor={MOODS[t.moodId].accent} stopOpacity={0.15} />
          ))}
        </linearGradient>
        <linearGradient id="tlLine" x1="0%" y1="0%" x2="100%" y2="0%">
          {TIMELINE_TRACKS.map((t, i) => (
            <stop key={i} offset={`${(i / (TIMELINE_TRACKS.length - 1)) * 100}%`}
              stopColor={MOODS[t.moodId].accent} stopOpacity={0.95} />
          ))}
        </linearGradient>
      </defs>
      {/* fill */}
      <path
        d={`M${pts[0].x},${H - PAD.b} ${pts.map(p => `L${p.x},${p.y}`).join(" ")} L${pts[pts.length-1].x},${H - PAD.b} Z`}
        fill="url(#tlFill)"
      />
      {/* glow line */}
      <polyline points={pts.map(p => `${p.x},${p.y}`).join(" ")}
        fill="none" stroke="rgba(200,180,255,0.1)" strokeWidth={8} strokeLinecap="round"
        style={{ filter: "blur(4px)" }} />
      {/* main line */}
      <polyline points={pts.map(p => `${p.x},${p.y}`).join(" ")}
        fill="none" stroke="url(#tlLine)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {/* time labels */}
      {pts.map((p) => (
        <text key={p.i} x={p.x} y={H - PAD.b + 16} textAnchor="middle"
          style={{ fontSize: 8, fill: "rgba(255,255,255,0.2)", fontFamily: "'DM Sans', sans-serif" }}>
          {p.t.time}
        </text>
      ))}
      {/* nodes */}
      {pts.map((p) => {
        const isSel = p.i === selectedIdx;
        const r = isSel ? 7 : 5;
        return (
          <g key={p.i} onClick={() => onSelect(p.i)} style={{ cursor: "pointer" }}>
            <circle cx={p.x} cy={p.y} r={isSel ? 16 : 11} fill={p.m.accent} opacity={isSel ? 0.35 : 0.15} />
            <circle cx={p.x} cy={p.y} r={r} fill={p.m.accent}
              style={{ filter: `drop-shadow(0 0 ${isSel ? 10 : 6}px ${p.m.accent})` }} />
            <circle cx={p.x} cy={p.y} r={r * 0.38} fill="rgba(255,255,255,0.75)" />
            {isSel && (
              <g>
                <rect x={p.x - 52} y={p.y - 44} width={104} height={34} rx={8}
                  fill="rgba(10,8,28,0.88)" stroke={p.m.accent} strokeOpacity={0.4} strokeWidth={1} />
                <text x={p.x} y={p.y - 28} textAnchor="middle"
                  style={{ fontSize: 10, fontWeight: 700, fill: p.m.accent, fontFamily: "'DM Sans', sans-serif" }}>
                  {p.t.name}
                </text>
                <text x={p.x} y={p.y - 16} textAnchor="middle"
                  style={{ fontSize: 8.5, fill: "rgba(255,255,255,0.38)", fontFamily: "'DM Sans', sans-serif" }}>
                  {p.t.artist}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export function AuraPrototypePage() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [moodId, setMoodId] = useState<MoodId>("serenity");
  const [permissions, setPermissions] = useState<Record<PermissionKey, boolean>>({
    music: true, motion: false, notifications: false,
  });
  const [calibration, setCalibration] = useState({ tempo: 32, vocal: 55, depth: 78, intensity: 20 });
  const [isPlaying, setIsPlaying] = useState(true);
  const [playerProgress, setPlayerProgress] = useState(2.18);
  const [timelineMode, setTimelineMode] = useState<"session" | "day">("session");
  const [timelineSelected, setTimelineSelected] = useState(1);
  const [liked, setLiked] = useState(false);

  const mood = MOODS[moodId];

  // Sync calibration when mood changes
  useEffect(() => {
    setCalibration(MOODS[moodId].stats);
  }, [moodId]);

  // Player progress ticker
  useEffect(() => {
    if (!isPlaying || screen !== "player") return;
    const id = setInterval(() => {
      setPlayerProgress((v) => (v >= 8.09 ? 0 : Math.min(v + 0.03, 8.09)));
    }, 220);
    return () => clearInterval(id);
  }, [isPlaying, screen]);

  const progressRatio = Math.min(playerProgress / 8.09, 1);

  function goTo(s: Screen) {
    setScreen(s);
    // Scroll phone into view on mobile
    phoneRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  const phoneRef = useRef<HTMLDivElement>(null);

  // ─── SCREENS ────────────────────────────────────────────────────────────────

  function renderScreen() {
    const txt = { color: "#ede8ff" } as const;
    const muted = { color: "rgba(210,200,255,0.45)" } as const;
    const C = "px-6"; // horizontal content padding

    switch (screen) {

      // ── SPLASH ────────────────────────────────────────────────────────────
      case "splash":
        return (
          <div className="absolute inset-0 flex flex-col items-center text-center">
            <PhoneBg mood={mood} />
            <DI />
            <StatusBar />
            {/* Rings + Orb */}
            <div className="relative flex items-center justify-center mt-20">
              {[170, 142, 116].map((r, i) => (
                <div key={r} className="absolute rounded-full pointer-events-none" style={{
                  width: r, height: r,
                  border: `1px solid rgba(200,180,255,${[0.06, 0.10, 0.14][i]})`,
                }} />
              ))}
              <AuraOrb mood={mood} size={180} />
            </div>
            {/* Wordmark */}
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 52, fontWeight: 800, letterSpacing: "0.18em", marginTop: 32, background: "linear-gradient(160deg, #e8e0ff 30%, #a78bfa 60%, #7c3aed 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              AURA
            </div>
            <div style={{ fontSize: 14, ...muted, letterSpacing: "0.08em", fontStyle: "italic", marginTop: 6 }}>
              Tuning, not typing.
            </div>
            {/* Dots + CTA */}
            <div className={`absolute bottom-0 left-0 right-0 ${C} pb-12`}>
              <ProgressDots active={0} />
              <CtaButton mood={mood} label="Begin" onClick={() => goTo("moodSelect")} />
              <button
                onClick={() => goTo("home")}
                style={{ display: "block", width: "100%", marginTop: 14, fontSize: 11, ...muted, letterSpacing: "0.04em" }}
              >
                Already have an account
              </button>
            </div>
          </div>
        );

      // ── MOOD SELECT ───────────────────────────────────────────────────────
      case "moodSelect":
        return (
          <div className="absolute inset-0 flex flex-col">
            <PhoneBg mood={mood} />
            <DI /><StatusBar />
            <div className={`${C} pt-16 relative z-10`}>
              <div style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", ...muted, textAlign: "center", marginBottom: 6 }}>03 / 04</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, letterSpacing: "-0.025em", ...txt, textAlign: "center", marginBottom: 4 }}>Where are you</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, letterSpacing: "-0.025em", color: mood.accent, textAlign: "center", marginBottom: 8 }}>right now?</div>
              <div style={{ fontSize: 12, ...muted, textAlign: "center", lineHeight: 1.7, marginBottom: 20 }}>
                Tap what resonates. AURA will calibrate your first session.
              </div>
              {/* 2×2 grid */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                {(["calm", "melancholy", "euphoria", "energy"] as MoodId[]).map((id) => {
                  const m = MOODS[id];
                  const active = moodId === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setMoodId(id)}
                      className="text-left p-4 transition-all"
                      style={{
                        borderRadius: 18,
                        background: `rgba(${active ? "255,255,255,0.09" : "255,255,255,0.04"})`,
                        border: `${active ? 1.5 : 1}px solid ${active ? m.accent : "rgba(255,255,255,0.08)"}`,
                        boxShadow: active ? `0 0 16px ${m.glow3}` : "none",
                      }}
                    >
                      <div className="rounded-full mb-3" style={{ width: 11, height: 11, background: m.accent, boxShadow: `0 0 8px ${m.accent}` }} />
                      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, color: active ? m.accent : "#ede8ff", marginBottom: 3 }}>{m.label}</div>
                      <div style={{ fontSize: 10, ...muted }}>{m.desc.split(" · ")[0]} · {m.desc.split(" · ")[1]}</div>
                      <div style={{ fontSize: 20, color: m.accent, opacity: 0.4, marginTop: 8 }}>{m.emoji}</div>
                    </button>
                  );
                })}
              </div>
              {/* Serenity full-width */}
              {(() => {
                const m = MOODS.serenity;
                const active = moodId === "serenity";
                return (
                  <button
                    onClick={() => setMoodId("serenity")}
                    className="w-full flex items-center justify-between px-4 py-3 mb-4"
                    style={{
                      borderRadius: 16,
                      background: active ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.04)",
                      border: `${active ? 1.5 : 1}px solid ${active ? m.accent : "rgba(255,255,255,0.08)"}`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-full" style={{ width: 11, height: 11, background: m.accent }} />
                      <div>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, color: active ? m.accent : "#ede8ff" }}>{m.label}</div>
                        <div style={{ fontSize: 10, ...muted }}>Peace · Airy · Rest</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 18, color: m.accent, opacity: 0.4 }}>{m.emoji}</div>
                  </button>
                );
              })()}
            </div>
            <div className={`${C} mt-auto pb-10 relative z-10`}>
              <ProgressDots active={2} />
              <CtaButton mood={mood} label="Set My Mood →" onClick={() => goTo("permissions")} />
            </div>
          </div>
        );

      // ── PERMISSIONS ───────────────────────────────────────────────────────
      case "permissions":
        return (
          <div className="absolute inset-0 flex flex-col">
            <PhoneBg mood={mood} />
            <DI /><StatusBar />
            <div className={`${C} relative z-10 pt-14`}>
              <div style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", ...muted, textAlign: "center", marginBottom: 6 }}>04 / 04</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, letterSpacing: "-0.025em", ...txt, textAlign: "center", marginBottom: 8 }}>Almost there.</div>
              <div style={{ fontSize: 12, ...muted, textAlign: "center", lineHeight: 1.7, marginBottom: 24 }}>
                Grant what feels right.<br/>Everything optional is genuinely optional.
              </div>
              {/* Ready rings + star */}
              <div className="flex justify-center mb-6">
                <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
                  {[58, 46, 34].map((r, i) => (
                    <div key={r} className="absolute rounded-full" style={{
                      width: r * 2, height: r * 2,
                      border: `1px solid rgba(200,192,255,${[0.07, 0.12, 0.2][i]})`,
                    }} />
                  ))}
                  <div className="flex items-center justify-center rounded-full" style={{
                    width: 54, height: 54,
                    background: `radial-gradient(circle, rgba(220,200,255,1) 0%, rgba(120,80,230,1) 55%, rgba(74,78,200,1) 100%)`,
                    boxShadow: `0 0 30px ${mood.glow1}`,
                  }}>
                    <span style={{ fontSize: 20, color: "rgba(237,232,255,0.9)" }}>✦</span>
                  </div>
                </div>
              </div>
              {/* Permission rows */}
              {([
                { key: "music" as const, icon: "🎵", title: "Music library access", sub: "To read your existing tracks" },
                { key: "motion" as const, icon: "📍", title: "Motion data (optional)", sub: "For ambient mood context" },
                { key: "notifications" as const, icon: "🔔", title: "Notifications (optional)", sub: "For mood-shift nudges" },
              ]).map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPermissions(prev => ({ ...prev, [p.key]: !prev[p.key] }))}
                  className="flex items-center gap-3 w-full mb-3"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 16, padding: "12px 16px",
                  }}
                >
                  <div className="flex items-center justify-center rounded-xl shrink-0" style={{ width: 32, height: 32, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", fontSize: 14 }}>
                    {p.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div style={{ fontSize: 12, fontWeight: 700, ...txt }}>{p.title}</div>
                    <div style={{ fontSize: 10, ...muted, marginTop: 2 }}>{p.sub}</div>
                  </div>
                  <div className="flex items-center justify-center rounded-full shrink-0" style={{
                    width: 24, height: 24,
                    background: permissions[p.key] ? `rgba(${mood.accent === "#C8C0FF" ? "200,192,255" : "200,192,255"},0.15)` : "rgba(255,255,255,0.06)",
                    border: `1px solid ${permissions[p.key] ? mood.accent : "rgba(255,255,255,0.1)"}`,
                    fontSize: 11,
                    color: mood.accent,
                  }}>
                    {permissions[p.key] ? "✓" : ""}
                  </div>
                </button>
              ))}
            </div>
            <div className={`${C} mt-auto pb-10 relative z-10`}>
              <ProgressDots active={3} />
              <CtaButton mood={mood} label="Enter AURA" onClick={() => goTo("home")} />
              <button onClick={() => goTo("home")} style={{ display: "block", width: "100%", marginTop: 12, fontSize: 11, ...muted, letterSpacing: "0.04em", textAlign: "center" }}>
                Skip all permissions
              </button>
            </div>
          </div>
        );

      // ── HOME ──────────────────────────────────────────────────────────────
      case "home":
        return (
          <div className="absolute inset-0 flex flex-col" style={{ paddingBottom: 88 }}>
            <PhoneBg mood={mood} />
            <DI /><StatusBar />
            <div className={`${C} pt-14 relative z-10 flex-1 overflow-y-auto`} style={{ scrollbarWidth: "none" }}>
              {/* Header */}
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", ...txt, marginBottom: 4 }}>Good evening.</div>
              <div style={{ fontSize: 14, ...muted, marginBottom: 16 }}>What are you feeling?</div>
              {/* Orb CTA */}
              <Glass onClick={() => goTo("calibration")} className="flex items-center gap-4 p-4 mb-4">
                <div className="relative flex items-center justify-center shrink-0">
                  {[42, 34].map((r, i) => (
                    <div key={r} className="absolute rounded-full pointer-events-none" style={{ width: r, height: r, border: `1px solid rgba(200,192,255,${[0.08, 0.15][i]})` }} />
                  ))}
                  <AuraOrb mood={mood} size={48} />
                </div>
                <div className="flex-1">
                  <div style={{ fontSize: 13, fontWeight: 700, ...txt, marginBottom: 3 }}>Calibrate Mood</div>
                  <div style={{ fontSize: 10, ...muted }}>Tap to tune your emotional frequency</div>
                </div>
                <div style={{ fontSize: 16, ...muted }}>→</div>
              </Glass>
              {/* Now Playing */}
              <SLabel>NOW PLAYING</SLabel>
              <Glass onClick={() => goTo("player")} className="p-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl shrink-0 overflow-hidden flex items-center justify-center" style={{ width: 52, height: 52, background: `radial-gradient(circle, ${mood.blob1}, ${mood.blob2})`, border: "1px solid rgba(255,255,255,0.1)" }}>
                    <AuraOrb mood={mood} size={36} breathe={false} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: 13, fontWeight: 700, ...txt, marginBottom: 2 }}>Weightless</div>
                    <div style={{ fontSize: 10, ...muted, marginBottom: 8 }}>Marconi Union · 2012</div>
                    {/* mini progress */}
                    <div style={{ height: 2, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: "38%", background: `linear-gradient(90deg, ${mood.accentDim}, ${mood.accent})`, borderRadius: 2 }} />
                    </div>
                  </div>
                  <div style={{ fontSize: 18, color: mood.accent, opacity: 0.8 }}>{isPlaying ? "▐▐" : "▶"}</div>
                </div>
                {/* mood badge */}
                <div className="flex justify-end mt-2">
                  <div style={{ fontSize: 7.5, letterSpacing: "0.18em", textTransform: "uppercase", color: mood.accent, padding: "3px 10px", borderRadius: 100, border: `1px solid ${mood.glow1}`, background: `${mood.glow3}` }}>
                    ◦ {mood.label}
                  </div>
                </div>
              </Glass>
              {/* Mood Today */}
              <SLabel>YOUR MOOD TODAY</SLabel>
              <Glass className="p-4 mb-4">
                <div style={{ fontSize: 11, color: mood.accent, marginBottom: 2, letterSpacing: "0.02em" }}>Stressed → Serene · ↓72% intensity</div>
                <div style={{ fontSize: 9, ...muted, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>4 SESSIONS · 2H 18M</div>
                <MiniArc mood={mood} />
                <div className="flex justify-between mt-1">
                  {["7am", "12pm", "6pm", "11pm"].map(t => (
                    <div key={t} style={{ fontSize: 8.5, ...muted }}>{t}</div>
                  ))}
                </div>
              </Glass>
              {/* Suggestions */}
              <SLabel>FOR YOUR {mood.label.toUpperCase()}</SLabel>
              <div className="flex flex-col gap-2 mb-4">
                {RECOMMENDATIONS.map((rec) => {
                  const rm = MOODS[rec.moodId];
                  return (
                    <Glass key={rec.title} className="flex items-center gap-3 px-3 py-3" accent={rm.accent}>
                      <div className="rounded-xl shrink-0 flex items-center justify-center" style={{ width: 38, height: 38, background: `${rm.glow3}`, border: `1px solid ${rm.glow1}` }}>
                        <span style={{ fontSize: 16, color: rm.accent }}>{rm.emoji}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div style={{ fontSize: 12, fontWeight: 700, ...txt, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{rec.title}</div>
                        <div style={{ fontSize: 10, ...muted }}>{rec.artist}</div>
                      </div>
                      <div style={{ fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", color: rm.accent, padding: "3px 9px", borderRadius: 100, border: `1px solid ${rm.glow1}`, background: rm.glow3, whiteSpace: "nowrap" }}>
                        {rec.mood}
                      </div>
                    </Glass>
                  );
                })}
              </div>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                <StatCard value="38m" label="Today" color={mood.accent} />
                <StatCard value="7" label="Tracks" color="#C8C0FF" />
                <StatCard value="↓72%" label="Shift" color={MOODS.melancholy.accent} />
              </div>
            </div>
            <BottomNav current={screen} onChange={goTo} />
          </div>
        );

      // ── CALIBRATION ───────────────────────────────────────────────────────
      case "calibration":
        return (
          <div className="absolute inset-0 flex flex-col" style={{ paddingBottom: 88 }}>
            <PhoneBg mood={mood} />
            <DI />
            <BackHeader label="Mood Calibration" title="How are you?" onBack={() => goTo("home")} right="?" />
            <div className={`${C} relative z-10 flex-1 overflow-y-auto mt-4`} style={{ scrollbarWidth: "none" }}>
              <MoodTabStrip selected={moodId} onChange={setMoodId} />
              {/* Axis labels */}
              <div className="flex justify-between mt-4 mb-1">
                <span style={{ fontSize: 9, ...muted, letterSpacing: "0.15em" }}>← Dark</span>
                <span style={{ fontSize: 9, ...muted, letterSpacing: "0.15em" }}>Energy ↑</span>
                <span style={{ fontSize: 9, ...muted, letterSpacing: "0.15em" }}>Joy →</span>
              </div>
              {/* Orb stage */}
              <div className="flex flex-col items-center py-4">
                <div className="relative flex items-center justify-center">
                  {[180, 150, 124, 104].map((r, i) => (
                    <div key={r} className="absolute rounded-full pointer-events-none" style={{
                      width: r, height: r,
                      border: `1px solid ${mood.ring.replace("VAL", String([0.05, 0.08, 0.12, 0.16][i]))}`,
                    }} />
                  ))}
                  <AuraOrb mood={mood} size={192} />
                </div>
                <div style={{ marginTop: 6, fontSize: 9, ...muted, letterSpacing: "0.15em" }}>Calm ↓</div>
              </div>
              {/* Readout */}
              <div className="text-center mb-4">
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 30, fontWeight: 800, letterSpacing: "-0.025em", color: mood.accent, lineHeight: 1 }}>
                  {mood.label}
                </div>
                <div style={{ fontSize: 12, ...muted, fontStyle: "italic", marginTop: 4, letterSpacing: "0.04em" }}>{mood.desc}</div>
              </div>
              {/* Params */}
              <Glass className="p-4 mb-4">
                <div style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", ...muted, marginBottom: 16 }}>Fine-tune your signal</div>
                <div className="flex flex-col gap-4">
                  <SliderRow icon="♩" label="Tempo" value={calibration.tempo} onChange={v => setCalibration(c => ({ ...c, tempo: v }))} accent={mood.accent} />
                  <SliderRow icon="🎤" label="Vocal" value={calibration.vocal} onChange={v => setCalibration(c => ({ ...c, vocal: v }))} accent={mood.accent} />
                  <SliderRow icon="🌊" label="Depth" value={calibration.depth} onChange={v => setCalibration(c => ({ ...c, depth: v }))} accent={mood.accent} />
                  <SliderRow icon="⚡" label="Intensity" value={calibration.intensity} onChange={v => setCalibration(c => ({ ...c, intensity: v }))} accent={mood.accent} />
                </div>
              </Glass>
              <CtaButton mood={mood} label="Tune my AURA" onClick={() => goTo("player")} />
              <div style={{ height: 16 }} />
            </div>
            <BottomNav current={screen} onChange={goTo} />
          </div>
        );

      // ── PLAYER ────────────────────────────────────────────────────────────
      case "player":
        return (
          <div className="absolute inset-0 flex flex-col" style={{ paddingBottom: 88 }}>
            <PhoneBg mood={mood} />
            <DI />
            <BackHeader label="Now Playing" title="Serenity Session" onBack={() => goTo("home")} />
            <div className={`${C} relative z-10 flex-1 overflow-y-auto mt-4`} style={{ scrollbarWidth: "none" }}>
              {/* Album art */}
              <div className="flex justify-center mb-5">
                <div className="relative flex items-center justify-center" style={{
                  width: 248, height: 248,
                  borderRadius: 28,
                  background: `linear-gradient(140deg, ${mood.blob1.replace("0.65", "1")}, ${mood.blob2.replace("0.5", "1")})`,
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: `0 0 50px ${mood.glow1}, 0 0 100px ${mood.glow2}, 0 30px 80px rgba(0,0,0,0.7)`,
                  overflow: "hidden",
                }}>
                  {/* inner aurora */}
                  <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 40% 35%, ${mood.blob3}, transparent 60%)` }} />
                  <AuraOrb mood={mood} size={90} />
                  {/* shine */}
                  <div className="absolute rounded-full" style={{ top: 14, left: 18, width: "35%", height: "26%", background: "rgba(255,255,255,0.1)", filter: "blur(12px)", transform: "rotate(-25deg)" }} />
                  {/* mood badge */}
                  <div className="absolute -top-3 right-3 rounded-full px-3" style={{
                    padding: "5px 12px",
                    background: `${mood.glow3}`,
                    border: `1px solid ${mood.glow1}`,
                    backdropFilter: "blur(20px)",
                    fontSize: 8,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: mood.accent,
                    whiteSpace: "nowrap",
                  }}>
                    ◦ {mood.label.toUpperCase()}
                  </div>
                </div>
              </div>
              {/* Track info */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", ...txt }}>Weightless</div>
                  <div style={{ fontSize: 13, ...muted, marginTop: 3 }}>Marconi Union · 2012</div>
                </div>
                <button onClick={() => setLiked(l => !l)} style={{ fontSize: 20, color: liked ? "#ff6060" : "rgba(255,100,100,0.5)", marginTop: 4 }}>
                  {liked ? "♥" : "♡"}
                </button>
              </div>
              {/* Waveform */}
              <div className="mb-3">
                <Waveform progress={progressRatio} accent={mood.accent} />
              </div>
              {/* Progress bar */}
              <div className="mb-4">
                <div style={{ height: 2.5, background: "rgba(255,255,255,0.08)", borderRadius: 2, position: "relative" }}>
                  <div style={{ height: "100%", width: `${progressRatio * 100}%`, background: `linear-gradient(90deg, ${mood.accentDim}, ${mood.accent})`, borderRadius: 2, position: "relative" }}>
                    <div style={{ position: "absolute", right: -5, top: "50%", transform: "translateY(-50%)", width: 11, height: 11, borderRadius: "50%", background: mood.accent, boxShadow: `0 0 8px ${mood.glow1}` }} />
                  </div>
                </div>
                <div className="flex justify-between mt-2" style={{ fontSize: 10, ...muted }}>
                  <span>{formatTime(playerProgress)}</span>
                  <span>8:09</span>
                </div>
              </div>
              {/* Controls */}
              <div className="flex items-center justify-between mb-5">
                {[["⇄", 40], ["⏮", 44]].map(([ic, sz]) => (
                  <button key={ic as string} style={{ fontSize: sz as number === 40 ? 18 : 20, color: "rgba(255,255,255,0.38)" }}>{ic}</button>
                ))}
                <button
                  onClick={() => setIsPlaying(p => !p)}
                  className="flex items-center justify-center rounded-full transition-transform active:scale-95"
                  style={{
                    width: 68, height: 68,
                    background: `linear-gradient(135deg, ${mood.gradStart}, ${mood.gradEnd.replace("0.95", "0.85")})`,
                    boxShadow: `0 0 36px ${mood.glow1}, 0 8px 24px rgba(0,0,0,0.5)`,
                  }}
                >
                  <span style={{ fontSize: 22, color: "rgba(5,5,14,0.85)", marginLeft: isPlaying ? 0 : 3 }}>
                    {isPlaying ? "▐▐" : "▶"}
                  </span>
                </button>
                {[["⏭", 44], ["↺", 40]].map(([ic, sz]) => (
                  <button key={ic as string} style={{ fontSize: sz as number === 44 ? 20 : 18, color: "rgba(255,255,255,0.38)" }}>{ic}</button>
                ))}
              </div>
              {/* Secondary actions */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[["⊕", "ADD"], ["◉", "ORB"], ["↑", "SHARE"], ["⋯", "MORE"]].map(([ic, lb]) => (
                  <Glass key={lb} className="flex flex-col items-center py-3">
                    <span style={{ fontSize: 17, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>{ic}</span>
                    <span style={{ fontSize: 8, letterSpacing: "0.18em", color: "rgba(255,255,255,0.22)" }}>{lb}</span>
                  </Glass>
                ))}
              </div>
              {/* Volume */}
              <div className="flex items-center gap-2 mb-4">
                <span style={{ fontSize: 13, ...muted }}>🔈</span>
                <div className="flex-1" style={{ height: 2.5, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
                  <div style={{ height: "100%", width: "72%", background: "rgba(255,255,255,0.25)", borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: 13, ...muted }}>🔊</span>
              </div>
            </div>
            <BottomNav current={screen} onChange={goTo} />
          </div>
        );

      // ── TIMELINE ──────────────────────────────────────────────────────────
      case "timeline":
        return (
          <div className="absolute inset-0 flex flex-col" style={{ paddingBottom: 88 }}>
            <PhoneBg mood={mood} />
            <DI />
            <BackHeader label="Flow Timeline" title="Tonight's Arc" onBack={() => goTo("home")} right="↗" />
            <div className={`${C} relative z-10 flex-1 overflow-y-auto mt-4`} style={{ scrollbarWidth: "none" }}>
              {/* View toggle */}
              <div className="flex gap-1 p-1 mb-4" style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
                {(["session", "day"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setTimelineMode(v)}
                    className="flex-1 py-2 transition-all"
                    style={{
                      borderRadius: 9, fontSize: 11, letterSpacing: "0.04em",
                      background: timelineMode === v ? "rgba(255,255,255,0.09)" : "none",
                      color: timelineMode === v ? "#ede8ff" : "rgba(255,255,255,0.32)",
                      border: timelineMode === v ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent",
                    }}
                  >
                    {v === "session" ? "Session Arc" : "Day View"}
                  </button>
                ))}
              </div>
              {/* Summary stats */}
              <div className="grid grid-cols-4 gap-2 mb-5">
                <StatCard value="7" label="Tracks" color="#C8C0FF" />
                <StatCard value="38m" label="Duration" color={MOODS.calm.accent} />
                <StatCard value="→ Serene" label="Journey" color={MOODS.melancholy.accent} />
                <StatCard value="↓72%" label="Intensity" color="#ede8ff" />
              </div>
              {/* Arc */}
              <Glass className="p-4 mb-4">
                <div className="flex justify-between mb-2">
                  {["High", "Mid", "Low"].map(l => (
                    <div key={l} style={{ fontSize: 8, ...muted }}>{l}</div>
                  ))}
                </div>
                <TimelineArc selectedIdx={timelineSelected} onSelect={setTimelineSelected} />
              </Glass>
              {/* Legend */}
              <div className="flex flex-wrap gap-2 mb-4">
                {(["energy", "melancholy", "calm", "serenity"] as MoodId[]).map(id => {
                  const m = MOODS[id];
                  return (
                    <div key={id} className="flex items-center gap-1.5">
                      <div className="rounded-full" style={{ width: 7, height: 7, background: m.accent, boxShadow: `0 0 4px ${m.accent}` }} />
                      <span style={{ fontSize: 9.5, ...muted }}>{m.label}</span>
                    </div>
                  );
                })}
              </div>
              {/* Track list */}
              <div className="flex flex-col gap-2 mb-6">
                {TIMELINE_TRACKS.map((t, i) => {
                  const tm = MOODS[t.moodId];
                  const isSel = i === timelineSelected;
                  return (
                    <button
                      key={t.name}
                      onClick={() => setTimelineSelected(i)}
                      className="flex items-center gap-2 text-left w-full"
                      style={{
                        background: isSel ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.035)",
                        border: `1px solid ${isSel ? tm.glow1 : "rgba(255,255,255,0.06)"}`,
                        borderLeft: `3px solid ${tm.accent}`,
                        borderRadius: 14, padding: "10px 14px",
                      }}
                    >
                      <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: 28, height: 28, background: `${tm.glow3}`, border: `1px solid ${tm.glow1}`, fontSize: 13 }}>
                        {tm.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div style={{ fontSize: 12, fontWeight: 700, ...txt, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.name}</div>
                        <div style={{ fontSize: 10, ...muted }}>{t.artist}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div style={{ fontSize: 10, ...muted }}>{t.duration}</div>
                        <div style={{ fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", color: tm.accent, marginTop: 3, padding: "2px 8px", borderRadius: 100, border: `1px solid ${tm.glow1}`, background: tm.glow3 }}>
                          {tm.label}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <BottomNav current={screen} onChange={goTo} />
          </div>
        );

      // ── YOU ───────────────────────────────────────────────────────────────
      case "you":
        return (
          <div className="absolute inset-0 flex flex-col" style={{ paddingBottom: 88 }}>
            <PhoneBg mood={mood} />
            <DI /><StatusBar />
            <div className={`${C} relative z-10 flex-1 overflow-y-auto pt-12`} style={{ scrollbarWidth: "none" }}>
              <div style={{ fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase", ...muted, textAlign: "center", marginBottom: 6 }}>YOU</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em", ...txt, textAlign: "center", marginBottom: 16 }}>Your frequency.</div>
              {/* Avatar */}
              <div className="flex flex-col items-center mb-5">
                <div className="relative flex items-center justify-center" style={{
                  width: 76, height: 76,
                  background: `radial-gradient(circle, rgba(60,50,120,1) 0%, rgba(20,15,60,1) 100%)`,
                  borderRadius: "50%",
                  border: `2px solid ${mood.accent}`,
                  boxShadow: `0 0 20px ${mood.glow2}`,
                }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: mood.accent, opacity: 0.85 }}>K</span>
                  <div className="absolute rounded-full" style={{ top: 4, right: 4, width: 12, height: 12, background: mood.accent, boxShadow: `0 0 8px ${mood.glow1}` }} />
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 700, ...txt, marginTop: 10, letterSpacing: "-0.01em" }}>Kreshant Kumar</div>
                <div style={{ fontSize: 11, ...muted, marginTop: 3 }}>{mood.label} · 14 day streak</div>
              </div>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                <StatCard value="47" label="Sessions" color="#C8C0FF" />
                <StatCard value="2h 18m" label="Avg Length" color={MOODS.calm.accent} />
                <StatCard value="↓68%" label="Avg Shift" color={MOODS.melancholy.accent} />
              </div>
              {/* Spectrum */}
              <SLabel>YOUR EMOTIONAL SPECTRUM</SLabel>
              <Glass className="p-4 mb-4">
                <div className="flex flex-col gap-4">
                  {SPECTRUM.map((s) => {
                    const sm = MOODS[s.moodId];
                    return (
                      <div key={s.label}>
                        <div className="flex justify-between mb-1.5">
                          <span style={{ fontSize: 11, color: sm.accent }}>{s.label}</span>
                          <span style={{ fontSize: 10, ...muted }}>{s.value}%</span>
                        </div>
                        <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 3 }}>
                          <div style={{
                            height: "100%", width: `${s.value}%`, borderRadius: 3,
                            background: `linear-gradient(90deg, ${sm.accentDim}, ${sm.accent})`,
                            boxShadow: `0 0 6px ${sm.glow1}`,
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Glass>
              {/* Preferences */}
              <SLabel>PREFERENCES</SLabel>
              <div className="flex flex-col gap-2 mb-5">
                {[
                  { icon: "☽", label: "Sleep Timer", value: "Auto · Serenity" },
                  { icon: "↯", label: "Haptic Feedback", value: "On" },
                  { icon: "✦", label: "Aurora Intensity", value: "High" },
                  { icon: "🔔", label: "Mood Notifications", value: "Off" },
                ].map((p) => (
                  <Glass key={p.label} className="flex items-center gap-3 px-4 py-3">
                    <span style={{ fontSize: 16, color: mood.accent, opacity: 0.7, width: 20, flexShrink: 0 }}>{p.icon}</span>
                    <div className="flex-1">
                      <div style={{ fontSize: 12, fontWeight: 700, ...txt }}>{p.label}</div>
                      <div style={{ fontSize: 10, ...muted, marginTop: 2 }}>{p.value}</div>
                    </div>
                    <span style={{ fontSize: 16, ...muted }}>›</span>
                  </Glass>
                ))}
              </div>
              <button style={{ display: "block", width: "100%", textAlign: "center", fontSize: 11, color: "rgba(255,100,100,0.42)", letterSpacing: "0.04em", marginBottom: 16 }}>
                Sign out
              </button>
            </div>
            <BottomNav current={screen} onChange={goTo} />
          </div>
        );
    }
  }

  // ─── PAGE WRAPPER ──────────────────────────────────────────────────────────

  return (
    <>
      {/* Global keyframes injected once */}
      <style>{`
        @keyframes orbBreathe {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.03) translateY(-4px); }
        }
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 140%; }
        }
        .aura-phone-scroll::-webkit-scrollbar { display: none; }
        .aura-phone-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <main className="relative min-h-screen overflow-hidden bg-cream">
        <Navbar />

        <div className="relative overflow-hidden px-4 pb-24 pt-32 sm:px-6 md:pt-40">
          {/* Portfolio page decorative bg */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute top-0 right-0 h-96 w-lg rounded-full bg-linear-to-bl from-violet-100/40 to-transparent blur-[100px]" />
            <div className="absolute bottom-0 left-0 h-80 w-104 rounded-full bg-linear-to-tr from-amber-100/30 to-transparent blur-[90px]" />
            <div
              className="absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage: "linear-gradient(#8b5cf6 1px, transparent 1px), linear-gradient(90deg, #8b5cf6 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />
          </div>

          <div className="relative mx-auto max-w-7xl">
            {/* Back link */}
            <div className="mb-10">
              <Link
                to="/projects/aura-app"
                className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400 transition-colors hover:text-violet-600"
              >
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                Back to case study
              </Link>
            </div>

            {/* Page header */}
            <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-purple-600">
                  <span className="h-px w-4 bg-purple-400" />
                  Live Prototype
                </span>
                <h1 className="mt-5 font-black leading-[0.9] tracking-tight">
                  <span className="block text-[clamp(2.8rem,8vw,6.2rem)] text-ink" style={{ fontFamily: "'Syne', sans-serif" }}>
                    AURA
                  </span>
                  <span
                    className="block text-[clamp(2.6rem,7vw,5.8rem)]"
                    style={{ color: "transparent", WebkitTextStroke: "2px #7c3aed", fontFamily: "'Syne', sans-serif" }}
                  >
                    Prototype
                  </span>
                </h1>
                <p className="mt-6 max-w-xl text-base leading-8 text-neutral-500">
                  A fully interactive version of the AURA concept — 8 screens, live mood switching,
                  animated playback, and real gesture-mapped UI. Change the mood state and watch
                  the entire interface shift.
                </p>
              </div>
              {/* Quick nav buttons */}
              <div className="flex flex-wrap gap-3">
                {([["Splash", "splash"], ["Home", "home"], ["Calibration", "calibration"], ["Player", "player"], ["Timeline", "timeline"], ["You", "you"]] as [string, Screen][]).map(([label, target]) => (
                  <button
                    key={target}
                    onClick={() => goTo(target)}
                    className="rounded-full border border-neutral-300 bg-white/70 px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition-all hover:border-violet-400 hover:text-violet-700"
                  >
                    {label}
                  </button>
                ))}
                <Link
                  to="/projects/aura-app"
                  className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#7c3aed,#a855f7,#c084fc)] px-5 py-2 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(124,58,237,0.22)]"
                >
                  Case Study
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Main layout: info panel left, phone right (stacks on mobile) */}
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start">

              {/* Left — features + info */}
              <section className="rounded-4xl border border-neutral-200/70 bg-white/75 p-6 shadow-[0_20px_60px_rgba(17,17,17,0.06)] backdrop-blur-md md:p-8 lg:sticky lg:top-32">
                <h2 className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-400">What's interactive</h2>
                <div className="grid gap-3 sm:grid-cols-2 mb-8">
                  {[
                    "Splash → onboarding flow",
                    "Mood selection (5 states)",
                    "Permission toggles",
                    "Live calibration sliders",
                    "Animated waveform + playback",
                    "Play / pause with live timer",
                    "Flow timeline arc (tap nodes)",
                    "Profile + spectrum bars",
                    "Full bottom nav routing",
                    "Mood-reactive UI colors",
                  ].map((item) => (
                    <div key={item} className="rounded-[18px] border border-neutral-200/70 bg-cream px-4 py-3 text-sm leading-6 text-neutral-600">
                      {item}
                    </div>
                  ))}
                </div>

                {/* Current mood display */}
                <div className="rounded-2xl border border-neutral-200 bg-linear-to-br from-violet-50 to-white p-5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-neutral-400 mb-3">Active Mood State</div>
                  <div className="flex items-center gap-4">
                    <div
                      className="rounded-full shrink-0"
                      style={{
                        width: 48, height: 48,
                        background: `radial-gradient(circle at 36% 30%, ${MOODS[moodId].orb[0]}, ${MOODS[moodId].orb[2]})`,
                        boxShadow: `0 0 20px ${MOODS[moodId].glow1}`,
                      }}
                    />
                    <div>
                      <div className="font-semibold text-neutral-800" style={{ fontFamily: "'Syne', sans-serif" }}>
                        {MOODS[moodId].label}
                      </div>
                      <div className="text-sm text-neutral-500 mt-0.5">{MOODS[moodId].desc}</div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {MOOD_ORDER.map((id) => (
                      <button
                        key={id}
                        onClick={() => setMoodId(id)}
                        className="rounded-full px-3 py-1.5 text-xs font-medium transition-all"
                        style={{
                          background: moodId === id ? MOODS[id].accent : "rgba(0,0,0,0.05)",
                          color: moodId === id ? (id === "euphoria" ? "#111" : "#fff") : "#666",
                          boxShadow: moodId === id ? `0 4px 12px ${MOODS[id].glow2}` : "none",
                        }}
                      >
                        {MOODS[id].label}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Right — phone */}
              <section className="flex flex-col items-center" ref={phoneRef}>
                {/* Glow behind phone */}
                <div
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: 500, height: 500,
                    background: `radial-gradient(circle, ${MOODS[moodId].glow2.replace("0.4", "0.18")}, transparent 65%)`,
                    filter: "blur(40px)",
                    transform: "translate(-50%, -50%) translate(230px, 450px)",
                  }}
                />
                {/* Phone bezel */}
                <div
                  className="relative"
                  style={{
                    width: 390, height: 844,
                    borderRadius: 54,
                    border: "1.5px solid rgba(255,255,255,0.13)",
                    boxShadow: [
                      "0 0 0 1px rgba(0,0,0,0.9)",
                      "0 60px 180px rgba(0,0,0,0.88)",
                      `0 0 100px ${MOODS[moodId].glow2}`,
                      "inset 0 0 80px rgba(0,0,0,0.5)",
                    ].join(", "),
                    background: "#04040e",
                    overflow: "hidden",
                    transition: "box-shadow 1s ease",
                  }}
                >
                  {renderScreen()}
                </div>
                {/* Screen label */}
                <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">
                  {screen.charAt(0).toUpperCase() + screen.slice(1)} Screen
                </div>
              </section>

            </div>
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
}