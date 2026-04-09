import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, ExternalLink, Calendar, Tag, User } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { projects } from "../data/projects"; // ✅ NEW

// ─── Section Label ─────────────────────────────────────────

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-purple-600 mb-4">
    <span className="w-4 h-px bg-purple-400" />
    {children}
  </span>
);

// ─── 404 ───────────────────────────────────────────────────

const NotFound = () => (
  <main className="min-h-screen bg-[#faf7f2] flex items-center justify-center px-6">
    <div className="text-center space-y-6">
      <p
        className="text-[clamp(5rem,20vw,12rem)] font-black text-[#111] leading-none"
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          WebkitTextStroke: "2px #7c3aed",
          color: "transparent",
        }}
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

// ─── MAIN ──────────────────────────────────────────────────

export const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  // ✅ FIND PROJECT USING STRING ID
  const project = projects.find((p) => p.id === id);

  // Scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // SEO updates
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
      {/* Structured Data */}
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

        {/* Background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-gradient-to-bl from-violet-100/35 to-transparent blur-[100px] rounded-full" />
          <div className="absolute bottom-1/2 left-0 w-[350px] h-[350px] bg-gradient-to-tr from-amber-100/25 to-transparent blur-[80px] rounded-full" />
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

          {/* Back */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-14"
          >
            <Link to="/projects" className="text-neutral-400 hover:text-violet-600">
              ← All Projects
            </Link>
          </motion.div>

          {/* Header */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 mb-20">

            <div>
              <SectionLabel>{project.category}</SectionLabel>

              <h1 className="font-display font-black leading-[0.88] tracking-tight mb-6">
                <span className="block text-[clamp(3rem,10vw,8rem)] text-[#111]">
                  {project.title}
                </span>
              </h1>

              <p className="text-base md:text-lg text-neutral-500 max-w-lg">
                {project.description}
              </p>
            </div>

            {/* Meta */}
            <div className="self-end">
              <div className="grid grid-cols-2 gap-6">

                <div className="p-5 bg-white rounded-xl">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <User className="w-4 h-4" />
                    <span className="text-xs">Client</span>
                  </div>
                  <p className="font-semibold">{project.client}</p>
                </div>

                <div className="p-5 bg-white rounded-xl">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs">Date</span>
                  </div>
                  <p className="font-semibold">{project.date}</p>
                </div>

                <div className="col-span-2 p-5 bg-white rounded-xl">
                  <div className="flex items-center gap-2 text-neutral-400 mb-2">
                    <Tag className="w-4 h-4" />
                    <span className="text-xs">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-violet-100 text-violet-700 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Hero Image */}
          {/* <div className="aspect-video rounded-2xl overflow-hidden mb-20 shadow">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div> */}

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12">

            <div>
              <SectionLabel>About Project</SectionLabel>

              {/* ✅ LINE BREAK FIX */}
              <p className="whitespace-pre-line text-neutral-500 leading-relaxed">
                {project.fullDescription}
              </p>
            </div>

            <div className="space-y-6">

              <div className="p-6 bg-white rounded-xl">
                <SectionLabel>Designer's Note</SectionLabel>
                <p className="text-sm text-neutral-500 italic">
                  "This project explores the intersection of concept and craft — creating visuals that feel both intentional and expressive."
                </p>
              </div>

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  className="block text-center bg-violet-600 text-white py-3 rounded-full"
                >
                  View Live Project
                </a>
              )}

            </div>

          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};