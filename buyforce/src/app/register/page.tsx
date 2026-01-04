"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async () => {
    setMsg("");
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      router.push("/");
    } catch (e: any) {
      setMsg(e?.message || "שגיאה בהרשמה");
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "#eef4ff", fontFamily: "Arial", display: "grid", placeItems: "center" }}>
      <div style={{ width: "min(520px, 92vw)", background: "white", borderRadius: 20, padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}>
        <button
          onClick={() => router.push("/")}
          style={{ background: "transparent", border: "none", cursor: "pointer", color: "#333", fontWeight: 800, marginBottom: 10 }}
        >
          ← Back
        </button>

        <h1 style={{ textAlign: "center", margin: 0, color: "#111" }}>Create Account</h1>
        <p style={{ textAlign: "center", marginTop: 8, color: "#444" }}>Sign up to continue</p>

        <div style={{ marginTop: 18 }}>
          <label style={{ color: "#111", fontWeight: 700 }}>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{ width: "100%", marginTop: 6, padding: 12, borderRadius: 12, border: "1px solid #cfd7e6" }}
          />
        </div>

        <div style={{ marginTop: 14 }}>
          <label style={{ color: "#111", fontWeight: 700 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{ width: "100%", marginTop: 6, padding: 12, borderRadius: 12, border: "1px solid #cfd7e6" }}
          />
        </div>

        <button
          onClick={handleRegister}
          style={{ width: "100%", marginTop: 16, padding: 12, borderRadius: 14, border: "none", background: "#7b2ff7", color: "white", fontWeight: 900, cursor: "pointer" }}
        >
          Sign Up
        </button>

        <p style={{ textAlign: "center", marginTop: 14, color: "#333" }}>
          Already have an account?{" "}
          <span style={{ color: "#7b2ff7", fontWeight: 900, cursor: "pointer" }} onClick={() => router.push("/login")}>
            Log In
          </span>
        </p>

        {msg && <p style={{ textAlign: "center", color: "darkred", fontWeight: 800 }}>{msg}</p>}
      </div>
    </main>
  );
}
