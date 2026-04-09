import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, ExternalLink, Calendar, Tag, User } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { projects } from "../data/projects";

// ─── Section Label ─────────────────────────────────────────
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <motion.span 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-purple-600 mb-4"
  >
    <span className="w-4 h-px bg-purple-400" />
    {children}
  </motion.span>
);

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
  const [imageLoaded, setImageLoaded] = useState(false);
  
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
        
        {/* Optimized Background - Keeping your grid but optimizing performance */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 right-0 w-[31.25rem] h-[25rem] bg-gradient-to-bl from-violet-100/35 to-transparent blur-[100px] rounded-full" />
          <div className="absolute bottom-1/2 left-0 w-[21.875rem] h-87.5 bg-linear-to-tr from-amber-100/25 to-transparent blur-[80px] rounded-full" />
          {/* Keeping your signature grid but reducing intensity */}
          <div
            className="absolute inset-0 opacity-[0.015]"
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
          
          {/* Animated Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-14"
          >
            <Link 
              to="/projects" 
              className="text-neutral-400 hover:text-violet-600 transition-colors duration-200 inline-flex items-center gap-2"
            >
              ← All Projects
            </Link>
          </motion.div>

          {/* Header with Staggered Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 mb-20"
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              <SectionLabel>{project.category}</SectionLabel>

              <h1 className="font-display font-black leading-[0.88] tracking-tight mb-6">
                <span className="block text-[clamp(3rem,10vw,8rem)] text-[#111]">
                  {project.title}
                </span>
              </h1>

              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base md:text-lg text-neutral-500 max-w-lg"
              >
                {project.description}
              </motion.p>
            </motion.div>

            {/* Meta Cards with Hover Effects */}
            <motion.div 
              className="self-end"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="grid grid-cols-2 gap-6">
                <motion.div 
                  className="p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2 text-neutral-400">
                    <User className="w-4 h-4" />
                    <span className="text-xs">Client</span>
                  </div>
                  <p className="font-semibold">{project.client}</p>
                </motion.div>

                <motion.div 
                  className="p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs">Date</span>
                  </div>
                  <p className="font-semibold">{project.date}</p>
                </motion.div>

                <motion.div 
                  className="col-span-2 p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2 text-neutral-400 mb-2">
                    <Tag className="w-4 h-4" />
                    <span className="text-xs">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <motion.span 
                        key={tag} 
                        className="px-2 py-1 bg-violet-100 text-violet-700 rounded text-sm"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* HERO with Enhanced Loading */}
          {project.hero && (
            <motion.div 
              className="aspect-video rounded-2xl overflow-hidden mb-20 shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <img
                src={project.hero}
                alt={project.title}
                className={`w-full h-full object-cover transition-all duration-700 ${imageLoaded ? 'scale-100' : 'scale-105'}`}
                onLoad={() => setImageLoaded(true)}
                loading="eager"
                decoding="async"
              />
            </motion.div>
          )}

          {/* Overview Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-3xl mb-20"
          >
            <SectionLabel>Overview</SectionLabel>
            <p className="text-neutral-500 leading-relaxed whitespace-pre-line">
              {project.fullDescription}
            </p>
          </motion.div>

          {/* Dynamic Sections with Scroll Reveal */}
          {project.sections?.map((section, index) => {
            const ref = useRef(null);
            const isInView = useInView(ref, { 
              once: true, 
              margin: "-100px",
              amount: 0.3
            });

            return (
              <motion.div
                ref={ref}
                key={index}
                className="mb-20 md:mb-28"
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Section Label */}
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet-500 mb-3">
                  {String(index + 1).padStart(2, "0")} / SECTION
                </p>

                {/* Section Title */}
                <motion.h2 
                  className="text-[clamp(1.6rem,2.5vw,2.2rem)] font-semibold tracking-tight text-neutral-900 mb-5 leading-tight"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.1 }}
                >
                  {section.title}
                </motion.h2>

                {/* Section Content */}
                <motion.p 
                  className="text-[15px] md:text-[17px] text-neutral-600 leading-relaxed md:leading-loose max-w-2xl mb-10 whitespace-pre-line"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.2 }}
                >
                  {section.content}
                </motion.p>

                {/* Images with Enhanced Hover */}
                {section.images && section.images.length > 0 && (
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.3 }}
                  >
                    {section.images.map((img, i) => (
                      <motion.div
                        key={i}
                        className="group relative overflow-hidden rounded-2xl shadow-md"
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img
                          src={img}
                          alt={`${section.title} ${i}`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading={i < 2 ? "eager" : "lazy"}
                          decoding="async"
                        />
                        
                        {/* Enhanced hover overlay */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            );
          })}

          {/* Gallery with Staggered Entrance */}
          {project.gallery && (
            <motion.div 
              className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ staggerChildren: 0.1 }}
            >
              {project.gallery.map((img, i) => (
                <motion.div 
                  key={i} 
                  className="rounded-xl overflow-hidden shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={img}
                    alt={`Project ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Final Content Section */}
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

            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-6 bg-white rounded-xl shadow-sm">
                <SectionLabel>Designer's Note</SectionLabel>
                <p className="text-sm text-neutral-500 italic">
                  "This project explores the intersection of concept and craft — creating visuals that feel both intentional and expressive."
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
};
