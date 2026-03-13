import { BODY, MONO } from "../styles/fonts";
import { TOOLBAR_ITEMS } from "../constants";

export function FormattingToolbar({ textareaRef, value, onChange }) {
  const handleInsert = (item) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart, end = ta.selectionEnd, selected = value.substring(start, end);
    let newText, pos;
    if (item.wrap && selected) {
      newText = value.substring(0, start) + item.insert + selected + item.insert + value.substring(end);
      pos = end + item.insert.length * 2;
    } else if (item.wrap) {
      newText = value.substring(0, start) + item.insert + "text" + item.insert + value.substring(end);
      pos = start + item.insert.length;
    } else {
      newText = value.substring(0, start) + item.insert + value.substring(end);
      pos = start + item.insert.length;
    }
    onChange(newText);
    setTimeout(() => { ta.focus(); ta.setSelectionRange(pos, item.wrap && !selected ? pos + 4 : pos); }, 10);
  };

  return (
    <div style={{ display: "flex", gap: 2, padding: "6px 8px", background: "var(--surface2)", borderRadius: "10px 10px 0 0", border: "1px solid var(--border2)", borderBottom: "none", flexWrap: "wrap" }}>
      {TOOLBAR_ITEMS.map(item => (
        <button
          key={item.id}
          onClick={() => handleInsert(item)}
          title={item.title}
          style={{ background: "transparent", border: "none", color: "var(--text2)", cursor: "pointer", padding: "4px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700, fontFamily: item.id === "code" ? MONO : BODY, transition: "all .15s", minWidth: 28, textAlign: "center", fontStyle: item.id === "italic" ? "italic" : "normal" }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-soft)"; e.currentTarget.style.color = "var(--accent-text)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text2)"; }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
