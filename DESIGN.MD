# DESIGN — Master Control

```
                                ▄
█▀▀█ █▀▀█ █▀▀█ █▀▀▄ █▀▀▀ █▀▀█ █▀▀█ █▀▀█
█░░█ █░░█ █▀▀▀ █░░█ █░░░ █░░█ █░░█ █▀▀▀
▀▀▀▀ █▀▀▀ ▀▀▀▀ ▀  ▀ ▀▀▀▀ ▀▀▀▀ ▀▀▀▀ ▀▀▀▀








                                                      ▄
                     ▀▀▀▀ ▀▀▀▀ ▀▀▀▀ ▀▀▀▄ ▀▀▀▀ ▀▀▀▀ ▀▀▀▀ ▀▀▀▀
                     ▀  ▀ ▀  ▀ ▀▀▀▀ ▀  ▀ ▀    ▀  ▀ ▀  ▀ ▀▀▀▀
                     ▀▀▀▀ ▀▀▀▀ ▀▀▀▀ ▀▀▀▀ ▀▀▀▀ ▀▀▀▀ ▀▀▀▀ ▀▀▀▀


   ┃
   ┃  hola,
   ┃
   ┃  Build · Big Pickle OpenCode Zen
   ╹▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
                                                   tab agents  ctrl+p commands
```

**Build · Big Pickle OpenCode Zen**

> Fuente de verdad del sistema de diseño.
> Modifica este archivo y los estilos se actualizan en tiempo real.

---

## Tokens

```
---tokens
colors.background.light: "#f0f0f0ff"
colors.background.dark: "#101012"
colors.foreground.light: "#0f172a"
colors.foreground.dark: "#f8fafc"
colors.primary.light: "#3b82f6"
colors.primary.dark: "#60a5fa"
colors.secondary.light: "#8b5cf6"
colors.secondary.dark: "#a78bfa"
colors.accent.light: "#f59e0b"
colors.accent.dark: "#fbbf24"
colors.muted.light: "#9997a9"
colors.muted.dark: "#797886"
colors.surface.light: "#ffffff"
colors.surface.dark: "#181A1E"
colors.border.light: "#e2e8f0"
colors.border.dark: "#303031"
fonts.sans: "Sansation, system-ui, sans-serif"
fonts.mono: "Geist Mono, Fira Code, monospace"
spacing.xs: "0.25rem"
spacing.sm: "0.5rem"
spacing.md: "1rem"
spacing.lg: "1.5rem"
spacing.xl: "2rem"
spacing.2xl: "4rem"
radii.sm: "0.375rem"
radii.md: "0.5rem"
radii.lg: "1rem"
radii.full: "9999px"
breakpoints.sm: "40rem"
breakpoints.md: "48rem"
breakpoints.lg: "64rem"
breakpoints.xl: "80rem"
breakpoints.2xl: "96rem"
shadows.sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)"
shadows.md: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
shadows.lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
animations.fast: "150ms"
animations.normal: "300ms"
animations.slow: "500ms"
# Escala tipográfica — roles semánticos.
# Genera utilidades Tailwind `text-<rol>` con line-height y tracking acoplados.
typography.display.size: "clamp(2.5rem, 6vw, 4.5rem)"
typography.display.lineHeight: "1.05"
typography.display.tracking: "-0.02em"
typography.titlePage.size: "clamp(2.25rem, 5vw, 3.5rem)"
typography.titlePage.lineHeight: "1.1"
typography.titlePage.tracking: "-0.02em"
typography.titleSection.size: "clamp(1.5rem, 3vw, 2.25rem)"
typography.titleSection.lineHeight: "1.2"
typography.titleSection.tracking: "-0.01em"
typography.titleSubsection.size: "clamp(1.25rem, 2.2vw, 1.75rem)"
typography.titleSubsection.lineHeight: "1.3"
typography.titleSubsection.tracking: "-0.01em"
typography.titleCard.size: "1.25rem"
typography.titleCard.lineHeight: "1.35"
typography.titleCard.tracking: "-0.01em"
typography.subtitle.size: "1.25rem"
typography.subtitle.lineHeight: "1.6"
typography.subtitle.tracking: "0"
typography.body.size: "1rem"
typography.body.lineHeight: "1.7"
typography.body.tracking: "0"
typography.bodySm.size: "0.875rem"
typography.bodySm.lineHeight: "1.6"
typography.bodySm.tracking: "0"
typography.label.size: "0.75rem"
typography.label.lineHeight: "1.4"
typography.label.tracking: "0.08em"
typography.caption.size: "0.75rem"
typography.caption.lineHeight: "1.5"
typography.caption.tracking: "0"
typography.copyright.size: "0.75rem"
typography.copyright.lineHeight: "1.5"
typography.copyright.tracking: "0"
typography.code.size: "0.875rem"
typography.code.lineHeight: "1.6"
typography.code.tracking: "0"
---
```

