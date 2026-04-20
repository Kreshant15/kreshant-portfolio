import React, { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Calendar, Tag, User } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { projects } from "../data/projects";

// ─── Section Label ─────────────────────────────────────────
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-purple-600 mb-4">
    <span className="w-4 h-px bg-purple-400" />
    {children}
  </span>
);

const getCenteredOddImageClass = (index: number, total: number) => {
  const isCenteredOddImage = total % 2 === 1 && total !== 1 && index === total - 1;

  return isCenteredOddImage ? "md:col-span-2 md:mx-auto md:w-[min(100%,32rem)]" : "";
};

// ─── 404 ───────────────────────────────────────────────────
const NotFound = () => (
  <main className="min-h-screen bg-cream flex items-center justify-center px-6">
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
  
  const project = useMemo(() => 
    projects.find((p) => p.id === id), 
    [id]
  );

  const structuredData = useMemo(() => project ? ({
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
    keywords: project.tags?.join(", ") || "",
  }) : null, [project]);

  // Scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      className="relative bg-cream"
      aria-label={`${project.title} — Project Detail`}
    >
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}

      <Navbar />

      <div className="relative pt-32 md:pt-40 pb-24 px-4 sm:px-6 overflow-hidden">
        
        {/* Background - Keeping your original design */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 right-0 w-125 h-100 bg-linear-to-bl from-violet-100/35 to-transparent blur-[100px] rounded-full" />
          <div className="absolute bottom-1/2 left-0 w-87.5 h-87.5 bg-linear-to-tr from-amber-100/25 to-transparent blur-[80px] rounded-full" />
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
          
          {/* Back Button with Animation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-14"
          >
            <Link 
              to="/projects" 
              className="text-neutral-400 hover:text-violet-600 transition-colors duration-200"
            >
              ← All Projects
            </Link>
          </motion.div>

          {/* Header */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SectionLabel>{project.category}</SectionLabel>

              <h1 className="font-display font-black leading-[0.88] tracking-tight mb-6">
                <span className="block text-[clamp(3rem,10vw,8rem)] text-[#111]">
                  {project.title}
                </span>
              </h1>

              <p className="text-base md:text-lg text-neutral-500 max-w-2xl">
                {project.description}
              </p>

              {project.prototypeUrl ? (
                <div className="mt-8">
                  <Link
                    to={project.prototypeUrl}
                    className="group inline-flex items-center gap-3 rounded-full
                      bg-[linear-gradient(135deg,#7c3aed,#a855f7,#c084fc)]
                      px-6 py-3 text-sm font-semibold text-white
                      shadow-[0_8px_24px_rgba(124,58,237,0.22)]
                      transition-transform duration-200 hover:scale-[1.02]"
                  >
                    View Prototype
                    <ExternalLink className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              ) : null}
            </motion.div>

            {/* Meta Cards */}
            <motion.div 
              className="self-end"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <User className="w-4 h-4" />
                    <span className="text-xs">Client</span>
                  </div>
                  <p className="font-semibold">{project.client}</p>
                </div>

                <div className="p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs">Date</span>
                  </div>
                  <p className="font-semibold">{project.date}</p>
                </div>

                <div className="col-span-2 p-5 bg-white rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 text-neutral-400 mb-2">
                    <Tag className="w-4 h-4" />
                    <span className="text-xs">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="px-2 py-1 bg-violet-100 text-violet-700 rounded text-sm hover:bg-violet-200 transition-colors cursor-default"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* HERO */}
          {project.hero && (
            <motion.div 
              className="aspect-video rounded-2xl overflow-hidden mb-20 shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={project.hero}
                alt={project.title}
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
              />
            </motion.div>
          )}

          {/* OVERVIEW */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="max-w-5xl mb-20"
          >
            <SectionLabel>Overview</SectionLabel>
            <p className="text-neutral-500 leading-relaxed whitespace-pre-line">
              {project.fullDescription}
            </p>
          </motion.div>

          {/* SECTIONS - Simplified animations */}
          {project.sections?.map((section, index) => (
            <motion.div 
              key={index} 
              className="mb-20 md:mb-28"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Section Label */}
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet-500 mb-3">
                {String(index + 1).padStart(2, "0")} / SECTION
              </p>

              {/* Section Title */}
              <h2 className="text-[clamp(1.6rem,2.5vw,2.2rem)] font-semibold tracking-tight text-neutral-900 mb-5 leading-tight">
                {section.title}
              </h2>

              {/* Section Content */}
              <p className="text-[15px] md:text-[17px] text-neutral-600 leading-relaxed md:leading-loose max-w-5xl mb-10 whitespace-pre-line">
                {section.content}
              </p>

              {/* Images */}
              {section.images && section.images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {section.images.map((img, i) => (
                    <motion.div
                      key={i}
                      className={`group relative overflow-hidden rounded-2xl shadow-md bg-neutral-100 p-2 ${getCenteredOddImageClass(i, section.images.length)}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <img
                        src={img}
                        alt={`${section.title} ${i}`}
                        className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}

          {/* GALLERY */}
          {project.gallery && (
            <motion.div 
              className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {project.gallery.map((img, i) => (
                <motion.div 
                  key={i} 
                  className={`rounded-xl overflow-hidden shadow-md bg-neutral-100 p-2 ${getCenteredOddImageClass(i, project.gallery.length)}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  whileHover={{ y: -3 }}
                >
                  <img
                    src={img}
                    alt={`Project ${i + 1}`}
                    className="w-full h-auto object-contain transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Final Content */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 mt-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <SectionLabel>About Project</SectionLabel>
              <p className="whitespace-pre-line text-neutral-500 leading-relaxed">
                {project.fullDescription}
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-white rounded-xl shadow-sm">
                <SectionLabel>Designer's Note</SectionLabel>
                <p className="text-sm text-neutral-500 italic">
                  "This project explores the intersection of concept and craft — creating visuals that feel both intentional and expressive."
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
};
