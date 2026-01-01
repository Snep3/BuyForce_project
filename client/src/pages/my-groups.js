// client/src/pages/my-groups.js
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config/api";
import Link from "next/link";
import { useRouter } from "next/router";

export default function MyGroupsPage() {
  const router = useRouter();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchGroups = async (token) => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${API_URL}/api/groups/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    fetchGroups(token);
  }, [router]);

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>הקבוצות שלי</h1>

      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <Link href="/products">⬅ חזרה לרשימת המוצרים</Link>
        <Link href="/my-orders">ההזמנות שלי</Link>
        <Link href="/">דף הבית</Link>
      </div>

      {loading && <p>טוען קבוצות...</p>}

      {error && (
        <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>
      )}

      {!loading && !error && groups.length === 0 && (
        <p>אתה עדיין לא שייך לשום קבוצה.</p>
      )}

      <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
        {groups.map((group) => {
          const stats = group.stats || {};
          const participantsCount = stats.participantsCount ?? 0;
          const minParticipants = stats.minParticipants ?? group.minParticipants ?? 0;
          const remainingToTarget = stats.remainingToTarget ?? Math.max(0, minParticipants - participantsCount);
          const progressPercent = stats.progressPercent ?? (
            minParticipants > 0
              ? Math.min(100, Math.round((participantsCount / minParticipants) * 100))
              : 0
          );
          const isFull = stats.isFull ?? remainingToTarget <= 0;

          return (
            <div
              key={group.id}
              style={{
                border: "1px solid #ddd",
                padding: "1rem",
                borderRadius: "4px",
              }}
            >
              <h3>{group.name}</h3>

              {group.product && (
                <p>
                  מוצר:{" "}
                  <Link href={`/products/${group.product.id}`}>
                    {group.product.name || `מוצר ${group.product.id}`}
                  </Link>
                </p>
              )}

              {group.description && <p>{group.description}</p>}

              <p>
                משתתפים: {participantsCount} / {minParticipants}
              </p>
              <p>
                נשארו עוד:{" "}
                {remainingToTarget > 0
                  ? `${remainingToTarget} משתתפים ליעד`
                  : "הקבוצה מלאה!"}
              </p>

              {/* בר התקדמות פשוט */}
              <div
                style={{
                  marginTop: "0.5rem",
                  background: "#eee",
                  borderRadius: "8px",
                  overflow: "hidden",
                  height: "10px",
                }}
              >
                <div
                  style={{
                    width: `${progressPercent}%`,
                    height: "100%",
                    transition: "width 0.3s",
                  }}
                />
              </div>

              <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
                סטטוס קבוצה:{" "}
                {isFull
                  ? "הקבוצה הגיעה ליעד"
                  : group.isActive
                  ? "פתוחה להצטרפות"
                  : "סגורה"}
              </p>
            </div>
          );
        })}
      </div>
    </main>
  );
}