---

## Colores

| Variable   | Light      | Dark       | Uso              |
|------------|------------|------------|------------------|
| background | `#f8fafc`  | `#020617`  | Fondo página     |
| foreground | `#0f172a`  | `#f8fafc`  | Texto principal  |
| surface    | `#ffffff`  | `#1e293b`  | Tarjetas         |
| border     | `#e2e8f0`  | `#334155`  | Bordes           |
| primary    | `#3b82f6`  | `#60a5fa`  | Acción principal |
| secondary  | `#8b5cf6`  | `#a78bfa`  | Acción secundaria|
| accent     | `#f59e0b`  | `#fbbf24`  | Énfasis          |
| muted      | `#94a3b8`  | `#b0b0b0`  | Texto secundario |

## Tipografía

| Rol   | Font Stack                          |
|-------|-------------------------------------|
| Sans  | `Sansation, system-ui, sans-serif`  |
| Mono  | `Geist Mono, Fira Code, monospace`  |

## Tipografía — Escala de tamaños

Cada rol genera una utilidad Tailwind `text-<rol>` con su `line-height` y
`letter-spacing` ya acoplados. **Usa siempre estas clases en lugar de
`text-sm`, `text-[clamp(...)]` o valores ad-hoc.** El `font-weight` y el
`uppercase` se aplican aparte con las utilidades `font-*` / `uppercase`.

| Clase                  | Rol                         | Tamaño (móvil → desktop)         | Peso sugerido |
|------------------------|-----------------------------|----------------------------------|---------------|
| `text-display`         | Hero / titular marketing    | `clamp(2.5rem, 6vw, 4.5rem)`     | 400           |
| `text-title-page`      | H1 de página                | `clamp(2.25rem, 5vw, 3.5rem)`    | 400           |
| `text-title-section`   | H2 de sección               | `clamp(1.5rem, 3vw, 2.25rem)`    | 400           |
| `text-title-subsection`| H3 / subtítulo de bloque    | `clamp(1.25rem, 2.2vw, 1.75rem)` | 400           |
| `text-title-card`      | Título de tarjeta           | `1.25rem`                        | 500           |
| `text-subtitle`        | Bajada / lead paragraph     | `1.25rem`                        | 400           |
| `text-body`            | Párrafo principal           | `1rem`                           | 400           |
| `text-body-sm`         | Descripción de tarjeta / texto secundario | `0.875rem`         | 400           |
| `text-label`           | Eyebrow / etiqueta uppercase| `0.75rem` + tracking `0.08em`    | 600           |
| `text-caption`         | Meta, notas al pie          | `0.75rem`                        | 400           |
| `text-copyright`       | Línea legal del footer      | `0.75rem`                        | 400           |
| `text-code`            | Mono / bloques de código    | `0.875rem`                       | 400           |

> Compatibilidad: los modificadores de Tailwind (`md:text-title-section`,
> `lg:text-display`) funcionan igual que con cualquier tamaño nativo.

## Espaciado

| Token | Valor     |
|-------|-----------|
| xs    | `0.25rem` |
| sm    | `0.5rem`  |
| md    | `1rem`    |
| lg    | `1.5rem`  |
| xl    | `2rem`    |
| 2xl   | `4rem`    |

## Radios

| Token | Valor       |
|-------|-------------|
| sm    | `0.375rem`  |
| md    | `0.5rem`    |
| lg    | `1rem`      |
| full  | `9999px`    |

## Sombras

| Token | Valor                                        |
|-------|----------------------------------------------|
| sm    | `0 1px 2px 0 rgb(0 0 0 / 0.05)`             |
| md    | `0 4px 6px -1px rgb(0 0 0 / 0.1)`           |
| lg    | `0 10px 15px -3px rgb(0 0 0 / 0.1)`         |

## Animaciones

| Token  | Valor    |
|--------|----------|
| fast   | `150ms`  |
| normal | `300ms`  |
| slow   | `500ms`  |



