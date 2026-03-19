"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const TABS = [
  { id: "overview",  label: "Overview",  icon: "◎" },
  { id: "kanban",   label: "Kanban",    icon: "🗂" },
  { id: "list",     label: "List",      icon: "📋" },
  { id: "timeline", label: "Timeline",  icon: "📅" },
  { id: "notes",    label: "Notes",     icon: "📝" },
  { id: "shipped",  label: "Shipped",   icon: "🚀" },
];

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const projectId = params?.projectId as string;

  function isActive(tabId: string) {
    return pathname.includes(`/${tabId}`);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 0 }}>
      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          gap: 2,
          borderBottom: "1px solid var(--border)",
          paddingBottom: 0,
          marginBottom: 18,
          flexShrink: 0,
        }}
      >
        {TABS.map((tab) => {
          const active = isActive(tab.id);
          return (
            <Link
              key={tab.id}
              href={`/projects/${projectId}/${tab.id}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                fontSize: 12,
                fontWeight: active ? 700 : 500,
                color: active ? "var(--accent)" : "var(--text2)",
                borderBottom: active ? "2px solid var(--accent)" : "2px solid transparent",
                marginBottom: -1,
                textDecoration: "none",
                borderRadius: "6px 6px 0 0",
                background: active ? "var(--accent)10" : "transparent",
                transition: "all .15s",
                whiteSpace: "nowrap",
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Page content */}
      <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
        {children}
      </div>
    </div>
  );
}
