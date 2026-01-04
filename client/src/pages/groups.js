// client/src/pages/groups.js
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { API_URL } from "../config/api";

export default function GroupsPage() {
  const router = useRouter();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joinLoadingId, setJoinLoadingId] = useState(null);

  useEffect(() => {
    async function fetchGroups() {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(`${API_URL}/api/groups`);
        setGroups(res.data || []);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message ||
            "קרתה שגיאה בזמן טעינת הקבוצות"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchGroups();
  }, []);

  async function handleJoin(groupId) {
    const token = typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setJoinLoadingId(groupId);
      setError("");

      const res = await axios.post(
        `${API_URL}/api/groups/${groupId}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // מעדכן את הקבוצה ברשימה לפי החזרה מהשרת (progress, currentParticipants וכו')
      setGroups((prev) =>
        prev.map((g) =>
          g.id === groupId
            ? {
                ...g,
                currentParticipants:
                  res.data.currentParticipants ?? g.currentParticipants,
                progress: res.data.progress ?? g.progress,
                isActive:
                  typeof res.data.isActive === "boolean"
                    ? res.data.isActive
                    : g.isActive,
              }
            : g
        )
      );
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "קרתה שגיאה בזמן הצטרפות לקבוצה"
      );
    } finally {
      setJoinLoadingId(null);
    }
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>קבוצות רכישה</h1>

      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <Link href="/products">⬅ חזרה לרשימת המוצרים</Link>
        <Link href="/my-groups">הקבוצות שלי</Link>
      </div>

      {loading && <p>טוען קבוצות...</p>}
      {error && (
        <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>
      )}

      {!loading && !error && groups.length === 0 && (
        <p>אין כרגע קבוצות פעילות.</p>
      )}

      <div
        style={{
          display: "grid",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        {groups.map((group) => {
          const progress = group.progress ?? 0;
          const isFull =
            progress >= 100 || group.isActive === false;

          return (
            <div
              key={group.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "1rem",
              }}
            >
              <h3>{group.name}</h3>

              {group.product && (
                <p>
                  מוצר:{" "}
                  {group.product.name ||
                    `מוצר ${group.product.id}`}
                </p>
              )}

              {group.description && (
                <p style={{ marginTop: "0.25rem" }}>
                  {group.description}
                </p>
              )}

              <p style={{ marginTop: "0.25rem" }}>
                משתתפים: {group.currentParticipants ?? 0} /{" "}
                {group.minParticipants}
              </p>

              <div
                style={{
                  marginTop: "0.5rem",
                  background: "#eee",
                  borderRadius: "4px",
                  overflow: "hidden",
                  height: "10px",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(progress, 100)}%`,
                    height: "100%",
                    background: "#4caf50",
                    transition: "width 0.2s",
                  }}
                />
              </div>

              <p
                style={{
                  marginTop: "0.25rem",
                  fontSize: "0.85rem",
                }}
              >
                התקדמות: {progress}%
              </p>

              {isFull && (
                <p
                  style={{
                    marginTop: "0.5rem",
                    color: "#d2691e",
                    fontWeight: "bold",
                  }}
                >
                  הקבוצה מלאה – מחכים לאישור תשלום / משלוח
                </p>
              )}

              <button
                onClick={() => handleJoin(group.id)}
                disabled={isFull || joinLoadingId === group.id}
                style={{
                  marginTop: "0.75rem",
                  padding: "0.5rem 1rem",
                  cursor:
                    isFull || joinLoadingId === group.id
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    isFull || joinLoadingId === group.id ? 0.6 : 1,
                }}
              >
                {isFull
                  ? "הקבוצה מלאה"
                  : joinLoadingId === group.id
                  ? "מצטרף..."
                  : "הצטרף לקבוצה בשקל"}
              </button>
            </div>
          );
        })}
      </div>
    </main>
  );
}
