"use client";

import { useState } from "react";
import { Modal, Btn, Avatar } from "@/components/ui";
import { PROJECT_COLORS } from "@/lib/constants";

const BODY = `'Manrope', sans-serif`;

function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 6 }}>{children}</div>;
}

type MemberUser = { id: string; name: string | null; email?: string | null; image: string | null };
type Member = { id: string; userId: string; role: string; user: MemberUser };

interface ProjectSettingsModalProps {
  projectId: string;
  name: string;
  description: string | null;
  colorId: string;
  members: Member[];
  currentUserId: string;
  onClose: () => void;
  onUpdate: (data: { name: string; description: string; colorId: string }) => Promise<void>;
  onRemoveMember: (memberId: string) => Promise<void>;
}

export function ProjectSettingsModal({
  projectId,
  name: initialName,
  description: initialDesc,
  colorId: initialColor,
  members,
  currentUserId,
  onClose,
  onUpdate,
  onRemoveMember,
}: ProjectSettingsModalProps) {
  const [tab, setTab] = useState<"settings" | "members" | "invite">("settings");
  const [name, setName] = useState(initialName);
  const [desc, setDesc] = useState(initialDesc || "");
  const [colorId, setColorId] = useState(initialColor);
  const [saving, setSaving] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const ROLE_LABEL: Record<string, string> = { OWNER: "Owner", ADMIN: "Admin", MEMBER: "Member", VIEWER: "Viewer" };

  async function generateInvite() {
    setGenerating(true);
    const res = await fetch("/api/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, role: "MEMBER" }),
    });
    if (res.ok) {
      const data = await res.json();
      const url = `${window.location.origin}/invite/${data.token}`;
      setInviteLink(url);
    }
    setGenerating(false);
  }

  return (
    <Modal open onClose={onClose} title="Project Settings" wide>
      {/* Tab bar */}
      <div style={{ display: "flex", gap: 2, background: "var(--surface2)", borderRadius: 10, padding: 4, marginBottom: 24 }}>
        {(["settings", "members", "invite"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: "7px 12px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: BODY,
              background: tab === t ? "var(--accent-soft)" : "transparent",
              color: tab === t ? "var(--accent-text)" : "var(--text2)",
            }}
          >
            {t === "settings" ? "⚙️ Settings" : t === "members" ? `👥 Members (${members.length})` : "🔗 Invite"}
          </button>
        ))}
      </div>

      {/* Settings tab */}
      {tab === "settings" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <Label>Project name</Label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Description</Label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} style={{ fontFamily: BODY }} />
          </div>
          <div>
            <Label>Project color</Label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {PROJECT_COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setColorId(c.id)}
                  style={{ width: 38, height: 38, borderRadius: 10, background: c.hex, cursor: "pointer", border: colorId === c.id ? "3px solid var(--text)" : "3px solid transparent", transition: "all .15s", position: "relative" }}
                >
                  {colorId === c.id && <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontSize: 16, fontWeight: 700 }}>✓</span>}
                </button>
              ))}
            </div>
          </div>
          <Btn onClick={async () => { setSaving(true); await onUpdate({ name, description: desc, colorId }); setSaving(false); onClose(); }} disabled={!name.trim() || saving} size="lg" style={{ width: "100%", justifyContent: "center" }}>
            {saving ? "Saving..." : "Save Changes"}
          </Btn>
        </div>
      )}

      {/* Members tab */}
      {tab === "members" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {members.map((m) => (
            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 12, background: "var(--surface2)", border: "1px solid var(--border)" }}>
              <Avatar user={m.user} size={36} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{m.user.name || "Unknown"}</div>
                <div style={{ fontSize: 12, color: "var(--text3)" }}>{m.user.email || ""}</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, background: "var(--accent-soft)", color: "var(--accent-text)", padding: "3px 10px", borderRadius: 20 }}>
                {ROLE_LABEL[m.role] || m.role}
              </span>
              {m.role !== "OWNER" && m.userId !== currentUserId && (
                <Btn variant="danger" size="sm" onClick={() => onRemoveMember(m.id)}>Remove</Btn>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Invite tab */}
      {tab === "invite" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ padding: "16px 18px", borderRadius: 12, background: "var(--surface2)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: "var(--text)" }}>Shareable invite link</div>
            <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 14, lineHeight: 1.5 }}>
              Anyone with this link can join as a Member. Links expire in 7 days.
            </p>
            {!inviteLink ? (
              <Btn onClick={generateInvite} disabled={generating}>
                {generating ? "Generating..." : "Generate Link"}
              </Btn>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={inviteLink}
                  readOnly
                  style={{ flex: 1, fontSize: 12 }}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <Btn
                  variant="secondary"
                  onClick={() => {
                    navigator.clipboard.writeText(inviteLink);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                >
                  {copied ? "Copied!" : "Copy"}
                </Btn>
              </div>
            )}
          </div>
          <p style={{ fontSize: 11, color: "var(--text3)", textAlign: "center" }}>
            Email invites are not yet supported. Use the link above to invite collaborators.
          </p>
        </div>
      )}
    </Modal>
  );
}
