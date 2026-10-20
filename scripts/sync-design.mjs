import { readFileSync, writeFileSync, watchFile } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DESIGN_MD = resolve(ROOT, "DESIGN.MD");
const GLOBALS_CSS = resolve(ROOT, "src/app/globals.css");

const CSS_TEMPLATE = `/*
 * ARCHIVO GENERADO por scripts/sync-design.mjs a partir de DESIGN.MD.
 * NO editar a mano: cualquier cambio se sobrescribe en el siguiente \`npm run dev\`.
 * Tokens de diseño -> editar DESIGN.MD.
 * Estilos de artículos (Tiptap/CMS) -> src/app/tiptap-content.css.
 */
@import "tailwindcss";



@variant dark (&:where(.dark, .dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-secondary: var(--secondary);
  --color-accent: var(--accent);
  --color-muted: var(--muted);
  --color-surface: var(--surface);
  --color-border: var(--border);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-geist-mono);

  /* Escala tipográfica — roles semánticos (ver DESIGN.MD) */
  --text-display: %typography.display.size%;
  --text-display--line-height: %typography.display.lineHeight%;
  --text-display--letter-spacing: %typography.display.tracking%;
  --text-title-page: %typography.titlePage.size%;
  --text-title-page--line-height: %typography.titlePage.lineHeight%;
  --text-title-page--letter-spacing: %typography.titlePage.tracking%;
  --text-title-section: %typography.titleSection.size%;
  --text-title-section--line-height: %typography.titleSection.lineHeight%;
  --text-title-section--letter-spacing: %typography.titleSection.tracking%;
  --text-title-subsection: %typography.titleSubsection.size%;
  --text-title-subsection--line-height: %typography.titleSubsection.lineHeight%;
  --text-title-subsection--letter-spacing: %typography.titleSubsection.tracking%;
  --text-title-card: %typography.titleCard.size%;
  --text-title-card--line-height: %typography.titleCard.lineHeight%;
  --text-title-card--letter-spacing: %typography.titleCard.tracking%;
  --text-subtitle: %typography.subtitle.size%;
  --text-subtitle--line-height: %typography.subtitle.lineHeight%;
  --text-body: %typography.body.size%;
  --text-body--line-height: %typography.body.lineHeight%;
  --text-body-sm: %typography.bodySm.size%;
  --text-body-sm--line-height: %typography.bodySm.lineHeight%;
  --text-label: %typography.label.size%;
  --text-label--line-height: %typography.label.lineHeight%;
  --text-label--letter-spacing: %typography.label.tracking%;
  --text-caption: %typography.caption.size%;
  --text-caption--line-height: %typography.caption.lineHeight%;
  --text-copyright: %typography.copyright.size%;
  --text-copyright--line-height: %typography.copyright.lineHeight%;
  --text-code: %typography.code.size%;
  --text-code--line-height: %typography.code.lineHeight%;
}

:root {
  --background: %colors.background.light%;
  --foreground: %colors.foreground.light%;
  --primary: %colors.primary.light%;
  --secondary: %colors.secondary.light%;
  --accent: %colors.accent.light%;
  --muted: %colors.muted.light%;
  --surface: %colors.surface.light%;
  --border: %colors.border.light%;
}

.dark {
  --background: %colors.background.dark%;
  --foreground: %colors.foreground.dark%;
  --primary: %colors.primary.dark%;
  --secondary: %colors.secondary.dark%;
  --accent: %colors.accent.dark%;
  --muted: %colors.muted.dark%;
  --surface: %colors.surface.dark%;
  --border: %colors.border.dark%;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans);
  transition: background-color 0.3s ease, color 0.3s ease;
}

/*
  Barra de scroll con los tokens del sitio: riel del color de fondo y una
  píldora delgada del color de borde que se aclara al pasar el cursor y toma
  el primario al arrastrarla. El borde transparente con background-clip deja
  aire alrededor de la píldora sin cambiar el ancho de la barra.
*/
::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}
::-webkit-scrollbar-track,
::-webkit-scrollbar-corner {
  background: var(--background);
}
::-webkit-scrollbar-thumb {
  background-color: var(--border);
  border: 3px solid transparent;
  border-radius: 9999px;
  background-clip: content-box;
  transition: background-color 0.2s ease;
}
::-webkit-scrollbar-thumb:hover {
  background-color: var(--muted);
}
::-webkit-scrollbar-thumb:active {
  background-color: var(--primary);
}

/*
  Firefox no tiene los pseudo-elementos de arriba, sólo las propiedades
  estándar. Van dentro del @supports porque Chrome también las entiende y,
  si están, ignora los pseudo-elementos (y con ellos la píldora y el hover).
*/
@supports not selector(::-webkit-scrollbar) {
  html {
    scrollbar-width: thin;
    scrollbar-color: var(--border) var(--background);
  }
}

:root {
  --dm-padding: 16px;
}
@media (min-width: 600px) {
  :root { --dm-padding: 24px; }
}
@media (min-width: 1240px) {
  :root { --dm-padding: clamp(24px, 5vw, 80px); }
}

@layer utilities {
  .dm-container {
    width: 100%;
    max-width: 1440px;
    margin-inline: auto;
    padding-inline: var(--dm-padding);
  }
  .dm-container-hero {
    width: 100%;
    max-width: 1600px;
    margin-inline: auto;
    padding-inline: var(--dm-padding);
  }
  .dm-container-text {
    width: 100%;
    max-width: 760px;
    margin-inline: auto;
    padding-inline: var(--dm-padding);
  }

  .dm-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
  }

  @media (min-width: 600px) {
    .dm-grid {
      grid-template-columns: repeat(8, minmax(0, 1fr));
      gap: 20px;
    }
  }
  @media (min-width: 905px) {
    .dm-grid {
      grid-template-columns: repeat(12, minmax(0, 1fr));
      gap: 24px;
    }
  }
  @media (min-width: 1240px) {
    .dm-grid {
      gap: 32px;
    }
  }
}
`;

