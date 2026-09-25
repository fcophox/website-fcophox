/**
 * Textos legales del sitio (privacidad, cookies y términos), en ES y EN.
 *
 * Viven aquí y no en messages/*.json porque son documentos largos con
 * estructura propia; los mensajes de interfaz sí están en next-intl.
 *
 * Marco que cubren: Ley 19.628 de Chile y su reforma por la Ley 21.719
 * (vigente desde el 1 de diciembre de 2026), el RGPD europeo y la Directiva
 * ePrivacy para visitantes de la UE, y las normas equivalentes de la región
 * (LGPD de Brasil, Ley 25.326 de Argentina, LFPDPPP de México).
 *
 * Si cambia lo que se recoge (un formulario nuevo, otro proveedor, otra
 * cookie), hay que actualizar LEGAL_UPDATED y la sección correspondiente. Si
 * cambian las categorías de cookies, sube también VERSION en utils/consent.ts
 * para volver a pedir el consentimiento.
 */

/** Correo para ejercer derechos. Debe ser uno que se revise de verdad. */
export const LEGAL_EMAIL = "fcojhormazabalh@gmail.com";
export const LEGAL_UPDATED = "2026-09-24";

export type LegalBlock =
  | string
  | { list: string[] }
  | { table: { head: string[]; rows: string[][] } };

export type LegalSection = { heading: string; blocks: LegalBlock[] };

export type LegalDoc = {
  title: string;
  description: string;
  intro: string;
  sections: LegalSection[];
};

export type LegalSlug = "privacy" | "cookies" | "terms";

