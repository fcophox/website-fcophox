import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

/*
 * Versión en construcción del sitio. Fuera de los buscadores y del sitemap
 * hasta que reemplace a la actual: sin esto competiría con la home real por
 * las mismas búsquedas.
 */
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "V3.Meta" });

  return {
    title: { absolute: t("title") },
    description: t("description"),
    robots: { index: false, follow: false },
  };
}

export default function V3Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/*
        Sin JavaScript, los bloques que framer-motion revela al entrar en
        pantalla se quedan con la opacidad 0 que el servidor les escribió
        inline, y las secciones afectadas aparecen vacías (el hero, sobre todo).
        Este <noscript> lo parsea el navegador sólo cuando no ejecuta scripts;
        con scripts su contenido es texto plano y no aplica. El `!important` es
        obligatorio: lo que hay que ganar son estilos inline.
      */}
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html: "[data-reveal]{opacity:1 !important;transform:none !important}",
          }}
        />
      </noscript>
      {children}
    </>
  );
}
