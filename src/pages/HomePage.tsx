import { motion, useScroll, useSpring } from "motion/react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Projects } from "../components/Projects";
import { About } from "../components/About";
import { InstagramCarousel } from "../components/InstagramCarousel";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { LoadingScreen } from "../components/LoadingScreen";
import SketchbookPortal from "../components/SketchbookPortal";

export const HomePage = () => {
  const { scrollYProgress } = useScroll();

  // Spring-smoothed scroll progress for the reading indicator
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      {/* Loading screen — renders independently, fades out on mount */}
      <LoadingScreen />

      <main
        className="relative bg-cream"
        aria-label="Kreshant Kumar — Graphic Designer Portfolio"
      >
        {/* ── Reading progress bar ── */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-0.5 z-70 origin-left pointer-events-none"
          style={{
            scaleX,
            background: "linear-gradient(90deg, #7c3aed, #a855f7, #c084fc)",
          }}
          aria-hidden
        />

        <Navbar />

        {/* ── Page sections ── */}
        <Hero />
        <Projects />
        <About />
        <InstagramCarousel />
        <Contact />
        <SketchbookPortal/>
        <Footer />

        {/* ── Global grain overlay ── */}
        {/* Static, no animation — grain animating causes repaints every frame */}
        <div
          className="fixed inset-0 pointer-events-none z-80 bg-grain opacity-[0.035]"
          aria-hidden
        />
      </main>
    </>
  );
};