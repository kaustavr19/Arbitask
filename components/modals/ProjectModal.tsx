"use client";

import { useState } from "react";
import { PROJECT_COLORS } from "@/lib/constants";
import { Btn, Modal } from "@/components/ui";

const BODY = `'Manrope', sans-serif`;

function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 6 }}>{children}</div>;
}

interface ProjectModalProps {
  onClose: () => void;
  onSave: (data: { name: string; description: string; colorId: string }) => Promise<void>;
  initialData?: { name: string; description: string; colorId: string };
}

export function ProjectModal({ onClose, onSave, initialData }: ProjectModalProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [desc, setDesc] = useState(initialData?.description || "");
  const [colorId, setColorId] = useState(initialData?.colorId || "rose");
  const [saving, setSaving] = useState(false);

  return (
    <Modal open onClose={onClose} title={initialData ? "Edit Project" : "New Project"}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <Label>Project name</Label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="My brilliant idea..." autoFocus />
        </div>
        <div>
          <Label>Description</Label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="What's this about?" style={{ fontFamily: BODY }} />
        </div>
        <div>
          <Label>Project color — themes everything inside</Label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {PROJECT_COLORS.map((c) => (
              <button
                key={c.id}
                onClick={() => setColorId(c.id)}
                style={{ width: 38, height: 38, borderRadius: 10, background: c.hex, cursor: "pointer", border: colorId === c.id ? "3px solid var(--text)" : "3px solid transparent", transition: "all .15s", position: "relative" }}
              >
                {colorId === c.id && (
                  <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontSize: 16, fontWeight: 700 }}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
        <Btn
          onClick={async () => {
            if (!name.trim() || saving) return;
            setSaving(true);
            await onSave({ name, description: desc, colorId });
            setSaving(false);
          }}
          disabled={!name.trim() || saving}
          size="lg"
          style={{ width: "100%", justifyContent: "center" }}
        >
          {saving ? "Saving..." : initialData ? "Save Changes" : "Create Project"}
        </Btn>
      </div>
    </Modal>
  );
}
