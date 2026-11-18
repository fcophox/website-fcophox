import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";

import { STUDY_LOGOS } from "@/data/study-logos";

/**
 * Trayectoria resumida: la etiqueta a la izquierda y, a la derecha, una sola
 * frase grande. Los años y los cargos van dentro de la frase, así que la lista
 * de roles ya no está —el detalle sigue en /about y /cv—. Debajo van las
 * industrias y los logotipos de formación (los de la home anterior).
 * Sostiene la propuesta sin quitarle protagonismo a los productos. Es el ancla
 * `#experiencia`.
 */
export async function ExperienceV3() {
  const t = await getTranslations("V3.Experience");
  const industries = t.raw("industries") as string[];

  const chip = "px-3 py-1.5 rounded-full border border-border/60 text-body-sm text-foreground/90";
  const link = "group inline-flex items-center gap-1.5 text-foreground hover:text-primary transition-colors";
  const arrow = "transition-transform group-hover:translate-x-0.5";

  return (
    <section id="experiencia" className="w-full relative z-10 bg-background py-16 md:py-24 scroll-mt-24">
      <div className="dm-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16">
          {/* La etiqueta queda arriba a la izquierda, a la altura de la primera línea. */}
          <p className="text-label font-mono uppercase text-foreground/80 lg:col-span-3">
            {t("label")}
          </p>

          <div className="lg:col-span-9">
            <h2 className="text-title-section font-normal text-foreground text-pretty lg:max-w-[880px]">
              {/*
                `t.rich` en vez de partir la frase en claves: el mensaje se lee
                entero y las dos partes destacadas van marcadas con <hl>, con el
                mismo degradado del texto destacado del hero.
              */}
              {t.rich("statement", {
                hl: (chunks) => (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                    {chunks}
                  </span>
                ),
              })}
            </h2>

            <div className="mt-12 md:mt-16">
              <p className="text-label font-mono uppercase text-muted mb-3">
                {t("industriesLabel")}
              </p>
              <ul className="flex flex-wrap gap-2">
                {industries.map((industry) => (
                  <li key={industry} className={chip}>
                    {industry}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12 md:mt-16">
              <p className="text-label font-mono uppercase text-muted mb-5">
                {t("knowledgeLabel")}
              </p>
              <ul className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-8 items-center max-w-3xl">
                {STUDY_LOGOS.map((logo) => (
                  <li
                    key={logo.name}
                    className="relative w-28 h-10 opacity-50 hover:opacity-100 transition-opacity"
                  >
                    <Image
                      src={logo.path}
                      alt={logo.name}
                      fill
                      sizes="112px"
                      className="object-contain object-left"
                    />
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-16 md:mt-20 flex flex-wrap items-center gap-x-8 gap-y-3">
              <Link href="/about" className={link}>
                {t("ctaAbout")}
                <ArrowRight size={16} className={arrow} aria-hidden />
              </Link>
              <Link href="/cv" className={link}>
                {t("ctaCv")}
                <ArrowRight size={16} className={arrow} aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
