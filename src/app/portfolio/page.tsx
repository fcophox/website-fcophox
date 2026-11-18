import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { PortfolioGallery } from "@/components/portfolio-gallery";
import { RevealImage } from "@/components/reveal-image";
import { RotatingTitle, type RotatingTitleItem } from "@/components/v3/rotating-title";
import {
  FEATURED_PROJECT,
  MAIN_PROJECTS,
  MORE_SHOTS,
  OTHER_PROJECTS,
  PORTFOLIO_IMAGE_PLACEHOLDER,
  type PortfolioProject,
} from "@/data/portfolio";

/*
 * /portfolio — en construcción. Todavía no está en el menú ni en el sitemap, y
 * queda fuera de los buscadores hasta que tenga contenido.
 *
 * El título son las tres frases del hero (V3.Hero.titles), leídas de la misma
 * clave para que no se desincronicen, pasando una tras otra con la misma
 * animación (RotatingTitle), pero con el tamaño de título de las páginas
 * internas en vez del del hero.
 *
 * Debajo: un proyecto destacado a todo el ancho, cuatro en dos columnas, «Otros
 * proyectos de diseño» en tres columnas y «Más diseños», solo imágenes en
 * masonry. Los proyectos viven en data/portfolio.ts (hoy, datos de ejemplo).
 */

/** Imagen, cliente y rubro. `aspect` y `sizes` cambian según la grilla. */
function ProjectCard({
  project,
  locale,
  aspect,
  sizes,
  titleClass,
}: {
  project: PortfolioProject;
  locale: "es" | "en";
  aspect: string;
  sizes: string;
  titleClass: string;
}) {
  return (
    <article className="flex flex-col">
      <div className={`relative w-full ${aspect} rounded-3xl overflow-hidden bg-surface mb-5`}>
        <RevealImage
          src={project.image ?? PORTFOLIO_IMAGE_PLACEHOLDER}
          alt={project.image ? project.client : ""}
          fill
          sizes={sizes}
          className="object-cover"
          revealColor="var(--surface)"
        />
      </div>
      <h3 className={`${titleClass} font-normal text-foreground mb-1`}>{project.client}</h3>
      <p className="text-body-sm text-muted">{project.sector[locale]}</p>
    </article>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "PortfolioPage" });
  return {
    title: t("metaTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function PortfolioPage() {
  const locale = (await getLocale()) === "en" ? "en" : "es";
  const t = await getTranslations("PortfolioPage");
  const tHero = await getTranslations("V3.Hero");
  const titles = tHero.raw("titles") as RotatingTitleItem[];

  return (
    <main className="w-full flex-1 flex flex-col items-center justify-start pt-8 pb-32">
      <div className="dm-container">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-body-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" aria-hidden />
            {t("backHome")}
          </Link>
        </div>

        <h1 className="grid text-title-page font-normal text-foreground mb-16 md:max-w-[80%]">
          <RotatingTitle titles={titles} />
        </h1>

        {/* Proyecto destacado, a todo el ancho */}
        <section className="mb-16 md:mb-24">
          <ProjectCard
            project={FEATURED_PROJECT}
            locale={locale}
            aspect="aspect-[16/9] md:aspect-[21/9]"
            sizes="100vw"
            titleClass="text-title-section"
          />
        </section>

        {/* Cuatro proyectos en dos columnas */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 mb-24 md:mb-32">
          {MAIN_PROJECTS.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              locale={locale}
              aspect="aspect-[16/10]"
              sizes="(min-width: 768px) 50vw, 100vw"
              titleClass="text-title-subsection"
            />
          ))}
        </section>

        {/* Otros proyectos de diseño, en tres columnas */}
        <section className="mb-24 md:mb-32">
          <h2 className="text-title-section font-normal text-foreground mb-10">{t("otherTitle")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {OTHER_PROJECTS.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                locale={locale}
                aspect="aspect-[4/3]"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                titleClass="text-title-card"
              />
            ))}
          </div>
        </section>

        {/* Más diseños: solo imágenes, en masonry; al hacer clic se abre un lightbox */}
        <section>
          <h2 className="text-title-section font-normal text-foreground mb-10">{t("moreTitle")}</h2>
          <PortfolioGallery
            shots={MORE_SHOTS.map((shot) => ({
              id: shot.id,
              src: shot.image ?? PORTFOLIO_IMAGE_PLACEHOLDER,
              title: shot.title,
              alt: shot.image ? shot.alt || shot.title : "",
              aspect: shot.aspect,
            }))}
            labels={{
              open: t("galleryOpen"),
              close: t("galleryClose"),
              previous: t("galleryPrevious"),
              next: t("galleryNext"),
              // Plantilla con {current} y {total}: se lee en crudo para que next-intl no la interprete.
              counter: t.raw("galleryCounter") as string,
            }}
          />
        </section>
      </div>
    </main>
  );
}
