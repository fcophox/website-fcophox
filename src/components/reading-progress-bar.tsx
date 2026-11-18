"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { motion, useScroll, useSpring } from "framer-motion";

const subscribeToNothing = () => () => {};

/**
 * Barra de progreso de lectura, fija arriba de la ventana.
 *
 * Va siempre DESPUÉS del contenido de la página, nunca como primer elemento:
 * al navegar, Next.js decide si subir al inicio mirando el primer nodo de la
 * página. Si ese nodo es esta barra (fija y montada en el body), Next la salta,
 * sigue por los hermanos del body, no encuentra la página y deja el scroll
 * donde estaba: el artículo se abría a media altura.
 */
export function ReadingProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  // `document` no existe en el servidor: el portal se monta recién en el cliente.
  const isClient = useSyncExternalStore(subscribeToNothing, () => true, () => false);

  if (!isClient) return null;

  // Va directo al body: el contenedor de las páginas tiene `z-10` y su contexto
  // de apilamiento dejaba la barra debajo del navbar, por mucho z-index que lleve.
  return createPortal(
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary z-[60] origin-left pointer-events-none"
      style={{ scaleX }}
    />,
    document.body,
  );
}
