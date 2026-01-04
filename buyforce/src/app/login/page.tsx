"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async () => {
    setMsg("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push("/");
    } catch (e: any) {
      setMsg(e?.message || "שגיאה בהתחברות");
    }
  };

  const handleGoogle = async () => {
    setMsg("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (e: any) {
      setMsg(e?.message || "שגיאה בהתחברות עם Google");
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

        <h1 style={{ textAlign: "center", margin: 0, color: "#111" }}>Welcome Back</h1>
        <p style={{ textAlign: "center", marginTop: 8, color: "#444" }}>Log in to continue</p>

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
          onClick={handleLogin}
          style={{ width: "100%", marginTop: 16, padding: 12, borderRadius: 14, border: "none", background: "#7b2ff7", color: "white", fontWeight: 900, cursor: "pointer" }}
        >
          Log In
        </button>

        <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: "#e5e9f2" }} />
          <span style={{ color: "#666", fontWeight: 700 }}>Or continue with</span>
          <div style={{ flex: 1, height: 1, background: "#e5e9f2" }} />
        </div>

        <button
          onClick={handleGoogle}
          style={{ width: "100%", marginTop: 14, padding: 12, borderRadius: 14, border: "1px solid #e2e7f2", background: "white", cursor: "pointer", fontWeight: 900 }}
        >
          Google
        </button>

        <p style={{ textAlign: "center", marginTop: 14, color: "#333" }}>
          Don't have an account?{" "}
          <span style={{ color: "#7b2ff7", fontWeight: 900, cursor: "pointer" }} onClick={() => router.push("/register")}>
            Sign Up
          </span>
        </p>

        {msg && <p style={{ textAlign: "center", color: "darkred", fontWeight: 800 }}>{msg}</p>}
      </div>
    </main>
  );
}
