import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDownRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-pastel-pink rounded-full blur-3xl opacity-40 animate-pulse" 
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pastel-blue rounded-full blur-3xl opacity-40 animate-pulse delay-1000" 
        />
        <div className="bg-grain absolute inset-0 pointer-events-none" />
      </div>

      <motion.div 
        style={{ opacity }}
        className="max-w-7xl mx-auto px-6 relative z-10 w-full"
      >
        <div className="w-full text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/30 backdrop-blur-sm border border-black/5 mb-8 relative z-10"
          >
            <Sparkles className="w-4 h-4 text-accent-pink" />
            <span className="font-mono text-xs uppercase tracking-widest text-black">Available for Freelance</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 5, type: "spring" }}
            className="absolute -top-10 -right-10 md:-right-20 rotate-12 hidden sm:block"
          >
            <span className="font-hand text-4xl md:text-6xl text-accent-pink drop-shadow-sm">
              Creative!
            </span>
          </motion.div>

          <div className="flex flex-col items-center justify-center mb-6">
            <motion.h1
              className="font-display text-3xl sm:text-7xl md:text-8xl lg:text-[clamp(3rem,10vw,8rem)] font-black leading-[0.8] tracking-tighter relative z-10 flex flex-wrap justify-center break-words"
            >
              {["KRESHANT", "KUMAR"].map((word, wordIndex) => (
                <motion.span 
                  key={wordIndex} 
                  className="inline-block whitespace-nowrap mx-[0.1em]"
                  animate={{ 
                    x: wordIndex === 0 ? [ 0, -20, 0 ] : [ 0, 20, 0 ],
                    opacity: [ 1, 0.8, 1 ]
                  }}
                  transition={{ 
                    duration: 0.6, 
                    repeat: Infinity, 
                    repeatDelay: 4, 
                    ease: "easeInOut" 
                  }}
                >
                  {word.split("").map((char, charIndex) => (
                    <motion.span
                      key={charIndex}
                      initial={{ opacity: 0, y: 50, rotateX: -90 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: (wordIndex * 8 + charIndex) * 0.05 + 2.8,
                        ease: [0.215, 0.61, 0.355, 1],
                      }}
                      className={`inline-block ${wordIndex === 1 ? "text-accent-pink/40" : "text-black"}`}
                      style={wordIndex === 1 ? { WebkitTextStroke: "2px #ff80ab" } : {}}
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.span>
              ))}
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4.5, duration: 0.8 }} // Delay after name animation
            className="mb-10 relative z-10"
          >
            <span className="font-mono text-lg sm:text-2xl uppercase tracking-[0.4em] text-accent-pink font-black inline-block">
              (Graphic Designer)
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4.7, duration: 1 }}
            className="max-w-2xl mx-auto text-base md:text-xl text-black/70 font-medium mb-12 px-4 relative z-10"
          >
            I design bold, concept-driven visuals that blend culture, emotion, and digital aesthetics.
From glitchy experiments to meaningful visual stories, my work is all about making ideas *feel* something—not just look good.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6 relative z-10"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/projects"
                className="group relative inline-block px-10 py-5 bg-black text-white rounded-full font-bold overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  View My Work <ArrowDownRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-accent-pink"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
              </Link>
            </motion.div>
            
            <div className="flex gap-4">
              <motion.a
                href="#contact"
                className="px-8 py-5 border-2 border-black rounded-full font-bold hover:bg-black hover:text-white transition-colors text-black"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Let's Talk
              </motion.a>

              <motion.a
                href="/doc/Kreshant_Fresher_Designer_CV.pdf"
                download
                className="px-8 py-5 bg-accent-pink text-white rounded-full font-bold hover:bg-black transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Download CV
              </motion.a>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Doodles (Simulated with icons/shapes) */}
      <motion.div
        style={{ y: y2, rotate: rotate1 }}
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-10 hidden lg:block"
      >
        <div className="w-16 h-16 border-4 border-accent-blue rounded-xl rotate-12" />
      </motion.div>
      <motion.div
        style={{ y: y1 }}
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-10 hidden lg:block"
      >
        <div className="w-20 h-20 bg-pastel-yellow rounded-full border-4 border-black" />
      </motion.div>
    </section>
  );
};
