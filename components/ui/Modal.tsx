"use client";

import { ReactNode } from "react";

export function Modal({ open, onClose, title, children, wide, fullscreen }: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  wide?: boolean;
  fullscreen?: boolean;
}) {
  if (!open) return null;
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: fullscreen ? "stretch" : "center", justifyContent: fullscreen ? "stretch" : "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      <div
        className="fi"
        onClick={(e) => e.stopPropagation()}
        style={fullscreen
          ? { background: "var(--surface-modal)", border: "1px solid var(--border-modal)", borderRadius: 0, padding: 28, width: "100%", height: "100%", display: "flex", flexDirection: "column", boxShadow: "none", overflow: "hidden" }
          : { background: "var(--surface-modal)", border: "1px solid var(--border-modal)", borderRadius: 14, padding: 26, width: wide ? 660 : 460, maxWidth: "94vw", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 8px 40px var(--shadow)" }}
      >
        {title && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>{title}</h2>
            <button onClick={onClose} style={{ background: "var(--surface3)", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 13, padding: "5px 9px", borderRadius: 6, fontWeight: 500 }}>✕</button>
          </div>
        )}
        <div style={fullscreen ? { flex: 1, display: "flex", flexDirection: "column", minHeight: 0 } : {}}>
          {children}
        </div>
      </div>
    </div>
  );
}
