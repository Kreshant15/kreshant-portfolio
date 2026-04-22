import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

const AT = {
  bg:      "#0C0600",
  bgMid:   "#160900",
  bgCard:  "#1E0E02",
  saffron: "#FF6B1A",
  gold:    "#D4952A",
  goldDim: "#8A5E12",
  red:     "#C0392B",
  cream:   "#F5E6C8",
  muted:   "#9B7B5A",
  mutedLt: "#C4A882",
  dark:    "#2C1500",
};

const caseStudy = {
  title: "Antaryatra",
  devanagari: "अन्तर्यात्रा",
  subtitle: "The Journey Inward",
  tagline: "अन्तर्यात्रा — Not a destination. A dissolution.",
  category: "Poster Series",
  date: "2024–2025",
  client: "Personal Series",
  tags: ["Poster Design", "Indian Aesthetics", "Spiritual Art", "Typography", "Visual Storytelling"],
  overview: `Antaryatra — अन्तर्यात्रा — means "the inner journey." Not travel to a place. Travel to a state. The series began as a personal exploration of India's philosophical traditions and became something larger: a visual language for concepts that have no direct translation.\n\nEach poster takes a single Sanskrit concept — Karma, Moksha, Maya, Krodh, Bhaya, Ahimsa, Shakti, Shraddha — and asks: what does this look like if you could see it? How does liberation feel different from illusion? What is the color of devotion?\n\nThe series doesn't illustrate religion. It tries to feel it.`,
  sections: [
    {
      title: "The Concept",
      content: `Indian philosophy contains ideas for which Western aesthetics has no visual vocabulary. Concepts like Maya — the illusion that masks reality — or Moksha — liberation not as escape but as return to truth — these resist simple representation.\n\nAntaryatra attempts to build that vocabulary. Working from traditional Indian art forms — Madhubani, Tanjore, Pahari painting, temple iconography — and pulling them forward through contemporary design thinking.\n\nThe result is neither purely traditional nor purely modern. It sits in the space between: recognizably Indian, unmistakably contemporary.`,
      images: ["/images/projects/antaryatra/antaryatra.webp", "/images/projects/antaryatra/Ahinsa.webp"],
    },
    {
      title: "Visual Language",
      content: `Color in Antaryatra is never decorative — it's semantic. Saffron for sacred fire and transformation. Deep crimson for passion, power, and the weight of Krodh (rage). The aged ochre of temple walls for wisdom that has survived centuries. Gold for the divine light that cuts through Maya.\n\nTypography becomes devotional. Sanskrit text in Devanagari sits alongside English translations, the visual contrast itself communicating the gap between the felt and the explained.\n\nTexture carries the memory of the series. The worn paper of old manuscripts, the visible brushwork of traditional painting, the sacred geometry of mandala forms — all present as structural elements, not surface treatment.`,
      images: ["/images/projects/antaryatra/Karma.webp", "/images/projects/antaryatra/bhaya.webp"],
    },
    {
      title: "Key Pieces",
      content: `Karma — The most typographically restrained piece. Sanskrit verse at the base. The design trusts the words to do the work.\n\nKrodh (Rage) — The most aggressive composition. Shiva-Nataraja energy channeled into layered type: Rage, Destruction, Intense, Calm. Krodh is not just anger — it is transformation through fire.\n\nMaya — A deliberately disorienting piece. Nested picture frames within frames. The design enacts what it describes.\n\nMoksha — The quietest piece. "Liberation is not an escape, but a return to truth." The most minimal composition — because liberation is the removal of everything unnecessary.\n\nShakti — The most devotionally intense. Power rendered as tenderness. The Sanskrit invocation as structural grid.`,
      images: ["/images/projects/antaryatra/krodh.webp", "/images/projects/antaryatra/Maya.webp", "/images/projects/antaryatra/Moksha.webp"],
    },
    {
      title: "Process",
      content: `Each piece begins with the concept. Hours spent reading — the Bhagavad Gita, the Upanishads, secondary scholarship — before a single element is placed. The visual approach only becomes clear when the idea is clear.\n\nSource imagery comes from traditional Indian art archives, temple photography, and classical painting references. Nothing is used without understanding its original context. Respect for the source material is non-negotiable.\n\nThe design process is then about translation — taking something that exists in the register of the sacred and finding a visual form that honors it without reducing it. The test: does this feel true?`,
      images: ["/images/projects/antaryatra/Shakti.webp", "/images/projects/antaryatra/shraddha.webp"],
    },
    {
      title: "Conclusion",
      content: `Antaryatra is the most personal series in Kreshant's body of work. It comes from a question that has no final answer: what does it mean to be Indian in a globalized visual culture? How do you make work that is genuinely rooted without being nostalgic?\n\nThe series doesn't answer that. But it keeps asking the question in different forms, through different concepts, with growing clarity.\n\nAntaryatra continues. The journey inward has no destination — only deepening.`,
      images: [],
    },
  ],
  posters: [
    { src: "/images/projects/antaryatra/antaryatra.webp", name: "Antaryatra", devanagari: "अन्तर्यात्रा" },
    { src: "/images/projects/antaryatra/Ahinsa.webp",     name: "Ahinsa",     devanagari: "अहिंसा" },
    { src: "/images/projects/antaryatra/bhaya.webp",      name: "Bhaya",      devanagari: "भय" },
    { src: "/images/projects/antaryatra/Karma.webp",      name: "Karma",      devanagari: "कर्म" },
    { src: "/images/projects/antaryatra/krodh.webp",      name: "Krodh",      devanagari: "क्रोध" },
    { src: "/images/projects/antaryatra/Maya.webp",       name: "Maya",       devanagari: "माया" },
    { src: "/images/projects/antaryatra/Moksha.webp",     name: "Moksha",     devanagari: "मोक्ष" },
    { src: "/images/projects/antaryatra/Shakti.webp",     name: "Shakti",     devanagari: "शक्ति" },
    { src: "/images/projects/antaryatra/shraddha.webp",   name: "Shraddha",   devanagari: "श्रद्धा" },
  ],
};

