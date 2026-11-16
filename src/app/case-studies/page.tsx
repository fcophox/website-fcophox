import { CaseStudiesClient } from "@/components/case-studies-client";
import { OwnProductsSection } from "@/components/own-products-section";
import { getLocale, getTranslations } from "next-intl/server";
import { CATEGORIA } from "@/utils/kontororu";
import { listarLocalizado } from "@/utils/kontororu-i18n";
import { aListadoArray } from "@/utils/kontororu-adapter";
import { Metadata } from 'next';

export const revalidate = 3600; // el webhook invalida antes; ver blog/page.tsx

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  return {
    title: t('caseStudiesTitle'),
    description: "Explora una selección de mis proyectos y casos de estudio donde he aplicado diseño, estrategia y código.",
  };
}

export default async function CasosDeEstudioPage() {
  /*
   * Los productos propios NO se mezclan con los casos de estudio: van en su
   * propia sección al final de la página. Su lectura se hace aparte para saber
   * cuáles están publicados; si falla, la grilla sigue igual.
   */
  const [casos, productos] = await Promise.all([
    listarLocalizado({ categoria: CATEGORIA.casosDeEstudio, limit: 100 }),
    listarLocalizado({ categoria: CATEGORIA.productos, limit: 100 }).catch((error) => {
      console.error("[case-studies] No se pudieron leer los productos de Kontorōru:", error);
      return null;
    }),
  ]);

  return (
    <CaseStudiesClient cases={aListadoArray(casos)}>
      <OwnProductsSection publishedIds={productos?.map((p) => p.slug) ?? null} />
    </CaseStudiesClient>
  );
}
