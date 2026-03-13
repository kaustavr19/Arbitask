import { useState, useEffect, useRef } from "react";
import { BODY } from "../styles/fonts";
import { SLASH_COMMANDS } from "../constants";

export function SlashMenu({ position, filter, onSelect, onClose }) {
  const [ai, setAi] = useState(0);
  const filtered = SLASH_COMMANDS.filter(c =>
    c.label.toLowerCase().includes(filter.toLowerCase()) ||
    c.desc.toLowerCase().includes(filter.toLowerCase())
  );
  const ref = useRef(null);

  useEffect(() => { setAi(0); }, [filter]);

  useEffect(() => {
    const h = e => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
      else if (e.key === "ArrowDown") { e.preventDefault(); setAi(i => Math.min(i + 1, filtered.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setAi(i => Math.max(i - 1, 0)); }
      else if (e.key === "Enter" && filtered[ai]) { e.preventDefault(); onSelect(filtered[ai]); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [filtered, ai, onSelect, onClose]);

  if (!filtered.length) return null;

  return (
    <div className="sm" ref={ref} style={{ left: position.x, top: position.y }}>
      {filtered.map((cmd, i) => (
        <button
          key={cmd.id}
          className={`si ${i === ai ? "ac" : ""}`}
          onMouseEnter={() => setAi(i)}
          onClick={() => onSelect(cmd)}
        >
          <span className="sic">{cmd.icon}</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{cmd.label}</div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 1 }}>{cmd.desc}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
