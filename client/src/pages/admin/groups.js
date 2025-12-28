// client/src/pages/admin/groups.js
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config/api";
import { useRouter } from "next/router";
import Link from "next/link";

export default function AdminGroupsPage() {
  const router = useRouter();

  const [groups, setGroups] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    productId: "",
    minParticipants: "",
    isActive: true,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // טעינת הקבוצות ברגע שהעמוד נטען
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/login");
      return;
    }
    fetchGroups();
  }, []);

  async function fetchGroups() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
        return;
      }

      const res = await axios.get(`${API_URL}/api/admin/groups`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGroups(res.data);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "שגיאה בטעינת הקבוצות";
      setError(Array.isArray(msg) ? msg.join(" | ") : String(msg));
    }
  }

  function resetForm() {
    setForm({
      name: "",
      productId: "",
      minParticipants: "",
      isActive: true,
    });
    setEditingId(null);
    setError("");
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    if (name === "isActive") {
      setForm((prev) => ({
        ...prev,
        isActive: type === "checkbox" ? checked : value === "true",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleEdit(group) {
    setEditingId(group.id);
    setForm({
      name: group.name || "",
      productId: group.productId || "",
      minParticipants:
        typeof group.minParticipants === "number"
          ? String(group.minParticipants)
          : "",
      isActive: !!group.isActive,
    });
    setError("");
  }

  async function handleDelete(id) {
    if (!window.confirm("למחוק את הקבוצה הזו?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
        return;
      }

      await axios.delete(`${API_URL}/api/admin/groups/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchGroups();
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "שגיאה במחיקת הקבוצה";
      setError(Array.isArray(msg) ? msg.join(" | ") : String(msg));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      // בניית payload נקי לפי ה-DTO
      const payload = {};

      if (form.name && form.name.trim() !== "") {
        payload.name = form.name.trim();
      }

      // productId אופציונלי – נשלח רק אם לא ריק
      if (form.productId && form.productId.trim() !== "") {
        payload.productId = form.productId.trim();
      }

      // minParticipants → מספר
      if (form.minParticipants !== "" && form.minParticipants != null) {
        const n = Number(form.minParticipants);
        if (!Number.isNaN(n)) {
          payload.minParticipants = n;
        }
      }

      // isActive → boolean
      if (typeof form.isActive === "boolean") {
        payload.isActive = form.isActive;
      }

      if (editingId) {
        // עדכון קבוצה קיימת
        const url = `${API_URL}/api/admin/groups/${editingId}`;
        await axios.put(url, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // יצירת קבוצה חדשה
        const url = `${API_URL}/api/admin/groups`;
        await axios.post(url, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      await fetchGroups();
      resetForm();
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "שגיאה בשמירת הקבוצה";
      setError(Array.isArray(msg) ? msg.join(" | ") : String(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>ניהול קבוצות (Admin)</h1>

      <div style={{ marginBottom: "1rem" }}>
        <Link href="/admin/products">לניהול מוצרים</Link> |{" "}
        <Link href="/products">לרשימת המוצרים</Link> |{" "}
        <Link href="/">דף הבית</Link>
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
      )}

      <section
        style={{
          border: "1px solid #ddd",
          padding: "1rem",
          borderRadius: "4px",
          marginBottom: "2rem",
          maxWidth: "400px",
        }}
      >
        <h2>{editingId ? "עריכת קבוצה" : "יצירת קבוצה חדשה"}</h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label>
            שם קבוצה
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.4rem" }}
            />
          </label>

          <label>
            Product ID (לא חובה)
            <input
              type="text"
              name="productId"
              value={form.productId}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.4rem" }}
            />
          </label>

          <label>
            מינימום משתתפים
            <input
              type="number"
              name="minParticipants"
              value={form.minParticipants}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.4rem" }}
            />
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
            />
            קבוצה פעילה
          </label>

          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
            <button type="submit" disabled={loading} style={{ padding: "0.4rem 0.8rem", cursor: "pointer" }}>
              {loading ? "שומר..." : editingId ? "עדכן קבוצה" : "צור קבוצה"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                style={{ padding: "0.4rem 0.8rem", cursor: "pointer" }}
              >
                ביטול עריכה
              </button>
            )}
          </div>
        </form>
      </section>

      <section>
        <h2>קבוצות קיימות</h2>
        {groups.length === 0 && <p>אין קבוצות עדיין.</p>}

        <div style={{ display: "grid", gap: "0.75rem", maxWidth: "600px" }}>
          {groups.map((g) => (
            <div
              key={g.id}
              style={{
                border: "1px solid #ddd",
                padding: "0.75rem",
                borderRadius: "4px",
              }}
            >
              <strong>{g.name}</strong> (ID: {g.id})
              <div>מינימום משתתפים: {g.minParticipants}</div>
              <div>סטטוס: {g.isActive ? "פעילה" : "לא פעילה"}</div>
              <div>Product ID: {g.productId || "אין"}</div>

              <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => handleEdit(g)}
                  style={{ padding: "0.3rem 0.6rem", cursor: "pointer" }}
                >
                  ערוך
                </button>
                <button
                  onClick={() => handleDelete(g.id)}
                  style={{ padding: "0.3rem 0.6rem", cursor: "pointer" }}
                >
                  מחק
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
