import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import { SITE_URL } from "@/lib/config";
import { CalculatorProvider } from "@/components/calculator-context";
import { MobileStickyBar } from "@/components/mobile-sticky-bar";
import { WaMelayang } from "@/components/wa-melayang";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mas Joki — Bantuan tugas, harga kelihatan di awal",
    template: "%s · Mas Joki",
  },
  description:
    "Parafrase, humanisasi teks AI, makalah, PowerPoint, artikel jurnal, sampai rapikan Word. Masukkan jumlah halaman, lihat totalnya sebelum chat.",
  keywords: [
    "jasa parafrase",
    "jasa makalah",
    "jasa powerpoint",
    "rapikan file word",
    "jasa artikel jurnal",
    "penurunan turnitin",
    "bantuan tugas mahasiswa",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Mas Joki",
    url: SITE_URL,
    title: "Mas Joki — Bantuan tugas, harga kelihatan di awal",
    description:
      "Hitung sendiri biaya parafrase, makalah, PowerPoint, artikel jurnal, dan penurunan Turnitin. Tanpa nunggu balasan chat.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mas Joki — Bantuan tugas, harga kelihatan di awal",
    description:
      "Hitung sendiri biaya parafrase, makalah, PowerPoint, artikel jurnal, dan penurunan Turnitin. Tanpa nunggu balasan chat.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfbf7" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1120" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${display.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="light dark" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem("color-scheme");var m=document.querySelector('meta[name="color-scheme"]');var d=false;if(s==="dark"){d=true;if(m)m.content="dark";}else if(s==="light"){d=false;if(m)m.content="light";}else{d=window.matchMedia("(prefers-color-scheme: dark)").matches;if(m)m.content="light dark";}if(d){document.documentElement.classList.add("dark");}else{document.documentElement.classList.remove("dark");}}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className="min-h-dvh bg-paper font-sans text-ink antialiased pb-24 lg:pb-0"
        suppressHydrationWarning
      >
        <a
          href="#konten"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-paper"
        >
          Lewati ke konten
        </a>
        <CalculatorProvider>
          {children}
          <MobileStickyBar />
          <WaMelayang />
          <Analytics />
        </CalculatorProvider>
      </body>
    </html>
  );
}
