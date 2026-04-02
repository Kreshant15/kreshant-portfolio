import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, ExternalLink, Calendar, Tag, User } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProjectDetail {
  id: number;
  title: string;
  category: string;
  tag: string;
  image: string;
  description: string;
  client: string;
  date: string;
  tags: string[];
  fullDescription: string;
  liveUrl?: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const projectDetails: Record<number, ProjectDetail> = {
  1: {
    id: 1,
    title: "Driphive",
    category: "Branding",
    tag: "BRAND",
    image: "https://picsum.photos/seed/drip/1200/800",
    description: "A modern identity for a premium streetwear brand rooted in urban culture and sustainability.",
    client: "Driphive Collective",
    date: "March 2024",
    tags: ["Branding", "Logo Design", "Typography"],
    fullDescription:
      "Driphive is a streetwear collective focused on high-quality, limited-edition drops. The branding needed to reflect exclusivity while remaining accessible to urban youth culture. A custom typeface and versatile logo system were developed to work across digital platforms and physical apparel — from screen to sticker, tag to tote.",
  },
  2: {
    id: 2,
    title: "Vexels",
    category: "Branding",
    tag: "BRAND",
    image: "https://picsum.photos/seed/vex/1200/800",
    description: "Visual identity for a tech-forward creative agency at the intersection of art and engineering.",
    client: "Vexels Studio",
    date: "January 2024",
    tags: ["Branding", "Visual Identity", "Web Design"],
    fullDescription:
      "Vexels Studio required an identity that communicated technical precision and creative energy simultaneously. The brand system uses geometric modular shapes and a sharp palette to represent where technology meets art. Deliverables included a full brand guide, stationery system, and responsive website direction.",
  },
  3: {
    id: 3,
    title: "Banana Quest",
    category: "UI Design",
    tag: "UI",
    image: "https://picsum.photos/seed/banana/1200/800",
    description: "A playful, high-energy mobile game interface designed for maximum engagement across all ages.",
    client: "Monkey Games",
    date: "December 2023",
    tags: ["UI Design", "UX Design", "Game UI"],
    fullDescription:
      "Banana Quest is a casual mobile game where players navigate a jungle to collect rare bananas. The UI focused on vibrant colour, chunky touch targets, and intuitive navigation to ensure a fun experience for all ages. Deliverables included a full design system — icons, menus, in-game HUDs, and onboarding flows.",
  },
  4: {
    id: 4,
    title: "Pixel Era",
    category: "Poster Design",
    tag: "PRINT",
    image: "https://picsum.photos/seed/pixel/1200/800",
    description: "A retro-futuristic poster series bridging 80s synthwave nostalgia with contemporary digital aesthetics.",
    client: "Synthwave Nights",
    date: "November 2023",
    tags: ["Poster Design", "Illustration", "Graphic Design"],
    fullDescription:
      "Pixel Era is a tribute to the 80s synthwave aesthetic, designed for a monthly electronic music event. Using a mix of pixel art and modern gradients, the series captures nostalgia for the early digital age while maintaining a contemporary edge. Each poster tells a different chapter of the same visual world.",
  },
};

// ─── Section Label (consistent with site) ────────────────────────────────────

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-purple-600 mb-4">
    <span className="w-4 h-px bg-purple-400" />
    {children}
  </span>
);

// ─── 404 state ────────────────────────────────────────────────────────────────

