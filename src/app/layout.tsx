import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist } from "next/font/google";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { PageTransition } from "@/components/layout/PageTransition";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { themeScript } from "@/components/layout/ThemeToggle";
import { TreasureToaster } from "@/components/treasure/toast";
import { TreasureKeyTrigger } from "@/components/treasure/TreasureTrigger";
import { site } from "@/content/site";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["wdth"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "fr_CH",
    siteName: site.fullName,
  },
};

export const viewport: Viewport = {
  themeColor: "#120a1c",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr-CH"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${bricolage.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body id="top" className="flex min-h-full flex-col">
        <a
          href="#contenu"
          className="fixed top-3 left-3 z-[100] -translate-y-24 rounded-full bg-coral px-5 py-3 font-semibold text-night transition-transform focus:translate-y-0"
        >
          Aller au contenu
        </a>
        <MotionProvider>
          <ScrollProgress />
          <Header />
          <main id="contenu" className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <CustomCursor />
          <TreasureKeyTrigger />
          <TreasureToaster />
        </MotionProvider>
      </body>
    </html>
  );
}
