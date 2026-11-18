"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export type RotatingTitleItem = { text: string; accent: string };

/** Cada cuánto cambia la frase (el mismo ritmo del hero anterior). */
const INTERVAL_MS = 4500;

/*
  Mismo movimiento que el hero anterior (components/hero.tsx): la frase que
  sale sube y se desvanece, y recién entonces entra la nueva desde abajo
  —sin cruzarse—, 0,5 s cada tramo. `wait` deja las frases ocultas abajo, sin
  transición, listas para entrar.
*/
const VARIANTS = {
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut", delay: 0.5 } },
  leave: { opacity: 0, y: -20, transition: { duration: 0.5, ease: "easeInOut" } },
  wait: { opacity: 0, y: 20, transition: { duration: 0 } },
} as const;

/**
 * Frases que pasan una tras otra, cada una con su parte destacada. La usan el
 * hero de la home y /portfolio.
 *
 * Devuelve sólo las frases: el título que las contiene (h1) debe llevar la
 * clase `grid`. Así todas se apilan en la misma celda, la grilla toma el alto
 * de la más larga y el contenido de abajo no salta al cambiar. Sólo la activa
 * es legible por lectores de pantalla; con «reducir movimiento» no rota y
 * queda la primera.
 */
export function RotatingTitle({ titles }: { titles: RotatingTitleItem[] }) {
  const shouldReduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion || titles.length < 2) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % titles.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [shouldReduceMotion, titles.length]);

  return (
    <>
      {titles.map((title, i) => {
        const isActive = i === active;
        const isLeaving = i === (active - 1 + titles.length) % titles.length;
        return (
          <motion.span
            key={title.accent}
            aria-hidden={!isActive}
            variants={VARIANTS}
            initial={false}
            animate={isActive ? "show" : isLeaving ? "leave" : "wait"}
            className={`col-start-1 row-start-1 text-balance ${isActive ? "" : "pointer-events-none"}`}
          >
            {title.text}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              {title.accent}
            </span>
          </motion.span>
        );
      })}
    </>
  );
}
