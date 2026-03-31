import React, { useState, useEffect, useRef } from "react";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useMotionValue, 
  useSpring,
  useReducedMotion 
} from "motion/react";
import { ArrowDownRight, Sparkles, Download } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  
  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, prefersReducedMotion]);

  const mouseXSpring = useSpring(mouseX, { stiffness: 50, damping: 10 });
  const mouseYSpring = useSpring(mouseY, { stiffness: 50, damping: 10 });
  
  const parallaxX1 = useTransform(mouseXSpring, [0, typeof window !== 'undefined' ? window.innerWidth : 1920], [-30, 30]);
  const parallaxY1 = useTransform(mouseYSpring, [0, typeof window !== 'undefined' ? window.innerHeight : 1080], [-30, 30]);

  // Typewriter effect
  const [displayText, setDisplayText] = useState("");
  const fullText = "(Graphic Designer)";
  
  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayText(fullText);
      return;
    }
    
    let index = 0;
    const timer = setInterval(() => {
      setDisplayText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(timer);
        // Add blinking cursor
        setTimeout(() => {
          setDisplayText(prev => prev + '|');
        }, 500);
      }
    }, 100);
    
    return () => clearInterval(timer);
  }, [fullText, prefersReducedMotion]);

  // Loading state for resume download
  const [isDownloading, setIsDownloading] = useState(false);
  
const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
  setIsDownloading(true);
  // Reset after 3 seconds
  setTimeout(() => setIsDownloading(false), 3000);
};

