"use client";

import { useEffect, useRef } from "react";

/**
 * Malla de una esfera vista desde su centro: sólo meridianos y paralelos, sin
 * relleno. Se proyecta con ojo de pez (equidistante), como la cúpula de un
 * planetario. Con perspectiva normal, desde el centro cada meridiano sale como
 * una recta y la esfera se lee como un tubo; el ojo de pez curva las líneas y
 * deja ver el polo, que es lo que la hace sentir esférica.
 *
 * Canvas 2D y nada más: son unas pocas miles de líneas, no justifican un motor
 * 3D. El color sale del token `--primary`, así sigue a la paleta.
 */

const MERIDIANS = 24;
const PARALLELS = 13;
/** Puntos por línea. Más es más suave; las curvas cercanas al borde lo notan. */
const STEPS = 96;
/** Campo de visión vertical, en radianes. Muy amplio: es lo que curva la malla. */
const FOV = (150 * Math.PI) / 180;
/** Inclinación de la cámara: mira hacia arriba para que el polo quede en la parte alta del cuadro. */
const PITCH = 0.7;
/** Radianes por segundo. Lento: es fondo, no protagonista. */
const SPEED = 0.025;
/**
 * Scroll: al bajar una pantalla completa, la cámara baja la mirada estos
 * radianes (el polo se aleja hacia arriba y entran más anillos al cuadro).
 */
const SCROLL_TILT = 0.75;
/**
 * Parallax: fracción del scroll que el lienzo acompaña hacia abajo. Con 0.45
 * la esfera sube a poco más de la mitad de la velocidad del contenido.
 */
const SCROLL_PARALLAX = 0.45;
/** Suavizado del scroll por frame (0–1). Más bajo es más lento y más fluido. */
const SCROLL_EASE = 0.08;
/** Ángulo desde el centro de la vista a partir del cual ya no se dibuja (casi detrás). */
const MAX_ANGLE = (125 * Math.PI) / 180;
/** La opacidad se agrupa en tantos niveles para trazar pocas rutas por frame. */
const ALPHA_BUCKETS = 8;
const MAX_ALPHA = 0.18;

type Vec3 = [number, number, number];

function buildLines(): Vec3[][] {
  const lines: Vec3[][] = [];

  for (let m = 0; m < MERIDIANS; m++) {
    const lon = (m / MERIDIANS) * Math.PI * 2;
    const line: Vec3[] = [];
    for (let s = 0; s <= STEPS; s++) {
      const lat = -Math.PI / 2 + (s / STEPS) * Math.PI;
      line.push([Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)]);
    }
    lines.push(line);
  }

  // Sin los polos: ahí el paralelo es un punto.
  for (let p = 1; p < PARALLELS; p++) {
    const lat = -Math.PI / 2 + (p / PARALLELS) * Math.PI;
    const line: Vec3[] = [];
    for (let s = 0; s <= STEPS; s++) {
      const lon = (s / STEPS) * Math.PI * 2;
      line.push([Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)]);
    }
    lines.push(line);
  }

  return lines;
}

export function SphereMesh({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const lines = buildLines();
    const color = getComputedStyle(canvas).getPropertyValue("--primary").trim() || "#3b82f6";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let raf = 0;
    let visible = true;
    const start = performance.now();
    /** Avance del scroll sobre el alto del lienzo, suavizado (0–1). */
    let scroll = 0;

    function draw(yaw: number, pitch: number) {
      if (!ctx || width === 0) return;
      ctx.clearRect(0, 0, width, height);

      // Ojo de pez equidistante: la distancia al centro crece con el ángulo, no con su tangente.
      const k = height / 2 / (FOV / 2);
      const cx = width / 2;
      const cy = height / 2;
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);

      const paths = Array.from({ length: ALPHA_BUCKETS }, () => new Path2D());

      for (const line of lines) {
        let prev: { x: number; y: number; angle: number } | null = null;

        for (const [x0, y0, z0] of line) {
          // Giro alrededor del eje vertical y luego la inclinación de la cámara.
          const x1 = x0 * cosY + z0 * sinY;
          const z1 = -x0 * sinY + z0 * cosY;
          const y = y0 * cosP - z1 * sinP;
          const z = y0 * sinP + z1 * cosP;

          const angle = Math.acos(Math.max(-1, Math.min(1, z)));
          if (angle > MAX_ANGLE) {
            prev = null;
            continue;
          }

          const planar = Math.hypot(x1, y) || 1;
          const r = k * angle;
          const point = { x: cx + (r * x1) / planar, y: cy - (r * y) / planar, angle };

          if (prev) {
            // Más visible al frente, se apaga hacia los bordes del campo de visión.
            const facing = 1 - (prev.angle + angle) / 2 / MAX_ANGLE;
            const bucket = Math.min(ALPHA_BUCKETS - 1, Math.floor(facing * ALPHA_BUCKETS));
            const path = paths[bucket];
            path.moveTo(prev.x, prev.y);
            path.lineTo(point.x, point.y);
          }
          prev = point;
        }
      }

      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      paths.forEach((path, i) => {
        ctx.globalAlpha = MAX_ALPHA * ((i + 1) / ALPHA_BUCKETS) ** 1.5;
        ctx.stroke(path);
      });
      ctx.globalAlpha = 1;
    }

    function frame(now: number) {
      if (!canvas) return;
      const target = height ? Math.min(1, Math.max(0, window.scrollY / height)) : 0;
      scroll += (target - scroll) * SCROLL_EASE;
      canvas.style.transform = `translate3d(0, ${scroll * height * SCROLL_PARALLAX}px, 0)`;
      draw(((now - start) / 1000) * SPEED, PITCH - scroll * SCROLL_TILT);
      raf = requestAnimationFrame(frame);
    }

    function play() {
      cancelAnimationFrame(raf);
      if (reducedMotion) draw(0, PITCH);
      else if (visible && !document.hidden) raf = requestAnimationFrame(frame);
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reducedMotion) draw(0, PITCH);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    // Fuera de pantalla no hay nada que dibujar.
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      play();
    });
    intersectionObserver.observe(canvas);

    document.addEventListener("visibilitychange", play);
    resize();
    play();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", play);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
