"use client";

import { useState } from "react";
import { PROJECT_ICONS } from "@/lib/constants";
import { Btn, Modal } from "@/components/ui";

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
  const [iconId, setIconId] = useState(initialData?.colorId || "rocket");
  const [saving, setSaving] = useState(false);

  return (
    <Modal open onClose={onClose} title={initialData ? "Edit Project" : "New Project"}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <Label>Project name</Label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="My brilliant idea..." autoFocus />
        </div>
        <div>
          <Label>Description</Label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="What's this about?" />
        </div>
        <div>
          <Label>Project icon</Label>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {PROJECT_ICONS.map((ic) => (
              <button
                key={ic.id}
                onClick={() => setIconId(ic.id)}
                title={ic.id}
                style={{
                  width: 38, height: 38, borderRadius: 8, fontSize: 18,
                  cursor: "pointer",
                  border: iconId === ic.id ? "2px solid var(--accent)" : "2px solid var(--border2)",
                  background: iconId === ic.id ? "var(--accent-soft)" : "var(--surface2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all .12s",
                }}
              >
                {ic.emoji}
              </button>
            ))}
          </div>
        </div>
        <Btn
          onClick={async () => {
            if (!name.trim() || saving) return;
            setSaving(true);
            await onSave({ name, description: desc, colorId: iconId });
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
