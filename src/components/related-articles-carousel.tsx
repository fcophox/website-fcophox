"use client";

import { useRef, useState, useEffect, useCallback, type MouseEvent, type PointerEvent } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { RevealImage } from "./reveal-image";

export interface RelatedItem {
  id: string | number;
  title: string;
  slug: string;
  content: string;
  image_url?: string | null;
  category?: string;
  href: string;
}

interface RelatedArticlesCarouselProps {
  items: RelatedItem[];
  viewAllHref: string;
}

/** Píxeles que debe moverse el mouse para contar como arrastre y no como clic. */
const DRAG_THRESHOLD = 5;
/** Lo que tarda el scroll suave en asentarse antes de devolver el snap. */
const SETTLE_MS = 400;

const gradients = [
  "from-primary/40 to-secondary/40",
  "from-secondary/40 to-accent/40",
  "from-accent/40 to-primary/40",
  "from-primary/40 to-accent/40",
  "from-secondary/40 to-primary/40",
  "from-accent/40 to-secondary/40",
];

export function RelatedArticlesCarousel({
  items,
  viewAllHref,
}: RelatedArticlesCarouselProps) {
  const t = useTranslations("ArticleNav");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startScroll: number } | null>(null);
  const hasDraggedRef = useRef(false);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, [checkScroll]);

  useEffect(() => () => clearTimeout(settleTimerRef.current), []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    // Scroll by the width of one card + gap
    const card = el.querySelector<HTMLElement>("[data-carousel-card]");
    const amount = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    // Sólo mouse: el táctil ya desliza de forma nativa.
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    clearTimeout(settleTimerRef.current);
    hasDraggedRef.current = false;
    dragRef.current = { startX: e.clientX, startScroll: e.currentTarget.scrollLeft };
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const el = e.currentTarget;
    const distance = e.clientX - drag.startX;
    if (!hasDraggedRef.current) {
      if (Math.abs(distance) < DRAG_THRESHOLD) return;
      hasDraggedRef.current = true;
      setIsDragging(true);
      el.setPointerCapture(e.pointerId);
      // Con snap activo el navegador devolvería cada píxel a la tarjeta anterior.
      el.style.scrollSnapType = "none";
    }
    el.scrollLeft = drag.startScroll - distance;
  };

  const handlePointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    dragRef.current = null;
    if (!hasDraggedRef.current) return;
    setIsDragging(false);
    const el = e.currentTarget;
    // Termina en la tarjeta más cercana: reactivar el snap de golpe daría un salto.
    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-carousel-card]"));
    const offsets = cards.map((card) => card.offsetLeft - cards[0].offsetLeft);
    const nearest = offsets.reduce((best, offset) =>
      Math.abs(offset - el.scrollLeft) < Math.abs(best - el.scrollLeft) ? offset : best,
    );
    el.scrollTo({ left: nearest, behavior: "smooth" });
    settleTimerRef.current = setTimeout(() => {
      el.style.scrollSnapType = "x mandatory";
    }, SETTLE_MS);
  };

  // Soltar tras arrastrar no debe abrir la tarjeta que quedó bajo el cursor.
  const handleClickCapture = (e: MouseEvent<HTMLDivElement>) => {
    if (!hasDraggedRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    hasDraggedRef.current = false;
  };

  if (items.length === 0) return null;

  return (
    <section className="w-full mt-20 pt-16 pb-8 border-t border-border">
      <div className="dm-container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-title-section font-normal text-foreground mb-2">
              {t("sectionTitle")}
            </h2>
            <p className="text-body text-muted max-w-xl">
              {t("sectionSubtitle")}
            </p>
          </div>
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 text-body-sm font-medium text-muted hover:text-foreground border border-border hover:border-foreground/30 rounded-full px-5 py-2.5 transition-all shrink-0"
          >
            {t("viewAll")}
          </Link>
        </div>
      </div>

      {/* Carousel track */}
      <div className="relative">
        <div
          ref={scrollRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onClickCapture={handleClickCapture}
          onDragStart={(e) => e.preventDefault()}
          className={`flex overflow-x-auto scrollbar-hide pb-4 ${
            isDragging ? "cursor-grabbing select-none [&_*]:cursor-grabbing" : "cursor-grab"
          }`}
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            scrollPaddingLeft: "calc(max(0px, (100vw - 1440px) / 2) + var(--dm-padding))",
          }}
        >
          {/* Left spacer */}
          <div className="shrink-0" style={{ width: "calc(max(0px, (100vw - 1440px) / 2) + var(--dm-padding))" }} />

          {items.map((item, i) => (
            <Link
              key={item.id}
              href={item.href}
              data-carousel-card
              className="group shrink-0 w-[300px] md:w-[340px] mr-6 flex flex-col cursor-pointer"
              style={{ scrollSnapAlign: "start" }}
            >
              {/* Image */}
              <div className="w-full aspect-[16/9] overflow-hidden relative rounded-2xl mb-4">
                {item.image_url ? (
                  <RevealImage
                    src={item.image_url}
                    alt={item.title}
                    useImgTag
                    className="w-full h-full object-cover hover-zoom"
                    wrapperClassName="w-full h-full"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className={`w-full h-full bg-gradient-to-br ${gradients[i % gradients.length]} hover-zoom`}
                  />
                )}
              </div>

              {/* Body */}
              <div className="flex flex-col flex-1">
                <h3 className="text-title-card font-normal text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-body-sm text-muted line-clamp-2">
                  {item.content.replace(/<[^>]*>/g, "").slice(0, 120)}
                </p>
              </div>
            </Link>
          ))}
          {/* Right spacer */}
          <div className="shrink-0" style={{ width: "max(0px, calc((100vw - 90rem) / 2))" }} />
        </div>

        {/* Navigation arrows */}
        <div className="dm-container mt-6 flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted hover:text-foreground hover:border-foreground/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted hover:text-foreground hover:border-foreground/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
