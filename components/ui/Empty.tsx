import { ReactNode } from "react";

const DISPLAY = `'Bricolage Grotesque', serif`;

export function Empty({ icon, title, sub, action }: { icon: string; title: string; sub: string; action?: ReactNode }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: 44, marginBottom: 14 }}>{icon}</div>
      <h3 style={{ fontSize: 17, fontWeight: 600, fontFamily: DISPLAY, marginBottom: 6, color: "var(--text)" }}>{title}</h3>
      <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 18 }}>{sub}</p>
      {action}
    </div>
  );
}