const NotFound = () => (
  <main className="min-h-screen bg-[#faf7f2] flex items-center justify-center px-6">
    <div className="text-center space-y-6">
      <p
        className="text-[clamp(5rem,20vw,12rem)] font-black text-[#111] leading-none"
        style={{ fontFamily: "'Space Grotesk', sans-serif", WebkitTextStroke: "2px #7c3aed", color: "transparent" }}
      >
        404
      </p>
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-400">
        Project not found
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Return home
      </Link>
    </div>
  </main>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

export const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const project = projectDetails[Number(id)];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Dynamic page title + description for SEO
  useEffect(() => {
    if (!project) return;
    document.title = `${project.title} — ${project.category} | Kreshant Kumar`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", project.description);
  }, [project]);

  if (!project) return <NotFound />;

  return (
    <main
      className="relative bg-[#faf7f2]"
      aria-label={`${project.title} — Project Detail`}
    >
      {/* Structured data for this project */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: project.title,
            description: project.description,
            creator: {
              "@type": "Person",
              name: "Kreshant Kumar",
              url: "https://kreshrts-portfolio.vercel.app",
            },
            dateCreated: project.date,
            genre: project.category,
            keywords: project.tags.join(", "),
          }),
        }}
      />

      <Navbar />

      <div className="relative pt-32 md:pt-40 pb-24 px-4 sm:px-6 overflow-hidden">

        {/* ── Background ── */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 right-0 w-[500px] h-[400px]
            bg-gradient-to-bl from-violet-100/35 to-transparent blur-[100px] rounded-full" />
          <div className="absolute bottom-1/2 left-0 w-[350px] h-[350px]
            bg-gradient-to-tr from-amber-100/25 to-transparent blur-[80px] rounded-full" />
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

          {/* ── Back link ── */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mb-14"
          >
            <Link
              to="/projects"
              className="group inline-flex items-center gap-2
                font-mono text-[10px] uppercase tracking-[0.25em]
                text-neutral-400 hover:text-violet-600 transition-colors duration-200"
              aria-label="Back to all projects"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-200" />
              All Projects
            </Link>
          </motion.div>

          {/* ── Header grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 mb-20 md:mb-28">

            {/* Left — title block */}
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <SectionLabel>{project.category}</SectionLabel>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-black leading-[0.88] tracking-tight mb-6"
              >
                <span
                  className="block text-[clamp(3rem,10vw,8rem)] text-[#111111]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {project.title}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-base md:text-lg text-neutral-500 font-light leading-relaxed max-w-lg"
              >
                {project.description}
              </motion.p>
            </div>

            {/* Right — meta info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="self-end"
            >
              <div className="grid grid-cols-2 gap-6">

                {/* Client */}
                <div className="rounded-2xl border border-neutral-200/80 bg-white/60 backdrop-blur-sm p-5 space-y-2">
                  <div className="flex items-center gap-1.5 text-neutral-400">
                    <User className="w-3.5 h-3.5" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em]">Client</span>
                  </div>
                  <p className="font-semibold text-sm text-[#111]">{project.client}</p>
                </div>

                {/* Date */}
                <div className="rounded-2xl border border-neutral-200/80 bg-white/60 backdrop-blur-sm p-5 space-y-2">
                  <div className="flex items-center gap-1.5 text-neutral-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em]">Date</span>
                  </div>
                  <p className="font-semibold text-sm text-[#111]">{project.date}</p>
                </div>

                {/* Tags */}
                <div className="col-span-2 rounded-2xl border border-neutral-200/80 bg-white/60 backdrop-blur-sm p-5 space-y-3">
                  <div className="flex items-center gap-1.5 text-neutral-400">
                    <Tag className="w-3.5 h-3.5" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em]">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full
                          font-mono text-[9px] uppercase tracking-[0.2em]
                          text-violet-700 bg-violet-50 border border-violet-200/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Hero image ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-video rounded-2xl overflow-hidden mb-20 md:mb-28
              shadow-[0_8px_40px_rgba(0,0,0,0.12)]
              border border-neutral-200/60"
          >
            <img
              src={project.image}
              alt={`${project.title} — hero image`}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              loading="eager"
            />
            {/* Subtle warm vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />

            {/* Category tag overlay */}
            <div className="absolute top-5 left-5">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em]
                text-white/90 bg-black/40 backdrop-blur-sm
                px-3 py-1.5 rounded-full border border-white/10">
                {project.tag}
              </span>
            </div>
          </motion.div>

          {/* ── Content grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20">

            {/* Left — full write-up + process shots */}
            <div>
              <SectionLabel>The Challenge</SectionLabel>

              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-black leading-tight tracking-tight mb-6"
              >
                <span
                  className="text-[clamp(1.8rem,4vw,3rem)] text-[#111]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  About the{" "}
                </span>
                <span
                  className="text-[clamp(1.8rem,4vw,3rem)]"
                  style={{
                    color: "transparent",
                    WebkitTextStroke: "1.5px #7c3aed",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  Project
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-base md:text-lg text-neutral-500 font-light leading-relaxed mb-12"
              >
                {project.fullDescription}
              </motion.p>

              {/* Process images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {["a", "b"].map((suffix, i) => (
                  <motion.div
                    key={suffix}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="aspect-[4/3] rounded-xl overflow-hidden
                      border border-neutral-200/60
                      shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
                  >
                    <img
                      src={`https://picsum.photos/seed/${project.id}${suffix}/600/400`}
                      alt={`${project.title} process ${i + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right — designer's note + CTA */}
            <div className="space-y-6 lg:pt-14">

              {/* Designer's note card */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl border border-violet-200/60
                  bg-white/60 backdrop-blur-sm
                  shadow-[0_2px_20px_rgba(124,58,237,0.07)]
                  p-6 relative overflow-hidden"
              >
                {/* Corner glow */}
                <div className="absolute top-0 right-0 w-24 h-24
                  bg-gradient-to-bl from-violet-100/50 to-transparent pointer-events-none" />

                <SectionLabel>Designer's Note</SectionLabel>

                <p className="text-sm text-neutral-500 font-light leading-relaxed italic">
                  "This project pushed me to explore the edges of{" "}
                  {project.category.toLowerCase()} — balancing concept with
                  craft, and making sure the final result felt both intentional
                  and alive."
                </p>
              </motion.div>

              {/* Live project CTA */}
              {project.liveUrl && (
                <motion.a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative flex items-center justify-center gap-2.5
                    w-full py-4 rounded-full
                    font-semibold text-sm text-white overflow-hidden
                    shadow-[0_4px_20px_rgba(124,58,237,0.3)]
                    hover:shadow-[0_6px_28px_rgba(124,58,237,0.45)]
                    transition-shadow duration-300"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #a855f7, #c084fc)",
                  }}
                  aria-label={`View ${project.title} live`}
                >
                  <span
                    className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%]
                      bg-gradient-to-r from-transparent via-white/25 to-transparent
                      transition-transform duration-700"
                  />
                  <span className="relative">View Live Project</span>
                  <ExternalLink
                    className="relative w-4 h-4
                      group-hover:translate-x-0.5 group-hover:-translate-y-0.5
                      transition-transform duration-200"
                  />
                </motion.a>
              )}

              {/* Back to projects */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  to="/projects"
                  className="group flex items-center justify-center gap-2
                    w-full py-4 rounded-full
                    font-semibold text-sm
                    border border-neutral-200/80 bg-white/70 backdrop-blur-sm
                    text-neutral-600 hover:border-violet-400 hover:text-violet-700
                    hover:shadow-[0_2px_16px_rgba(124,58,237,0.12)]
                    shadow-sm transition-all duration-200"
                  aria-label="Back to all projects"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                  All Projects
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[80] bg-grain opacity-[0.035]"
        aria-hidden
      />
    </main>
  );
};