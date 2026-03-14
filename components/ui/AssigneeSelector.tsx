"use client";

import { Avatar } from "./Avatar";

type MemberUser = { id: string; name: string | null; image: string | null };
type Member = { id: string; userId: string; role: string; user: MemberUser };

interface AssigneeSelectorProps {
  members: Member[];
  selectedUserIds: string[];
  onChange: (userId: string, selected: boolean) => void;
}

export function AssigneeSelector({ members, selectedUserIds, onChange }: AssigneeSelectorProps) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {members.map((m) => {
        const selected = selectedUserIds.includes(m.userId);
        return (
          <button
            key={m.userId}
            onClick={() => onChange(m.userId, !selected)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "6px 12px",
              borderRadius: 20,
              border: selected ? "2px solid var(--accent)" : "2px solid var(--border2)",
              background: selected ? "var(--accent-soft)" : "var(--surface2)",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              color: selected ? "var(--accent-text)" : "var(--text2)",
              transition: "all .15s",
            }}
          >
            <Avatar user={m.user} size={20} />
            {m.user.name || "Unknown"}
          </button>
        );
      })}
      {members.length === 0 && (
        <span style={{ fontSize: 12, color: "var(--text3)" }}>No other members yet</span>
      )}
    </div>
  );
}
