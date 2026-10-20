"use client";

import Link from "next/link";
import { RevealImage } from "./reveal-image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef, useEffect, useState, type ReactNode } from "react";

export interface Project {
  id?: string;
  slug?: string;
  tag: string;
  title: string;
  description: string;
  tags: string[];
  colors: string[];
  image_url?: string;
}

type Variant = "default" | "v3";

type Props = {
  projects?: Project[];
  /** Sobrescriben la cabecera por defecto (los usa la home v3). */
  label?: string;
  /** Nodo y no sólo texto: la home v3 lo manda con un tramo en degradado. */
  title?: ReactNode;
  /**
   * `v3` es la variante de la home nueva: sin `surface` (la tarjeta toma el
   * fondo más oscuro de la paleta), imagen al 70 % del ancho y la información
   * en el 30 % restante, con los tipos un escalón más chicos para que quepan.
   */
  variant?: Variant;
};

export function ProjectCard({ projects = [], label, title, variant }: Props) {
  const t = useTranslations("ProjectCard");
  const isV3 = variant === "v3";
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  // Detect desktop — the pinned stacking effect only runs on large screens.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Track scroll progress (0 → 1) across the tall section.
  useEffect(() => {
    if (!isDesktop) return;
    let raf = 0;
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const scrollable = el.offsetHeight - window.innerHeight;
        if (scrollable <= 0) {
          setProgress(0);
          return;
        }
        const p = Math.min(1, Math.max(0, -rect.top / scrollable));
        setProgress(p);
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isDesktop, projects.length]);

  if (!projects || projects.length === 0) return null;

  const Header = (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
      <div>
        {/*
          En v3 la etiqueta va como en el resto de las secciones —mono,
          mayúsculas, sin píldora—. La home actual conserva la píldora, que es
          como se lee en todas sus secciones.
        */}
        {isV3 ? (
          <p className="text-label font-mono uppercase text-foreground/80 mb-4">
            {label ?? t("since")}
          </p>
        ) : (
          <span className="inline-block bg-muted/10 dark:bg-muted/5 border border-border/40 px-3.5 py-1.5 rounded-full text-label font-semibold text-muted uppercase mb-4">
            {label ?? t("since")}
          </span>
        )}
        <h2 className="text-title-section font-normal text-foreground text-left w-full md:max-w-[750px]">
          {title ?? t("title")}
        </h2>
      </div>
      <Link
        href="/case-studies"
        className="group flex items-center gap-2 text-muted hover:text-foreground transition-colors whitespace-nowrap mb-1"
      >
        <span className="text-body-sm font-medium">{t("viewAll")}</span>
        <ArrowUpRight
          size={20}
          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </Link>
    </div>
  );

  // ---- Mobile / fallback: simple stacked list ----
  if (!isDesktop) {
    return (
      <section className="w-full relative z-10 bg-background overflow-visible">
        <div className="dm-container py-12">
          <div className="mb-16">{Header}</div>
          <div className="space-y-12">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <ProjectCardItem project={project} variant={variant} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ---- Desktop: pinned stacking stage ----
  const N = projects.length;
  // Scroll distance allotted to the whole sequence, expressed in viewport heights.
  const sectionHeightVh = 100 + (N - 1) * 85;
  // Position along the timeline: 0 → N-1 (which card is at the front).
  const timeline = progress * (N - 1);
  const activeIndex = Math.min(N - 1, Math.max(0, Math.round(timeline)));

  const handleDotClick = (index: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const absoluteOffsetTop = rect.top + scrollTop;
    const scrollable = el.offsetHeight - window.innerHeight;
    const targetScrollY = absoluteOffsetTop + scrollable * (index / (N - 1));
    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={sectionRef}
      className="w-full relative z-10 bg-background"
      style={{ height: `${sectionHeightVh}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="dm-container h-full flex flex-col pt-16 pb-10">
          <div className="mb-20 shrink-0">{Header}</div>

          <div className="relative flex-1 flex gap-8">
            {/* Dots Indicator (Left side, centered vertically) */}
            <div className="flex flex-col justify-center gap-3 pr-2 z-20 select-none">
              {projects.map((_, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => handleDotClick(idx)}
                    className={`w-2 rounded-full transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-primary h-6"
                        : "bg-border/60 hover:bg-primary/50 h-2"
                    }`}
                    aria-label={`Go to case ${idx + 1}`}
                  />
                );
              })}
            </div>

            {/* Card stage */}
            <div className="relative flex-1">
            {projects.map((project, index) => {
              // How much this card has slid into place (0 → 1).
              const entered = index === 0 ? 1 : clamp(timeline - (index - 1), 0, 1);
              // How much the NEXT card has covered this one (0 → 1).
              const covered = clamp(timeline - index, 0, 1);

              const enterVH = (1 - entered) * 80; // comes up from below the viewport
              const coverPx = -covered * 30; // recedes upward when covered
              const scale = 1 - covered * 0.05;

              return (
                <div
                  key={index}
                  className="absolute inset-x-0 top-0"
                  style={{
                    zIndex: index,
                    transform: `translateY(calc(${enterVH}vh + ${coverPx}px)) scale(${scale})`,
                    transformOrigin: "top center",
                    transition: "none",
                    pointerEvents: covered > 0.5 ? "none" : "auto",
                  }}
                >
                  <ProjectCardItem project={project} variant={variant} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
     </div>
    </section>
  );
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function ProjectCardItem({ project, variant = "default" }: { project: Project; variant?: Variant }) {
  const isV3 = variant === "v3";
  return (
    <div className="w-full">
      <Link
        href={project.slug ? `/case-studies/${project.slug}` : `/case-studies`}
        className="block no-underline w-full cursor-none"
        data-custom-cursor="true"
      >
        <div
          className={`w-full rounded-3xl overflow-hidden flex flex-col md:flex-row ${
            isV3
              ? "bg-background border border-border/20"
              : "bg-surface border border-border/20 shadow-2xl"
          }`}
        >
          {/*
            v3: la imagen se lleva el 70 % del ancho. El recuadro pasa a 16/9
            porque con el 70 % un 29/20 (el de la home actual) crecería tanto de
            alto que la tarjeta no cabría en la pantalla fija del apilado.
          */}
          <div
            className={`w-full flex items-center justify-center ${
              isV3 ? "p-6 md:w-[70%] md:p-8" : "p-6 md:w-[50%] md:p-10"
            }`}
          >
            {/*
              El tope de alto es `100vh - 24rem`, no un porcentaje: la tarjeta
              vive dentro de la pantalla fija del apilado, y ahí lo que sobra
              para ella es la altura del viewport menos el encabezado de la
              sección, los paddings y el del propio recuadro. Con un tope plano
              el recorte se comía la imagen en pantallas altas sin necesidad.
            */}
            <div
              className={`relative w-full rounded-xl overflow-hidden group border border-border/50 ${
                isV3
                  ? "aspect-[29/20] md:aspect-[16/9] md:max-h-[calc(100vh-24rem)]"
                  : "aspect-[29/20]"
              }`}
            >
              {project.image_url ? (
                <div className="w-full h-full relative">
                  <RevealImage
                    src={project.image_url}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes={isV3 ? "(max-width: 768px) 100vw, 70vw" : "(max-width: 768px) 100vw, 50vw"}
                    /*
                      En v3 la tarjeta no tiene `surface`: la cortina se pinta
                      con el fondo para que mientras está cerrada se lea como
                      parte de la tarjeta y no como un parche más claro.
                    */
                    revealColor={isV3 ? "var(--background)" : undefined}
                    variant={isV3 ? "curtain-sides" : "curtain-down"}
                  />
                </div>
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${project.colors[0]}20, ${project.colors[1]}20)`,
                  }}
                >
                  <div
                    className="w-3/4 h-3/4 rounded-lg border border-white/10"
                    style={{
                      background: `linear-gradient(135deg, ${project.colors[0]}40, ${project.colors[1]}40)`,
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div
            className={`flex flex-col justify-between w-full items-start text-left ${
              isV3 ? "p-6 md:w-[30%] md:p-8" : "p-8 md:w-[50%] md:p-10"
            }`}
          >
            <div className={isV3 ? "space-y-4 md:space-y-5" : "space-y-6"}>
              <span className="text-caption font-medium text-secondary bg-secondary/10 px-3 py-1.5 rounded-full inline-block">
                {project.tag}
              </span>
              <h3
                className={`font-normal text-foreground text-left w-full ${
                  isV3 ? "text-title-subsection" : "text-title-section md:max-w-[750px]"
                }`}
              >
                {project.title}
              </h3>
              <p className={`text-muted ${isV3 ? "text-body-sm" : "text-body max-w-md"}`}>
                {project.description}
              </p>
            </div>
            <div className={`flex flex-wrap gap-2 mt-auto ${isV3 ? "pt-6 md:pt-8" : "pt-8"}`}>
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full text-caption text-muted bg-muted/20 border border-border"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
