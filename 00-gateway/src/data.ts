import { BtnListType, ProjectListType } from "./types";

export const projectsData: ProjectListType[] = [
  {
    id: 1,
    name: "Próximamente",
    subHeading: "Kupuri Media — Proyecto 1",
    description:
      "Este proyecto estará disponible muy pronto. Mantente al tanto de las novedades de Kupuri Media y Agent Alex.",
    demoLink: "#",
    sourceLink: "#",
    techStack: ["Kupuri Media", "Synthia 3.0"],
  },
  {
    id: 2,
    name: "Próximamente",
    subHeading: "Kupuri Media — Proyecto 2",
    description:
      "Contenido exclusivo en camino. Solo por invitación. Síguenos para más detalles.",
    demoLink: "#",
    sourceLink: "#",
    techStack: ["Agent Alex", "Kupuri Media"],
  },
];

export const BtnList: BtnListType[] = [
  {
    label: "LinkedIn",
    link: "https://www.linkedin.com/in/ivette-milo-546440168/",
    icon: "linkedin",
    newTab: true,
    isLocked: false,
  },
  {
    label: "X / Twitter",
    link: "https://x.com",
    icon: "twitter",
    newTab: true,
    isLocked: true,
  },
  {
    label: "Instagram",
    link: "https://instagram.com",
    icon: "instagram",
    newTab: true,
    isLocked: true,
  },
  {
    label: "YouTube",
    link: "https://youtube.com",
    icon: "youtube",
    newTab: true,
    isLocked: true,
  },
  {
    label: "Blog",
    link: "/blog",
    icon: "blog",
    newTab: false,
    isLocked: true,
  },
  {
    label: "Proyectos",
    link: "/projects",
    icon: "projects",
    newTab: false,
    isLocked: true,
  },
  {
    label: "Acerca de",
    link: "/about",
    icon: "about",
    newTab: false,
    isLocked: true,
  },
  {
    label: "Contacto",
    link: "/contact",
    icon: "contact",
    newTab: false,
    isLocked: true,
  },
];
