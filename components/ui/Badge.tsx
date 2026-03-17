import { CSSProperties, ReactNode } from "react";

export function Badge({ children, color, style = {} }: { children: ReactNode; color?: string; style?: CSSProperties }) {
  const c = color || "var(--accent)";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 9px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: 0,
        background: c + "18",
        color: c,
        border: `1px solid ${c}28`,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
