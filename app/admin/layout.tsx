import type { Metadata } from "next";

/**
 * Halaman admin tidak untuk diindeks: berisi alat internal pengelola dan tidak
 * punya nilai pencarian. `follow: false` mencegah crawler menelusuri tautan
 * balik dari halaman ini.
 */
export const metadata: Metadata = {
  title: { default: "Mas Joki", template: "%s — Mas Joki" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
