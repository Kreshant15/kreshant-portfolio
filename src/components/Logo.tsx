import { motion } from "motion/react";

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <motion.div
      className={`relative flex items-center gap-1.5 select-none ${className}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      {/* Wordmark */}
      <span
        className="text-xl md:text-2xl font-black tracking-tight text-[#111]"
        style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.03em" }}
      >
        kreshrts
      </span>

      {/* Superscript mark — outline circle, echoes "KUMAR" outline style */}
      <motion.span
        className="relative -top-1 text-[9px] font-mono font-bold leading-none"
        style={{
          color: "transparent",
          WebkitTextStroke: "0.8px #7c3aed",
          letterSpacing: "0",
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        ®
      </motion.span>

      {/* Underline — same violet as accent system */}
      <motion.div
        className="absolute -bottom-0.5 left-0 h-[1.5px] rounded-full bg-violet-400/50"
        initial={{ width: "0%" }}
        whileHover={{ width: "100%" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </motion.div>
  );
};