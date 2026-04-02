import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { X, ArrowUpRight } from "lucide-react";
import { Logo } from "./Logo";
import {
  FaInstagram, FaLinkedin, FaDribbble, FaTwitter, FaBehance,
} from "react-icons/fa";

const navLinks = [
  { label: "Projects", href: "#projects" },
  { label: "About",    href: "#about"    },
  { label: "Skills",   href: "#skills"   },
  { label: "Contact",  href: "#contact"  },
];

const socialLinks = [
  { Icon: FaInstagram, href: "https://instagram.com/kreshrts",             label: "Instagram", color: "#E4405F" },
  { Icon: FaLinkedin,  href: "https://www.linkedin.com/in/kreshant-kumar", label: "LinkedIn",  color: "#0A66C2" },
  { Icon: FaDribbble,  href: "https://dribbble.com/Kresh_15",              label: "Dribbble",  color: "#EA4C89" },
  { Icon: FaBehance,   href: "https://www.behance.net/kreshantkumar",      label: "Behance",   color: "#053eff" },
  { Icon: FaTwitter,   href: "https://twitter.com/kreshrts",               label: "Twitter",   color: "#1DA1F2" },
];

const legalContent: Record<string, { title: string; content: string }> = {
  Privacy: {
    title: "Privacy Policy",
    content: "Your data is safe here. I don't sell it, share it, or do anything shady with it. Honestly, I'm more interested in designing cool stuff than collecting your information.",
  },
  Terms: {
    title: "Terms of Service",
    content: "Everything you see here is original work (unless stated otherwise). Feel free to get inspired — just don't copy-paste it and call it yours. That's not cool.",
  },
  Cookies: {
    title: "Cookie Policy",
    content: "Yes, this site uses cookies — not the tasty kind. Just boring digital ones that help the site run smoothly. No tracking your life story, no creepy stuff.",
  },
};

const LegalModal = ({ activeKey, onClose }: { activeKey: string | null; onClose: () => void }) => (
  <AnimatePresence>
    {activeKey && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="relative z-10 max-w-md w-full
            bg-white/90 backdrop-blur-xl border border-neutral-200
            rounded-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
        >
          <div className="absolute top-0 right-0 w-32 h-32
            bg-gradient-to-bl from-violet-100/60 to-transparent rounded-bl-full pointer-events-none" />

          <button
            onClick={onClose} aria-label="Close"
            className="absolute top-5 right-5 w-8 h-8 rounded-full
              bg-neutral-100 hover:bg-neutral-200 transition-colors
              flex items-center justify-center"
          >
            <X className="w-4 h-4 text-neutral-600" />
          </button>

          <h3 className="font-black text-2xl mb-4 tracking-tight text-[#111]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {legalContent[activeKey].title}
          </h3>
          <p className="text-sm text-neutral-500 leading-relaxed font-light">
            {legalContent[activeKey].content}
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={onClose}
            className="mt-8 w-full py-3.5 rounded-full font-semibold text-sm text-white
              shadow-[0_4px_20px_rgba(124,58,237,0.3)]
              hover:shadow-[0_6px_28px_rgba(124,58,237,0.45)]
              transition-shadow duration-300"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7, #c084fc)" }}
          >
            Got it!
          </motion.button>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export const Footer = () => {
  const [activeLegal, setActiveLegal] = useState<string | null>(null);

  return (
    <>
      <LegalModal activeKey={activeLegal} onClose={() => setActiveLegal(null)} />

      <footer aria-label="Site footer" className="relative bg-[#faf7f2] border-t border-neutral-200/60 overflow-hidden">
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(#8b5cf6 1px, transparent 1px),
              linear-gradient(90deg, #8b5cf6 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute bottom-0 left-0 w-[300px] h-[200px]
          bg-gradient-to-tr from-violet-100/30 to-transparent blur-[70px] pointer-events-none" />

        {/* Email CTA strip */}
        <div className="relative border-b border-neutral-200/60 py-12 px-4 sm:px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-mono text-[10px] uppercase tracking-[0.35em] text-purple-500 mb-3"
          >
            Open for work ✦ Freelance & full-time
          </motion.p>
          <motion.a
            href="mailto:kreshant2002@gmail.com"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group inline-flex items-center gap-2
              font-black text-xl sm:text-2xl md:text-3xl text-[#111]
              hover:text-violet-600 transition-colors duration-300"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            kreshant2002@gmail.com
            <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100
              group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
          </motion.a>
        </div>

        {/* Main row */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <Logo />

            <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-x-7 gap-y-2">
              {navLinks.map(({ label, href }) => (
                <a key={label} href={href}
                  className="font-mono text-[10px] uppercase tracking-[0.25em]
                    text-neutral-400 hover:text-violet-600 transition-colors duration-200">
                  {label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2.5">
              {socialLinks.map(({ Icon, href, label, color }) => (
                <motion.a
                  key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  whileHover={{ y: -2, scale: 1.1 }} whileTap={{ scale: 0.95 }}
                  className="group relative w-9 h-9 rounded-xl overflow-hidden
                    bg-white/70 backdrop-blur-sm border border-neutral-200
                    flex items-center justify-center shadow-sm transition-all duration-200"
                >
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: color }}
                  />
                  <div className="relative w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors z-10">
                    <Icon />
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Bottom row */}
          <div className="mt-8 pt-6 border-t border-neutral-200/60
            flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex gap-6">
              {Object.keys(legalContent).map((key) => (
                <button key={key} onClick={() => setActiveLegal(key)}
                  className="font-mono text-[9px] uppercase tracking-[0.25em]
                    text-neutral-400 hover:text-violet-600 transition-colors cursor-pointer">
                  {key}
                </button>
              ))}
            </div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">
              © {new Date().getFullYear()} — Handcrafted with ✨ by Kreshant
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;