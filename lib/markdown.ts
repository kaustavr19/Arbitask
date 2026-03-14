export function renderMd(text: string): string {
  if (!text) return "";
  let h = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/^### (.+)$/gm, '<h3 style="font-size:15px;font-weight:700;margin:14px 0 6px;color:var(--text)">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="font-size:17px;font-weight:700;margin:14px 0 6px;color:var(--text)">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="font-size:20px;font-weight:700;margin:16px 0 8px;color:var(--text)">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--text)">$1</strong>')
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, '<code style="background:var(--surface3);padding:2px 6px;border-radius:4px;font-size:12px;font-family:monospace">$1</code>')
    .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid var(--border2);margin:16px 0"/>')
    .replace(/^>\s?(.+)$/gm, '<blockquote style="border-left:3px solid var(--accent);padding:4px 12px;margin:8px 0;color:var(--text2);font-style:italic">$1</blockquote>')
    .replace(/^- \[x\] (.+)$/gm, '<div style="margin:4px 0;text-decoration:line-through;opacity:0.5">☑ $1</div>')
    .replace(/^- \[ \] (.+)$/gm, '<div style="margin:4px 0">☐ $1</div>')
    .replace(/^- (.+)$/gm, "{{UL}}$1{{/UL}}")
    .replace(/^(\d+)\. (.+)$/gm, "{{OL}}$2{{/OL}}");

  h = h.replace(/({{UL}}.*?{{\/UL}}\n?)+/g, (m) => {
    const items = m.replace(/{{UL}}(.*?){{\/UL}}\n?/g, '<li style="margin:4px 0">$1</li>');
    return `<ul style="list-style-type:disc;padding-left:24px;margin:8px 0">${items}</ul>`;
  });
  h = h.replace(/({{OL}}.*?{{\/OL}}\n?)+/g, (m) => {
    const items = m.replace(/{{OL}}(.*?){{\/OL}}\n?/g, '<li style="margin:4px 0">$1</li>');
    return `<ol style="list-style-type:decimal;padding-left:24px;margin:8px 0">${items}</ol>`;
  });
  h = h.replace(/\n\n/g, "<br/><br/>").replace(/\n/g, "<br/>");
  return h;
}