return (
    <section 
      ref={containerRef} 
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      aria-label="Hero section - Introduction to Kreshant Kumar"
    >
      {/* SEO Meta Data */}
      <div className="sr-only">
        <h1>Kreshant Kumar - Graphic Designer Portfolio</h1>
        <p>Creative graphic designer specializing in bold, concept-driven visuals that blend culture, emotion, and digital aesthetics.</p>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          style={{ y: y1, x: parallaxX1 }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-pastel-pink to-accent-purple rounded-full blur-3xl opacity-40"
          animate={prefersReducedMotion ? {} : { 
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          role="presentation"
          aria-hidden="true"
        />
        <motion.div 
          style={{ y: y2, x: parallaxX1 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pastel-blue to-purple-300 rounded-full blur-3xl opacity-40"
          animate={prefersReducedMotion ? {} : { 
            scale: [1, 1.05, 1],
            opacity: [0.4, 0.5, 0.4]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
          role="presentation"
          aria-hidden="true"
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
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/30 backdrop-blur-sm border border-black/5 mb-8 relative z-10"
          >
            <Sparkles 
              className="w-4 h-4 text-accent-pink" 
              aria-hidden="true"
            />
            <span className="font-mono text-xs uppercase tracking-widest text-black">
              Available for Freelance
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="absolute -top-10 -right-10 md:-right-20 rotate-12 hidden sm:block"
          >
            <span className="font-hand text-4xl md:text-6xl text-accent-pink drop-shadow-sm sr-only sm:not-sr-only">
              Creative!
            </span>
          </motion.div>

          <div className="flex flex-col items-center justify-center mb-6">
            <motion.h1
              className="font-display text-3xl sm:text-7xl md:text-8xl lg:text-[clamp(3rem,10vw,8rem)] font-black leading-[0.8] tracking-tighter relative z-10 flex flex-wrap justify-center break-words"
              aria-label="KRESHANT KUMAR - Graphic Designer"
            >
              {["KRESHANT", "KUMAR"].map((word, wordIndex) => (
                <motion.span 
                  key={wordIndex} 
                  className="inline-block whitespace-nowrap mx-[0.1em]"
                  animate={prefersReducedMotion ? {} : { 
                    x: wordIndex === 0 ? [ 0, -10, 0 ] : [ 0, 10, 0 ],
                    opacity: [ 1, 0.9, 1 ]
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
                      key={`${wordIndex}-${charIndex}`}
                      initial={{ opacity: 0, y: 50, rotateX: -90 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: (wordIndex * 8 + charIndex) * 0.05 + 0.3,
                        ease: [0.215, 0.61, 0.355, 1],
                      }}
                      className={`inline-block ${wordIndex === 1 ? "text-transparent" : "text-black"}`}
                      style={wordIndex === 1 ? { 
                        WebkitTextStroke: "2px #8A2BE2", // Purple stroke
                        color: "transparent" // No fill
                      } : {}}
                      aria-hidden="true"
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
            transition={{ delay: 1, duration: 0.8 }}
            className="mb-10 relative z-10"
          >
            <span className="font-mono text-lg sm:text-2xl uppercase tracking-[0.4em] text-accent-pink font-black inline-block min-h-[2rem]">
              {displayText.replace('|', '')}
              {displayText.includes('|') && (
                <motion.span 
                  className="inline-block w-2 h-8 bg-accent-pink ml-1 align-middle"
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  aria-hidden="true"
                />
              )}
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="max-w-2xl mx-auto text-base md:text-xl text-black/70 font-medium mb-12 px-4 relative z-10"
          >
            I design bold, concept-driven visuals that blend culture, emotion, and digital aesthetics.
            From glitchy experiments to meaningful visual stories, my work is all about making ideas <em className="not-italic font-semibold">feel</em> something—not just look good.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6 relative z-10"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Link
                to="/projects"
                className="group relative inline-block px-10 py-5 bg-black text-white rounded-full font-bold overflow-hidden shadow-lg hover:shadow-xl transition-all"
                aria-label="View portfolio projects"
              >
                <span className="relative z-10 flex items-center gap-2">
                  View My Work <ArrowDownRight className="w-5 h-5 group-hover:rotate-45 transition-transform" aria-hidden="true" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-accent-pink to-purple-500"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  aria-hidden="true"
                />
              </Link>
            </motion.div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a
                href="#contact"
                className="px-8 py-5 border-2 border-black rounded-full font-bold hover:bg-black hover:text-white transition-all duration-300 text-black shadow-md hover:shadow-lg text-center"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Contact Kreshant for freelance opportunities"
              >
                Let's Talk
              </motion.a>

              <motion.a
                href="/doc/Kreshant_Fresher_Designer_CV.pdf"
                download="Kreshant_Fresher_Designer_CV.pdf"
                onClick={handleDownload}
                className="px-8 py-5 bg-gradient-to-r from-accent-pink to-purple-500 text-white rounded-full font-bold hover:from-purple-500 hover:to-accent-pink transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg text-center"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Download Kreshant's resume as PDF"
              >
                {isDownloading ? (
                  <span className="flex items-center gap-2">
                    <motion.span 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5"
                    >
                      ↻
                    </motion.span>
                    Downloading...
                  </span>
                ) : (
                  <>
                    <Download className="w-5 h-5" aria-hidden="true" />
                    Download CV
                  </>
                )}
              </motion.a>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Doodles */}
      <motion.div
        style={{ y: y2, rotate: rotate1, x: parallaxX1 }}
        animate={prefersReducedMotion ? {} : { 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-10 hidden lg:block"
        role="presentation"
        aria-hidden="true"
      >
        <div className="w-16 h-16 border-4 border-accent-blue rounded-xl rotate-12" />
      </motion.div>
      
      <motion.div
        style={{ y: y1, x: parallaxX1 }}
        animate={prefersReducedMotion ? {} : { 
          y: [0, 20, 0], 
          rotate: [0, -5, 0] 
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-10 hidden lg:block"
        role="presentation"
        aria-hidden="true"
      >
        <div className="w-20 h-20 bg-pastel-yellow rounded-full border-4 border-black" />
      </motion.div>

      {/* Accessibility skip link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-white focus:px-4 focus:py-2 focus:rounded-md focus:z-50"
      >
        Skip to main content
      </a>
    </section>
  );
};
