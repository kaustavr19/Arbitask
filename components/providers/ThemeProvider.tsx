"use client";

import { createContext, useContext, useState, useCallback, ReactNode, CSSProperties } from "react";
import { buildThemeVars, stC } from "@/lib/theme";
import { ATMOSPHERES, PROJECT_COLORS } from "@/lib/constants";

type Mode = "dark" | "light";

interface ThemeCtx {
  mode: Mode;
  atmosphere: string;
  projectColorId: string;
  setMode: (m: Mode) => void;
  setAtmosphere: (a: string) => void;
  setProjectColorId: (id: string) => void;
  toggleMode: () => void;
  stC: (id: string) => string;
}

const ThemeContext = createContext<ThemeCtx | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("dark");
  const [atmosphere, setAtmosphere] = useState("ocean");
  const [projectColorId, setProjectColorId] = useState("rose");

  const toggleMode = useCallback(() => setMode((m) => (m === "dark" ? "light" : "dark")), []);

  const themeVars = buildThemeVars(mode, atmosphere, projectColorId);
  const atmObj = ATMOSPHERES.find((a) => a.id === atmosphere) || ATMOSPHERES[0];
  const bgGrad = mode === "dark" ? atmObj.darkGrad : atmObj.lightGrad;

  return (
    <ThemeContext.Provider
      value={{ mode, atmosphere, projectColorId, setMode, setAtmosphere, setProjectColorId, toggleMode, stC }}
    >
      <div
        style={{
          ...(themeVars as CSSProperties),
          height: "100vh",
          display: "flex",
          overflow: "hidden",
          position: "relative",
          color: "var(--text)",
        }}
      >
        {/* Atmospheric background */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            background: bgGrad,
            transition: "background .6s ease",
          }}
        />
        <div style={{ position: "relative", zIndex: 1, display: "flex", width: "100%", height: "100%" }}>
          {children}
        </div>
      </div>
    </ThemeContext.Provider>
  );
}
