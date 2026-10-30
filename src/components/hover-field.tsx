"use client";

import { useState, type ElementType, type PointerEvent, type ReactNode, type TransitionEvent } from "react";

import { GradientField, type FieldParams } from "@/components/gradient-field";

type Props = {
  /** Elemento o componente de la tarjeta, p. ej. `"li"` o `motion.div`. */
  as?: ElementType;
  className?: string;
  /** Ajustes del efecto, p. ej. cuando una imagen tapa parte de la tarjeta. */
  fieldParams?: Partial<FieldParams>;
  children: ReactNode;
} & Record<string, unknown>;

/**
 * Tarjeta que al pasar el cursor muestra el fondo del hero. El contenedor debe
 * llevar `relative overflow-hidden`, y su contenido `relative` para quedar
 * sobre el efecto.
 *
 * El shader se monta sólo durante el hover: son varias tarjetas y cada una
 * necesitaría su propio contexto WebGL corriendo todo el rato. Entra con el
 * fundido que el canvas ya trae; al salir se desvanece el contenedor y recién
 * entonces se desmonta, para no cortar el efecto en seco.
 */
export function HoverField({ as: Tag = "div", className, fieldParams, children, ...rest }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFieldMounted, setIsFieldMounted] = useState(false);

  const handlePointerEnter = (e: PointerEvent) => {
    // En táctil no hay hover: un toque dejaría el efecto encendido.
    if (e.pointerType !== "mouse") return;
    setIsHovered(true);
    setIsFieldMounted(true);
  };

  const handleTransitionEnd = (e: TransitionEvent) => {
    // El fundido del canvas también burbujea hasta aquí.
    if (e.target === e.currentTarget && !isHovered) setIsFieldMounted(false);
  };

  return (
    <Tag
      {...rest}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={() => setIsHovered(false)}
      className={className}
    >
      {isFieldMounted && (
        <div
          aria-hidden
          onTransitionEnd={handleTransitionEnd}
          className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <GradientField className="absolute inset-0" params={fieldParams} />
        </div>
      )}
      {children}
    </Tag>
  );
}