// Mandala — denser, more petals
const Mandala = ({ size = 300, opacity = 0.04 }: { size?: number; opacity?: number }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ opacity, display: "block" }}>
    {[0,30,60,90,120,150,180,210,240,270,300,330].map((a) => (
      <g key={`op${a}`} transform={`rotate(${a} 100 100)`}>
        <ellipse cx="100" cy="29" rx="4" ry="14" fill="none" stroke={AT.gold} strokeWidth="0.5"/>
        <circle cx="100" cy="15" r="2" fill={AT.gold} opacity="0.55"/>
      </g>
    ))}
    {[15,45,75,105,135,165,195,225,255,285,315,345].map((a) => (
      <g key={`mp${a}`} transform={`rotate(${a} 100 100)`}>
        <ellipse cx="100" cy="53" rx="3" ry="10" fill="none" stroke={AT.saffron} strokeWidth="0.4" opacity="0.6"/>
      </g>
    ))}
    {Array.from({length:16},(_,i)=>i*22.5).map((a)=>(
      <line key={`sp${a}`} x1="100" y1="100"
        x2={100+87*Math.cos(a*Math.PI/180)} y2={100+87*Math.sin(a*Math.PI/180)}
        stroke={AT.gold} strokeWidth="0.22" opacity="0.35"/>
    ))}
    {[84,67,51,37,25,16,9].map((r,i)=>(
      <circle key={`cr${r}`} cx="100" cy="100" r={r} fill="none"
        stroke={i%2===0?AT.gold:AT.saffron} strokeWidth={i===0?"0.5":"0.28"}
        opacity={i%2===0?"0.45":"0.3"}/>
    ))}
    {[0,45,90,135,180,225,270,315].map((a)=>(
      <g key={`lp${a}`} transform={`rotate(${a} 100 100)`}>
        <ellipse cx="100" cy="84" rx="2.5" ry="7" fill={AT.gold} opacity="0.18"/>
      </g>
    ))}
    <circle cx="100" cy="100" r="4.5" fill={AT.gold} opacity="0.72"/>
    <circle cx="100" cy="100" r="2.2" fill={AT.saffron} opacity="0.88"/>
    <circle cx="100" cy="100" r="0.9" fill="#fff" opacity="0.65"/>
  </svg>
);

