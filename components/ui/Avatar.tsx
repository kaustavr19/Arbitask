export function Avatar({ user, size = 24 }: { user: { name?: string | null; image?: string | null }; size?: number }) {
  if (user.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.image}
        alt={user.name || ""}
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--surface)" }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "var(--accent-soft)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.4,
        fontWeight: 700,
        color: "var(--accent-text)",
        border: "2px solid var(--surface)",
        flexShrink: 0,
      }}
    >
      {user.name?.[0]?.toUpperCase() || "?"}
    </div>
  );
}
