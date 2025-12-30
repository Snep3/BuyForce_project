// client/pages/products/[id].js
import axios from "axios";
import { API_URL } from "../../config/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ProductDetailPage({ initialProduct }) {
  const router = useRouter();
  const [product, setProduct] = useState(initialProduct);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setProduct(initialProduct);
  }, [initialProduct]);

  async function handleAddComment(e) {
    e.preventDefault();
    setError("");

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      setError("אתה חייב להיות מחובר כדי להוסיף תגובה.");
      return;
    }

    try {
      setSending(true);
      const res = await axios.post(
        `${API_URL}/api/products/${product.id}/comments`,
        { content: comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProduct(res.data);
      setComment("");
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.error || "בעיה בהוספת התגובה, נסה שוב מאוחר יותר."
      );
    } finally {
      setSending(false);
    }
  }

  if (!product) {
    return (
      <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <p>המוצר לא נמצא.</p>
        <button onClick={() => router.push("/products")}>
          חזרה לרשימת מוצרים
        </button>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <Link href="/products">⬅ חזרה לרשימת מוצרים</Link>

      <h1>{product.name}</h1>
      <p>מחיר: {product.price}₪</p>
      <p>קטגוריה: {product.category}</p>
      {product.description && <p>תיאור: {product.description}</p>}

      <section style={{ marginTop: "2rem" }}>
        <h2>תגובות</h2>
        {product.comments && product.comments.length > 0 ? (
          <ul>
            {product.comments.map((c, idx) => (
              <li key={idx}>
                <strong>{c.userId?.username || "משתמש"}</strong>: {c.content}
              </li>
            ))}
          </ul>
        ) : (
          <p>עדיין אין תגובות.</p>
        )}

        <form
          onSubmit={handleAddComment}
          style={{
            marginTop: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            maxWidth: "400px",
          }}
        >
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="כתוב תגובה..."
            style={{ minHeight: "80px", padding: "0.5rem" }}
          />

          {error && <div style={{ color: "red" }}>{error}</div>}

          <button
            type="submit"
            disabled={sending || !comment.trim()}
            style={{ padding: "0.5rem" }}
          >
            {sending ? "שולח..." : "הוסף תגובה"}
          </button>
        </form>
      </section>
    </main>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const res = await axios.get(`${API_URL}/api/products/${params.id}`);
    return {
      props: {
        initialProduct: res.data,
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: {
        initialProduct: null,
      },
    };
  }
}
