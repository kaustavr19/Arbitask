import { BODY, DISPLAY } from "../../styles/fonts";

export function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null;
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      <div
        className="fi"
        onClick={e => e.stopPropagation()}
        style={{ background: "var(--surface-modal)", border: "2px solid var(--border-modal)", borderRadius: 18, padding: 28, width: wide ? 680 : 480, maxWidth: "94vw", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 8px 32px rgba(0,0,0,0.3), 0 24px 80px rgba(0,0,0,0.25), 0 0 0 1px var(--border-modal)" }}
      >
        {title && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, fontFamily: DISPLAY }}>{title}</h2>
            <button onClick={onClose} style={{ background: "var(--surface3)", border: "none", color: "var(--text2)", cursor: "pointer", fontSize: 14, padding: "6px 10px", borderRadius: 8, fontWeight: 600 }}>✕</button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
