import { useState, useRef } from "react";
import { BODY, DISPLAY } from "../../styles/fonts";
import { PROJECT_COLORS } from "../../constants";
import { fmtDate } from "../../utils/helpers";
import { renderMd } from "../../utils/markdown";
import { Btn, Badge, Empty, Label } from "../ui";
import { Modal } from "../ui/Modal";
import { SlashMenu } from "../SlashMenu";

export function NotesView({ notes, projects, onAddNote, onUpdateNote, onDeleteNote }) {
  const [an, setAn] = useState(null);
  const [editing, setEditing] = useState(false);
  const [ec, setEc] = useState("");
  const [et, setEt] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [nt, setNt] = useState("");
  const [nc, setNc] = useState("");
  const [np, setNp] = useState("");
  const [slashOpen, setSO] = useState(false);
  const [sf, setSF] = useState("");
  const [sp, setSP] = useState({ x: 0, y: 0 });
  const [ss, setSS] = useState(-1);
  const [st2, setST] = useState(null);
  const editRef = useRef(null);
  const newRef = useRef(null);
  const note = notes.find(n => n.id === an);

  const handleTA = (e, target) => {
    const val = e.target.value, pos = e.target.selectionStart;
    (target === "edit" ? setEc : setNc)(val);
    const ls = val.lastIndexOf("\n", pos - 1) + 1;
    const lt = val.substring(ls, pos);
    const si = lt.lastIndexOf("/");
    if (si !== -1 && (si === 0 || lt[si - 1] === " " || lt[si - 1] === "\n")) {
      const f = lt.substring(si + 1);
      if (f.length <= 20 && !/\s/.test(f)) {
        const r = e.target.getBoundingClientRect();
        setSO(true); setSF(f); setSS(ls + si); setST(target);
        setSP({ x: 16, y: Math.min(r.height - 80, Math.max(0, (pos / val.length) * r.height)) });
        return;
      }
    }
    if (slashOpen) setSO(false);
  };

  const handleSlashSelect = (cmd) => {
    const content = st2 === "edit" ? ec : nc;
    const setter = st2 === "edit" ? setEc : setNc;
    const ref2 = st2 === "edit" ? editRef : newRef;
    const before = content.substring(0, ss);
    const cp = ref2.current ? ref2.current.selectionStart : content.length;
    const after = content.substring(cp);
    setter(before + cmd.insert + after);
    setSO(false); setSF("");
    setTimeout(() => {
      if (ref2.current) {
        const np2 = before.length + cmd.insert.length;
        ref2.current.focus();
        ref2.current.setSelectionRange(np2, np2);
      }
    }, 10);
  };

  return (
    <div style={{ display: "flex", height: "100%", minHeight: 0 }}>
      <div style={{ width: 270, minWidth: 270, borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "0 14px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)" }}>{notes.length} notes</span>
          <Btn size="sm" onClick={() => setShowNew(true)}>+ New</Btn>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "0 6px" }}>
          {notes.map(n => {
            const proj = projects.find(p => p.id === n.projectId);
            const npc = proj ? (PROJECT_COLORS.find(c => c.id === proj.colorId) || PROJECT_COLORS[0]) : null;
            return (
              <button key={n.id} onClick={() => { setAn(n.id); setEditing(false); }} style={{ display: "block", width: "100%", textAlign: "left", padding: 10, borderRadius: 9, border: "none", cursor: "pointer", marginBottom: 3, fontFamily: BODY, background: an === n.id ? "var(--accent-soft)" : "transparent", color: an === n.id ? "var(--accent-text)" : "var(--text2)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.title}</div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ fontSize: 10, color: "var(--text3)" }}>{fmtDate(n.createdAt)}</span>
                  {npc && <Badge color={npc.hex} style={{ fontSize: 9, padding: "1px 6px" }}>{proj.name}</Badge>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, padding: "0 26px", overflowY: "auto" }}>
        {!note ? (
          <Empty icon="✎" title="Select a note" sub="Pick a note or create a new one" action={<Btn onClick={() => setShowNew(true)}>Create note</Btn>} />
        ) : editing ? (
          <div className="fi" style={{ position: "relative" }}>
            <input value={et} onChange={e => setEt(e.target.value)} style={{ fontSize: 20, fontWeight: 700, fontFamily: DISPLAY, background: "transparent", border: "none", borderBottom: "2px solid var(--accent)", borderRadius: 0, padding: "8px 0", marginBottom: 14 }} />
            <div style={{ position: "relative" }}>
              <textarea ref={editRef} value={ec} onChange={e => handleTA(e, "edit")} rows={16} placeholder="Write in markdown... Type / for commands" />
              {slashOpen && st2 === "edit" && <SlashMenu position={sp} filter={sf} onSelect={handleSlashSelect} onClose={() => setSO(false)} />}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <Btn onClick={() => { if (note) { onUpdateNote(note.id, { title: et, content: ec }); setEditing(false); } }}>Save</Btn>
              <Btn variant="ghost" onClick={() => { setEditing(false); setSO(false); }}>Cancel</Btn>
            </div>
          </div>
        ) : (
          <div className="fi">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 800, fontFamily: DISPLAY, marginBottom: 4 }}>{note.title}</h1>
                <span style={{ fontSize: 12, color: "var(--text3)" }}>{fmtDate(note.createdAt)}</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <Btn size="sm" variant="secondary" onClick={() => { setEt(note.title); setEc(note.content); setEditing(true); }}>Edit</Btn>
                <Btn size="sm" variant="danger" onClick={() => { onDeleteNote(note.id); setAn(null); }}>Delete</Btn>
              </div>
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text2)" }} dangerouslySetInnerHTML={{ __html: renderMd(note.content) }} />
          </div>
        )}
      </div>

      <Modal open={showNew} onClose={() => { setShowNew(false); setSO(false); }} title="New Note">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div><Label>Title</Label><input value={nt} onChange={e => setNt(e.target.value)} placeholder="Note title..." /></div>
          <div>
            <Label>Link to project</Label>
            <select value={np} onChange={e => setNp(e.target.value)}>
              <option value="">No project</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div style={{ position: "relative" }}>
            <Label>Content <span style={{ fontWeight: 400, color: "var(--text3)" }}>— type / for commands</span></Label>
            <textarea ref={newRef} value={nc} onChange={e => handleTA(e, "new")} rows={8} placeholder="# Your thoughts here..." />
            {slashOpen && st2 === "new" && <SlashMenu position={sp} filter={sf} onSelect={handleSlashSelect} onClose={() => setSO(false)} />}
          </div>
          <Btn onClick={() => { if (nt.trim()) { onAddNote({ title: nt, content: nc, projectId: np || null }); setNt(""); setNc(""); setNp(""); setShowNew(false); } }} disabled={!nt.trim()}>
            Create Note
          </Btn>
        </div>
      </Modal>
    </div>
  );
}
