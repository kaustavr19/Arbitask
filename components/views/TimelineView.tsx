"use client";

import { useState, useEffect, useRef } from "react";
import { PROJECT_COLORS, STATUSES } from "@/lib/constants";
import { fmtDate } from "@/lib/helpers";
import { Empty } from "@/components/ui";

const BODY = `'Manrope', sans-serif`;

type Task = {
  id: string;
  title: string;
  status: string;
  startDate: Date | null;
  dueDate: Date | null;
  projectId: string;
};
type Project = { id: string; name: string; colorId: string; tasks: Task[] };

interface TimelineViewProps {
  project?: Project;
  projects?: Project[];
}

export function TimelineView({ project, projects }: TimelineViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cw, setCw] = useState(800);
  const [filterProjectId, setFilterProjectId] = useState<string>("");

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setCw(e.contentRect.width);
    });
    ro.observe(containerRef.current);
    setCw(containerRef.current.offsetWidth);
    return () => ro.disconnect();
  }, []);

  const isGlobal = !!projects;
  const allProjects = projects || (project ? [project] : []);
  const filteredProjects = filterProjectId
    ? allProjects.filter((p) => p.id === filterProjectId)
    : allProjects;

  function getProjectColor(projectId: string) {
    const p = allProjects.find((p) => p.id === projectId);
    return PROJECT_COLORS.find((c) => c.id === (p?.colorId || "rose")) || PROJECT_COLORS[0];
  }

  const allTasksWithProject = filteredProjects.flatMap((p) =>
    p.tasks.map((t) => ({ ...t, _project: p }))
  );

  const wd = allTasksWithProject.filter((t) => t.startDate && t.dueDate);

  if (!wd.length) {
    return (
      <div ref={containerRef}>
        {isGlobal && allProjects.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)" }}>Filter by project</span>
            <select
              value={filterProjectId}
              onChange={(e) => setFilterProjectId(e.target.value)}
              style={{ fontSize: 12, padding: "5px 10px", borderRadius: 8, border: "1px solid var(--border2)", background: "var(--surface2)", color: "var(--text)", width: "auto", maxWidth: 200 }}
            >
              <option value="">All projects</option>
              {allProjects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        )}
        <Empty icon="📅" title="No timeline data" sub="Add start and due dates to tasks" />
      </div>
    );
  }

  const allD = wd.flatMap((t) => [new Date(t.startDate!), new Date(t.dueDate!)]);
  const minD = new Date(Math.min(...allD.map((d) => d.getTime())));
  const maxD = new Date(Math.max(...allD.map((d) => d.getTime())));
  const td = Math.max((maxD.getTime() - minD.getTime()) / 864e5, 1);
  const labelW = 200;
  const barArea = Math.max(cw - labelW - 40, 200);
  const px = Math.max(barArea / td, 8);
  const totalW = labelW + td * px + 40;

  const months: Date[] = [];
  const cur = new Date(minD.getFullYear(), minD.getMonth(), 1);
  while (cur <= maxD) {
    months.push(new Date(cur));
    cur.setMonth(cur.getMonth() + 1);
  }

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", overflowX: "auto", overflowY: "auto" }}>
      {isGlobal && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)" }}>Filter by project</span>
          <select
            value={filterProjectId}
            onChange={(e) => setFilterProjectId(e.target.value)}
            style={{ fontSize: 12, padding: "5px 10px", borderRadius: 8, border: "1px solid var(--border2)", background: "var(--surface2)", color: "var(--text)", width: "auto", maxWidth: 200 }}
          >
            <option value="">All projects</option>
            {allProjects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      )}
      <div style={{ position: "relative", height: 28, minWidth: totalW }}>
        {months.map((m, i) => {
          const off = Math.max(0, (m.getTime() - minD.getTime()) / 864e5);
          return (
            <div
              key={i}
              style={{ position: "absolute", left: labelW + off * px, fontSize: 10, fontWeight: 700, color: "var(--text3)", letterSpacing: 0.5, textTransform: "uppercase", borderLeft: "1px solid var(--border)", paddingLeft: 8, height: "100%", display: "flex", alignItems: "center", fontFamily: BODY }}
            >
              {m.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 4, minWidth: totalW }}>
        {wd.map((task) => {
          const start = (new Date(task.startDate!).getTime() - minD.getTime()) / 864e5;
          const dur = Math.max((new Date(task.dueDate!).getTime() - new Date(task.startDate!).getTime()) / 864e5, 1);
          const st = STATUSES.find((s) => s.id === task.status);
          const pc = getProjectColor(task.projectId);
          return (
            <div key={task.id} style={{ display: "flex", alignItems: "center", height: 38 }}>
              <div style={{ width: labelW, flexShrink: 0, paddingRight: 12, fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text)" }}>
                {isGlobal && (
                  <span style={{ fontSize: 10, color: pc.hex, marginRight: 6, fontWeight: 700 }}>
                    {task._project.name} ·
                  </span>
                )}
                {task.title}
              </div>
              <div style={{ position: "relative", flex: 1 }}>
                <div
                  style={{ position: "absolute", left: start * px, width: Math.max(dur * px, 28), height: 30, borderRadius: 8, background: `linear-gradient(135deg,${pc.hex}BB,${pc.hex}66)`, border: `1px solid ${pc.hex}88`, display: "flex", alignItems: "center", gap: 5, paddingLeft: 8, fontSize: 11, fontWeight: 600, color: "#FFF" }}
                >
                  <span>{st?.emoji}</span>
                  {dur * px > 100 && (
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {fmtDate(task.startDate)} → {fmtDate(task.dueDate)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
