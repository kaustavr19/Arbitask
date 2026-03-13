import { useState } from "react";
import { BODY } from "../../styles/fonts";
import { PROJECT_COLORS } from "../../constants";
import { gid } from "../../utils/helpers";
import { Btn, Label, Modal } from "../ui";

export function ProjectModal({ open, onClose, onSave }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [colorId, setColorId] = useState("rose");

  return (
    <Modal open={open} onClose={onClose} title="New Project">
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <Label>Project name</Label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="My brilliant idea..." autoFocus />
        </div>
        <div>
          <Label>Description</Label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="What's this about?" style={{ fontFamily: BODY }} />
        </div>
        <div>
          <Label>Project color — themes everything inside</Label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {PROJECT_COLORS.map(c => (
              <button key={c.id} onClick={() => setColorId(c.id)} style={{ width: 38, height: 38, borderRadius: 10, background: c.hex, cursor: "pointer", border: colorId === c.id ? "3px solid var(--text)" : "3px solid transparent", transition: "all .15s", position: "relative" }}>
                {colorId === c.id && <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontSize: 16, fontWeight: 700 }}>✓</span>}
              </button>
            ))}
          </div>
        </div>
        <Btn
          onClick={() => {
            if (name.trim()) {
              onSave({ id: gid(), name, description: desc, colorId, createdAt: new Date().toISOString(), tasks: [] });
              setName(""); setDesc(""); setColorId("rose"); onClose();
            }
          }}
          disabled={!name.trim()}
          size="lg"
          style={{ width: "100%", justifyContent: "center" }}
        >
          Create Project
        </Btn>
      </div>
    </Modal>
  );
}
