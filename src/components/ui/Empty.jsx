import { DISPLAY } from "../../styles/fonts";

export function Empty({ icon, title, sub, action }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: 44, marginBottom: 14 }}>{icon}</div>
      <h3 style={{ fontSize: 17, fontWeight: 600, fontFamily: DISPLAY, marginBottom: 6 }}>{title}</h3>
      <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 18 }}>{sub}</p>
      {action}
    </div>
  );
}
