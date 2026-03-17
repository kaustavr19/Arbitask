export type ThemeMode = "dark" | "light" | "eye";

export function buildThemeVars(mode: ThemeMode): Record<string, string> {

  if (mode === "light") {
    return {
      "--bg":           "#F7F6F3",   // warm off-white, not clinical white
      "--surface":      "#FFFFFF",
      "--surface2":     "#F1F0EC",
      "--surface3":     "#E8E6E0",
      "--surface-modal":"#FFFFFF",
      "--glass":        "rgba(0,0,0,0.02)",
      "--border":       "rgba(30,20,10,0.09)",
      "--border2":      "rgba(30,20,10,0.14)",
      "--border-modal": "rgba(30,20,10,0.12)",
      "--text":         "#17120A",   // warm near-black — 16:1 on white
      "--text2":        "#6B5E4E",   // warm mid-brown — 5.5:1 on white ✓
      "--text3":        "#A89880",   // warm light — used sparingly
      "--accent":       "#C44800",   // deep burnt orange — 5.9:1 on white ✓
      "--accent-soft":  "#C4480014",
      "--accent-glow":  "#C4480022",
      "--accent-text":  "#B04000",   // even deeper for text on tinted bg
      "--shadow":       "rgba(40,20,5,0.09)",
      "--shadow-lg":    "rgba(40,20,5,0.18)",
      "--backdrop-val": "blur(14px) saturate(1.2)",
      "--st-idea":      "#B45309",
      "--st-planned":   "#4F46E5",
      "--st-in_progress":"#C2410C",
      "--st-blocked":   "#B91C1C",
      "--st-done":      "#15803D",
      "--st-archived":  "#78716C",
    };
  }

  if (mode === "eye") {
    return {
      "--bg":           "#F4EBDA",   // warm parchment
      "--surface":      "#EFE4CF",
      "--surface2":     "#E5D8BE",
      "--surface3":     "#D8C9A8",
      "--surface-modal":"#F4EBDA",
      "--glass":        "rgba(80,45,10,0.04)",
      "--border":       "rgba(90,55,15,0.14)",
      "--border2":      "rgba(90,55,15,0.22)",
      "--border-modal": "rgba(90,55,15,0.18)",
      "--text":         "#211508",   // very dark warm — 12:1 on parchment ✓
      "--text2":        "#5A3A18",   // warm brown — 5.8:1 ✓
      "--text3":        "#8C6030",   // mid warm — used sparingly
      "--accent":       "#8C3600",   // deep orange on warm bg — 5.2:1 ✓
      "--accent-soft":  "#8C360016",
      "--accent-glow":  "#8C360024",
      "--accent-text":  "#7A2E00",
      "--shadow":       "rgba(60,30,5,0.14)",
      "--shadow-lg":    "rgba(60,30,5,0.26)",
      "--backdrop-val": "blur(12px) saturate(1.0)",
      "--st-idea":      "#92400E",
      "--st-planned":   "#4338CA",
      "--st-in_progress":"#9A3412",
      "--st-blocked":   "#991B1B",
      "--st-done":      "#14532D",
      "--st-archived":  "#57534E",
    };
  }

  // dark — warm dark, not cold blue-gray
  return {
    "--bg":           "#100F0D",   // very dark warm
    "--surface":      "#171512",   // sidebar — dark warm
    "--surface2":     "#1F1D19",   // cards, inputs
    "--surface3":     "#272420",   // hover, active states
    "--surface-modal":"#1B1916",
    "--glass":        "rgba(255,240,220,0.03)",
    "--border":       "rgba(255,240,220,0.08)",
    "--border2":      "rgba(255,240,220,0.13)",
    "--border-modal": "rgba(255,240,220,0.14)",
    "--text":         "#F0EBE3",   // warm white — max readability
    "--text2":        "#8C8070",   // warm mid — 4.8:1 on surface ✓
    "--text3":        "#4A4440",   // dark warm — used sparingly
    "--accent":       "#E8610A",   // vibrant warm orange
    "--accent-soft":  "#E8610A1A",
    "--accent-glow":  "#E8610A2A",
    "--accent-text":  "#FF9055",   // light orange for text on dark — 5.2:1 ✓
    "--shadow":       "rgba(0,0,0,0.55)",
    "--shadow-lg":    "rgba(0,0,0,0.75)",
    "--backdrop-val": "blur(16px) saturate(1.4)",
    "--st-idea":      "#F59E0B",
    "--st-planned":   "#818CF8",
    "--st-in_progress":"#FB923C",
    "--st-blocked":   "#F87171",
    "--st-done":      "#4ADE80",
    "--st-archived":  "#78716C",
  };
}

export const stC = (id: string) => `var(--st-${id})`;
