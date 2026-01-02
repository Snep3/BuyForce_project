// client/pages/register.js
import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config/api";
import { useRouter } from "next/router";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("test1");
  const [email, setEmail] = useState("test1@test.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/api/users/signup`, {
        username,
        email,
        password,
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      router.push("/products");
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.error ||
          "Registration failed. Check your details."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>הרשמה</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "320px",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          marginTop: "1rem",
        }}
      >
        <label>
          שם משתמש
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%", padding: "0.4rem" }}
          />
        </label>

        <label>
          אימייל
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "0.4rem" }}
          />
        </label>

        <label>
          סיסמה
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "0.4rem" }}
          />
        </label>

        {error && (
          <div style={{ color: "red", fontSize: "0.9rem" }}>{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "0.5rem",
            padding: "0.5rem",
            cursor: "pointer",
          }}
        >
          {loading ? "נרשם..." : "הרשם"}
        </button>
      </form>
    </main>
  );
}
