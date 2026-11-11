import type { Metadata } from "next";

/**
 * Halaman auth tidak untuk diindeks: isinya formulir pribadi dan tidak punya
 * nilai pencarian. `follow: false` juga mencegah crawler menelusuri tautan
 * balik ke halaman lain dari sini.
 */
export const metadata: Metadata = {
  title: "Masuk",
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
