export interface ProjectDetail {
  id: string;
  title: string;
  category: string;
  tag: string;
  prototypeUrl?: string;
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
  },

  {
    id: "aura-app",
    title: "Aura App Screens",
    category: "UI Prototype",
    tag: "APP",
    prototypeUrl: "/aura",
    image: "/images/projects/aura/cover.svg",
    description:
      "A mood-led music app concept translated from Figma into a working portfolio prototype with a soft editorial case study and interactive mobile flow.",
    client: "Personal Concept",
    date: "April 2026",
    tags: ["Figma", "UI Prototype", "Mobile App", "Interaction Design"],
    fullDescription:
      "Aura started as a set of app screens exploring how music discovery could feel more emotional, ambient, and personal than a typical playlist interface.\n\nInstead of centering the product around search, the concept frames listening as calibration: the user signals a mood, the interface responds with an orb-like visual language, and sessions gradually shape a calmer or more focused state.\n\nThis portfolio version turns that concept into both a written case study and a working prototype. The case study explains the thinking behind the flow, while the prototype lets viewers step through onboarding, mood selection, tuning, playback, and reflection in a way that feels more alive than a static mockup.",
    hero: "/images/projects/aura/hero.svg",
    gallery: [
      "/images/projects/aura/mockup-overview.svg",
      "/images/projects/aura/screen-grid.svg",
      "/images/projects/aura/hero.svg",
    ],
    sections: [
      {
        title: "Concept",
        content:
          "Aura is designed as a mood-first listening experience. Rather than asking the user to begin with a search bar, it begins with a feeling. The product language is built around calibration, resonance, and emotional drift.\n\nThat framing shaped both the interface and the narrative of the app. Screens use soft gradients, translucent cards, and glowing orbs to make the product feel atmospheric instead of purely utilitarian.",
        images: ["/images/projects/aura/mockup-overview.svg"],
      },
      {
        title: "Design Direction",
        content:
          "The visual system balances two references: immersive app UI and the softer editorial tone already present across this portfolio. Purple remained the anchor, but it is filtered through warmer creams, quieter typography, and rounded framing so the project still feels like part of the same site.\n\nThe interface relies on a compact mobile canvas, low-contrast glass surfaces, and expressive spacing rather than loud decoration.",
        images: ["/images/projects/aura/hero.svg"],
      },
      {
        title: "Core Flow",
        content:
          "The core prototype flow follows the most important emotional journey in the app: arrival, mood selection, permissions, calibration, playback, reflection, and profile.\n\nEach step answers a simple question. Who are you right now? What should the soundscape become? How did the session affect your state? That sequence turns a playlist app into something closer to a guided ritual.",
        images: ["/images/projects/aura/screen-grid.svg"],
      },
      {
        title: "Prototype Translation",
        content:
          "To move from Figma into a working prototype, I rebuilt the experience in React inside the portfolio. The result is not just a visual recreation but an interactive model: sliders respond, playback animates, navigation moves between states, and the app can be explored as a coherent product.\n\nThat made the project stronger as a portfolio piece because people can both read the intent and test the behavior.",
        images: [
          "/images/projects/aura/mockup-overview.svg",
          "/images/projects/aura/screen-grid.svg",
        ],
      },
    ],
  }
];
