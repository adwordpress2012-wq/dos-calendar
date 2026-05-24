"use client";

import { Moon, Sun } from "lucide-react";
import type { DemoTheme } from "@/components/calendarTypes";

type ThemeToggleProps = {
  theme: DemoTheme;
  onChange: (theme: DemoTheme) => void;
};

export function ThemeToggle({ theme, onChange }: ThemeToggleProps) {
  const isNight = theme === "night";

  return (
    <div
      className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      role="group"
      aria-label="Theme"
    >
      <button
        type="button"
        onClick={() => onChange("day")}
        aria-pressed={!isNight}
        className={`touch-target inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-black transition-all ${
          !isNight
            ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-md shadow-blue-500/25"
            : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
        }`}
      >
        <Sun size={18} aria-hidden="true" />
        <span className="hidden sm:inline">Day</span>
      </button>
      <button
        type="button"
        onClick={() => onChange("night")}
        aria-pressed={isNight}
        className={`touch-target inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-black transition-all ${
          isNight
            ? "bg-gradient-to-r from-purple-600 to-slate-800 text-white shadow-md shadow-purple-600/30"
            : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
        }`}
      >
        <Moon size={18} aria-hidden="true" />
        <span className="hidden sm:inline">Night</span>
      </button>
    </div>
  );
}
