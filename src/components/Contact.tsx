import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Mail } from "lucide-react";
import {
  FaInstagram, FaLinkedin, FaDribbble, FaTwitter, FaBehance,
} from "react-icons/fa";

interface SocialLink {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
  label: string;
  color: string;
}

const socialLinks: SocialLink[] = [
  { Icon: FaInstagram, href: "https://instagram.com/kreshrts", label: "Instagram", color: "#E4405F" },
  { Icon: FaLinkedin, href: "https://www.linkedin.com/in/kreshant-kumar", label: "LinkedIn", color: "#0A66C2" },
  { Icon: FaDribbble, href: "https://dribbble.com/Kresh_15", label: "Dribbble", color: "#EA4C89" },
  { Icon: FaBehance, href: "https://www.behance.net/kreshantkumar", label: "Behance", color: "#053eff" },
  { Icon: FaTwitter, href: "https://twitter.com/kreshrts", label: "Twitter", color: "#1DA1F2" },
];

const inputClass = `
  w-full px-5 py-3.5 text-sm
  bg-white/80 backdrop-blur-sm
  border border-neutral-200/80 rounded-xl
  text-[#111] placeholder:text-neutral-400
  focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200/50
  transition-all duration-200
`;

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <motion.span
    initial={{ opacity: 0, x: -16 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="mb-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-purple-600"
  >
    <span className="h-px w-4 bg-purple-400" />
    {children}
  </motion.span>
);

export const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/xpqorqgw", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setSubmitStatus({ type: "success", message: "Message sent! I'll get back to you soon." });
        form.reset();
      } else {
        setSubmitStatus({ type: "error", message: "Something went wrong. Email me directly instead." });
      }
    } catch {
      setSubmitStatus({ type: "error", message: "Network error. Try emailing me directly." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      aria-label="Contact Kreshant Kumar"
      className="relative overflow-hidden bg-[#faf7f2] px-4 py-28 sm:px-6 md:py-36"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-violet-100/40 to-transparent blur-[100px]" />
        <div className="absolute top-0 left-0 h-[300px] w-[400px] rounded-full bg-gradient-to-br from-amber-100/25 to-transparent blur-[80px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(#8b5cf6 1px, transparent 1px), linear-gradient(90deg, #8b5cf6 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-16 md:mb-20">
          <SectionLabel>Get in Touch</SectionLabel>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black leading-[0.88] tracking-tight"
          >
            <span className="block text-[clamp(2.2rem,6.5vw,5rem)] text-[#111111]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              LET&apos;S CREATE
            </span>
            <span className="block text-[clamp(2.2rem,6.5vw,5rem)]" style={{ color: "transparent", WebkitTextStroke: "2px #7c3aed", fontFamily: "'Space Grotesk', sans-serif" }}>
              SOMETHING
            </span>
            <span className="block text-[clamp(2.2rem,6.5vw,5rem)] text-[#111111]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              COOL TOGETHER.
            </span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-10"
          >
            <a href="mailto:kreshant2002@gmail.com" aria-label="Email Kreshant Kumar" className="group flex items-center gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-neutral-200/80 bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-200 group-hover:border-violet-400">
                <Mail className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.25em] text-neutral-400">Email Me</p>
                <p className="text-base font-semibold text-[#111] transition-colors duration-200 group-hover:text-violet-600">kreshant2002@gmail.com</p>
              </div>
            </a>

            <div className="h-px bg-gradient-to-r from-violet-200/60 to-transparent" />

            <div>
              <p className="mb-5 font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-400">Find me on</p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map(({ Icon, href, label, color }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    whileHover={{ y: -4, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-neutral-200/80 bg-white/80 shadow-sm transition-all duration-200 hover:shadow-md backdrop-blur-sm"
                  >
                    <motion.div className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" style={{ backgroundColor: color }} />
                    <Icon className="relative h-4 w-4 text-neutral-600 transition-colors duration-200 group-hover:text-white" />
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-violet-200/60 bg-white/50 p-5 backdrop-blur-sm">
              <div className="mb-2 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-emerald-600">Currently available</p>
              </div>
              <p className="text-sm font-light leading-relaxed text-neutral-500">
                Open to freelance projects, full-time roles, and design collaborations. Response time is usually within 24 hours.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <div className="relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white/60 p-7 shadow-[0_2px_24px_rgba(0,0,0,0.06)] backdrop-blur-md md:p-8">
              <div className="absolute top-0 right-0 h-48 w-48 bg-gradient-to-bl from-violet-100/40 to-transparent pointer-events-none" />
              <form className="relative space-y-5" onSubmit={handleSubmit} noValidate>
                <div>
                  <label htmlFor="contact-name" className="mb-2 block font-mono text-[9px] uppercase tracking-[0.25em] text-neutral-400">Your Name</label>
                  <input id="contact-name" name="name" type="text" placeholder="Enter your name" required className={inputClass} />
                </div>
                <div>
                  <label htmlFor="contact-email" className="mb-2 block font-mono text-[9px] uppercase tracking-[0.25em] text-neutral-400">Email Address</label>
                  <input id="contact-email" name="email" type="email" placeholder="hello@example.com" required className={inputClass} />
                </div>
                <div>
                  <label htmlFor="contact-message" className="mb-2 block font-mono text-[9px] uppercase tracking-[0.25em] text-neutral-400">Your Message</label>
                  <textarea id="contact-message" name="message" rows={4} placeholder="Tell me about your project..." required className={`${inputClass} resize-none`} />
                </div>

                <AnimatePresence>
                  {submitStatus && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`rounded-xl border p-4 text-sm font-medium ${
                        submitStatus.type === "success"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-red-200 bg-red-50 text-red-700"
                      }`}
                    >
                      {submitStatus.message}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full py-4 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(124,58,237,0.3)] transition-shadow duration-300 hover:shadow-[0_6px_28px_rgba(124,58,237,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7, #c084fc)" }}
                >
                  <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]" />
                  <span className="relative">{isSubmitting ? "Sending..." : "Send Message"}</span>
                  <Send className={`relative h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${isSubmitting ? "animate-pulse" : ""}`} />
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
