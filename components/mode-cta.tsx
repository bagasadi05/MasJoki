"use client";

import { useCalculator, scrollKeKalkulator } from "./calculator-context";

export function ModeCta({
  mode,
  className,
  children,
}: {
  mode: "hitung" | "penawaran";
  className?: string;
  children: React.ReactNode;
}) {
  const { setMode } = useCalculator();

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        setMode(mode);
        scrollKeKalkulator();
      }}
    >
      {children}
    </button>
  );
}
