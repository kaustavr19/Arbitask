import { PROJECT_COLORS } from "../constants";

export function buildThemeVars(mode, atmId, pcId) {
  const pc = PROJECT_COLORS.find(c => c.id === pcId) || PROJECT_COLORS[0];
  const dk = mode === "dark";
  return {
    "--surface": dk ? "rgba(22,22,26,0.88)" : "rgba(255,255,255,0.88)",
    "--surface2": dk ? "rgba(30,30,36,0.92)" : "rgba(240,240,244,0.92)",
    "--surface3": dk ? "rgba(42,42,50,0.92)" : "rgba(228,228,235,0.92)",
    "--surface-modal": dk ? "#252530" : "#fcfcfe",
    "--glass": dk ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
    "--border": dk ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
    "--border2": dk ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
    "--border-modal": dk ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.13)",
    "--text": dk ? "#EDEDEF" : "#1A1A1E",
    "--text2": dk ? "#94949E" : "#6B6B76",
    "--text3": dk ? "#5A5A66" : "#9A9AA6",
    "--accent": pc.hex,
    "--accent-soft": pc.hex + (dk ? "18" : "14"),
    "--accent-glow": pc.hex + "22",
    "--accent-text": dk ? pc.hex : pc.lightText,
    "--shadow": dk ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.08)",
    "--backdrop-val": dk ? "blur(16px) saturate(1.4)" : "blur(16px) saturate(1.2)",
    "--st-idea": "#EAB308", "--st-planned": "#6366F1", "--st-in_progress": "#F97316",
    "--st-blocked": "#EF4444", "--st-done": "#22C55E", "--st-archived": "#71717A",
  };
}

export const stC = (id) => `var(--st-${id})`;
