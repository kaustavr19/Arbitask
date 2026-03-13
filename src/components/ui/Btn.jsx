import { BODY } from "../../styles/fonts";

export function Btn({ children, onClick, variant = "primary", size = "md", style = {}, disabled }) {
  const b = { fontFamily: BODY, fontWeight: 600, border: "none", cursor: disabled ? "not-allowed" : "pointer", borderRadius: 10, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all .2s", opacity: disabled ? .4 : 1, fontSize: size === "sm" ? 12 : size === "lg" ? 15 : 13, padding: size === "sm" ? "6px 12px" : size === "lg" ? "14px 28px" : "10px 18px" };
  const v = {
    primary: { background: "var(--accent)", color: "#FFF", boxShadow: disabled ? "none" : "0 2px 8px var(--accent-glow)" },
    secondary: { background: "var(--surface3)", color: "var(--text)", border: "1px solid var(--border2)" },
    ghost: { background: "transparent", color: "var(--text2)" },
    danger: { background: "#EF444420", color: "#EF4444", border: "1px solid #EF444444" },
  };
  return (
    <button
      style={{ ...b, ...v[variant], ...style }}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = "translateY(-1px)" }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none" }}
    >
      {children}
    </button>
  );
}
