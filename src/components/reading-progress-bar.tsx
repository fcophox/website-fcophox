"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { motion, useScroll, useSpring } from "framer-motion";

const subscribeToNothing = () => () => {};

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
