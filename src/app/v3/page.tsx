import { getTranslations } from "next-intl/server";

import { Blog } from "@/components/blog";
import { ProjectCard } from "@/components/project-card";
import { ContactCtaV3 } from "@/components/v3/contact-cta";
import { ExperienceV3 } from "@/components/v3/experience";
import { FeaturedProductsV3 } from "@/components/v3/featured-products";
import { HeroV3 } from "@/components/v3/hero";
import { PillarsV3 } from "@/components/v3/pillars";
import { CATEGORIA } from "@/utils/kontororu";
import { aListadoArray } from "@/utils/kontororu-adapter";
import { listarLocalizado } from "@/utils/kontororu-i18n";

export const revalidate = 3600;

const COLOR_PALETTES = [
  ["#3b82f6", "#06b6d4"],
  ["#8b5cf6", "#ec4899"],
  ["#22c55e", "#14b8a6"],
  ["#f97316", "#ef4444"],
  ["#eab308", "#f97316"],
  ["#ec4899", "#8b5cf6"],
];

/**
 * Home v3: Product Builder & UX Engineer.
 *
 * Orden: posicionamiento → cómo trabajo → productos construidos → trayectoria
 * → casos de estudio → blog → contacto. Los productos van antes que la
 * trayectoria: la experiencia respalda, no encabeza.
 */
export default async function HomeV3() {
  const t = await getTranslations("V3.CaseStudies");

  const casos = await listarLocalizado({ categoria: CATEGORIA.casosDeEstudio, limit: 6 });
  const projects = aListadoArray(casos).map((c, i) => ({
    id: c.id,
    slug: c.slug,
    tag: c.category || "Case Study",
    title: c.title,
    description: c.content || "",
    tags: c.tags ?? [],
    colors: COLOR_PALETTES[i % COLOR_PALETTES.length],
    image_url: c.image_url ?? undefined,
  }));

  return (
    <main className="min-h-screen flex flex-col relative bg-background">
      <HeroV3 />
      <PillarsV3 />
      <FeaturedProductsV3 />
      <ExperienceV3 />
      <ProjectCard
        projects={projects}
        label={t("label")}
        title={t.rich("title", {
          hl: (chunks) => (
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              {chunks}
            </span>
          ),
        })}
        variant="v3"
      />
      <Blog />
      <ContactCtaV3 />
    </main>
  );
}