const es: Record<LegalSlug, LegalDoc> = {
  privacy: {
    title: "Política de privacidad",
    description: "Qué datos personales trata fcophox.com, con qué fin y cómo ejercer tus derechos.",
    intro:
      "Esta política explica qué datos personales se recogen cuando visitas fcophox.com o me escribes a través de sus formularios, para qué se usan, con quién se comparten y qué derechos tienes sobre ellos.",
    sections: [
      {
        heading: "1. Responsable del tratamiento",
        blocks: [
          `El responsable es Francisco Hormazábal (fcophox), consultor independiente en UX y diseño de producto, con domicilio en Chile. Para cualquier asunto relacionado con tus datos puedes escribir a ${LEGAL_EMAIL}.`,
        ],
      },
      {
        heading: "2. Qué datos recojo y para qué",
        blocks: [
          {
            table: {
              head: ["Origen", "Datos", "Finalidad", "Base legal"],
              rows: [
                [
                  "Formularios de contacto, consultoría y agenda",
                  "Nombre, correo, mensaje y los detalles que elijas indicar (tipo de proyecto, presupuesto, fecha y hora de reunión)",
                  "Responder tu consulta, preparar una propuesta y coordinar reuniones",
                  "Tu consentimiento al enviar el formulario y la aplicación de medidas precontractuales a petición tuya",
                ],
                [
                  "Google Analytics (sólo si lo aceptas)",
                  "Páginas visitadas, duración, dispositivo, navegador, ubicación aproximada e identificador aleatorio en cookie. La IP se anonimiza y no se almacena",
                  "Medir de forma agregada qué contenido es útil y mejorar el sitio",
                  "Tu consentimiento, que puedes retirar en cualquier momento",
                ],
                [
                  "Registros técnicos del servidor",
                  "Dirección IP, fecha y hora, URL solicitada y agente de usuario",
                  "Seguridad, prevención de abusos y diagnóstico de errores",
                  "Interés legítimo en mantener el sitio seguro y operativo",
                ],
              ],
            },
          },
          "No tomo decisiones automatizadas ni elaboro perfiles con efectos jurídicos sobre ti, no vendo tus datos y no los uso para publicidad. El sitio no está dirigido a menores de 14 años y no recojo conscientemente datos suyos.",
        ],
      },
      {
        heading: "3. Con quién se comparten",
        blocks: [
          "Sólo con proveedores que los tratan por encargo mío y bajo contrato, para que el sitio funcione:",
          {
            list: [
              "Vercel Inc. (EE. UU.): alojamiento del sitio y registros técnicos.",
              "Resend (EE. UU.): envío del aviso por correo cuando completas un formulario.",
              "Kontorōru: gestor de contenido y bandeja donde se guardan los mensajes de los formularios.",
              "Google (Gmail y, si lo aceptas, Google Analytics — Google LLC/Google Ireland Ltd.): recepción de los avisos de contacto y medición de audiencia.",
            ],
          },
          "Algunos de estos proveedores están fuera de Chile y del Espacio Económico Europeo. Esas transferencias se amparan en cláusulas contractuales tipo o en el Marco de Privacidad de Datos UE–EE. UU. cuando el proveedor está adherido. También compartiré datos con autoridades si una ley me obliga a ello.",
        ],
      },
      {
        heading: "4. Cuánto tiempo se conservan",
        blocks: [
          {
            list: [
              "Mensajes de formularios: hasta 24 meses desde el último contacto, salvo que se inicie una relación profesional, en cuyo caso se conservan lo que exija la normativa tributaria y contractual.",
              "Datos de Google Analytics: 14 meses, y después se eliminan automáticamente.",
              "Registros técnicos del servidor: el plazo de retención del proveedor de hosting, normalmente días o pocas semanas.",
            ],
          },
        ],
      },
      {
        heading: "5. Tus derechos",
        blocks: [
          "Puedes ejercer en cualquier momento, sin costo, los derechos de:",
          {
            list: [
              "Acceso: saber qué datos tuyos trato.",
              "Rectificación: corregir datos inexactos o incompletos.",
              "Supresión: pedir que se eliminen.",
              "Oposición y limitación del tratamiento.",
              "Portabilidad: recibir tus datos en un formato estructurado y de uso común.",
              "Retirar tu consentimiento, sin que ello afecte a la licitud del tratamiento previo.",
            ],
          },
          `Escríbeme a ${LEGAL_EMAIL} indicando qué derecho quieres ejercer. Responderé en un plazo máximo de 30 días. Si consideras que no he atendido bien tu solicitud, puedes reclamar ante la autoridad de control: en Chile, la Agencia de Protección de Datos Personales; en la UE, la autoridad de tu país (en España, la AEPD).`,
        ],
      },
      {
        heading: "6. Seguridad",
        blocks: [
          "El sitio se sirve siempre por HTTPS, las claves de acceso a los servicios nunca llegan al navegador y el acceso a los mensajes está limitado a mí. Ningún sistema es infalible: si ocurriera una brecha que afecte a tus datos, te lo comunicaré y lo notificaré a la autoridad en los plazos que marca la ley.",
        ],
      },
      {
        heading: "7. Cambios en esta política",
        blocks: [
          "Si esta política cambia de forma relevante, actualizaré la fecha de arriba y, cuando corresponda, volveré a pedir tu consentimiento.",
        ],
      },
    ],
  },
  cookies: {
    title: "Política de cookies",
    description: "Qué cookies y almacenamiento local usa fcophox.com y cómo gestionarlos.",
    intro:
      "Las cookies y el almacenamiento local son pequeños datos que el sitio guarda en tu navegador. Aquí se detallan todos los que usa fcophox.com. Las que no son estrictamente necesarias sólo se activan si las aceptas, y puedes cambiar tu elección cuando quieras.",
    sections: [
      {
        heading: "Estrictamente necesarias",
        blocks: [
          "Hacen funcionar el sitio o recuerdan una elección que tú hiciste. No requieren consentimiento y no sirven para identificarte.",
          {
            table: {
              head: ["Nombre", "Tipo", "Finalidad", "Duración"],
              rows: [
                ["NEXT_LOCALE", "Cookie propia", "Recordar el idioma que elegiste", "1 año"],
                ["cookie-consent", "Almacenamiento local", "Recordar tus preferencias de cookies", "Hasta que lo borres"],
                ["resources_unlocked", "Almacenamiento local", "Recordar que desbloqueaste la sección de recursos", "Hasta que lo borres"],
                ["liked_kontororu_*", "Almacenamiento local", "Recordar que marcaste un artículo como útil, para no contarlo dos veces", "Hasta que lo borres"],
              ],
            },
          },
        ],
      },
      {
        heading: "Analíticas (opcionales)",
        blocks: [
          "Sólo se instalan si las aceptas. Las establece Google Analytics 4 para contar visitas de forma agregada.",
          {
            table: {
              head: ["Nombre", "Proveedor", "Finalidad", "Duración"],
              rows: [
                ["_ga", "Google", "Distinguir visitantes con un identificador aleatorio", "2 años"],
                ["_ga_N30VCBN4MR", "Google", "Mantener el estado de la sesión", "2 años"],
              ],
            },
          },
          "Más información en la política de privacidad de Google: https://policies.google.com/privacy. También puedes instalar el complemento de inhabilitación de Google Analytics: https://tools.google.com/dlpage/gaoptout.",
        ],
      },
      {
        heading: "Cómo gestionarlas",
        blocks: [
          "Puedes cambiar o retirar tu consentimiento en cualquier momento con el botón «Preferencias de cookies» de esta página o del pie del sitio. Al retirarlo, las cookies de Google Analytics se eliminan.",
          "También puedes bloquear o borrar las cookies desde la configuración de tu navegador. Si bloqueas las necesarias, es posible que el sitio no recuerde tu idioma.",
          "El sitio no usa cookies publicitarias ni de redes sociales. Las fuentes tipográficas se sirven desde el propio dominio, sin contactar a terceros.",
        ],
      },
    ],
  },
  terms: {
    title: "Aviso legal y términos de uso",
    description: "Condiciones de uso de fcophox.com y titularidad de sus contenidos.",
    intro:
      "Al navegar por fcophox.com aceptas estas condiciones. Si no estás de acuerdo con ellas, te pido que no uses el sitio.",
    sections: [
      {
        heading: "1. Titular del sitio",
        blocks: [
          `fcophox.com es el sitio profesional de Francisco Hormazábal (fcophox), consultor independiente en UX Engineering y diseño de producto, con domicilio en Chile. Contacto: ${LEGAL_EMAIL}.`,
        ],
      },
      {
        heading: "2. Propiedad intelectual",
        blocks: [
          "Los textos, diseños, imágenes, código y casos de estudio publicados son obra mía o se usan con permiso de sus titulares, y están protegidos por la legislación de propiedad intelectual. Puedes citarlos brevemente con enlace a la fuente. Cualquier otra reproducción, distribución o uso comercial requiere autorización previa por escrito.",
          "Las marcas, logotipos y nombres de clientes o empresas que aparecen en los casos de estudio pertenecen a sus respectivos titulares y se mencionan sólo con fines descriptivos.",
          "Los recursos y prompts de la sección de recursos se ofrecen para uso personal y profesional; no está permitido revenderlos ni redistribuirlos como propios.",
        ],
      },
      {
        heading: "3. Uso del sitio",
        blocks: [
          "Te comprometes a no usar el sitio ni sus formularios para enviar spam, contenido ilícito o código malicioso, ni a intentar acceder a partes no públicas del sistema.",
        ],
      },
      {
        heading: "4. Responsabilidad",
        blocks: [
          "El contenido del blog y de los recursos es informativo y refleja mi experiencia profesional; no constituye asesoría para un caso concreto. Procuro que sea exacto y esté actualizado, pero no garantizo que esté libre de errores.",
          "El sitio contiene enlaces a sitios de terceros sobre cuyo contenido y políticas no tengo control. Tampoco garantizo la disponibilidad ininterrumpida del sitio.",
        ],
      },
      {
        heading: "5. Ley aplicable",
        blocks: [
          "Estas condiciones se rigen por la legislación chilena. Si eres consumidor, conservas los derechos que te reconozca la ley de tu país de residencia.",
        ],
      },
    ],
  },
};

