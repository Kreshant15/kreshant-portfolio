import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Projects } from "../components/Projects";

export const ProjectsPage = () => {
  return (
    <main
      className="relative bg-[#faf7f2]"
      aria-label="All Projects — Kreshant Kumar"
    >
      <Navbar />

      {/* ── PAGE CONTENT ── */}
      <div className="relative pt-32 md:pt-40 pb-24 px-4 sm:px-6 min-h-screen overflow-hidden">

        {/* Background — same as every other section */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 right-0 w-125 h-100
            bg-linear-to-bl from-violet-100/35 to-transparent blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-100 h-75
            bg-linear-to-tr from-amber-100/25 to-transparent blur-[80px] rounded-full" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `
                linear-gradient(#8b5cf6 1px, transparent 1px),
                linear-gradient(90deg, #8b5cf6 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto">

          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12"
          >
            <Link
              to="/"
              className="group inline-flex items-center gap-2
                font-mono text-[10px] uppercase tracking-[0.25em]
                text-neutral-400 hover:text-violet-600 transition-colors duration-200"
              aria-label="Back to homepage"
            >
              <ArrowLeft
                className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-200"
              />
              Back to Home
            </Link>
          </motion.div>

          {/* Page heading — same two-line pattern as every section */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6"
          >
            {/* Section label */}
            <span className="inline-flex items-center gap-2
              font-mono text-[10px] uppercase tracking-[0.3em]
              text-purple-600 mb-4">
              <span className="w-4 h-px bg-purple-400" />
              Archive
            </span>

            <h1
              className="font-display font-black leading-[0.9] tracking-tight"
            >
              <span
                className="block text-[clamp(2.8rem,8vw,6.5rem)] text-[#111111]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                ALL
              </span>
              <span
                className="block text-[clamp(2.8rem,8vw,6.5rem)]"
                style={{
                  color: "transparent",
                  WebkitTextStroke: "2px #7c3aed",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                Projects
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="max-w-lg text-sm md:text-base leading-relaxed
              text-neutral-500 font-light mb-16"
          >
            A comprehensive archive of my creative journey — from commercial
            branding to experimental digital art and UI explorations.
          </motion.p>

          {/* Projects grid — reused component, no "Explore" button */}
          <Projects showExploreButton={false} />
        </div>
      </div>

      <Footer />

      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-80 bg-grain opacity-[0.035]"
        aria-hidden
      />
    </main>
  );
};