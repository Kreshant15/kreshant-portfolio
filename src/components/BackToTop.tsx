import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowUp } from "lucide-react";

export const BackToTop = () => {
  const [isVisible, setIsVisible]       = useState(false);
  const [scrollPct, setScrollPct]       = useState(0);
  const prefersReducedMotion            = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const total    = document.documentElement.scrollHeight - window.innerHeight;
      setIsVisible(scrolled > 500);
      setScrollPct(total > 0 ? scrolled / total : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // SVG ring progress
  const radius      = 22;
  const circumference = 2 * Math.PI * radius;
  const dashOffset  = circumference * (1 - scrollPct);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 16 }}
          animate={{ opacity: 1, scale: 1,   y: 0  }}
          exit={{   opacity: 0, scale: 0.6, y: 16  }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: prefersReducedMotion ? 1 : 1.08 }}
          whileTap={{   scale: 0.93 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[60]
            w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center
            rounded-full
            bg-white/80 backdrop-blur-md
            border border-neutral-200/80
            shadow-[0_4px_20px_rgba(124,58,237,0.18)]
            hover:shadow-[0_6px_28px_rgba(124,58,237,0.32)]
            hover:border-violet-300
            transition-shadow duration-200 group"
          aria-label="Back to top"
        >
          {/* Progress ring */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 50 50"
            aria-hidden
          >
            {/* Track */}
            <circle
              cx="25" cy="25" r={radius}
              fill="none"
              stroke="rgba(167,139,250,0.15)"
              strokeWidth="2"
            />
            {/* Fill */}
            <circle
              cx="25" cy="25" r={radius}
              fill="none"
              stroke="url(#ring-grad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: "stroke-dashoffset 0.15s linear" }}
            />
            <defs>
              <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
            </defs>
          </svg>

          {/* Arrow */}
          <motion.span
            animate={!prefersReducedMotion ? { y: [0, -2, 0] } : {}}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10"
          >
            <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600 group-hover:text-violet-700 transition-colors" />
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
