import { projects } from "./projects";

export interface ProjectCardData {
  id: string;
  title: string;
  category: string;
  image: string;
  tag: string;
}

export const customProjectCards: ProjectCardData[] = [
  {
    id: "banana-quest",
    title: "Banana Quest",
    category: "UI Design",
    image: "/images/projects/bquest/cover.webp",
    tag: "UI",
  },
  {
    id: "pixel-era",
    title: "Pixel Era",
    category: "Poster Series",
    image: "/images/projects/pixel/Pixelation.webp",
    tag: "PRINT",
  },
  {
    id: "antaryatra",
    title: "Antaryatra",
    category: "Poster Series",
    image: "/images/projects/antaryatra/antaryatra.webp",
    tag: "ART",
  },
];

const baseProjectCards: ProjectCardData[] = projects.map((project) => ({
  id: project.id,
  title: project.title,
  category: project.category,
  image: project.image,
  tag: project.tag,
}));

export const projectCards: ProjectCardData[] = [
  ...baseProjectCards,
  ...customProjectCards,
].filter(
  (project, index, allProjects) =>
    index === allProjects.findIndex(({ id }) => id === project.id)
);
