// client/src/pages/wishlist.js
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { API_URL } from "../config/api";

// רשימת המוצרים ב־Wishlist של המשתמש
export default function WishlistPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // טעינת ה־wishlist מהשרת
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    async function fetchWishlist() {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(`${API_URL}/api/wishlist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setItems(res.data || []);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message ||
            "אירעה שגיאה בטעינת רשימת המעקב"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchWishlist();
  }, [router]);

  // הסרת מוצר מהרשימה
  async function handleRemove(productId) {
    if (!productId) return;
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      await axios.delete(
        `${API_URL}/api/wishlist/remove/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setItems((prev) =>
        prev.filter(
          (item) =>
            item.productId !== productId &&
            item.product?.id !== productId
        )
      );
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
          "אירעה שגיאה בעת הסרת המוצר מהרשימה"
      );
    }
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>רשימת מעקב (Wishlist)</h1>

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

      {loading && <p>טוען רשימת מעקב...</p>}

      {error && (
        <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>
      )}

      {!loading && !error && items.length === 0 && (
        <p>אין לך עדיין מוצרים ברשימת המעקב.</p>
      )}

      <div
        style={{
          display: "grid",
          gap: "1rem",
          marginTop: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        {items.map((item) => {
          const product = item.product || {};
          const productId = product.id || item.productId;

          return (
            <div
              key={item.id}
              style={{
                border: "1px solid #ddd",
                padding: "1rem",
                borderRadius: "4px",
              }}
            >
              <h3>
                {product.name
                  ? product.name
                  : `מוצר ${productId || ""}`}
              </h3>
              {product.price && (
                <p>מחיר: {product.price} ₪</p>
              )}
              {product.category && (
                <p>קטגוריה: {product.category}</p>
              )}

              <div
                style={{
                  marginTop: "0.75rem",
                  display: "flex",
                  gap: "0.5rem",
                }}
              >
                {productId && (
                  <Link href={`/products/${productId}`}>
                    פרטי המוצר
                  </Link>
                )}

                <button
                  onClick={() => handleRemove(productId)}
                  style={{
                    padding: "0.4rem 0.8rem",
                    borderRadius: "4px",
                    border: "1px solid #c00",
                    background: "#fff5f5",
                    cursor: "pointer",
                  }}
                >
                  הסרה מהרשימה
                </button>
              </div>

              {item.createdAt && (
                <p
                  style={{
                    fontSize: "0.8rem",
                    marginTop: "0.5rem",
                    color: "#555",
                  }}
                >
                  נוסף לרשימה בתאריך{" "}
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
