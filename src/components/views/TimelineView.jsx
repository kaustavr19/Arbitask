import { useState, useEffect, useRef } from "react";
import { BODY } from "../../styles/fonts";
import { PROJECT_COLORS, STATUSES } from "../../constants";
import { fmtDate } from "../../utils/helpers";
import { Empty } from "../ui";

export function TimelineView({ project }) {
  const containerRef = useRef(null);
  const [cw, setCw] = useState(800);

  useEffect(() => {
    if (containerRef.current) {
      const ro = new ResizeObserver(entries => {
        for (const e of entries) setCw(e.contentRect.width);
      });
      ro.observe(containerRef.current);
      setCw(containerRef.current.offsetWidth);
      return () => ro.disconnect();
    }
  }, []);

  if (!project) return <Empty icon="📂" title="Select a project" sub="Pick a project from the sidebar" />;
  const pc = PROJECT_COLORS.find(c => c.id === project.colorId) || PROJECT_COLORS[0];
  const wd = project.tasks.filter(t => t.startDate && t.dueDate);
  if (!wd.length) return <div ref={containerRef}><Empty icon="📅" title="No timeline data" sub="Add start and due dates to tasks" /></div>;

  const allD = wd.flatMap(t => [new Date(t.startDate), new Date(t.dueDate)]);
  const minD = new Date(Math.min(...allD)), maxD = new Date(Math.max(...allD));
  const td = Math.max((maxD - minD) / 864e5, 1), labelW = 200, barArea = Math.max(cw - labelW - 40, 200), px = Math.max(barArea / td, 8), totalW = labelW + td * px + 40;
  const months = [];
  const cur = new Date(minD.getFullYear(), minD.getMonth(), 1);
  while (cur <= maxD) { months.push(new Date(cur)); cur.setMonth(cur.getMonth() + 1); }

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", overflowX: "auto", overflowY: "auto" }}>
      <div style={{ position: "relative", height: 28, minWidth: totalW }}>
        {months.map((m, i) => {
          const off = Math.max(0, (m - minD) / 864e5);
          return (
            <div key={i} style={{ position: "absolute", left: labelW + off * px, fontSize: 10, fontWeight: 700, color: "var(--text3)", letterSpacing: .5, textTransform: "uppercase", borderLeft: "1px solid var(--border)", paddingLeft: 8, height: "100%", display: "flex", alignItems: "center", fontFamily: BODY }}>
              {m.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 4, minWidth: totalW }}>
        {wd.map(task => {
          const start = (new Date(task.startDate) - minD) / 864e5;
          const dur = Math.max((new Date(task.dueDate) - new Date(task.startDate)) / 864e5, 1);
          const st = STATUSES.find(s => s.id === task.status);
          return (
            <div key={task.id} style={{ display: "flex", alignItems: "center", height: 38 }}>
              <div style={{ width: labelW, flexShrink: 0, paddingRight: 12, fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task.title}</div>
              <div style={{ position: "relative", flex: 1 }}>
                <div style={{ position: "absolute", left: start * px, width: Math.max(dur * px, 28), height: 30, borderRadius: 8, background: `linear-gradient(135deg,${pc.hex}BB,${pc.hex}66)`, border: `1px solid ${pc.hex}88`, display: "flex", alignItems: "center", gap: 5, paddingLeft: 8, fontSize: 11, fontWeight: 600, color: "#FFF" }}>
                  <span>{st.emoji}</span>
                  {dur * px > 100 && <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fmtDate(task.startDate)} → {fmtDate(task.dueDate)}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
