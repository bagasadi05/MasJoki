"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("color-scheme");
    const systemIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const darkActive =
      stored === "dark" ||
      (!stored && systemIsDark) ||
      document.documentElement.classList.contains("dark");

    setIsDark(darkActive);
    if (darkActive) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Media query listener
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = (e: MediaQueryListEvent) => {
      const currentStored = localStorage.getItem("color-scheme");
      if (!currentStored || currentStored === "light dark") {
        setIsDark(e.matches);
        if (e.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };
    mql.addEventListener("change", handleMediaChange);

    // Multi-tab storage sync
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "color-scheme") {
        const val = e.newValue;
        const newDark =
          val === "dark" ||
          (!val && window.matchMedia("(prefers-color-scheme: dark)").matches);
        setIsDark(newDark);
        if (newDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      mql.removeEventListener("change", handleMediaChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);

    const systemIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const meta = document.querySelector('meta[name="color-scheme"]');

    if (nextDark) {
      document.documentElement.classList.add("dark");
      if (systemIsDark) {
        // Target matches system preference, so remove stored value per modern-web-guidance
        localStorage.removeItem("color-scheme");
        if (meta) meta.setAttribute("content", "light dark");
      } else {
        localStorage.setItem("color-scheme", "dark");
        if (meta) meta.setAttribute("content", "dark");
      }
    } else {
      document.documentElement.classList.remove("dark");
      if (!systemIsDark) {
        // Target matches system preference, so remove stored value per modern-web-guidance
        localStorage.removeItem("color-scheme");
        if (meta) meta.setAttribute("content", "light dark");
      } else {
        localStorage.setItem("color-scheme", "light");
        if (meta) meta.setAttribute("content", "light");
      }
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        mounted
          ? isDark
            ? "Beralih ke mode terang"
            : "Beralih ke mode gelap"
          : "Ganti mode tema"
      }
      title={mounted ? (isDark ? "Mode Terang" : "Mode Gelap") : "Ganti Tema"}
      className={`relative grid size-10 place-items-center rounded-xl border border-line bg-paper-2 text-ink-soft transition duration-200 hover:border-brand/40 hover:bg-brand-soft hover:text-brand active:scale-95 cursor-pointer ${className}`}
    >
      {mounted ? (
        isDark ? (
          <Sun className="size-4.5 text-amber transition-transform duration-300 rotate-0 scale-100" />
        ) : (
          <Moon className="size-4.5 text-ink-soft transition-transform duration-300 rotate-0 scale-100" />
        )
      ) : (
        <span className="size-4.5 block" />
      )}
    </button>
  );
}
