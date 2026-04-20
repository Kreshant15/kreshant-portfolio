import React, { useState, useEffect, useRef } from "react";
import { Menu, X as CloseIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  FaInstagram, FaLinkedin, FaDribbble, FaTwitter,
} from "react-icons/fa";
import { Logo } from "./Logo";
import NavSketchbookLink from './NavSketchbookLink';


// ─── Data ────────────────────────────────────────────────────────────────────

const navLinks = [
  { name: "Projects", href: "/projects",  isRoute: true  },
  { name: "About",    href: "/#about",    isRoute: false },
  { name: "Skills",   href: "/#skills",   isRoute: false },
  { name: "Contact",  href: "/#contact",  isRoute: false },
];

const socialIcons = [
  { Icon: FaInstagram, href: "https://instagram.com/kreshrts",             label: "Instagram" },
  { Icon: FaLinkedin,  href: "https://www.linkedin.com/in/kreshant-kumar", label: "LinkedIn"  },
  { Icon: FaDribbble,  href: "https://dribbble.com/Kresh_15",              label: "Dribbble"  },
  { Icon: FaTwitter,   href: "https://x.com/kreshrts",                    label: "Twitter"   },
];

// ─── NavLink (desktop) ───────────────────────────────────────────────────────

type DesktopNavLinkProps = {
  name: string;
  href: string;
  isRoute: boolean;
  active: boolean;
};