const DividerOrnament = () => (
  <div className="flex items-center justify-center gap-4 my-4">
    <div className="h-px flex-1 opacity-15" style={{background:AT.gold}}/>
    <span style={{color:AT.gold,fontSize:"0.62rem",opacity:0.42,letterSpacing:"0.2em"}}>✦ ॐ ✦</span>
    <div className="h-px flex-1 opacity-15" style={{background:AT.gold}}/>
  </div>
);

const SacredLabel = ({ num, label }: { num: string; label: string }) => (
  <div className="flex items-center gap-4 mb-6">
    <div className="flex flex-col items-center shrink-0">
      <div className="w-px h-5" style={{background:`linear-gradient(to bottom,transparent,${AT.gold})`}}/>
      <div className="w-2.5 h-2.5 rounded-full" style={{background:`${AT.saffron}22`,border:`1px solid ${AT.saffron}`,boxShadow:`0 0 6px ${AT.saffron}40`}}/>
      <div className="w-px h-5" style={{background:`linear-gradient(to top,transparent,${AT.gold})`}}/>
    </div>
    <p className="text-[9px] tracking-[0.45em] uppercase flex-1" style={{color:AT.gold,fontFamily:"Georgia,serif"}}>
      {num} · {label}
    </p>
    <div className="flex gap-1 shrink-0">
      {[1,0.5,0.2].map((op,i)=>(
        <div key={i} className="w-1 h-1 rounded-full" style={{background:AT.gold,opacity:op}}/>
      ))}
    </div>
  </div>
);

