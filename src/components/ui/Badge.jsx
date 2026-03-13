import { BODY } from "../../styles/fonts";

export function Badge({ children, color, style = {} }) {
  const c = color || "var(--accent)";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: .2, background: c + "18", color: c, border: `1px solid ${c}28`, fontFamily: BODY, ...style }}>
      {children}
    </span>
  );
}
