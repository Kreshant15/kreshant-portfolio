import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

// â”€â”€â”€ Design tool labels that cycle during load â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const TOOLS = ["Ps", "Ai", "Fg", "Cv", "Xd", "Cd"];

const TOOL_COLORS: Record<string, string> = {
  Ps: "#31A8FF",
  Ai: "#FF9A00",
  Fg: "#A259FF",
  Cv: "#00C4CC",
  Xd: "#FF61F6",
  Cd: "#00A950",
};

// â”€â”€â”€ Loading Screen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const LoadingScreen = () => {
  const [phase,   setPhase]   = useState<"in" | "hold" | "out">("in");
  const [visible, setVisible] = useState(true);
  const [toolIdx, setToolIdx] = useState(0);
  const prefersReduced        = useReducedMotion();

  // If user prefers reduced motion, skip the loading screen entirely
  useEffect(() => {
    if (prefersReduced) {
      setVisible(false);
      return;
    }

    // Phase timeline:
    //  0ms   â†’ letters animate in
    //  700ms â†’ progress bar starts (hold)
    //  2200msâ†’ exit begins
    //  3000msâ†’ unmount

    const t1 = setTimeout(() => setPhase("hold"), 700);
    const t2 = setTimeout(() => setPhase("out"),  2200);
    const t3 = setTimeout(() => setVisible(false), 3100);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [prefersReduced]);

  // Tool badge cycles every 300ms during load
  useEffect(() => {
    if (!visible) return;
    const iv = setInterval(() => {
      setToolIdx((i) => (i + 1) % TOOLS.length);
    }, 320);
    return () => clearInterval(iv);
  }, [visible]);

  const letters = "KRESHRTS".split("");
  const activeTool = TOOLS[toolIdx];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{
            clipPath: ["inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"],
            transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
          style={{ backgroundColor: "#0c0010" }}
          aria-label="Loading"
          aria-live="polite"
        >

          {/* â”€â”€ Background grid â€” same system, dark tinted â”€â”€ */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: `
                linear-gradient(#7c3aed 1px, transparent 1px),
                linear-gradient(90deg, #7c3aed 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
            aria-hidden
          />

          {/* â”€â”€ Ambient blob â”€â”€ */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              w-[600px] h-[300px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)",
            }}
            aria-hidden
          />

          {/* â”€â”€ Tool badge (cycling) â”€â”€ */}
          <motion.div
            key={activeTool}
            initial={{ opacity: 0, scale: 0.7, y: -8 }}
            animate={{ opacity: 1, scale: 1,   y: 0  }}
            exit={{   opacity: 0, scale: 0.7, y: 8   }}
            transition={{ duration: 0.2 }}
            className="absolute top-1/2 left-1/2 pointer-events-none"
            style={{ marginTop: -110, marginLeft: -180 }}
            aria-hidden
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center
                font-black text-white text-sm shadow-lg border border-white/10"
              style={{ backgroundColor: TOOL_COLORS[activeTool] + "cc" }}
            >
              {activeTool}
            </div>
          </motion.div>

          {/* â”€â”€ Main wordmark â”€â”€ */}
          <div className="relative flex flex-col items-center gap-6">
            <div className="flex items-end gap-1 sm:gap-2">
              {letters.map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0,  opacity: 1 }}
                  transition={{
                    delay:    i * 0.07,
                    duration: 0.5,
                    ease:     [0.16, 1, 0.3, 1],
                  }}
                  className="font-black leading-none text-white select-none"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize:   "clamp(2.2rem, 10vw, 5.5rem)",
                    // Alternate: every other letter becomes outline violet
                    ...(i % 2 === 1
                      ? { color: "transparent", WebkitTextStroke: "1.5px #7c3aed" }
                      : {}),
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* Role label */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.4 }}
              className="font-mono text-[10px] uppercase tracking-[0.45em] text-neutral-400"
            >
              Graphic Designer
            </motion.p>

            {/* Progress bar */}
            <div className="w-full relative h-[2px] rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: phase === "in" ? "30%" : "100%" }}
                transition={{
                  duration: phase === "in" ? 0.6 : 1.3,
                  ease:     phase === "in" ? "easeOut" : [0.16, 1, 0.3, 1],
                }}
                className="absolute left-0 top-0 h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #7c3aed, #a855f7, #c084fc)",
                }}
              />
            </div>

            {/* Status label */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.4 }}
              className="font-mono text-[9px] uppercase tracking-[0.4em] text-neutral-600"
            >
              {phase === "out" ? "Ready" : "Initialising..."}
            </motion.p>
          </div>

          {/* â”€â”€ Corner marks â”€â”€ */}
          {(["tl","tr","bl","br"] as const).map((corner) => (
            <motion.div
              key={corner}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.4, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute pointer-events-none"
              style={{
                top:    corner.startsWith("t") ? 24 : "auto",
                bottom: corner.startsWith("b") ? 24 : "auto",
                left:   corner.endsWith("l")   ? 24 : "auto",
                right:  corner.endsWith("r")   ? 24 : "auto",
              }}
              aria-hidden
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                {corner === "tl" && <path d="M0 20 L0 0 L20 0" stroke="#7c3aed" strokeWidth="1.5"/>}
                {corner === "tr" && <path d="M0 0 L20 0 L20 20" stroke="#7c3aed" strokeWidth="1.5"/>}
                {corner === "bl" && <path d="M0 0 L0 20 L20 20" stroke="#7c3aed" strokeWidth="1.5"/>}
                {corner === "br" && <path d="M20 0 L20 20 L0 20" stroke="#7c3aed" strokeWidth="1.5"/>}
              </svg>
            </motion.div>
          ))}

          {/* â”€â”€ URL watermark bottom â”€â”€ */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            className="absolute bottom-7 font-mono text-[8px] uppercase tracking-[0.35em] text-neutral-700"
            aria-hidden
          >
            kreshrts-portfolio.vercel.app
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
