"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { GradientField } from "@/components/gradient-field";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/**
 * Hero de la v3. Conserva el fondo y el avatar del hero actual; cambia el
 * mensaje: un solo H1 fijo en lugar de cuatro titulares rotando, para que el
 * posicionamiento se lea en el primer vistazo.
 */
export function HeroV3() {
  const t = useTranslations("V3.Hero");
  const shouldReduceMotion = useReducedMotion();

  /*
    `data-reveal` sólo importa sin JavaScript: framer-motion escribe la opacidad
    0 del estado inicial inline en el HTML del servidor y, sin scripts, nadie la
    revierte —el hero salía en blanco—. El layout de /v3 lleva una hoja dentro
    de <noscript> que anula esos estilos para ese caso; con JS no hace nada.
  */
  const rise = (delay: number) => ({
    "data-reveal": true,
    initial: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: EASE_OUT },
  });

  return (
    <section
      className="dark bg-background text-foreground relative min-h-screen flex flex-col items-start justify-center overflow-hidden text-left py-20"
      style={{ backgroundColor: "var(--background, #101012)" }}
    >
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-screen overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20"
            aria-hidden
          />
          <GradientField className="absolute inset-0" />
        </div>
      </div>

      {/*
        `dm-container`, no `dm-container-hero`: ese último sube el tope a 1600px
        y dejaba el hero desplazado respecto al resto de las secciones, que
        paran en 1440px.
      */}
      <div className="relative z-10 dm-container flex flex-col items-start">
        <motion.div {...rise(0.1)} className="relative mb-6">
          <div className="absolute -inset-3 rounded-full bg-primary/15 blur-xl" aria-hidden />
          <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden ring-1 ring-border/60 shadow-lg shadow-background/40">
            <Image
              src="/brand/francisco-avatar.png?v=2"
              alt="Francisco Hormazábal"
              fill
              sizes="80px"
              priority
              className="object-cover"
            />
          </div>
        </motion.div>

        <motion.p
          {...rise(0.2)}
          className="text-label font-mono uppercase text-foreground/80 mb-6"
        >
          {t("eyebrow")}
        </motion.p>

        <motion.h1
          {...rise(0.3)}
          className="text-display font-normal text-foreground mb-6 text-balance"
        >
          {t("title")}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            {t("titleAccent")}
          </span>
        </motion.h1>

        <motion.p {...rise(0.4)} className="text-subtitle text-muted max-w-3xl mb-10 text-pretty">
          {t("description")}
        </motion.p>

        <motion.div {...rise(0.5)} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <a
            href="#productos"
            className="px-8 py-3 rounded-full bg-primary text-background font-medium hover:scale-105 transition-transform duration-200 shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
          >
            {t("ctaPrimary")}
            <ArrowRight className="w-4 h-4" aria-hidden />
          </a>
          <a
            href="#experiencia"
            className="px-8 py-3 rounded-full bg-surface text-foreground font-medium hover:scale-105 transition-transform duration-200 border border-border flex items-center justify-center gap-2"
          >
            {t("ctaSecondary")}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
