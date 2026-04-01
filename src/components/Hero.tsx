import React, { useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion
} from "motion/react";
import { ArrowDownRight, Sparkles, Download } from "lucide-react";

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setIsDownloading(true);
    setTimeout(() => setIsDownloading(false), 3000);
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-gradient-to-br from-amber-50 to-violet-50"
    >
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2
          w-[300px] h-[300px] md:w-[500px] md:h-[500px]
          bg-gradient-to-r from-purple-300/20 to-pink-200/20
          blur-[80px] rounded-full" />
        
        <div className="absolute bottom-1/4 left-1/4
          w-[250px] h-[250px] md:w-[400px] md:h-[400px]
          bg-gradient-to-r from-blue-200/20 to-violet-200/20
          blur-[80px] rounded-full" />
        
        <div className="absolute inset-0 bg-grain opacity-30 pointer-events-none" />
      </div>

      {/* FLOATING ELEMENTS */}
      <motion.div
        animate={!prefersReducedMotion ? { 
          y: [0, -15, 0],
          rotate: [0, 5, 0]
        } : {}}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute left-6 top-1/4 text-purple-400 text-2xl md:text-3xl opacity-70"
      >
        ✦
      </motion.div>

      <motion.div
        animate={!prefersReducedMotion ? { 
          y: [0, 20, 0],
          rotate: [0, -5, 0]
        } : {}}
        transition={{ 
          duration: 5, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute right-8 bottom-1/3 text-pink-400 text-xl md:text-2xl opacity-70"
      >
        ◎
      </motion.div>

      {/* CONTENT */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-6xl mx-auto px-6 text-center w-full"
      >
        {/* Availability Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 mb-6 md:mb-8 px-5 py-2 rounded-full
          bg-white/70 backdrop-blur-sm border border-purple-200/50
          text-xs md:text-sm uppercase tracking-widest font-mono shadow-sm"
        >
          <motion.div
            animate={!prefersReducedMotion ? { 
              rotate: [0, 360]
            } : {}}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Sparkles className="w-4 h-4 text-purple-500" />
          </motion.div>
          Available for Freelance
        </motion.div>

        {/* NAME with enhanced animations */}
        <div className="mb-6 md:mb-8">
          <motion.h1 
            className="font-display font-black leading-[0.85] tracking-tight text-[clamp(2.5rem,12vw,6rem)] md:text-[clamp(4rem,10vw,8rem)]"
          >
            {/* KRESHANT - Word level animation */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8,
                ease: [0.215, 0.61, 0.355, 1],
                delay: 0.3
              }}
              className="block text-black mb-2"
            >
              KRESHANT
            </motion.div>

            {/* KUMAR - Letter by letter animation */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.08,
                    delayChildren: 0.6
                  }
                }
              }}
              className="block text-center"
            >
              {"KUMAR".split("").map((letter, index) => (
                <motion.span
                  key={index}
                  variants={{
                    hidden: { 
                      opacity: 0, 
                      y: 50,
                      rotateY: 90
                    },
                    visible: { 
                      opacity: 1, 
                      y: 0, 
                      rotateY: 0,
                      transition: {
                        duration: 0.6,
                        ease: [0.215, 0.61, 0.355, 1]
                      }
                    }
                  }}
                  className="inline-block text-transparent"
                  style={{ 
                    WebkitTextStroke: "2px #8B5CF6"
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>
          </motion.h1>
        </div>

        {/* ROLE with typewriter effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-4 md:mt-6"
        >
          <span className="text-sm md:text-lg tracking-[0.3em] uppercase text-purple-600 font-semibold inline-block">
            Graphic Designer
          </span>
        </motion.div>

        {/* DESC */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mt-6 max-w-2xl mx-auto text-black/80 text-base md:text-lg leading-relaxed"
        >
          I design bold, concept-driven visuals blending culture, emotion, and digital aesthetics.
          My work turns ideas into experiences — not just visuals.
        </motion.p>

        {/* CTA BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center"
        >
          {/* PRIMARY - Enhanced */}
          <motion.a
            href="#contact"
            className="group relative px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            style={{
              background: 'linear-gradient(45deg, #c77dff, #a855f7, #d8b4fe)',
            }}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="absolute left-[-100%] top-0 w-full h-full
            bg-gradient-to-r from-transparent via-white/30 to-transparent
            opacity-0 group-hover:opacity-100 group-hover:left-[100%] transition-all duration-500" />
            
            <span className="relative text-white flex items-center gap-2">
              Let's Work Together
              <ArrowDownRight className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-45 transition-transform duration-300" />
            </span>
          </motion.a>

          {/* SECONDARY - Resume Download */}
          <motion.a
            href="/doc/Kreshant_Fresher_Designer_CV.pdf"
            download="Kreshant_Fresher_Designer_CV.pdf"
            onClick={handleDownload}
            className="group relative px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold overflow-hidden border-2 border-purple-300 shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            whileHover={{ 
              scale: 1.05,
              borderColor: "#8B5CF6",
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              animate={isDownloading && !prefersReducedMotion ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: isDownloading ? Infinity : 0, ease: "linear" }}
            >
              <Download className="w-4 h-4 md:w-5 md:h-5 text-purple-600 group-hover:text-purple-800 transition-colors" />
            </motion.span>
            
            <span className="text-purple-700 group-hover:text-purple-900 transition-colors">
              {isDownloading ? "Downloading..." : "Download Resume"}
            </span>
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
};
