/**
 * Logotipos de los lugares donde estudié o enseñé («Experiencia respaldada por
 * el conocimiento»). Los usan Trayectoria en la home (v3) y ExperienceLogos en
 * la home anterior (/org). Los SVG están en public/studies/.
 *
 * Vive aquí y no en experience-logos.tsx porque ese archivo es "use client" y
 * un componente de servidor no puede importar datos de él.
 */
export const STUDY_LOGOS = [
  { name: "UDD", path: "/studies/udd.svg" },
  { name: "FinisTerrae", path: "/studies/uft.svg" },
  { name: "AyerViernes", path: "/studies/ayerviernes.svg" },
  { name: "AprendeUX", path: "/studies/aprendeux.svg" },
  { name: "DuocUC", path: "/studies/duoc.svg" },
  { name: "UXAlliance", path: "/studies/uxalliance.svg" },
  { name: "PUC", path: "/studies/uc.svg" },
  { name: "UNIR", path: "/studies/unir.svg" },
];
