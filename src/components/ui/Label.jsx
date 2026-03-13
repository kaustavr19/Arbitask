export function Label({ children }) {
  return (
    <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 5, display: "block" }}>
      {children}
    </label>
  );
}
