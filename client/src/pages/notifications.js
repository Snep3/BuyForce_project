import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { http } from "../config/http";

export default function NotificationsPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/login");
      return;
    }

    (async () => {
      try {
        setError("");
        const res = await http.get("/api/notifications/my");
        setItems(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error(e);
        setError(e?.response?.data?.message || "Failed to load notifications");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  async function markRead(id) {
    setBusyId(id);
    try {
      await http.patch(`/api/notifications/${id}/read`);
      setItems((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Failed to mark as read");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: 900 }}>
      <h1>Notifications</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}

      {!loading && items.length === 0 && <p>No notifications yet.</p>}

      <div style={{ display: "grid", gap: "0.75rem", marginTop: "1rem" }}>
        {items.map((n) => (
          <div
            key={n.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 6,
              padding: "0.9rem",
              background: n.isRead ? "#fafafa" : "white",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <b>{n.type}</b>
                <span style={{ marginLeft: 10, opacity: 0.7, fontSize: 13 }}>
                  {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
                </span>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => markRead(n.id)}
                  disabled={busyId === n.id}
                  style={{ cursor: "pointer" }}
                >
                  {busyId === n.id ? "..." : "Mark read"}
                </button>
              )}
            </div>

            <p style={{ marginTop: 8 }}>{n.message}</p>

            <div style={{ marginTop: 8, opacity: 0.75, fontSize: 13 }}>
              Status: {n.isRead ? "Read" : "Unread"}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
