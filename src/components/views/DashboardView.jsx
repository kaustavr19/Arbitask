import { DISPLAY } from "../../styles/fonts";
import { ACHIEVEMENTS } from "../../constants";

export function DashboardView({ stats, projects }) {
  const earned = ACHIEVEMENTS.filter(a => a.check(stats));
  const locked = ACHIEVEMENTS.filter(a => !a.check(stats));

  return (
    <div style={{ width: "100%", maxWidth: 900, margin: "0 auto" }}>
      {/* HERO CARD */}
      <div className="fi" style={{
        position: "relative", overflow: "hidden", borderRadius: 20, padding: "32px 36px",
        background: `linear-gradient(135deg, ${stats.currentLevel.color}22, ${stats.currentLevel.color}08)`,
        border: `2px solid ${stats.currentLevel.color}33`, marginBottom: 24,
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: stats.currentLevel.color + "0A" }} />
        <div style={{ position: "absolute", bottom: -60, left: "30%", width: 300, height: 300, borderRadius: "50%", background: stats.currentLevel.color + "06" }} />
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{
            width: 100, height: 100, borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center",
            background: `linear-gradient(135deg, ${stats.currentLevel.color}44, ${stats.currentLevel.color}22)`,
            border: `3px solid ${stats.currentLevel.color}66`, fontSize: 48,
            animation: "pulseGlow 3s ease-in-out infinite",
          }}>
            {stats.currentLevel.emoji}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: stats.currentLevel.color, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Level {stats.currentLevel.level}</div>
            <div style={{ fontSize: 36, fontWeight: 800, fontFamily: DISPLAY, letterSpacing: -1, marginBottom: 6, color: "var(--text)" }}>{stats.currentLevel.title}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, height: 12, borderRadius: 6, background: "var(--surface3)", overflow: "hidden" }}>
                <div style={{
                  width: `${stats.levelProgress * 100}%`, height: "100%", borderRadius: 6,
                  background: `linear-gradient(90deg, ${stats.currentLevel.color}, ${stats.currentLevel.color}AA)`,
                  transition: "width .8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  boxShadow: `0 0 12px ${stats.currentLevel.color}66`,
                }} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 800, fontFamily: DISPLAY, color: stats.currentLevel.color, minWidth: 60, textAlign: "right" }}>
                {stats.xp} XP
              </span>
            </div>
            {stats.nextLevel && (
              <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 6 }}>
                {stats.xpNeeded - stats.xpInLevel} XP to <span style={{ fontWeight: 700, color: stats.nextLevel.color }}>{stats.nextLevel.emoji} {stats.nextLevel.title}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PRODUCTIVITY STATS */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, fontFamily: DISPLAY, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>📊</span> Productivity Stats
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {[
            { l: "Completed", v: stats.done, i: "✅", c: "var(--st-done)" },
            { l: "In Progress", v: stats.inProgress, i: "🔥", c: "var(--st-in_progress)" },
            { l: "Blocked", v: stats.blocked, i: "🚧", c: "var(--st-blocked)" },
            { l: "Completion", v: stats.completionRate + "%", i: "📈", c: "var(--accent)" },
            { l: "Total Tasks", v: stats.totalTasks, i: "📋", c: "var(--st-planned)" },
          ].map((s, i) => (
            <div key={i} className="fi" style={{
              padding: "18px 14px", borderRadius: 14, background: "var(--surface)",
              border: "1px solid var(--border)", textAlign: "center",
              animationDelay: `${i * 0.08}s`, animationFillMode: "both",
            }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{s.i}</div>
              <div style={{ fontSize: 28, fontWeight: 800, fontFamily: DISPLAY, color: s.c, letterSpacing: -1 }}>{s.v}</div>
              <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 600, marginTop: 4, textTransform: "uppercase", letterSpacing: .5 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ACHIEVEMENTS */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, fontFamily: DISPLAY, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>🏆</span> Achievements
        </h2>
        <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 14 }}>{earned.length} of {ACHIEVEMENTS.length} unlocked</p>

        {earned.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 }}>
            {earned.map((a, i) => (
              <div key={a.id} className="fi" style={{
                padding: "16px 14px", borderRadius: 14,
                background: "linear-gradient(135deg, var(--accent-soft), transparent)",
                border: "1px solid var(--accent-glow)",
                animationDelay: `${i * 0.06}s`, animationFillMode: "both",
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--accent-soft)", fontSize: 22, border: "2px solid var(--accent-glow)", boxShadow: "0 4px 12px var(--accent-glow)" }}>{a.emoji}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, fontFamily: DISPLAY, color: "var(--text)" }}>{a.title}</div>
                  <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 2 }}>{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {locked.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {locked.map(a => (
              <div key={a.id} style={{ padding: "16px 14px", borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12, opacity: .45 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface3)", fontSize: 22, filter: "grayscale(1)" }}>{a.emoji}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, fontFamily: DISPLAY, color: "var(--text3)" }}>{a.title}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* XP BREAKDOWN */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, fontFamily: DISPLAY, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>⚡</span> XP Breakdown
        </h2>
        <div style={{ borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border)", overflow: "hidden" }}>
          {[
            { label: "Tasks completed", count: stats.done, xpEach: 50, emoji: "✅" },
            { label: "Tasks in progress", count: stats.inProgress, xpEach: 15, emoji: "🔥" },
            { label: "Tasks created", count: stats.totalTasks, xpEach: 10, emoji: "📋" },
            { label: "Notes written", count: stats.notes, xpEach: 10, emoji: "📝" },
            { label: "Projects created", count: stats.projects, xpEach: 20, emoji: "📂" },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", padding: "12px 18px", borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
              <span style={{ fontSize: 16, marginRight: 12 }}>{row.emoji}</span>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{row.label}</span>
              <span style={{ fontSize: 12, color: "var(--text3)", marginRight: 16 }}>{row.count} × {row.xpEach} XP</span>
              <span style={{ fontSize: 14, fontWeight: 800, fontFamily: DISPLAY, color: "var(--accent)", minWidth: 55, textAlign: "right" }}>{row.count * row.xpEach} XP</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
