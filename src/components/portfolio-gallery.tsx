"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { RevealImage } from "@/components/reveal-image";

export type GalleryShot = {
  id: string;
  src: string;
  /** Título que se muestra bajo la imagen en el lightbox. */
  title: string;
  alt: string;
  /** Clase de proporción de Tailwind para la miniatura (p. ej. "aspect-[4/5]"). */
  aspect: string;
};

type Labels = {
  open: string;
  close: string;
  previous: string;
  next: string;
  /** Texto del contador, con {current} y {total}. */
  counter: string;
};

const subscribeToNothing = () => () => {};

/**
 * Proporción numérica a partir de la clase de Tailwind de la miniatura
 * ("aspect-[4/5]" → 0.8, "aspect-square" → 1). Con ella el lightbox da a la
 * imagen su forma real, para que las esquinas redondeadas caigan en la imagen y
 * no en un recuadro más grande.
 */
function ratioOf(aspect: string): number {
  const match = aspect.match(/aspect-\[(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)\]/);
  if (match) return Number(match[1]) / Number(match[2]);
  if (aspect.includes("aspect-video")) return 16 / 9;
  return 1;
}

/** Distancia (px) de arrastre para pasar de imagen en pantallas táctiles. */
const SWIPE_THRESHOLD = 80;

/**
 * Masonry de imágenes que abre un lightbox al hacer clic.
 *
 * En el lightbox: flechas a los lados, ← → del teclado, deslizar en pantallas
 * táctiles, Esc o clic en el fondo para cerrar. Al abrir, el foco pasa al
 * botón de cerrar y se bloquea el scroll de la página; al cerrar, el foco
 * vuelve a la miniatura. Va en un portal al body para quedar sobre el navbar
 * (el contenedor de las páginas tiene su propio contexto de apilamiento).
 */
export function PortfolioGallery({ shots, labels }: { shots: GalleryShot[]; labels: Labels }) {
  const [index, setIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const isClient = useSyncExternalStore(subscribeToNothing, () => true, () => false);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const lastOpened = useRef<number | null>(null);

  const isOpen = index !== null;
  const total = shots.length;

  const open = (i: number) => {
    lastOpened.current = i;
    setDirection(0);
    setIndex(i);
  };

  const close = useCallback(() => setIndex(null), []);

  const go = useCallback(
    (step: 1 | -1) => {
      setDirection(step);
      setIndex((i) => (i === null ? i : (i + step + total) % total));
    },
    [total],
  );

  // Teclado, bloqueo de scroll y foco mientras está abierto.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    const thumbs = thumbRefs.current;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      // Devuelve el foco a la miniatura que abrió el lightbox.
      const i = lastOpened.current;
      if (i !== null) thumbs[i]?.focus();
    };
  }, [isOpen, close, go]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) go(1);
    else if (info.offset.x > SWIPE_THRESHOLD) go(-1);
  };

  const shot = index !== null ? shots[index] : null;
  const slide = shouldReduceMotion ? 0 : 60;

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
        {shots.map((s, i) => (
          <button
            key={s.id}
            ref={(el) => {
              thumbRefs.current[i] = el;
            }}
            type="button"
            onClick={() => open(i)}
            aria-label={`${labels.open} ${labels.counter.replace("{current}", String(i + 1)).replace("{total}", String(total))}`}
            className={`group relative block w-full ${s.aspect} rounded-3xl overflow-hidden bg-surface mb-6 break-inside-avoid cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary`}
          >
            <RevealImage
              src={s.src}
              alt={s.alt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              revealColor="var(--surface)"
            />
          </button>
        ))}
      </div>

      {isClient &&
        createPortal(
          <AnimatePresence>
            {shot && index !== null && (
              <motion.div
                key="lightbox"
                data-lightbox
                role="dialog"
                aria-modal="true"
                aria-label={shot.title}
                className="fixed inset-0 z-[70] flex items-center justify-center bg-background/95 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={close}
              >
                {/* Contador y cerrar */}
                <div className="absolute top-0 inset-x-0 flex items-center justify-between p-4 md:p-6">
                  <span className="text-label font-mono text-muted" aria-live="polite">
                    {labels.counter.replace("{current}", String(index + 1)).replace("{total}", String(total))}
                  </span>
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={close}
                    aria-label={labels.close}
                    className="size-11 rounded-full bg-surface/80 border border-border text-foreground flex items-center justify-center hover:border-primary/40 transition-colors"
                  >
                    <X className="size-5" aria-hidden />
                  </button>
                </div>

                {/* Anterior */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(-1);
                  }}
                  aria-label={labels.previous}
                  className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 size-12 rounded-full bg-surface/80 border border-border text-foreground flex items-center justify-center hover:border-primary/40 transition-colors"
                >
                  <ChevronLeft className="size-6" aria-hidden />
                </button>

                {/* Imagen con su título abajo, al centro */}
                <div
                  className="relative w-full h-[85vh] [--gutter:2rem] md:[--gutter:10rem]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.figure
                      key={shot.id}
                      className="absolute inset-0 flex flex-col items-center justify-center gap-5 touch-pan-y"
                      custom={direction}
                      initial={{ opacity: 0, x: direction * slide }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: direction * -slide }}
                      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.4}
                      onDragEnd={onDragEnd}
                    >
                      {/*
                        El ancho es el menor entre el espacio disponible y el
                        que permite el alto (70vh × proporción): así la imagen
                        cabe entera y conserva su forma.
                      */}
                      <div
                        className="relative rounded-3xl overflow-hidden bg-surface shadow-2xl shadow-black/40"
                        style={{
                          aspectRatio: ratioOf(shot.aspect),
                          width: `min(calc(100vw - var(--gutter)), calc(70vh * ${ratioOf(shot.aspect)}))`,
                        }}
                      >
                        <Image
                          src={shot.src}
                          alt={shot.alt}
                          fill
                          sizes="100vw"
                          draggable={false}
                          className="object-cover select-none"
                        />
                      </div>
                      <figcaption className="text-title-card font-normal text-foreground text-center px-6">
                        {shot.title}
                      </figcaption>
                    </motion.figure>
                  </AnimatePresence>
                </div>

                {/* Siguiente */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(1);
                  }}
                  aria-label={labels.next}
                  className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 size-12 rounded-full bg-surface/80 border border-border text-foreground flex items-center justify-center hover:border-primary/40 transition-colors"
                >
                  <ChevronRight className="size-6" aria-hidden />
                </button>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
