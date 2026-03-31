import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Menu, 
  X as CloseIcon, 
  Palette, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Dribbble 
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "./Logo";

const MotionLink = motion(Link);

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle scroll lock for mobile menu
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: "Projects", href: "/projects" },
    { name: "About", href: "/#about" },
    { name: "Skills", href: "/#skills" },
    { name: "Contact", href: "/#contact" },
  ];

  const socialIcons = [
    { Icon: Instagram, href: "https://instagram.com/kreshrts", label: "Instagram", hoverColor: "hover:text-[#E4405F]" },
    { Icon: Linkedin, href: "https://www.linkedin.com/in/kreshant-kumar", label: "LinkedIn", hoverColor: "hover:text-[#0A66C2]" },
    { Icon: Dribbble, href: "https://dribbble.com/Kresh_15", label: "Dribbble", hoverColor: "hover:text-[#EA4C89]" },
    { Icon: Twitter, href: "https://x.com/kreshrts", label: "Twitter", hoverColor: "hover:text-black" },
  ];

  const isHome = location.pathname === "/";

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 3 }}
      className={`fixed top-0 left-0 w-full transition-all duration-300 ${
        isOpen ? "z-[100]" : "z-50"
      } ${
        scrolled || isOpen ? "py-4 bg-white/90 backdrop-blur-md shadow-sm" : "py-8 bg-transparent"
      }`}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link 
          to="/" 
          aria-label="Kreshant Kumar homepage"
        >
          <Logo />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <motion.div
              key={link.name}
              whileHover={{ y: -2 }}
              className="relative"
            >
              {link.href.startsWith("/#") ? (
                <a
                  href={link.href}
                  className="font-mono text-sm uppercase tracking-widest text-black/80 hover:text-accent-pink transition-colors relative"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-pink transition-all group-hover:w-full"></span>
                </a>
              ) : (
                <Link
                  to={link.href}
                  className="font-mono text-sm uppercase tracking-widest text-black/80 hover:text-accent-pink transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-pink transition-all group-hover:w-full"></span>
                </Link>
              )}
            </motion.div>
          ))}
          
          <div className="flex items-center gap-4 ml-4 border-l pl-8 border-black/10">
            {socialIcons.map(({ Icon, href, label, hoverColor }, i) => (
              <a 
                key={i} 
                href={href} 
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors text-black/60 ${hoverColor} hover:scale-110`}
                aria-label={label}
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <span className="font-hand text-2xl text-accent-pink -rotate-6">Menu</span>
          <button
            className="p-2 text-black"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <CloseIcon /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[99] md:hidden"
            aria-modal="true"
            role="dialog"
            aria-label="Navigation menu"
          >
            {/* Mobile Menu Content */}
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="flex flex-col items-center justify-center h-full px-6 pb-20 overflow-hidden"
            >
              <div className="absolute top-8 left-6">
                <Logo />
              </div>
              
              <button
                className="absolute top-8 right-6 p-2 text-black z-10"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
              >
                <CloseIcon className="w-8 h-8" />
              </button>

              {/* Navigation Links */}
              <div className="flex flex-col items-center gap-8 w-full max-w-md">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full text-center"
                  >
                    {link.href.startsWith("/#") ? (
                      <a
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="font-display text-4xl font-bold text-black hover:text-accent-pink transition-colors py-4"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className="font-display text-4xl font-bold text-black hover:text-accent-pink transition-colors py-4 block"
                      >
                        {link.name}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Social Icons */}
              <div className="flex gap-8 mt-16">
                {socialIcons.map(({ Icon, href, label, hoverColor }, i) => (
                  <motion.a 
                    key={i} 
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className={`transition-colors text-black/60 ${hoverColor} hover:scale-110`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={label}
                  >
                    <Icon className="w-8 h-8" />
                  </motion.a>
                ))}
              </div>

              {/* Decorative Elements */}
              <div className="absolute bottom-10 left-10 w-16 h-16 border-4 border-accent-pink rounded-full opacity-20" />
              <div className="absolute top-20 right-10 w-12 h-12 bg-pastel-blue rounded-full opacity-20" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
