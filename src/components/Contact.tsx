import React, { useState } from "react";
import { motion } from "motion/react";
import { Send, Mail } from "lucide-react";
import { 
  FaInstagram,
  FaLinkedin,
  FaDribbble,
  FaTwitter 
} from 'react-icons/fa';
import { FaBehance } from 'react-icons/fa';

interface SocialLink {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
  color: string;
}

export const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const socialLinks: SocialLink[] = [
    { Icon: FaInstagram, href: "https://instagram.com/kreshrts", color: "hover:bg-[#E4405F] hover:border-[#E4405F]" },
    { Icon: FaLinkedin, href: "https://www.linkedin.com/in/kreshant-kumar", color: "hover:bg-[#0A66C2] hover:border-[#0A66C2]" },
    { Icon: FaDribbble, href: "https://dribbble.com/Kresh_15", color: "hover:bg-[#EA4C89] hover:border-[#EA4C89]" },
    { Icon: FaBehance, href: "https://www.behance.net/kreshantkumar", color: "hover:bg-[#053eff] hover:border-[#053eff]" },
    { Icon: FaTwitter, href: "https://twitter.com/kreshrts", color: "hover:bg-[#1DA1F2] hover:border-[#1DA1F2]" },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      // Replace with your Formspree endpoint
      const response = await fetch('https://formspree.io/f/xpqorqgw', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setSubmitStatus({type: 'success', message: 'Message sent successfully! I\'ll get back to you soon.'});
        (e.target as HTMLFormElement).reset();
      } else {
        setSubmitStatus({type: 'error', message: 'Something went wrong. Please try again or email me directly.'});
      }
    } catch (error) {
      setSubmitStatus({type: 'error', message: 'Network error. Please try again or email me directly.'});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 bg-transparent relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="font-mono text-xs uppercase tracking-[0.3em] text-accent-purple mb-4 block"
            >
              Get in Touch
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="relative font-display text-4xl sm:text-6xl md:text-7xl font-bold mb-8 tracking-tighter text-black"
            >
              LET'S CREATE <br />
              <span className="text-accent-pink drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">SOMETHING</span> <br />
              COOL TOGETHER.
              
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute -top-12 -right-12 font-hand text-5xl text-accent-purple -rotate-12 hidden md:block"
              >
                Say Hi!
              </motion.div>
            </motion.h2>
            
            <div className="space-y-6 mt-12">
              <a href="mailto:kreshant2002@gmail.com" className="flex items-center gap-4 group">
                <div className="p-4 bg-pastel-purple rounded-full group-hover:bg-accent-purple transition-colors">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-mono text-xs uppercase text-black/40">Email Me</p>
                  <p className="text-xl font-bold text-black">kreshant2002@gmail.com</p>
                </div>
              </a>

              <div className="flex gap-4 pt-8">
                {socialLinks.map(({ Icon, href, color }, i) => (
                  <motion.a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -5, scale: 1.1 }}
                    className={`p-4 border-2 border-black rounded-2xl hover:text-white transition-all text-black ${color}`}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-pastel-yellow/40 backdrop-blur-md p-8 md:p-12 rounded-[3rem] border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block font-mono text-xs uppercase mb-2">Your Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  required
                  className="w-full px-6 py-4 bg-white border-2 border-black rounded-2xl focus:outline-none focus:ring-4 ring-accent-pink/20 transition-all"
                />
              </div>
              <div>
                <label htmlFor="email" className="block font-mono text-xs uppercase mb-2">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="hello@example.com"
                  required
                  className="w-full px-6 py-4 bg-white border-2 border-black rounded-2xl focus:outline-none focus:ring-4 ring-accent-pink/20 transition-all"
                />
              </div>
              <div>
                <label htmlFor="message" className="block font-mono text-xs uppercase mb-2">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Tell me about your project..."
                  required
                  className="w-full px-6 py-4 bg-white border-2 border-black rounded-2xl focus:outline-none focus:ring-4 ring-accent-pink/20 transition-all resize-none"
                />
              </div>
              
              {submitStatus && (
                <div className={`p-4 rounded-2xl ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {submitStatus.message}
                </div>
              )}
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-3 group disabled:opacity-70"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