// ─── IMAGE GRID — KEY FIX ─────────────────────────────────
// No forced aspect ratios. Images show at their natural proportions.
// 1 img  → full width centred, capped at 520px tall
// 2 imgs → side-by-side md+, capped at 440px tall each
// 3 imgs → all three in ONE row, capped at 310px tall (fixes the orphan)
// 4+     → 2-col grid, capped at 380px tall
const SacredGrid = ({ images, title }: { images: string[]; title: string }) => {
  if (!images.length) return null;
  const n = images.length;
  const grid = n===1?"grid-cols-1": n===2?"grid-cols-1 md:grid-cols-2": n===3?"grid-cols-3": "grid-cols-2";
  const cap  = n===1?"max-h-[520px]": n===2?"max-h-[440px]": n===3?"max-h-[310px]": "max-h-[380px]";

  return (
    <div className={`grid gap-3 md:gap-4 mt-10 ${grid}`}>
      {images.map((src,i)=>(
        <motion.div key={i} className="relative overflow-hidden group"
          style={{background:AT.bgCard,border:`1px solid ${AT.gold}20`,boxShadow:`0 6px 28px rgba(0,0,0,0.55),inset 0 1px 0 ${AT.gold}10`}}
          initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          transition={{duration:0.55,delay:i*0.08}} whileHover={{scale:1.015}}>
          {/* top shimmer */}
          <div className="absolute top-0 left-0 right-0 h-px z-10"
            style={{background:`linear-gradient(to right,transparent,${AT.gold}50,transparent)`}}/>
          {/* image — natural sizing */}
          <img src={src} alt={`${title} ${i+1}`}
            className={`w-full object-contain block mx-auto ${cap} transition-transform duration-700 group-hover:scale-[1.04]`}
            loading="lazy"/>
          {/* corner brackets */}
          {["top-1.5 left-1.5 border-t border-l","top-1.5 right-1.5 border-t border-r",
            "bottom-1.5 left-1.5 border-b border-l","bottom-1.5 right-1.5 border-b border-r"].map((cls,ci)=>(
            <div key={ci} className={`absolute w-3 h-3 pointer-events-none z-10 ${cls}`}
              style={{borderColor:`${AT.gold}48`}}/>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

// Gallery shrine card — completely natural image size
const SacredCard = ({ src, name, devanagari, index }: {
  src: string; name: string; devanagari: string; index: number;
}) => (
  <motion.div className="relative overflow-hidden group cursor-pointer"
    style={{border:`1px solid ${AT.gold}22`,background:AT.bgCard}}
    initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
    transition={{duration:0.5,delay:index*0.055}} whileHover={{scale:1.02}}>
    <div className="absolute top-0 left-0 right-0 h-px z-10"
      style={{background:`linear-gradient(to right,transparent,${AT.gold}48,transparent)`}}/>
    {/* completely natural — no maxHeight */}
    <img src={src} alt={name} className="w-full object-contain block transition-transform duration-700 group-hover:scale-[1.03]" loading="lazy"/>
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-end pb-5 px-3"
      style={{background:`linear-gradient(to top,${AT.bg}F0 0%,${AT.bg}70 45%,transparent 75%)`}}>
      <p className="text-base leading-none mb-1" style={{color:AT.saffron,fontFamily:"'Noto Sans Devanagari',serif",textShadow:`0 0 20px ${AT.saffron}80`}}>
        {devanagari}
      </p>
      <p className="text-[9px] tracking-[0.3em] uppercase" style={{color:AT.cream}}>{name}</p>
    </div>
    {/* corner ornaments */}
    {["top-2 left-2 border-t border-l","top-2 right-2 border-t border-r",
      "bottom-2 left-2 border-b border-l","bottom-2 right-2 border-b border-r"].map((cls,i)=>(
      <div key={i} className={`absolute w-3.5 h-3.5 pointer-events-none z-10 ${cls}`}
        style={{borderColor:`${AT.gold}52`}}/>
    ))}
  </motion.div>
);

export const AntaryatraProject = () => {
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const {scrollYProgress} = useScroll({target:heroRef,offset:["start start","end start"]});
  const heroY       = useTransform(scrollYProgress,[0,1],["0%","28%"]);
  const heroOpacity = useTransform(scrollYProgress,[0,0.85],[1,0]);
  const mandalaRot  = useTransform(scrollYProgress,[0,1],[0,42]);

  useEffect(()=>{
    window.scrollTo({top:0,behavior:"smooth"});
    document.title="Antaryatra — Poster Series | Kreshant Kumar";
  },[]);

  return (
    <main style={{background:AT.bg,color:AT.cream}} className="relative min-h-screen">

      {/* noise texture */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{
        backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundRepeat:"repeat",backgroundSize:"200px 200px",opacity:0.7,
      }}/>

      {/* warm glow */}
      <div className="pointer-events-none fixed inset-0 z-0"
        style={{background:`radial-gradient(ellipse 80% 45% at 50% 0%,${AT.saffron}0C 0%,transparent 60%)`}}/>

      <Navbar/>

      {/* HERO */}
      <div ref={heroRef} className="relative flex flex-col items-center justify-center text-center overflow-hidden" style={{height:"100dvh"}}>
        <motion.div className="absolute inset-0" style={{y:heroY,opacity:heroOpacity}}>
          <img src="/images/projects/antaryatra/antaryatra.webp" alt="Antaryatra" className="w-full h-full object-cover" loading="eager"/>
          <div className="absolute inset-0" style={{background:`linear-gradient(to bottom,${AT.bg}C0 0%,${AT.bg}55 35%,${AT.bg}CC 70%,${AT.bg} 100%)`}}/>
        </motion.div>

        {/* large scroll-rotating mandala */}
        <motion.div className="absolute top-1/2 left-1/2 pointer-events-none" style={{x:"-50%",y:"-50%",rotate:mandalaRot}}>
          <Mandala size={580} opacity={0.14}/>
        </motion.div>

        {/* small spinning mandalas */}
        <motion.div className="absolute top-[10%] right-[8%] pointer-events-none hidden md:block"
          animate={prefersReducedMotion?undefined:{rotate:[0,-360]}}
          transition={prefersReducedMotion?undefined:{duration:65,repeat:Infinity,ease:"linear"}}>
          <Mandala size={150} opacity={0.11}/>
        </motion.div>
        <motion.div className="absolute bottom-[12%] left-[5%] pointer-events-none hidden md:block"
          animate={prefersReducedMotion?undefined:{rotate:[0,360]}}
          transition={prefersReducedMotion?undefined:{duration:50,repeat:Infinity,ease:"linear"}}>
          <Mandala size={100} opacity={0.09}/>
        </motion.div>

        {/* hero text */}
        <div className="relative z-10 px-6 max-w-4xl mx-auto">
          <motion.div initial={{opacity:0,y:32}} animate={{opacity:1,y:0}} transition={{duration:1.1,ease:[0.16,1,0.3,1]}}>
            <p className="text-[9px] tracking-[0.6em] uppercase mb-8" style={{color:AT.gold,fontFamily:"Georgia,serif",opacity:0.65}}>
              Poster Series · Personal Work
            </p>
            <p className="leading-none mb-3" style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:"clamp(1.7rem,5vw,3.6rem)",color:AT.saffron,textShadow:`0 0 50px ${AT.saffron}50`}}>
              {caseStudy.devanagari}
            </p>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-10 opacity-25" style={{background:AT.gold}}/>
              <span style={{color:AT.gold,fontSize:"0.5rem",opacity:0.4,letterSpacing:"0.25em"}}>✦ ✦ ✦</span>
              <div className="h-px w-10 opacity-25" style={{background:AT.gold}}/>
            </div>
            <h1 className="font-black leading-none tracking-tight mb-6"
              style={{fontFamily:"Georgia,'Times New Roman',serif",fontSize:"clamp(3rem,11vw,8.5rem)",color:AT.cream,textShadow:"0 4px 48px rgba(0,0,0,0.75)"}}>
              ANTARYATRA
            </h1>
            <p className="text-sm md:text-base max-w-xs mx-auto leading-relaxed"
              style={{color:AT.muted,fontFamily:"Georgia,serif",fontStyle:"italic"}}>
              {caseStudy.subtitle}
            </p>
          </motion.div>
        </div>

        {/* scroll cue */}
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{opacity:[0.2,0.7,0.2]}} transition={{repeat:Infinity,duration:3.5}}>
          <div className="w-px h-14" style={{background:`linear-gradient(to bottom,transparent,${AT.saffron}70)`}}/>
          <div className="w-1 h-1 rounded-full" style={{background:AT.gold}}/>
          <p className="text-[8px] tracking-[0.5em] uppercase mt-1" style={{color:AT.gold,fontFamily:"Georgia,serif"}}>scroll</p>
        </motion.div>
      </div>

      {/* BODY */}
      <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-10 py-24">

        <Link to="/projects"
          className="inline-flex items-center gap-2 text-[9px] tracking-[0.35em] uppercase mb-20 opacity-35 hover:opacity-90 transition-opacity"
          style={{color:AT.gold,fontFamily:"Georgia,serif"}}>
          <ArrowLeft className="w-3 h-3"/> All Projects
        </Link>

        {/* meta strip */}
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-px mb-20" style={{background:`${AT.gold}18`}}
          initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.25}}>
          {[
            {label:"Type",value:caseStudy.category},
            {label:"Client",value:caseStudy.client},
            {label:"Year",value:caseStudy.date},
            {label:"Language",value:"Sanskrit · Hindi · English"},
          ].map(({label,value})=>(
            <div key={label} className="p-5" style={{background:AT.bgMid}}>
              <p className="text-[8px] tracking-[0.4em] uppercase mb-1.5" style={{color:AT.gold,fontFamily:"Georgia,serif"}}>{label}</p>
              <p className="text-sm font-medium" style={{color:AT.cream,fontFamily:"Georgia,serif"}}>{value}</p>
            </div>
          ))}
        </motion.div>

        {/* tagline block */}
        <div className="mb-8 text-center py-12 relative">
          <div className="absolute top-0 left-0 right-0 h-px" style={{background:`linear-gradient(to right,transparent,${AT.gold}28,transparent)`}}/>
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{background:`linear-gradient(to right,transparent,${AT.gold}28,transparent)`}}/>
          {["top-2 left-2","top-2 right-2","bottom-2 left-2","bottom-2 right-2"].map((pos)=>(
            <div key={pos} className={`absolute ${pos} w-1.5 h-1.5 rounded-full`} style={{background:AT.gold,opacity:0.35}}/>
          ))}
          <p className="text-[8px] tracking-[0.5em] uppercase mb-5 opacity-40" style={{color:AT.gold,fontFamily:"Georgia,serif"}}>✦ Guiding Verse ✦</p>
          <p className="text-xl md:text-2xl italic max-w-2xl mx-auto leading-relaxed" style={{fontFamily:"Georgia,serif",color:AT.saffron}}>
            "{caseStudy.tagline}"
          </p>
        </div>

        <DividerOrnament/>

        {/* overview */}
        <div className="mb-24 mt-16">
          <SacredLabel num="00" label="Overview"/>
          <p className="text-[15px] leading-[2] max-w-3xl whitespace-pre-line" style={{color:AT.muted,fontFamily:"Georgia,serif"}}>
            {caseStudy.overview}
          </p>
        </div>

        {/* tags */}
        <div className="flex flex-wrap gap-2 mb-24">
          {caseStudy.tags.map((tag)=>(
            <span key={tag} className="text-[9px] tracking-[0.2em] uppercase px-3 py-1.5"
              style={{border:`1px solid ${AT.gold}30`,color:AT.mutedLt,fontFamily:"Georgia,serif",background:`${AT.gold}08`}}>
              {tag}
            </span>
          ))}
        </div>

        {/* sections */}
        {caseStudy.sections.map((section,idx)=>(
          <motion.div key={idx} className="mb-24 md:mb-32"
            initial={{opacity:0,y:36}} whileInView={{opacity:1,y:0}}
            viewport={{once:true,margin:"-80px"}} transition={{duration:0.65}}>
            <SacredLabel num={String(idx+1).padStart(2,"0")} label={section.title}/>
            <h2 className="font-bold leading-tight mb-6"
              style={{fontFamily:"Georgia,'Times New Roman',serif",fontSize:"clamp(1.6rem,3.5vw,2.6rem)",color:AT.cream}}>
              {section.title}
            </h2>
            <p className="text-[15px] leading-[2] max-w-3xl whitespace-pre-line" style={{color:AT.muted,fontFamily:"Georgia,serif"}}>
              {section.content}
            </p>
            <SacredGrid images={section.images} title={section.title}/>
          </motion.div>
        ))}

        <DividerOrnament/>

        {/* gallery shrine */}
        <div className="mb-24 mt-16">
          <SacredLabel num="GL" label="The Full Series"/>
          <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
            <h2 className="font-bold" style={{fontFamily:"Georgia,serif",fontSize:"clamp(1.4rem,3vw,2rem)",color:AT.cream}}>
              All Nine Concepts
            </h2>
            <p className="text-[9px] tracking-[0.3em] uppercase opacity-35" style={{color:AT.gold,fontFamily:"Georgia,serif"}}>
              {caseStudy.posters.length} works
            </p>
          </div>
          {/* 3-col md+, 2-col mobile — natural sizes */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {caseStudy.posters.map((poster,i)=>(
              <SacredCard key={i} src={poster.src} name={poster.name} devanagari={poster.devanagari} index={i}/>
            ))}
          </div>
        </div>

        {/* mandala trinity */}
        <div className="flex items-center justify-center gap-6 mb-20">
          {[{size:88,op:0.22,d:1,dur:34},{size:128,op:0.38,d:-1,dur:25},{size:88,op:0.22,d:1,dur:42}].map(({size,op,d,dur},i)=>(
            <motion.div key={i}
              animate={prefersReducedMotion?undefined:{rotate:[0,360*d]}}
              transition={prefersReducedMotion?undefined:{duration:dur,repeat:Infinity,ease:"linear"}}>
              <Mandala size={size} opacity={op}/>
            </motion.div>
          ))}
        </div>

        {/* bottom nav */}
        <motion.div className="border-t pt-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          style={{borderColor:`${AT.gold}18`}}
          initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}>
          <div>
            <p className="text-[8px] tracking-[0.45em] uppercase mb-2 opacity-25" style={{color:AT.gold,fontFamily:"Georgia,serif"}}>Continue</p>
            <h3 className="font-bold" style={{fontFamily:"Georgia,serif",fontSize:"clamp(1.5rem,3vw,2rem)",color:AT.cream}}>All Projects</h3>
          </div>
          <Link to="/projects"
            className="inline-flex items-center gap-3 px-6 py-3 text-[9px] tracking-[0.3em] uppercase opacity-65 hover:opacity-100 transition-all"
            style={{border:`1px solid ${AT.gold}38`,color:AT.gold,fontFamily:"Georgia,serif",background:`${AT.gold}07`}}>
            <ArrowLeft className="w-3 h-3"/> Return
          </Link>
        </motion.div>
      </div>

      <Footer/>
    </main>
  );
};