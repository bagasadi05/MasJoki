import { ViewTransition } from "react";

/**
 * `<main>` yang dianimasikan saat berpindah halaman lewat View Transitions
 * bawaan browser (React 19.3) — tanpa pustaka animasi, tanpa JavaScript tambahan.
 *
 * Gerakannya "lembar nota baru": halaman lama memudar cepat, halaman baru masuk
 * dengan sedikit terangkat. Sengaja bukan geser horizontal ala aplikasi, karena
 * perpindahan posisi adalah pemicu motion sickness paling umum dan tidak cocok
 * dengan metafora kertas.
 *
 * Halaman yang belum memakai komponen ini tetap tampil normal, hanya tanpa animasi.
 */
export function TransisiHalaman({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <ViewTransition enter="halaman-masuk" exit="halaman-keluar">
      <main id={id} className={className}>
        {children}
      </main>
    </ViewTransition>
  );
}
