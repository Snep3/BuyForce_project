// client/src/pages/my-orders.js
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config/api";
import Link from "next/link";
import { useRouter } from "next/router";

// דף המציג את ההזמנות של המשתמש המחובר
export default function MyOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // פונקציה לטעינת ההזמנות מהשרת
  const fetchOrders = async (token) => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${API_URL}/api/orders/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "קרתה שגיאה בזמן טעינת ההזמנות"
      );
    } finally {
      setLoading(false);
    }
  };

  // טעינת ההזמנות של המשתמש המחובר בעת טעינת הדף
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) {
      // אם המשתמש לא מחובר – לשלוח אותו ללוגין
      router.replace("/login");
      return;
    }

    fetchOrders(token);
  }, [router]);

  // ביטול הזמנה
  const handleCancelOrder = async (orderId) => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const ok = window.confirm("בטוח שברצונך לבטל את ההזמנה?");
    if (!ok) return;

    try {
      setError("");

      await axios.patch(
        `${API_URL}/api/orders/${orderId}/cancel`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ריענון רשימת ההזמנות אחרי ביטול
      await fetchOrders(token);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "קרתה שגיאה בזמן ביטול ההזמנה"
      );
    }
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>ההזמנות שלי</h1>

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
        <Link href="/">דף הבית</Link>
      </div>

      {loading && <p>טוען הזמנות...</p>}

      {error && (
        <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>
      )}

      {!loading && !error && orders.length === 0 && (
        <p>אין לך עדיין הזמנות.</p>
      )}

      {/* הצגת רשימת ההזמנות בעיצוב רספונסיבי פשוט */}
      <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
        {orders.map((order) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #ddd",
              padding: "1rem",
              borderRadius: "4px",
            }}
          >
            <h3>הזמנה #{order.id}</h3>
            <p>סטטוס: {order.status}</p>
            <p>סכום כולל: {order.totalPrice}₪</p>

            {order.group && (
              <p>
                קבוצה:{" "}
                {order.group.name
                  ? `${order.group.name} (ID: ${order.group.id})`
                  : order.group.id}
              </p>
            )}

            {/* הצגת פרטי הפריטים בהזמנה */}
            {order.items && order.items.length > 0 && (
              <div style={{ marginTop: "0.5rem" }}>
                <strong>פריטים:</strong>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.product ? (
                        <Link href={`/products/${item.product.id}`}>
                          {item.product.name ||
                            `מוצר ${item.product.id}`}
                        </Link>
                      ) : (
                        item.product?.name ||
                        `מוצר ${item.product?.id}`
                      )}{" "}
                      – כמות: {item.quantity} – סה״כ: {item.totalPrice}₪
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
              נוצר ב:{" "}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : "לא ידוע"}
            </p>

            {/* כפתור ביטול הזמנה – רק אם היא עדיין בהמתנה */}
            {order.status === "pending" && (
              <button
                onClick={() => handleCancelOrder(order.id)}
                style={{
                  marginTop: "0.75rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                בטל הזמנה
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
