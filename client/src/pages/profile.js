// client/src/pages/profile.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { http } from "../config/http";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    avatarUrl: "",
  });

  function getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }

  async function loadProfile() {
    try {
      setError("");
      const res = await http.get("/api/users/me");
      setProfile(res.data);
      setForm({
        fullName: res.data.fullName || "",
        phone: res.data.phone || "",
        address: res.data.address || "",
        avatarUrl: res.data.avatarUrl || "",
      });
    } catch (e) {
      console.error(e);
      const msg = e?.response?.data?.message || "Failed to load profile";
      setError(msg);
      // אם זה בעיית auth - תעיף ללוגין
      if (e?.response?.status === 401 || e?.response?.status === 400) {
        router.replace("/login");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname]);

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await http.patch("/api/users/me", form);
      setProfile(res.data);

      // עדכון user ב-localStorage (שימושי ל-NavBar)
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem("user");
        const current = raw ? JSON.parse(raw) : {};
        localStorage.setItem("user", JSON.stringify({ ...current, ...res.data }));
      }
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || "Failed to save profile");
      if (e?.response?.status === 401 || e?.response?.status === 400) {
        router.replace("/login");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>Profile</h1>
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: 700 }}>
      <h1>Profile</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {profile && (
        <div style={{ marginBottom: "1rem", opacity: 0.85 }}>
          <div>
            <b>Email:</b> {profile.email}
          </div>
          <div>
            <b>Username:</b> {profile.username || "-"}
          </div>
        </div>
      )}

      <form
        onSubmit={save}
        style={{
          display: "grid",
          gap: "0.75rem",
          border: "1px solid #eee",
          padding: "1rem",
          borderRadius: 6,
        }}
      >
        <label>
          Full Name
          <input
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </label>

        <label>
          Phone
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </label>

        <label>
          Address
          <input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </label>

        <label>
          Avatar URL
          <input
            value={form.avatarUrl}
            onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
            style={{ width: "100%", padding: "0.5rem" }}
            placeholder="https://..."
          />
        </label>

        {form.avatarUrl ? (
          <img
            src={form.avatarUrl}
            alt="avatar"
            style={{ width: 80, height: 80, borderRadius: "50%" }}
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        ) : null}

        <button
          type="submit"
          disabled={saving}
          style={{ padding: "0.6rem", cursor: "pointer" }}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
    </main>
  );
}
