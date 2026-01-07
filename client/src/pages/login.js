// client/pages/login.js
import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config/api";
import { useRouter } from "next/router";
import Link from "next/link";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("test1@test.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  function saveAuth(resData) {
    if (typeof window === "undefined") return;

    // backend should return: { token, user }
    localStorage.setItem("token", resData.token);
    localStorage.setItem("user", JSON.stringify(resData.user));
  }

  function extractErrorMessage(err, fallback) {
    // Axios backend error
    const backendMsg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.response?.data?.details;

    if (backendMsg) return backendMsg;

    // Firebase errors
    const code = err?.code;
    if (code) {
      if (code === "auth/popup-closed-by-user") return "סגרת את חלון Google לפני סיום ההתחברות.";
      if (code === "auth/cancelled-popup-request") return "בקשת ההתחברות בוטלה (נפתח חלון נוסף). נסה שוב.";
      if (code === "auth/popup-blocked") return "הדפדפן חסם את חלון ההתחברות. תאפשר Popups לאתר ונסה שוב.";
      return `Google/Firebase error: ${code}`;
    }

    return err?.message || fallback;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/api/users/login`, {
        email,
        password,
      });

      saveAuth(res.data);
      router.push("/home");
    } catch (err) {
      console.error(err);
      setError(extractErrorMessage(err, "Login failed. Check email/password."));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setGoogleLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);

      // IMPORTANT: send Firebase idToken to backend
      const idToken = await result.user.getIdToken(true);

      console.log("ID TOKEN TYPE:", typeof idToken);
      console.log("ID TOKEN LEN:", idToken?.length);
      console.log("ID TOKEN HEAD:", idToken?.slice(0, 20));

      const res = await axios.post(`${API_URL}/api/auth/firebase`, { idToken });

      saveAuth(res.data);
      router.push("/home");
    } catch (err) {
      console.error(err);

      // NOTE: COOP warnings about window.close are not fatal.
      // If signInWithPopup succeeds but you still see warnings,
      // the try block will still continue. Only real errors arrive here.

      const msg = extractErrorMessage(err, "Google login failed.");
      setError(msg);
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100vw",
        margin: 0,
        padding: "2rem",
        fontFamily: "sans-serif",
        backgroundImage:
          "linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url('https://ishai.co.il/wp-content/uploads/2023/02/BDish_20161009_173921494_21.jpg')",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <h1 style={{ fontSize: "4rem", marginBottom: "1rem", color: "#000" }}>
        Buyforce Login
      </h1>

      <p
        style={{
          marginBottom: "2.5rem",
          fontSize: "1.4rem",
          fontWeight: "bold",
        }}
      >
        <Link
          href="/register"
          style={{ color: "#0070f3", textDecoration: "underline" }}
        >
          Don't have an account? Press here to register
        </Link>
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "550px",
          display: "flex",
          flexDirection: "column",
          gap: "2.5rem",
          textAlign: "right",
        }}
      >
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.8rem",
            fontSize: "1.6rem",
            fontWeight: "900",
          }}
        >
          אימייל
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "1.5rem",
              borderRadius: "10px",
              border: "3px solid #000",
              fontSize: "1.4rem",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          />
        </label>

        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.8rem",
            fontSize: "1.6rem",
            fontWeight: "900",
          }}
        >
          סיסמה
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "1.5rem",
              borderRadius: "10px",
              border: "3px solid #000",
              fontSize: "1.4rem",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          />
        </label>

        {error && (
          <div
            style={{
              color: "red",
              fontSize: "1.2rem",
              fontWeight: "bold",
              textAlign: "center",
              backgroundColor: "white",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || googleLoading}
          style={{
            marginTop: "1rem",
            padding: "1.8rem",
            cursor: "pointer",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontWeight: "900",
            fontSize: "1.8rem",
            opacity: loading ? 0.7 : 1,
            boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
          }}
        >
          {loading ? "מתחבר..." : "התחבר עכשיו"}
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading || googleLoading}
          style={{
            padding: "1.4rem",
            cursor: "pointer",
            backgroundColor: "#fff",
            color: "#111",
            border: "2px solid #111",
            borderRadius: "10px",
            fontWeight: "900",
            fontSize: "1.4rem",
            opacity: googleLoading ? 0.7 : 1,
          }}
        >
          {googleLoading ? "מתחבר עם Google..." : "התחבר עם Google"}
        </button>
      </form>
    </main>
  );
}