const DesktopNavLink: React.FC<DesktopNavLinkProps> = ({
  name, href, isRoute, active,
}) => {
  const base = `relative font-mono text-[11px] uppercase tracking-[0.18em]
    transition-colors duration-200 group`;
  const color = active ? "text-violet-600" : "text-neutral-600 hover:text-[#111]";

  const inner = (
    <>
      {name}
      {/* Underline on hover / active */}
      <motion.span
        className="absolute -bottom-0.5 left-0 h-[1.5px] rounded-full bg-violet-400"
        initial={{ width: active ? "100%" : "0%" }}
        whileHover={{ width: "100%" }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />
    </>
  );

  return isRoute ? (
    <Link to={href} className={`${base} ${color}`}>{inner}</Link>
  ) : (
    <a href={href} className={`${base} ${color}`}>{inner}</a>
  );
};

// ─── Main Navbar ─────────────────────────────────────────────────────────────

export const Navbar = () => {
  const [isOpen,   setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location                = useLocation();
  const scrollPos               = useRef(0);
  const prefersReducedMotion    = useReducedMotion();

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll lock / restore for mobile menu
  useEffect(() => {
    if (isOpen) {
      scrollPos.current = window.scrollY;
      document.body.style.overflow  = "hidden";
      document.body.style.position  = "fixed";
      document.body.style.top       = `-${scrollPos.current}px`;
      document.body.style.width     = "100%";
    } else {
      document.body.style.overflow  = "";
      document.body.style.position  = "";
      document.body.style.top       = "";
      document.body.style.width     = "";
      window.scrollTo(0, scrollPos.current);
    }
    return () => {
      document.body.style.overflow  = "";
      document.body.style.position  = "";
      document.body.style.top       = "";
      document.body.style.width     = "";
    };
  }, [isOpen]);

  // Close on route change
  useEffect(() => { setIsOpen(false); }, [location]);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const activeSection = location.hash || (location.pathname === "/" ? "" : location.pathname);

  return (
    <>
      {/* ── DESKTOP / SCROLL-AWARE NAV ───────────────────────────── */}
      <motion.nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "py-3 bg-cream/90 backdrop-blur-md border-b border-neutral-200/60 shadow-[0_1px_16px_rgba(0,0,0,0.05)]"
            : "py-6 bg-transparent"
        }`}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" aria-label="Kreshant Kumar — Home">
            <span className="block md:hidden">
              <Logo variant="site" size="xs" />
            </span>
            <span className="hidden md:block">
              <Logo variant="site" size="sm" />
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) => (
              <DesktopNavLink
                key={link.name}
                {...link}
                active={activeSection === link.href}
              />
            ))}
            <NavSketchbookLink />
          </div>

          {/* Desktop social + CTA */}
          <div className="hidden md:flex items-center gap-4">
            {/* Social icons */}
            <div className="flex items-center gap-3 pr-4 border-r border-neutral-200/80">
              {socialIcons.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ y: -2, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-neutral-500 hover:text-violet-600 transition-colors duration-200"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>

            {/* Hire me pill */}
            <motion.a
              href="/#contact"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="group relative inline-flex items-center px-5 py-2 rounded-full
                text-[11px] font-semibold font-mono uppercase tracking-[0.15em]
                text-white overflow-hidden
                shadow-[0_2px_12px_rgba(124,58,237,0.28)]
                hover:shadow-[0_4px_20px_rgba(124,58,237,0.42)]
                transition-shadow duration-200"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #a855f7, #c084fc)",
              }}
              aria-label="Hire Kreshant Kumar"
            >
              <span
                className="absolute inset-0 translate-x-full group-hover:translate-x-full
                  bg-linear-to-r from-transparent via-white/25 to-transparent
                  transition-transform duration-600"
              />
              <span className="relative">Hire Me</span>
            </motion.a>
          </div>

          {/* Mobile hamburger */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="md:hidden relative z-70 w-10 h-10 flex items-center justify-center
              rounded-xl bg-white/70 backdrop-blur-sm border border-neutral-200/80
              text-[#111] shadow-sm"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0,   opacity: 1 }}
                  exit={{   rotate: 90,  opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <CloseIcon className="w-5 h-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 90,  opacity: 0 }}
                  animate={{ rotate: 0,   opacity: 1 }}
                  exit={{   rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <Menu className="w-5 h-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.nav>

      {/* ── MOBILE MENU ──────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-55 md:hidden bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
              aria-hidden
            />

            {/* Drawer — slides in from right */}
            <motion.div
              key="drawer"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: "0%",   opacity: 1 }}
              exit={{   x: "100%", opacity: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="fixed top-0 right-0 bottom-0 z-60 md:hidden
                w-[min(340px,90vw)] flex flex-col
                bg-cream border-l border-neutral-200/80
                shadow-[-8px_0_40px_rgba(0,0,0,0.08)]"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
            >
              {/* Background grid (matches site) */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(#8b5cf6 1px, transparent 1px),
                    linear-gradient(90deg, #8b5cf6 1px, transparent 1px)
                  `,
                  backgroundSize: "40px 40px",
                }}
                aria-hidden
              />
              {/* Ambient blob */}
              <div
                className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)",
                }}
                aria-hidden
              />

              {/* ── Drawer header ── */}
              <div className="relative flex items-center justify-between px-6 py-5 border-b border-neutral-200/60">
                <Link to="/" onClick={() => setIsOpen(false)} aria-label="Home">
                  <Logo variant="site" size="xs" />
                </Link>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                  className="w-9 h-9 flex items-center justify-center rounded-xl
                    bg-white/70 backdrop-blur-sm border border-neutral-200/80
                    text-neutral-600"
                >
                  <CloseIcon className="w-4 h-4" />
                </motion.button>
              </div>

              {/* ── Nav links ── */}
              <nav className="relative flex-1 flex flex-col justify-center px-8 gap-1" aria-label="Mobile links">
                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to="/sketchbook"
                    onClick={() => setIsOpen(false)}
                    className="group flex items-center justify-between px-4 py-3 mb-3
                      rounded-2xl border border-violet-200/80 bg-violet-50/80
                      shadow-[0_6px_24px_rgba(124,58,237,0.08)]"
                    aria-label="Open Sketchbook"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg text-violet-500 transition-transform duration-200 group-hover:scale-110">
                        {'\u2726'}
                      </span>
                      <div className="flex flex-col">
                        <span
                          className="text-3xl text-violet-700 leading-none"
                          style={{ fontFamily: "'Caveat', cursive" }}
                        >
                          Sketchbook
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-violet-400">
                          The Other Side
                        </span>
                      </div>
                    </div>
                    <span
                      className="text-violet-300 group-hover:text-violet-500
                        transition-colors duration-200 font-mono text-xs"
                    >
                      {'\u2197'}
                    </span>
                  </Link>
                </motion.div>

                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 + 0.1, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {link.isRoute ? (
                      <Link
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className="group flex items-center justify-between py-3
                          border-b border-neutral-100 last:border-0"
                      >
                        <span
                          className="font-black text-3xl sm:text-4xl text-[#111]
                            group-hover:text-violet-600 transition-colors duration-200 leading-none"
                          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          {link.name}
                        </span>
                        <span
                          className="text-neutral-300 group-hover:text-violet-400
                            transition-colors duration-200 font-mono text-xs"
                        >
                          ↗
                        </span>
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="group flex items-center justify-between py-3
                          border-b border-neutral-100 last:border-0"
                      >
                        <span
                          className="font-black text-3xl sm:text-4xl text-[#111]
                            group-hover:text-violet-600 transition-colors duration-200 leading-none"
                          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          {link.name}
                        </span>
                        <span
                          className="text-neutral-300 group-hover:text-violet-400
                            transition-colors duration-200 font-mono text-xs"
                        >
                          ↗
                        </span>
                      </a>
                    )}
                  </motion.div>
                ))}
              </nav>

              {/* ── Drawer footer ── */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.35 }}
                className="relative px-8 py-6 border-t border-neutral-200/60 space-y-5"
              >
                {/* Social row */}
                <div className="flex items-center gap-4">
                  {socialIcons.map(({ Icon, href, label }) => (
                    <motion.a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsOpen(false)}
                      className="w-9 h-9 flex items-center justify-center rounded-xl
                        bg-white/70 backdrop-blur-sm border border-neutral-200/80
                        text-neutral-500 hover:text-violet-600 hover:border-violet-300
                        transition-all duration-200 shadow-sm"
                    >
                      <Icon size={16} />
                    </motion.a>
                  ))}
                </div>

                {/* Hire me CTA */}
                <a
                  href="/#contact"
                  onClick={() => setIsOpen(false)}
                  className="group relative flex items-center justify-center w-full py-3.5 rounded-full
                    font-semibold text-sm text-white overflow-hidden
                    shadow-[0_4px_16px_rgba(124,58,237,0.28)]"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #a855f7, #c084fc)",
                  }}
                  aria-label="Contact Kreshant for hire"
                >
                  <span
                    className="absolute inset-0 translate-x-full group-hover:translate-x-full
                      bg-linear-to-r from-transparent via-white/20 to-transparent
                      transition-transform duration-600"
                  />
                  <span className="relative">Let's Work Together</span>
                </a>

                {/* Availability note */}
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-neutral-400 text-center">
                  Open to freelance & full-time ✦
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
