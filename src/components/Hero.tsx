import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowDownRight } from "lucide-react";

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll fade
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 py-32"
    >
      {/* 🌌 BACKGROUND */}
      <div className="absolute inset-0 z-0">

        {/* Main gradient blob */}
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2
          w-[800px] h-[800px]
          bg-gradient-to-r from-purple-400/50 to-pink-300/50
          blur-[160px] opacity-80 rounded-full"
        />

        {/* Secondary blob */}
        <motion.div
          className="absolute bottom-0 right-1/4
          w-[600px] h-[600px]
          bg-gradient-to-r from-blue-300/40 to-purple-300/40
          blur-[140px] opacity-70 rounded-full"
        />

        {/* ✨ FULL GLASS LAYER */}
        <div className="
          absolute inset-0
          backdrop-blur-[80px]
          bg-white/30
        " />

        {/* Grain */}
        <div className="bg-grain absolute inset-0 pointer-events-none opacity-70" />

        {/* 🌊 Bottom fade (IMPORTANT FIX) */}
        <div className="
          absolute bottom-0 left-0 w-full h-40
          bg-gradient-to-b from-transparent to-[#f5f1eb]
        " />
      </div>

      {/* ✨ CONTENT */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        {/* Availability */}
        <div className="inline-block mb-6 px-5 py-2 rounded-full
        bg-white/40 backdrop-blur-md border border-white/30
        text-xs uppercase tracking-widest font-mono">
          Available for Freelance
        </div>

        {/* NAME */}
        <h1 className="font-display font-black leading-[0.9] tracking-tight text-4xl sm:text-6xl md:text-7xl">
          <span className="block text-black">KRESHANT</span>
          <span
            className="block text-transparent"
            style={{ WebkitTextStroke: "2px #8A2BE2" }}
          >
            KUMAR
          </span>
        </h1>

        {/* ROLE */}
        <p className="mt-6 text-sm sm:text-lg tracking-[0.35em] uppercase text-purple-500 font-semibold">
          Graphic Designer
        </p>

        {/* DESC */}
        <p className="mt-6 max-w-2xl mx-auto text-black/70 text-base md:text-lg">
          I design bold, concept-driven visuals blending culture, emotion, and digital aesthetics.
          My work turns ideas into experiences — not just visuals.
        </p>

        {/* 🚀 CTA */}
        <div className="mt-10 flex flex-col sm:flex-row gap-6 justify-center items-center">

          {/* PRIMARY (Anchor button) */}
          <a
            href="#projects"
            className="group px-8 py-4 rounded-full
            bg-black text-white font-semibold
            flex items-center gap-2
            transition-all duration-300 hover:bg-black/80 hover:scale-105"
          >
            View My Work
            <ArrowDownRight className="w-5 h-5 group-hover:rotate-45 transition" />
          </a>

          {/* SECONDARY (Glass) */}
          <a
            href="#contact"
            className="px-8 py-4 rounded-full
            bg-white/20 backdrop-blur-md border border-white/30
            text-black font-semibold
            transition-all duration-300 hover:bg-white/30 hover:scale-105"
          >
            Let’s Talk
          </a>
        </div>
      </motion.div>
    </section>
  );
};
