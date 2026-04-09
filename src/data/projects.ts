export interface ProjectDetail {
  id: string;
  title: string;
  category: string;
  tag: string;
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
  hero: "/images/projects/driphive/Driphive-cover.webp",

  // 🔥 MAIN GALLERY (top visuals / highlights)
  gallery: [
    "/images/projects/driphive/Driphive-cover.webp",
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
        "/images/projects/driphive/Artboard-1.webp",
        "/images/projects/driphive/typography.webp",
        "/images/projects/driphive/typography-2.webp",
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
      "Visual identity for a tech-forward creative agency at the intersection of art and engineering.",
    client: "Personal Project",
    date: "August 2024",
    tags: ["Branding", "Visual Identity"],
    fullDescription:
      "Vexels Studio required an identity that communicated technical precision and creative energy simultaneously.\n\nThe brand system uses geometric modular shapes and a sharp palette to represent where technology meets art.",
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