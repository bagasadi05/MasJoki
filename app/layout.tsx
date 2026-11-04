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
    "Parafrase, humanisasi teks, makalah, PowerPoint, artikel jurnal, sampai rapikan Word. Masukkan jumlah halaman, lihat totalnya sebelum chat.",
  keywords: [
    "jasa parafrase",
    "jasa makalah",
    "jasa powerpoint",
    "rapikan file word",
    "jasa artikel jurnal",
    "bantuan tugas mahasiswa",
  ],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Mas Joki",
    title: "Mas Joki — Bantuan tugas, harga kelihatan di awal",
    description:
      "Hitung sendiri biaya parafrase, makalah, PowerPoint, dan artikel jurnal. Tanpa nunggu balasan chat.",
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
    <html lang="id" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-dvh bg-paper font-sans text-ink antialiased">
        {children}
        <WaMelayang />
      </body>
    </html>
  );
}
