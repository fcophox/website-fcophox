# v3 — Diagnóstico y matriz de auditoría

Documento de trabajo para la evolución del sitio hacia **Product Builder & UX Engineer**.
La versión nueva se construye en `/v3` (no indexada) y sustituye a la home cuando esté lista.

## A. Diagnóstico

**Arquitectura.** Next.js 16 (App Router) + React 19 + Tailwind v4 + next-intl 4. El idioma
se elige por cookie (`NEXT_LOCALE`), no por URL: no hay `/en/…`, así que tampoco hay
hreflang posible sin cambiar la arquitectura. Textos de UI en `messages/{es,en}.json`;
blog y casos de estudio vienen de Kontorōru. Tokens en `DESIGN.MD` → `globals.css` (generado).

**Fortalezas que se conservan.** Identidad visual oscura y consistente, hero con shader
propio, casos de estudio reales en el CMS, blog activo, CV imprimible, bilingüe completo
en la UI, sitemap con contenido del CMS y redirecciones 301 de slugs antiguos.

**Problemas principales.**
1. **Posicionamiento difuso.** El hero rota cuatro titulares genéricos ("Investigación y
   optimización…", "Conocimiento y experiencia para convertir ideas en realidad") y un badge
   "Growth Partner". Ninguno dice *qué es* Francisco.
2. **Identidad dominada por consultoría.** "UX Engineer & Product Design Consultant" en
   metadatos, navbar, footer y CV. El CV abre con "UX Leader" y "Full Stack Experience Builder".
3. **Productos casi invisibles.** Sólo Tanzō aparece, en una sección con video y sin ficha.
   Kontorōru —que ya sirve el contenido de este mismo sitio— no se menciona.
4. **Cifras inconsistentes.** About dice "+16 años" y "Diseñando experiencias desde 2015";
   CV y plan dicen 14+. About también declara "+50 proyectos", "+20 equipos" y
   "+890 contribuciones" sin fuente.
5. **Meta descriptions hardcodeadas en español** en `layout.tsx` y `page.tsx`: en inglés el
   sitio sigue entregando la descripción en español. La de la home habla de "Fcophox" en
   tercera persona.
6. **Redundancia en la home.** UxBento y ServicesSection dicen casi lo mismo (estrategia,
   prototipos, IA) con dos títulos distintos.

## B. Matriz de contenidos

| Página | Contenido actual | Problema | Acción | Prioridad |
|---|---|---|---|---|
| Home · Hero | 4 titulares rotando + badge "Growth Partner" | No comunica rol; el H1 cambia cada 4,5 s | **Hecho en /v3:** H1 fijo, eyebrow, CTA a `#productos` y `#experiencia` | P0 |
| Home · UxBento + Services | 8 tarjetas de capacidades | Redundantes entre sí y centradas en consultoría | **Hecho en /v3:** 3 pilares (entender, diseñar, construir). Capacidades detalladas → página propia | P0 |
| Home · Tools (Tanzō) | Video + CTA a Tanzō | Única evidencia de producto, sin ficha | **Hecho en /v3:** sección Productos con 4 fichas verificadas | P0 |
| Home · ExperienceLogos | Logos de formación | Respalda pero no explica trayectoria | **Hecho en /v3:** bloque Trayectoria (roles, industrias, links a About/CV). Logos → About | P1 |
| Home · ConversationCta | Carrusel de 3 mensajes | Orientado a consultoría | **Hecho en /v3:** CTA único (trabajo + colaboración) | P0 |
| Home · Casos / Blog | Componentes con Kontorōru | Bien | Conservar (reutilizados en /v3) | — |
| Metadatos globales | "UX Engineer & Product Design Consultant", descripción sólo en español | Rol desactualizado, sin i18n | Mover descripciones a `messages`, nuevo título | P0 |
| Navbar / Footer | Subtítulo "UX Engineer & Product Design Consultant"; nav sin Productos | Rol antiguo; Productos no navegable | Cambiar rol; evaluar nav del plan (Fase 8) | P1 |
| About | "La experiencia como el resultado", +16 años, stats sin fuente | Cifras inconsistentes y no verificadas | Reescribir con "De diseñar experiencias a construir productos"; confirmar cifras | P1 |
| CV | Rol "UX Engineer & Product Design Consultant", perfil "UX Leader" | Jerarquía invertida respecto al plan | Nuevo título y resumen; reordenar skills | P1 |
| Capabilities `/capabilities/[slug]` | 4 servicios con páginas largas | Enfoque consultoría | Reagrupar en 4 pilares del plan | P1 |
| Methodology | Página FSEB extensa | No es prioritaria para la nueva narrativa | Conservar; quitar de la nav principal si se simplifica | P2 |
| Case studies | Casos reales del CMS | Faltan "mi participación" y resultados explícitos | Plantilla de caso (Fase 6) en Kontorōru | P2 |
| Resources | Prompt library | Buena evidencia de IA aplicada | Conservar; enlazar desde Capacidades/IA | P2 |
| hero-lab, particle-lab, design-system | Herramientas internas | `design-system` no tiene noindex | Revisar indexación | P2 |

## Productos verificados (fuente: repositorios locales)

| Producto | Qué es | Stack (package.json) | Estado | Pendiente |
|---|---|---|---|---|
| Kontorōru | CMS headless multi-tenant (Rukma Studio) | Next.js, TS, Tailwind, shadcn/ui, Supabase, Tiptap | Producción: sirve este sitio | Confirmar si es público y tu rol vs. Rukma Studio; captura |
| Tanzō | Suite: Kōsei, Kādo, Rebyū | Next.js, TS, React Flow, Convex | Beta pública (tanzo.fcophox.com responde 200) | Captura real; aclarar relación repo `mind` vs `tanzo-suite` |
| Bijon | Auditoría UX/CRO con IA dentro de Tanzō | Next.js, Gemini 2.5 Flash | Marcado "Beta" | Confirmar estado; ¿es accesible? |
| Manabu | LMS/CMS para bootcamps | Next.js, Convex, Tiptap | Marcado "MVP" | Confirmar estado y si manabu.cl es público |

Candidatos no incluidos aún: módulo de cotizaciones de Tanzō Studio (¿el "gestor de
propuestas comerciales"?), el caso "RAG Platform: gestión logística con IA" (podría ser
evidencia de IA), Conexionify, el conversor de PPT, Inventario, ACELERA 1988.

## Pendiente de verificar contigo

- Años de experiencia: ¿14+ (plan, CV) o 16+ (About)?
- Stats del About: +50 proyectos, +20 equipos, +890 contribuciones.
- Estado real de Bijon y Manabu; capturas reales de los cuatro productos.
- Tu participación exacta en cada producto (¿solo o con Rukma Studio?).
- Uso de Claude Code u otras herramientas de IA para declararlo en Capacidades.