const en: Record<LegalSlug, LegalDoc> = {
  privacy: {
    title: "Privacy policy",
    description: "What personal data fcophox.com processes, why, and how to exercise your rights.",
    intro:
      "This policy explains what personal data is collected when you visit fcophox.com or contact me through its forms, what it is used for, who it is shared with and what rights you have over it.",
    sections: [
      {
        heading: "1. Data controller",
        blocks: [
          `The controller is Francisco Hormazábal (fcophox), an independent UX and product design consultant based in Chile. For anything related to your data, write to ${LEGAL_EMAIL}.`,
        ],
      },
      {
        heading: "2. What I collect and why",
        blocks: [
          {
            table: {
              head: ["Source", "Data", "Purpose", "Legal basis"],
              rows: [
                [
                  "Contact, consulting and booking forms",
                  "Name, email, message and any details you choose to share (project type, budget, meeting date and time)",
                  "Replying to your enquiry, preparing a proposal and scheduling meetings",
                  "Your consent when submitting the form, and steps taken at your request prior to a contract",
                ],
                [
                  "Google Analytics (only if you accept)",
                  "Pages visited, duration, device, browser, approximate location and a random cookie identifier. IP addresses are anonymised and not stored",
                  "Measuring in aggregate which content is useful and improving the site",
                  "Your consent, which you can withdraw at any time",
                ],
                [
                  "Server logs",
                  "IP address, date and time, requested URL and user agent",
                  "Security, abuse prevention and error diagnosis",
                  "Legitimate interest in keeping the site secure and running",
                ],
              ],
            },
          },
          "I do not make automated decisions or build profiles with legal effects on you, I do not sell your data and I do not use it for advertising. The site is not aimed at children under 14 and I do not knowingly collect their data.",
        ],
      },
      {
        heading: "3. Who it is shared with",
        blocks: [
          "Only with providers that process it on my behalf, under contract, so the site can run:",
          {
            list: [
              "Vercel Inc. (USA): site hosting and server logs.",
              "Resend (USA): sending the email notification when you submit a form.",
              "Kontorōru: content manager and inbox where form messages are stored.",
              "Google (Gmail and, if you accept, Google Analytics — Google LLC/Google Ireland Ltd.): receiving contact notifications and audience measurement.",
            ],
          },
          "Some of these providers are located outside Chile and the European Economic Area. Those transfers rely on standard contractual clauses or, where the provider is certified, the EU–US Data Privacy Framework. I will also share data with authorities when legally required to.",
        ],
      },
      {
        heading: "4. How long it is kept",
        blocks: [
          {
            list: [
              "Form messages: up to 24 months after the last contact, unless a professional engagement begins, in which case they are kept as long as tax and contract law require.",
              "Google Analytics data: 14 months, after which it is deleted automatically.",
              "Server logs: the hosting provider's retention period, usually days or a few weeks.",
            ],
          },
        ],
      },
      {
        heading: "5. Your rights",
        blocks: [
          "At any time and free of charge, you can exercise your rights to:",
          {
            list: [
              "Access: know what data of yours I process.",
              "Rectification: correct inaccurate or incomplete data.",
              "Erasure: have it deleted.",
              "Object to or restrict processing.",
              "Portability: receive your data in a structured, commonly used format.",
              "Withdraw your consent, without affecting the lawfulness of prior processing.",
            ],
          },
          `Write to ${LEGAL_EMAIL} stating which right you want to exercise. I will reply within 30 days at most. If you feel your request was not handled properly, you can complain to the supervisory authority: in Chile, the Agencia de Protección de Datos Personales; in the EU, the authority of your country.`,
        ],
      },
      {
        heading: "6. Security",
        blocks: [
          "The site is always served over HTTPS, service credentials never reach the browser and access to messages is limited to me. No system is infallible: if a breach affecting your data occurred, I would inform you and notify the authority within the legal deadlines.",
        ],
      },
      {
        heading: "7. Changes to this policy",
        blocks: [
          "If this policy changes materially, I will update the date above and, where appropriate, ask for your consent again.",
        ],
      },
    ],
  },
  cookies: {
    title: "Cookie policy",
    description: "Which cookies and local storage fcophox.com uses and how to manage them.",
    intro:
      "Cookies and local storage are small pieces of data the site keeps in your browser. All of the ones fcophox.com uses are listed here. Those that are not strictly necessary are only enabled if you accept them, and you can change your choice whenever you like.",
    sections: [
      {
        heading: "Strictly necessary",
        blocks: [
          "They make the site work or remember a choice you made. They do not require consent and cannot identify you.",
          {
            table: {
              head: ["Name", "Type", "Purpose", "Duration"],
              rows: [
                ["NEXT_LOCALE", "First-party cookie", "Remember your chosen language", "1 year"],
                ["cookie-consent", "Local storage", "Remember your cookie preferences", "Until you clear it"],
                ["resources_unlocked", "Local storage", "Remember that you unlocked the resources section", "Until you clear it"],
                ["liked_kontororu_*", "Local storage", "Remember that you marked an article as helpful, so it is not counted twice", "Until you clear it"],
              ],
            },
          },
        ],
      },
      {
        heading: "Analytics (optional)",
        blocks: [
          "Only set if you accept them. They are set by Google Analytics 4 to count visits in aggregate.",
          {
            table: {
              head: ["Name", "Provider", "Purpose", "Duration"],
              rows: [
                ["_ga", "Google", "Distinguish visitors with a random identifier", "2 years"],
                ["_ga_N30VCBN4MR", "Google", "Persist session state", "2 years"],
              ],
            },
          },
          "More information in Google's privacy policy: https://policies.google.com/privacy. You can also install the Google Analytics opt-out add-on: https://tools.google.com/dlpage/gaoptout.",
        ],
      },
      {
        heading: "How to manage them",
        blocks: [
          "You can change or withdraw your consent at any time with the “Cookie preferences” button on this page or in the site footer. When you withdraw it, the Google Analytics cookies are deleted.",
          "You can also block or delete cookies in your browser settings. If you block the necessary ones, the site may not remember your language.",
          "The site uses no advertising or social media cookies. Fonts are served from the site's own domain, without contacting third parties.",
        ],
      },
    ],
  },
  terms: {
    title: "Legal notice and terms of use",
    description: "Terms of use of fcophox.com and ownership of its content.",
    intro:
      "By browsing fcophox.com you accept these terms. If you do not agree with them, please do not use the site.",
    sections: [
      {
        heading: "1. Site owner",
        blocks: [
          `fcophox.com is the professional website of Francisco Hormazábal (fcophox), an independent UX Engineering and product design consultant based in Chile. Contact: ${LEGAL_EMAIL}.`,
        ],
      },
      {
        heading: "2. Intellectual property",
        blocks: [
          "The texts, designs, images, code and case studies published here are my own work or are used with their owners' permission, and are protected by intellectual property law. You may quote them briefly with a link to the source. Any other reproduction, distribution or commercial use requires prior written permission.",
          "Brands, logos and names of clients or companies shown in case studies belong to their respective owners and are mentioned for descriptive purposes only.",
          "The resources and prompts in the resources section are offered for personal and professional use; reselling them or redistributing them as your own is not allowed.",
        ],
      },
      {
        heading: "3. Use of the site",
        blocks: [
          "You agree not to use the site or its forms to send spam, unlawful content or malicious code, nor to attempt to access non-public parts of the system.",
        ],
      },
      {
        heading: "4. Liability",
        blocks: [
          "Blog and resource content is informational and reflects my professional experience; it is not advice for any specific case. I aim to keep it accurate and up to date, but I do not guarantee it is error-free.",
          "The site links to third-party sites whose content and policies I do not control. I also do not guarantee uninterrupted availability of the site.",
        ],
      },
      {
        heading: "5. Governing law",
        blocks: [
          "These terms are governed by Chilean law. If you are a consumer, you keep any rights granted to you by the law of your country of residence.",
        ],
      },
    ],
  },
};

export function getLegalDoc(slug: LegalSlug, locale: string): LegalDoc {
  return (locale === "en" ? en : es)[slug];
}
