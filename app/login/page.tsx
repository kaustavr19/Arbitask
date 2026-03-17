import { signIn } from "@/lib/auth";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { signInWithCredentials } from "@/lib/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  if (session?.user) redirect(params.callbackUrl || "/dashboard");

  const hasError = params.error === "CredentialsSignin";

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "radial-gradient(ellipse 100% 60% at 50% -10%, #2A1200 0%, #0D0C0A 60%)",
      fontFamily: "'Outfit', sans-serif",
      padding: "20px",
    }}>
      {/* Subtle warm glow orb */}
      <div style={{
        position: "fixed",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: 600,
        height: 300,
        background: "radial-gradient(ellipse, rgba(232,97,10,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        background: "rgba(23,21,18,0.85)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,235,210,0.10)",
        borderRadius: 18,
        padding: "44px 40px 40px",
        width: "100%",
        maxWidth: 380,
        boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,235,210,0.04) inset",
        position: "relative",
        zIndex: 1,
        textAlign: "center",
      }}>
        {/* Logo mark */}
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: "linear-gradient(135deg, #F07020 0%, #E8610A 60%, #C44800 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          color: "#FFF",
          fontWeight: 800,
          margin: "0 auto 18px",
          boxShadow: "0 8px 24px rgba(232,97,10,0.4)",
          letterSpacing: -1,
        }}>A</div>

        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F0EBE3", marginBottom: 6, letterSpacing: -0.4 }}>
          Arbitask
        </h1>
        <p style={{ color: "#6B5A4A", fontSize: 13, marginBottom: 34, lineHeight: 1.5 }}>
          From raw idea to shipped — in one place.
        </p>

        {/* Google Sign-in */}
        <form action={async () => { "use server"; await signIn("google", { redirectTo: params.callbackUrl || "/dashboard" }); }}>
          <button
            type="submit"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "11px 20px",
              background: "#F0EBE3",
              color: "#17120A",
              border: "none",
              borderRadius: 9,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            Continue with Google
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,235,210,0.08)" }} />
          <span style={{ fontSize: 10, color: "#4A4440", fontWeight: 600, letterSpacing: 1 }}>OR DEMO</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,235,210,0.08)" }} />
        </div>

        {/* Demo credentials login */}
        <form action={signInWithCredentials} style={{ textAlign: "left" }}>
          <div style={{ marginBottom: 8 }}>
            <input
              type="email"
              name="email"
              defaultValue="demo@arbitask.app"
              placeholder="Email"
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "rgba(255,235,210,0.05)",
                border: "1px solid rgba(255,235,210,0.10)",
                borderRadius: 9,
                color: "#F0EBE3",
                fontSize: 13,
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <input
              type="password"
              name="password"
              defaultValue="demo1234"
              placeholder="Password"
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "rgba(255,235,210,0.05)",
                border: "1px solid rgba(255,235,210,0.10)",
                borderRadius: 9,
                color: "#F0EBE3",
                fontSize: 13,
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            />
          </div>
          {hasError && (
            <p style={{ fontSize: 12, color: "#F87171", marginBottom: 10, textAlign: "center" }}>
              Invalid credentials. Use the pre-filled demo account.
            </p>
          )}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "11px 20px",
              background: "linear-gradient(135deg, #F07020 0%, #E8610A 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 9,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: "0 4px 14px rgba(232,97,10,0.35)",
              letterSpacing: 0.1,
            }}
          >
            Sign in as Demo User
          </button>
        </form>

        <p style={{ marginTop: 20, fontSize: 11, color: "#3A3430", lineHeight: 1.6 }}>
          <code style={{ color: "#5A5048" }}>demo@arbitask.app</code>
          {" / "}
          <code style={{ color: "#5A5048" }}>demo1234</code>
        </p>
      </div>
    </div>
  );
}
