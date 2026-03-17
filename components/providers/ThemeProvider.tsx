"use client";

import { createContext, useContext, useState, useCallback, ReactNode, CSSProperties } from "react";
import { buildThemeVars, stC, ThemeMode } from "@/lib/theme";

interface ThemeCtx {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  cycleMode: () => void;
  stC: (id: string) => string;
}

const ThemeContext = createContext<ThemeCtx | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}

const MODE_ORDER: ThemeMode[] = ["dark", "light", "eye"];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("dark");

  const cycleMode = useCallback(() => {
    setMode((m) => {
      const i = MODE_ORDER.indexOf(m);
      return MODE_ORDER[(i + 1) % MODE_ORDER.length];
    });
  }, []);

  const themeVars = buildThemeVars(mode);

  const bg =
    mode === "light"
      ? "#F7F6F3"
      : mode === "eye"
      ? "#F4EBDA"
      : "#100F0D";

  // Subtle ambient orbs — per mode
  const orbs =
    mode === "dark" ? (
      <>
        {/* Top-right warm orange bloom */}
        <div style={{ position: "fixed", top: -160, right: -80, width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,97,10,0.13) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
        {/* Bottom-left cool amber counter-glow */}
        <div style={{ position: "fixed", bottom: -200, left: 80, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(180,60,5,0.07) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
        {/* Center-right faint mid-bloom */}
        <div style={{ position: "fixed", top: "35%", right: "20%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(240,112,32,0.04) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      </>
    ) : mode === "light" ? (
      <>
        <div style={{ position: "fixed", top: -120, right: -60, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(196,72,0,0.07) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "fixed", bottom: -180, left: 60, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(196,72,0,0.04) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
      </>
    ) : (
      <>
        <div style={{ position: "fixed", top: -100, right: -40, width: 440, height: 440, borderRadius: "50%", background: "radial-gradient(circle, rgba(140,54,0,0.09) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "fixed", bottom: -160, left: 40, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(140,54,0,0.05) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
      </>
    );

  return (
    <ThemeContext.Provider value={{ mode, setMode, cycleMode, stC }}>
      <div
        style={{
          ...(themeVars as CSSProperties),
          height: "100vh",
          display: "flex",
          overflow: "hidden",
          position: "relative",
          background: bg,
          color: "var(--text)",
        }}
      >
        {orbs}
        <div style={{ position: "relative", display: "flex", width: "100%", height: "100%", zIndex: 1 }}>
          {children}
        </div>
      </div>
    </ThemeContext.Provider>
  );
}
