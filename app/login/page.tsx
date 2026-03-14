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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(ellipse at 20% 80%,#0A2E4D 0%,#0C1929 40%,#080F18 100%)",
        fontFamily: "'Manrope', sans-serif",
      }}
    >
      <div
        style={{
          background: "rgba(22,22,26,0.92)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          padding: "48px 40px",
          width: "100%",
          maxWidth: 400,
          backdropFilter: "blur(16px)",
          boxShadow: "0 32px 64px rgba(0,0,0,0.5)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 12 }}>⚡</div>
        <h1
          style={{
            fontFamily: "'Bricolage Grotesque', serif",
            fontSize: 28,
            fontWeight: 800,
            color: "#EDEDEF",
            marginBottom: 8,
          }}
        >
          Arbitask
        </h1>
        <p style={{ color: "#94949E", fontSize: 15, marginBottom: 36, lineHeight: 1.5 }}>
          Turn raw ideas into shipped projects.
          <br />
          Track, collaborate, level up.
        </p>

        {/* Google Sign-in */}
        <form
          action={async () => {
            "use server";
            await signIn("google", {
              redirectTo: params.callbackUrl || "/dashboard",
            });
          }}
        >
          <button
            type="submit"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              padding: "14px 24px",
              background: "#fff",
              color: "#1A1A1E",
              border: "none",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Manrope', sans-serif",
              transition: "opacity .2s",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            Continue with Google
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          <span style={{ fontSize: 11, color: "#5A5A66", fontWeight: 600, letterSpacing: 1 }}>DEMO</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
        </div>

        {/* Demo credentials login */}
        <form action={signInWithCredentials} style={{ textAlign: "left" }}>
          <div style={{ marginBottom: 10 }}>
            <input
              type="email"
              name="email"
              defaultValue="demo@arbitask.app"
              placeholder="Email"
              style={{
                width: "100%",
                padding: "11px 14px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                color: "#EDEDEF",
                fontSize: 14,
                fontFamily: "'Manrope', sans-serif",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <input
              type="password"
              name="password"
              defaultValue="demo1234"
              placeholder="Password"
              style={{
                width: "100%",
                padding: "11px 14px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                color: "#EDEDEF",
                fontSize: 14,
                fontFamily: "'Manrope', sans-serif",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          {hasError && (
            <p style={{ fontSize: 12, color: "#EF4444", marginBottom: 10, textAlign: "center" }}>
              Invalid credentials. Use the pre-filled demo account.
            </p>
          )}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "13px 24px",
              background: "linear-gradient(135deg, #F43F5E, #E11D48)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Manrope', sans-serif",
              letterSpacing: 0.3,
            }}
          >
            Sign in as Demo User
          </button>
        </form>

        <p style={{ marginTop: 20, fontSize: 11, color: "#5A5A66", lineHeight: 1.6 }}>
          Demo: <code style={{ color: "#94949E" }}>demo@arbitask.app</code> /{" "}
          <code style={{ color: "#94949E" }}>demo1234</code>
        </p>
      </div>
    </div>
  );
}
