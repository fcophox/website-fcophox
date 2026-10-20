"use client";

import React, { useState, useRef, useEffect } from "react";
import Image, { ImageProps } from "next/image";

interface RevealImageProps extends Omit<ImageProps, "src" | "alt"> {
  src: string;
  alt: string;
  useImgTag?: boolean;
  revealColor?: string;
  delayMs?: number;
  durationMs?: number;
  wrapperClassName?: string;
  /**
   * Cómo aparece la imagen.
   *
   * - `curtain-down` (por defecto): una cortina que baja y la descubre de
   *   arriba hacia abajo.
   * - `curtain-sides`: dos paneles que se abren hacia los lados, como una
   *   cortina que se corre. Los paneles se solapan un 1 % para que no se vea la
   *   juntura del medio mientras están cerrados.
   */
  variant?: "curtain-down" | "curtain-sides";
}

export function RevealImage({
  src,
  alt,
  useImgTag = false,
  revealColor,
  delayMs = 150,
  durationMs = 800,
  wrapperClassName,
  className,
  onLoad,
  fill,
  width,
  height,
  style,
  variant = "curtain-down",
  ...props
}: RevealImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Handle cached images
  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoaded(true);
    }
  }, []);

  // Scroll visibility observer (triggers only once per mount)
  useEffect(() => {
    // Sin IntersectionObserver revelamos igual, pero en el siguiente frame y no
    // de forma síncrona dentro del efecto: un setState en el cuerpo encadena
    // renders, y el navegador sin observador tampoco tiene prisa alguna.
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setIsInView(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.01,
        rootMargin: "100px 0px 100px 0px", // Trigger 100px before it enters the viewport
      }
    );

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad(e);
    }
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    setIsLoaded(true); // Don't leave the curtain overlay covering the image on failure
    if (props.onError) {
      props.onError(e);
    }
  };

  // Determine wrapper styling and classes
  const defaultWrapperClass = fill
    ? "absolute inset-0 overflow-hidden"
    : "relative overflow-hidden inline-block";

  const wrapperStyle: React.CSSProperties = {};
  if (width && !fill) wrapperStyle.width = width;
  if (height && !fill) wrapperStyle.height = height;

  const showReveal = (isLoaded && isInView) || hasError;

  const curtainColor = revealColor || "var(--surface)";

  /*
    Lo común a las dos cortinas. La de abajo sólo cambia el eje: donde aquélla
    avanza en Y, ésta se parte en dos paneles que salen en X.
  */
  const curtainStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    bottom: 0,
    backgroundColor: curtainColor,
    transitionProperty: "transform",
    transitionDuration: `${durationMs}ms`,
    transitionDelay: `${delayMs}ms`,
    transitionTimingFunction: "cubic-bezier(0.77, 0, 0.175, 1)",
    zIndex: 10,
    pointerEvents: "none",
  };

  // La cortina que baja: revela de arriba hacia abajo.
  const overlayStyle: React.CSSProperties = {
    ...curtainStyle,
    left: 0,
    right: 0,
    transform: showReveal ? "translateY(100%)" : "translateY(0%)",
  };

  /*
    101 % y no 100 %: con 100 % justo, el panel queda pegado al borde y en
    pantallas con escalado fraccionario se ve una línea de un píxel. El medio
    se solapa igual (los dos miden 50,5 %).
  */
  const panelWidth = "50.5%";
  const leftPanelStyle: React.CSSProperties = {
    ...curtainStyle,
    left: 0,
    width: panelWidth,
    transform: showReveal ? "translateX(-101%)" : "translateX(0%)",
  };
  const rightPanelStyle: React.CSSProperties = {
    ...curtainStyle,
    right: 0,
    width: panelWidth,
    transform: showReveal ? "translateX(101%)" : "translateX(0%)",
  };

  // Premium parallax-like scale-down animation on the image itself
  const imageStyle: React.CSSProperties = {
    ...style,
    transition: `transform ${durationMs + 200}ms cubic-bezier(0.25, 1, 0.5, 1)`,
    transitionDelay: `${delayMs}ms`,
    transform: showReveal ? undefined : "scale(1.08)",
  };

  return (
    <div 
      ref={wrapperRef}
      className={`${defaultWrapperClass} ${wrapperClassName || ""}`} 
      style={{ ...style, ...wrapperStyle }}
    >
      {useImgTag ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={className}
          style={{ width: "100%", height: "100%", objectFit: "cover", ...imageStyle }}
          {...(props as React.ImgHTMLAttributes<HTMLImageElement>)}
        />
      ) : (
        <Image
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={className}
          fill={fill}
          width={width}
          height={height}
          style={imageStyle}
          {...props}
        />
      )}

      {/* The Reveal Overlay */}
      {variant === "curtain-sides" ? (
        <>
          <div style={leftPanelStyle} aria-hidden="true" />
          <div style={rightPanelStyle} aria-hidden="true" />
        </>
      ) : (
        <div style={overlayStyle} aria-hidden="true" />
      )}
    </div>
  );
}
