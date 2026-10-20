"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { GradientField } from "@/components/gradient-field";

interface Slide {
  label: string;
  title: string;
  description: string;
  cta: string;
  form: string;
}

/** Strong ease-out; the built-in curves feel weak at this scale. */
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const SLIDE_MS = 5000;

/**
 * Cierre de la home: el carrusel de mensajes del inicio (Idea, Consultoría,
 * Café virtual) sobre una sección completa —sin tarjeta— con el mismo campo de
 * gradiente del hero, fundido hacia arriba. Texto y botones centrados.
 */
export function ContactCtaV3() {
  const t = useTranslations("V3.Contact");
  const shouldReduceMotion = useReducedMotion();

  const slides = (t.raw("slides") || []) as Slide[];

  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { margin: "-10%" });

  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Sólo gira mientras la sección está a la vista; si no, consume los mensajes
  // con el visitante todavía arriba y llega a media rotación.
  // `index` como dependencia hace que tocar un punto reinicie la espera.
  useEffect(() => {
    if (slides.length <= 1 || isHovered || !inView) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => clearInterval(id);
  }, [index, isHovered, inView, slides.length]);

  if (slides.length === 0) return null;

  const slide = slides[index];

  /* `data-reveal`: ver la nota del hero. Sin JS esta sección quedaba vacía. */
  const rise = (delay: number) => ({
    "data-reveal": true,
    initial: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-15%" },
    transition: { duration: 0.55, delay, ease: EASE_OUT },
  });

  const swap = {
    "data-reveal": true,
    initial: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 },
    transition: { duration: 0.4, ease: EASE_OUT },
  };

  return (
    <section
      ref={sectionRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="dark relative w-full overflow-hidden bg-background py-24 md:py-32"
      /*
        Como en el hero: el fondo se pinta inline para que el primer frame no
        salga blanco antes de que llegue la hoja de estilos. El literal sólo
        cubre ese instante; el token sigue mandando en operación normal.
      */
      style={{ backgroundColor: "var(--background, #101012)" }}
    >
      {/*
        El mismo campo del hero, pero con el fundido arriba en vez de abajo: el
        hero cierra su sección entregando el fondo hacia abajo, y este bloque,
        que cierra la página, tiene que entregarlo hacia arriba. El fundido
        inferior va corto (0.25) y no nulo: sin él el campo llegaba a color
        pleno justo en el borde y se veía la línea donde empieza el pie.
      */}
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-background to-background" />
        <GradientField className="absolute inset-0" params={{ topFade: 0.7, bottomFade: 0.25 }} />
      </div>

      <div className="dm-container relative z-10">
        <div className="mx-auto max-w-3xl flex flex-col items-center text-center">
          {/*
            Los tres mensajes tienen largos distintos y sin esto el alto de la
            sección cambiaría en cada rotación. Cada diapositiva se apila
            invisible en la misma celda, así el alto es siempre el del más
            largo y los botones de abajo no saltan. Divs, nunca h2/p: este
            bloque sólo reserva espacio y no debe entrar en el índice del
            documento.
          */}
          <div className="relative w-full">
            <div aria-hidden className="invisible grid">
              {slides.map((s, i) => (
                <div key={i} className="[grid-area:1/1] flex flex-col items-center">
                  <div className="mb-5 text-label font-mono uppercase">{s.label}</div>
                  <div className="mb-4 max-w-xl text-title-section text-balance">{s.title}</div>
                  <div className="mb-8 max-w-lg text-subtitle text-pretty">{s.description}</div>
                </div>
              ))}
            </div>

            <div className="absolute inset-0">
              <AnimatePresence mode="wait">
                <motion.div key={index} {...swap} className="flex flex-col items-center">
                  <p className="mb-5 text-label font-mono uppercase text-primary">{slide.label}</p>
                  <h2 className="mb-4 max-w-xl text-title-section font-normal text-foreground text-balance">
                    {slide.title}
                  </h2>
                  <p className="mb-8 max-w-lg text-subtitle text-muted text-pretty">
                    {slide.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <motion.div {...rise(0.16)} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href={`/contact?form=${slide.form}`}
              className="px-8 py-3 rounded-full bg-primary text-background font-medium hover:scale-105 transition-transform duration-200 shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
            >
              {slide.cta}
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <a
              href="https://www.linkedin.com/in/fcophox/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-full bg-background/40 text-foreground font-medium border border-border hover:border-primary/40 transition-colors flex items-center justify-center"
            >
              {t("linkedin")}
            </a>
          </motion.div>

          {/*
            El progreso vive dentro del punto activo en vez de en una barra
            aparte: es donde ya mira el ojo para responder "cuál de los tres
            es este". Animación CSS, no un tick de estado, para que corra
            fuera del hilo principal y se pueda pausar con una propiedad —
            tiene que detenerse exactamente cuando lo hace la rotación (al
            pasar el cursor o salir de pantalla) o los dos se desincronizan.
          */}
          <style>{`
            @keyframes conversation-progress {
              from { transform: scaleX(0); }
              to   { transform: scaleX(1); }
            }
          `}</style>

          <motion.div {...rise(0.22)} className="mt-8 flex items-center gap-2.5">
            {slides.map((s, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={s.title}
                aria-current={i === index}
                className={`relative h-2 cursor-pointer overflow-hidden rounded-full transition-all duration-300 ${
                  i === index ? "w-8 bg-border/40" : "w-2 bg-border/60 hover:bg-primary/50"
                }`}
              >
                {i === index && (
                  <span
                    // Remounting on each slide is what restarts the fill.
                    key={index}
                    aria-hidden
                    className="absolute inset-0 origin-left rounded-full bg-primary"
                    style={{
                      animation: `conversation-progress ${SLIDE_MS}ms linear forwards`,
                      animationPlayState: isHovered || !inView ? "paused" : "running",
                    }}
                  />
                )}
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
