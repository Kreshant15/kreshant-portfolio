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
    "A modern streetwear identity exploring bold visuals and urban culture.",

  client: "Personal Project",
  date: "March 2025",
  tags: ["Branding", "Streetwear", "Posters"],

  fullDescription:
    "DripHive — The Pulse of Street Culture.\n\nA concept brand exploring bold, rebellious visual identity inspired by urban aesthetics.",

  hero: "/images/projects/driphive/hero.webp",

  gallery: [
    "/images/projects/driphive/1.webp",
    "/images/projects/driphive/2.webp",
    "/images/projects/driphive/3.webp",
  ],

  // 🔥 NEW (important)
  sections: [
    {
      title: "Concept",
      content:
        "DripHive was built as a bold streetwear concept blending rebellion, identity, and visual impact. The idea was to create a brand that feels raw, expressive, and unapologetically modern.",
    },
    {
      title: "Visual Direction",
      content:
        "The visual language combines graffiti-inspired typography, neon accents, and strong contrast. Purple and green highlights create a distinctive identity.",
    },
    {
      title: "Execution",
      content:
        "The project includes posters, mockups, and apparel concepts designed to feel energetic and visually striking.",
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