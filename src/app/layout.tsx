import type { Metadata } from "next";
import { Sansation, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./tiptap-content.css";
import { ThemeProvider } from "@/components/theme-provider";

import { ConsentedAnalytics, CookieConsent, TesutoConsent, TesutoPageview } from "@/components/cookie-consent";


const sansation = Sansation({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { getTranslations, getLocale } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://fcophox.com'),
    title: {
      default: t('defaultTitle'),
      template: t('templateTitle'),
    },
    description: t('description'),
    openGraph: {
      title: t('defaultTitle'),
      description: t('description'),
      url: "/",
      siteName: "fcoPhox",
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      type: "website",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: t('ogAlt'),
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: t('defaultTitle'),
      description: t('description'),
      images: ["/og-image.jpg"],
    },
  };
}

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CustomCursor } from "@/components/custom-cursor";
import { HeaderBackground } from "@/components/header-background";
import { ChromaticEdge } from "@/components/chromatic-edge";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      /*
        `dark` también acá, no sólo vía ThemeProvider: el script de next-themes
        corre después de que el CSS ya aplicó, así que sin la clase el primer
        frame resolvería `--background` al valor claro de `:root` y el fondo
        parpadearía en blanco. next-themes sólo agrega y quita `light`/`dark`,
        los demás clases (las variables de fuentes) quedan intactas.
      */
      className={`dark ${sansation.variable} ${geistMono.variable} h-full antialiased`}
      /*
        El color de fondo de la web pintado en el propio documento, inline: es
        el respaldo para el primer frame de cualquier carga —antes de que llegue
        la hoja de estilos— y para el rebote del scroll, donde no hay ninguna
        sección que cubra. El literal es el `--background` de `.dark`; una vez
        el CSS está, el token manda.
      */
      style={{ backgroundColor: "var(--background, #101012)" }}
      suppressHydrationWarning
    >
      <head>
        {/*
          Tesuto (tests A/B). Va arriba del todo y en etiquetas crudas, no con
          next/script: el anti-flicker tiene que ocultar el documento antes del
          primer pintado y tesuto.js debe cargar síncrono para aplicar la
          variante sin parpadeo. Modifica la clase de <html> antes de hidratar;
          lo cubre el suppressHydrationWarning de arriba.
          Con data-consent="required" no crea cookies ni asigna variantes hasta
          que <TesutoConsent /> le pasa el consentimiento analítico.
        */}
        <style>{`.tesuto-hide{opacity:0 !important}`}</style>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,c,t){d.documentElement.className+=" "+c;w.tesutoHide={end:function(){d.documentElement.className=d.documentElement.className.replace(new RegExp("\\\\s?"+c+"\\\\b","g"),"")}};setTimeout(w.tesutoHide.end,t);w.tesuto=w.tesuto||function(){(w.tesuto.q=w.tesuto.q||[]).push(arguments)};})(window,document,"tesuto-hide",4000);`,
          }}
        />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://tesuto.fcophox.com/tesuto.js?id=TST-JTE36YR" data-consent="required" />
      </head>
      <body className="min-h-full overflow-x-hidden relative flex flex-col bg-background text-foreground transition-colors duration-300">
        <NextIntlClientProvider messages={messages}>
          {/*
            Dark only. `forcedTheme` pins the class rather than merely defaulting
            to it: the system preference is ignored and any setTheme call becomes
            a no-op, so there is no path back to the light palette. The ⌘B/Ctrl+B
            shortcut that used to flip it is unmounted — src/components/
            theme-shortcut.tsx and theme-toggle.tsx are now unused.
          */}
          <ThemeProvider
            attribute="class"
            forcedTheme="dark"
            disableTransitionOnChange
          >
            <CustomCursor />
            <HeaderBackground />
            <Navbar />
            <div className="flex-1 flex flex-col relative z-10">
              {children}
            </div>
            <Footer />
            <ChromaticEdge />
            <CookieConsent />
            <ConsentedAnalytics />
            <TesutoConsent />
            <TesutoPageview />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
