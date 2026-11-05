import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import { WaMelayang } from "@/components/wa-melayang";
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
    icon: "/mas-joki.jpg",
    apple: "/mas-joki.jpg",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Mas Joki",
    title: "Mas Joki — Bantuan tugas, harga kelihatan di awal",
    description:
      "Hitung sendiri biaya parafrase, makalah, PowerPoint, artikel jurnal, dan penurunan Turnitin. Tanpa nunggu balasan chat.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#fbfaf6",
  colorScheme: "light",
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
      <body
        className="min-h-dvh bg-paper font-sans text-ink antialiased"
        suppressHydrationWarning
      >
        <a
          href="#konten"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-[0.82rem] focus:font-semibold focus:text-paper"
        >
          Lewati ke konten
        </a>
        {children}
        <WaMelayang />
      </body>
    </html>
  );
}
