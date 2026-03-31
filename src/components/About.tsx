import { motion } from "motion/react";
import { Figma, Palette, Zap, Layout, Image as ImageIcon, Code, MapPin, GraduationCap, User, Instagram, Briefcase } from "lucide-react";

export const About = () => {
  const skills = [
    { name: "Photoshop", icon: <ImageIcon className="w-5 h-5" />, hoverColor: "#31A8FF" },
    { name: "Illustrator", icon: <Palette className="w-5 h-5" />, hoverColor: "#FF9A00" },
    { name: "InDesign", icon: <Layout className="w-5 h-5" />, hoverColor: "#FF3366" },
    { name: "Figma", icon: <Figma className="w-5 h-5" />, hoverColor: "#F24E1E" },
    { name: "Affinity", icon: <Zap className="w-5 h-5" />, hoverColor: "#00BFFF" },
    { name: "Canva", icon: <Palette className="w-5 h-5" />, hoverColor: "#00C4CC" },
    { name: "After Effects", icon: <Zap className="w-5 h-5" />, hoverColor: "#9999FF" },
    { name: "DaVinci Resolve", icon: <ImageIcon className="w-5 h-5" />, hoverColor: "#0055FF" },
    { name: "HTML", icon: <Code className="w-5 h-5" />, hoverColor: "#E34F26" },
    { name: "CSS", icon: <Code className="w-5 h-5" />, hoverColor: "#1572B6" },
  ];

  return (
    <section id="about" className="py-24 px-6 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side: Profile Card & Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Reduced Image Size Container */}
            <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto lg:mx-0">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-black relative z-10">
                <img
                  src="/images/me/kresh.webp"
                  alt="Kreshant Kumar"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute inset-0 bg-accent-pink rounded-full -rotate-6 z-0" />
              
              <motion.div
                initial={{ opacity: 0, rotate: -20 }}
                whileInView={{ opacity: 1, rotate: -12 }}
                className="absolute -top-12 -left-12 font-hand text-4xl text-accent-pink hidden md:block"
              >
                That's me!
              </motion.div>

              {/* Status Badge */}
              <div className="absolute bottom-4 right-4 z-20 bg-white border-2 border-black px-4 py-1 rounded-full flex items-center gap-2 shadow-lg">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-black">Open to work</span>
              </div>
            </div>

            {/* Profile Card */}
            <div className="bg-white border-4 border-black rounded-[2rem] p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pastel-blue/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-pastel-pink/30 transition-colors" />
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-pastel-pink rounded-xl border-2 border-black/5">
                    <User className="w-6 h-6 text-accent-pink" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase text-black/40">Name</p>
                    <p className="text-xl font-black tracking-tight text-black">Kreshant Kumar</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-pastel-blue rounded-xl border-2 border-black/5">
                    <Briefcase className="w-6 h-6 text-accent-blue" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase text-black/40">Role</p>
                    <p className="text-lg font-bold text-black">Graphic Designer</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-pastel-purple rounded-xl border-2 border-black/5">
                    <MapPin className="w-6 h-6 text-accent-purple" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase text-black/40">Based</p>
                    <p className="text-sm font-medium text-black">Dharamshala, Himachal, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-pastel-yellow rounded-xl border-2 border-black/5">
                    <GraduationCap className="w-6 h-6 text-black/70" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase text-black/40">Education</p>
                    <p className="text-sm font-medium leading-tight text-black">
                      Diploma: Graphic and web designing<br/>
                      BA: Journalism and mass comm.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-black/5">
                  <div>
                    <p className="font-mono text-[10px] uppercase text-black/40">Personality</p>
                    <p className="font-bold text-accent-pink">INTP</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase text-black/40">Instagram</p>
                    <a href="https://instagram.com/kreshrts" target="_blank" rel="noopener noreferrer" className="font-bold flex items-center gap-1 hover:text-accent-pink transition-colors text-black">
                      <Instagram className="w-3 h-3" /> kreshrts
                    </a>
                  </div>
                </div>

                <motion.a
                  href="/doc/Kreshant_Fresher_Designer_CV.pdf"
                  download
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-accent-pink transition-colors"
                >
                  Download Resume
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Story & Skills */}
          <div className="lg:pt-12">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="font-mono text-xs uppercase tracking-[0.3em] text-accent-blue mb-4 block"
            >
              The Story
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-8 tracking-tighter text-black"
            >
              BORN IN THE <br />
              <span className="text-accent-pink">DIGITAL ERA.</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-lg text-black/70 mb-12 leading-relaxed font-medium"
            >
              I’m a graphic designer who sees design as more than visuals — it’s a way to explore ideas, emotions, and meaning.

My work often blends digital culture, philosophy, and experimental aesthetics. Whether it’s a streetwear brand or a conceptual poster series, I focus on creating designs that don’t just look good, but say something.

            </motion.p>

            <div id="skills" className="relative flex flex-wrap gap-3">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="absolute -top-12 right-0 font-hand text-3xl text-accent-blue hidden md:block"
              >
                My Toolkit
              </motion.div>
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotate: 2, 
                    backgroundColor: skill.hoverColor, 
                    color: "#fff",
                    borderColor: skill.hoverColor
                  }}
                  className="px-5 py-2 bg-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3 transition-all cursor-default text-black group"
                >
                  <div className="text-accent-pink group-hover:text-white transition-colors">
                    {skill.icon}
                  </div>
                  <span className="font-bold text-xs uppercase tracking-wider">{skill.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
