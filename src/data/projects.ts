export interface ProjectDetail {
  id: string;
  title: string;
  category: string;
  tag: string;
  href?: string;
  image: string;
  description: string;
  client: string;
  date: string;
  tags: string[];
  fullDescription: string;
  sections?: {
  title: string;
  content: string;
  images: string[];
}[];
  hero?: string;          // main banner image
  gallery?: string[];     // multiple images
  sectionImages?: { [sectionTitle: string]: string[] }; // images specific to sections
}

export const projects: ProjectDetail[] = [
  {
    id: "aura-app",
    title: "Aura App Screens",
    category: "UI Prototype",
    tag: "APP",
    href: "/aura",
    image: "/images/projects/bquest/cover.webp",
    description:
      "An interactive mobile prototype built from the Aura Figma app screens, covering onboarding, mood calibration, playback, timeline, and profile flows.",
    client: "Personal Concept",
    date: "April 2026",
    tags: ["Figma", "UI Prototype", "Mobile App", "Interaction Design"],
    fullDescription:
      "Aura is a concept music-and-mood app translated from Figma into a working prototype inside this portfolio site.\n\nThe prototype focuses on a smooth emotional calibration flow, immersive playback, and a visual system built around translucent cards, glowing orb states, and ambient gradients.",
  },
  {
  id: "driphive",
  title: "Driphive",
  category: "Branding",
  tag: "BRAND",

  image: "/images/projects/driphive/Driphive-cover.webp",

  description:
    "A bold streetwear concept exploring identity, rebellion, and modern urban culture.",

  client: "Personal Project",
  date: "March 2025",
  tags: ["Branding", "Streetwear", "Visual Identity", "Posters"],

  fullDescription:
    "DripHive — The Pulse of Street Culture.\n\nDripHive is a conceptual streetwear brand built as an exploration of bold visual identity, urban expression, and youth-driven aesthetics. The project focuses on crafting a rebellious and high-energy brand language that stands out through typography, color, and composition.",

  // 🔥 HERO (use your best clean wide image)
  hero: "/images/projects/driphive/hero.webp",

  // 🔥 MAIN GALLERY (top visuals / highlights)
  gallery: [
    "/images/projects/driphive/hero.webp",
    "/images/projects/driphive/ad-banner-skateboard.webp",
    "/images/projects/driphive/Mockup.webp",
  ],

  // 🔥 FULL CASE STUDY SECTIONS
  sections: [
    {
      title: "Concept",
      content:
        "DripHive is a conceptual streetwear brand built around rebellion, individuality, and modern urban identity. The goal was to create a brand that feels raw, expressive, and unapologetically bold — something that resonates with youth culture and street aesthetics.\n\nInstead of following clean corporate branding, DripHive embraces loud typography, layered textures, and experimental compositions to reflect the chaos and energy of the streets.",
      images: [],
    },

    {
      title: "Brand Direction",
      content:
        "The visual identity is driven by contrast — structured layouts combined with chaotic expression. Typography plays a central role, mixing graffiti-inspired styles with modern sans-serif elements.\n\nThe color palette blends neutral tones with vibrant accents like neon green and purple, creating a distinctive and energetic brand language.",
      images: [
        "/images/projects/driphive/Logos.webp",
        "/images/projects/driphive/Colours.webp",
        "/images/projects/driphive/Typography-Fonts.webp",
      ],
    },

    {
      title: "Design Exploration",
      content:
        "Multiple design explorations were created to experiment with layout, typography, and visual hierarchy. These iterations helped refine the balance between bold expression and readability.\n\nThe process focused on pushing boundaries while maintaining a cohesive system across all assets.",
      images: [
        // "/images/projects/driphive/Artboard-1.webp",
        "/images/projects/driphive/typography.webp",
        // "/images/projects/driphive/typography-2.webp",
      ],
    },

    {
      title: "Merch & Applications",
      content:
        "The identity was extended into apparel and product design to simulate real-world applications. Each item — from hoodies and t-shirts to accessories — was designed to feel like a statement piece.\n\nThe goal was to ensure consistency while keeping each product visually impactful and aligned with the brand’s bold personality.",
      images: [
        "/images/projects/driphive/black-hoodie.webp",
        "/images/projects/driphive/black-shirt.webp",
        "/images/projects/driphive/Hanging-tshirt-1.webp",
        "/images/projects/driphive/Free-Skateboard.webp",
        "/images/projects/driphive/Nike-Mockup.webp",
      ],
    },

    {
      title: "Social Media",
      content:
        "A series of social media creatives were designed to explore how the brand communicates in a digital space. The focus was on scroll-stopping visuals using contrast, bold typography, and dynamic compositions.\n\nThese posts simulate real-world campaigns and help establish a consistent online presence.",
      images: [
        "/images/projects/driphive/Social-Media-Post-1.webp",
        "/images/projects/driphive/Social-Media-Post-2.webp",
        "/images/projects/driphive/Social-Media-Post-3.webp",
        "/images/projects/driphive/Social-Media-Post-4.webp",
      ],
    },

    {
      title: "Website & Digital",
      content:
        "A conceptual website interface was designed to extend the brand into a digital experience. The UI follows the same bold and immersive visual language, ensuring consistency across platforms.\n\nThe layouts focus on strong typography, visual hierarchy, and modern interaction patterns.",
      images: [
        "/images/projects/driphive/Webpage-1.webp",
        "/images/projects/driphive/Webpage-2.webp",
        "/images/projects/driphive/Webpage-3.webp",
        "/images/projects/driphive/website-mockup.webp",
      ],
    },

    {
      title: "Mockups & Real-World Presence",
      content:
        "To visualize real-world scalability, the brand was applied across environmental and advertising mockups. These include billboards and promotional visuals that demonstrate how DripHive performs beyond digital formats.",
      images: [
        "/images/projects/driphive/Billboard.webp",
        "/images/projects/driphive/Mockup.webp",
      ],
    },

    {
      title: "Conclusion",
      content:
        "DripHive is not just a branding project — it is an exploration of identity, culture, and expression through design.\n\nThis project allowed me to experiment with bold visual systems, push creative boundaries, and build a cohesive brand across multiple touchpoints.",
      images: [],
    },
  ],
},

  {
  id: "vexels",
  title: "Vexels",
  category: "Branding",
  tag: "BRAND",

  image: "/images/projects/vexels/cover.webp",

  description:
    "A playful and expressive brand identity inspired by comics, pop visuals, and storytelling.",

  client: "Personal Project",
  date: "April 2025",
  tags: ["Branding", "Visual Identity", "Packaging", "Social Media"],

  fullDescription:
    "Vexels — A Visual Playground.\n\nVexels is a concept brand built around comic-inspired storytelling, bold colors, and expressive visuals. The project explores how playful graphics and dynamic layouts can create an engaging and memorable identity.\n\nUnlike minimal corporate branding, Vexels embraces energy, personality, and visual experimentation — making it vibrant, youthful, and full of character.",

  // 🔥 HERO (choose your strongest visual)
  hero: "/images/projects/vexels/hero.webp",

  // 🔥 TOP GALLERY (first impression)
  gallery: [
    "/images/projects/vexels/stationary.webp",
    "/images/projects/vexels/Artboard-5.webp",
    "/images/projects/vexels/Artboard-8.webp",
  ],

  sections: [
    {
      title: "Concept",
      content:
        "Vexels was designed as a playful brand identity inspired by comic culture, pop art, and visual storytelling. The goal was to create a system that feels expressive, vibrant, and full of personality.\n\nThe identity embraces bold shapes, bursts, stickers, and dynamic compositions to create an energetic and engaging visual language.",
      images: [],
    },

    {
      title: "Brand Guidelines",
      content:
        "A comprehensive brand system was developed to define the visual identity, including personality, tone, and core values. The system ensures consistency across all touchpoints while maintaining a playful and expressive character.",
      images: [
        "/images/projects/vexels/guidelines1.webp",
        "/images/projects/vexels/guidelines2.webp",
      ],
    },

    {
      title: "Identity System",
      content:
        "The identity system includes logo variations, typefaces, and a bold color palette. Bright and contrasting colors combined with playful typography create a distinctive and recognizable brand presence.\n\nThe system is flexible and scalable, allowing it to adapt across different mediums while maintaining consistency.",
      images: [
        "/images/projects/vexels/logo.webp",
        "/images/projects/vexels/typo.webp",
      ],
    },

    {
      title: "Print & Packaging",
      content:
        "The brand was extended into print and packaging applications including business cards, tags, and shopping bags. These elements demonstrate how the identity translates into physical formats while maintaining its expressive visual language.",
      images: [
        "/images/projects/vexels/Business-Card.webp",
        "/images/projects/vexels/tags.webp",
        "/images/projects/vexels/bag.webp",
      ],
    },

    {
      title: "Editorial & Comic System",
      content:
        "The identity expands into editorial layouts inspired by comic storytelling. The use of panels, bold typography, and vibrant compositions creates an immersive narrative experience.\n\nThis approach reinforces the brand’s playful personality while maintaining structure and readability.",
      images: [
        "/images/projects/vexels/comic-open.webp",
        "/images/projects/vexels/magazine.webp",
      ],
    },

    {
      title: "Social Media",
      content:
        "A series of social media creatives were designed to explore how the brand communicates digitally. The focus was on high-impact visuals, bold typography, and engaging layouts.\n\nThese designs simulate real campaigns and help establish a consistent online presence.",
      images: [
        "/images/projects/vexels/Social-Media-1.webp",
        "/images/projects/vexels/Social-Media-2.webp",
        "/images/projects/vexels/Social-Media-3.webp",
        "/images/projects/vexels/Social-Media-4.webp",
      ],
    },

    {
      title: "Applications & Mockups",
      content:
        "To visualize real-world usage, the identity was applied across posters, building signage, and promotional mockups. These applications showcase how the brand performs across different environments and scales effectively.",
      images: [
        "/images/projects/vexels/poster.webp",
        "/images/projects/vexels/Sign-on-Building.webp",
      ],
    },

    {
      title: "Conclusion",
      content:
        "Vexels is an exploration of expressive branding — combining color, typography, and playful elements to create a lively and engaging identity.\n\nThis project demonstrates my ability to build flexible design systems that balance creativity with structure across multiple touchpoints.",
      images: [],
    },
  ],
},

  {
    id: "banana-quest",
    title: "Banana Quest",
    category: "UI Design",
    tag: "UI",
    image: "/images/projects/bquest/cover.webp",
    description:
      "Visual identity for a tech-forward creative agency at the intersection of art and engineering.",
    client: "Personal Project",
    date: "August 2024",
    tags: ["Branding", "Visual Identity"],
    fullDescription:
      "Vexels Studio required an identity that communicated technical precision and creative energy simultaneously.\n\nThe brand system uses geometric modular shapes and a sharp palette to represent where technology meets art.",
  },

  {
    id: "pixel-era",
    title: "Pixel Era",
    category: "Poster Design",
    tag: "PRINT",
    image: "/images/projects/pixel/cover.webp",
    description:
      "Visual identity for a tech-forward creative agency at the intersection of art and engineering.",
    client: "Personal Project",
    date: "August 2024",
    tags: ["Branding", "Visual Identity"],
    fullDescription:
      "Vexels Studio required an identity that communicated technical precision and creative energy simultaneously.\n\nThe brand system uses geometric modular shapes and a sharp palette to represent where technology meets art.",
  }
];