function parseTokens(text) {
  const tokens = {};
  const lines = text.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("//")) continue;
    const sep = trimmed.indexOf(": ");
    if (sep === -1) continue;
    const key = trimmed.slice(0, sep).trim();
    const raw = trimmed.slice(sep + 2).trim();
    const value = raw.startsWith('"') && raw.endsWith('"') ? raw.slice(1, -1) : raw;
    const parts = key.split(".");
    let obj = tokens;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!obj[parts[i]]) obj[parts[i]] = {};
      obj = obj[parts[i]];
    }
    obj[parts[parts.length - 1]] = value;
  }
  return tokens;
}

function resolvePath(obj, path) {
  return path.split(".").reduce((acc, part) => (acc ? acc[part] : undefined), obj);
}

function applyTemplate(template, tokens) {
  return template.replace(/%([A-Za-z0-9_.\-]+)%/g, (match, path) => {
    const value = resolvePath(tokens, path);
    if (value === undefined) {
      console.warn(`[design] WARNING: token "${path}" not found in DESIGN.MD`);
      return match;
    }
    return value;
  });
}

function extractTokenBlock(content) {
  const startMarker = "---tokens";
  const endMarker = "---";
  const start = content.indexOf(startMarker);
  if (start === -1) return null;
  const afterStart = start + startMarker.length;
  const end = content.indexOf(endMarker, afterStart);
  if (end === -1) return null;
  return content.slice(afterStart, end).trim();
}

function sync() {
  try {
    const md = readFileSync(DESIGN_MD, "utf-8");
    const block = extractTokenBlock(md);
    if (!block) {
      console.error("[design] ERROR: no `---tokens` block found in DESIGN.MD");
      return;
    }
    const tokens = parseTokens(block);
    const css = applyTemplate(CSS_TEMPLATE, tokens);
    writeFileSync(GLOBALS_CSS, css, "utf-8");
    console.log(`[design] ✓ globals.css generated from DESIGN.MD (${new Date().toLocaleTimeString()})`);
  } catch (err) {
    console.error("[design] ERROR:", err.message);
  }
}

sync();

watchFile(DESIGN_MD, { interval: 500 }, (curr, prev) => {
  if (curr.mtimeMs !== prev.mtimeMs) {
    sync();
  }
});

console.log(`[design] Watching DESIGN.MD for changes (polling every 500ms)...`);
