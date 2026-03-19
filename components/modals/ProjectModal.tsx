"use client";

import { useState } from "react";
import { PROJECT_ICONS, PROJECT_STATUSES, PROJECT_PRIORITIES } from "@/lib/constants";
import { Btn } from "@/components/ui";

type ProjectSaveData = {
  name: string;
  description: string;
  colorId: string;
  status: string;
  priority: string;
  startDate: string;
  targetDate: string;
};

interface ProjectModalProps {
  onClose: () => void;
  onSave: (data: ProjectSaveData) => Promise<void>;
  initialData?: { name: string; description: string; colorId: string; status?: string; priority?: string; startDate?: string; targetDate?: string };
}

export function ProjectModal({ onClose, onSave, initialData }: ProjectModalProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [summary, setSummary] = useState(initialData?.description || "");
  const [iconId, setIconId] = useState(initialData?.colorId || "rocket");
  const [status, setStatus] = useState(initialData?.status || "backlog");
  const [priority, setPriority] = useState(initialData?.priority || "no_priority");
  const [startDate, setStartDate] = useState(initialData?.startDate || "");
  const [targetDate, setTargetDate] = useState(initialData?.targetDate || "");
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const selectedIcon = PROJECT_ICONS.find((i) => i.id === iconId)?.emoji ?? "📦";

  const chipSelect: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 500,
    padding: "5px 12px",
    borderRadius: 20,
    border: "1px solid var(--border2)",
    background: "var(--surface2)",
    color: "var(--text2)",
    cursor: "pointer",
    appearance: "none" as const,
    WebkitAppearance: "none" as const,
    lineHeight: 1.4,
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      <div
        className="fi"
        onClick={(e) => e.stopPropagation()}
        style={{ background: "var(--surface-modal)", border: "1px solid var(--border-modal)", borderRadius: 14, width: 700, maxWidth: "96vw", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 8px 40px var(--shadow-lg)", overflow: "hidden" }}
      >
        {/* ── Body ──────────────────────────────────── */}
        <div style={{ flex: 1, padding: "28px 28px 0", overflowY: "auto" }}>
          {/* Icon picker */}
          <div style={{ position: "relative", marginBottom: 18 }}>
            <button
              onClick={() => setShowIconPicker((v) => !v)}
              style={{ width: 52, height: 52, borderRadius: 12, border: "1px solid var(--border2)", background: "var(--surface2)", fontSize: 26, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .12s" }}
            >
              {selectedIcon}
            </button>
            {showIconPicker && (
              <div
                style={{ position: "absolute", top: 58, left: 0, zIndex: 20, background: "var(--surface-modal)", border: "1px solid var(--border2)", borderRadius: 12, padding: 10, boxShadow: "0 8px 32px var(--shadow)", display: "flex", flexWrap: "wrap", gap: 5, width: 232 }}
                onClick={(e) => e.stopPropagation()}
              >
                {PROJECT_ICONS.map((ic) => (
                  <button
                    key={ic.id}
                    onClick={() => { setIconId(ic.id); setShowIconPicker(false); }}
                    style={{ width: 34, height: 34, borderRadius: 7, fontSize: 16, cursor: "pointer", border: iconId === ic.id ? "2px solid var(--accent)" : "1px solid transparent", background: iconId === ic.id ? "var(--accent-soft)" : "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .1s" }}
                  >
                    {ic.emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Project name */}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project name..."
            autoFocus
            style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, background: "transparent", border: "none", borderRadius: 0, padding: "0 0 8px", width: "100%", color: "var(--text)" }}
          />

          {/* Summary */}
          <input
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Add a short summary..."
            style={{ fontSize: 14, background: "transparent", border: "none", borderRadius: 0, padding: "0 0 20px", width: "100%", color: "var(--text2)" }}
          />

          {/* Property chips */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingBottom: 20, borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={chipSelect}>
              {PROJECT_STATUSES.map((s) => <option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}
            </select>

            <select value={priority} onChange={(e) => setPriority(e.target.value)} style={chipSelect}>
              {PROJECT_PRIORITIES.map((p) => <option key={p.id} value={p.id}>{p.icon} {p.label}</option>)}
            </select>

            <label style={{ ...chipSelect, display: "flex", alignItems: "center", gap: 5, color: startDate ? "var(--text2)" : "var(--text3)" }}>
              <span style={{ fontSize: 11 }}>▷</span>
              Start
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ background: "transparent", border: "none", padding: 0, fontSize: 12, color: "inherit", cursor: "pointer", width: startDate ? "auto" : 0, maxWidth: startDate ? 120 : 0, overflow: "hidden", transition: "max-width .2s" }} />
            </label>

            <label style={{ ...chipSelect, display: "flex", alignItems: "center", gap: 5, color: targetDate ? "var(--text2)" : "var(--text3)" }}>
              <span style={{ fontSize: 11 }}>⏱</span>
              Target
              <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} style={{ background: "transparent", border: "none", padding: 0, fontSize: 12, color: "inherit", cursor: "pointer", width: targetDate ? "auto" : 0, maxWidth: targetDate ? 120 : 0, overflow: "hidden", transition: "max-width .2s" }} />
            </label>
          </div>

          {/* Description */}
          <textarea
            value={""}
            onChange={() => {}}
            rows={6}
            placeholder="Write a description, a project brief, or collect ideas..."
            style={{ background: "transparent", border: "none", borderRadius: 0, padding: 0, resize: "none", fontSize: 14, color: "var(--text)", lineHeight: 1.7, width: "100%" }}
          />
        </div>

        {/* ── Footer ──────────────────────────────────── */}
        <div style={{ padding: "16px 28px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", gap: 10, background: "var(--surface2)", flexShrink: 0 }}>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn
            onClick={async () => {
              if (!name.trim() || saving) return;
              setSaving(true);
              await onSave({ name, description: summary, colorId: iconId, status, priority, startDate, targetDate });
              setSaving(false);
            }}
            disabled={!name.trim() || saving}
            size="lg"
          >
            {saving ? "Creating..." : initialData ? "Save Changes" : "Create project"}
          </Btn>
        </div>
      </div>
    </div>
  );
}
