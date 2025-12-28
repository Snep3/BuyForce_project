// client/src/pages/products/[id].js
import { useState } from "react";
import axios from "axios";
import { API_URL } from "../../config/api";
import { useRouter } from "next/router";
import Link from "next/link";
import ProductComments from "../../components/ProductComments";

// פונקציה לקבלת טוקן המשתמש מהלוקל סטורג'
function getAuth() {
  if (typeof window === "undefined") return { token: null, user: null };
  const token = localStorage.getItem("token");
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;
  return { token, user };
}

// עמוד להצגת פרטי מוצר
export default function ProductDetailsPage({ product }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!product) {
    return (
      <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>מוצר לא נמצא</h1>
        <Link href="/products">חזרה לרשימת המוצרים</Link>
      </main>
    );
  }

  // טיפול ביצירת הזמנה
  async function handleCreateOrder() {
    setError("");
    setLoading(true);

    try {
      const { token } = getAuth();
      if (!token) {
        // אם המשתמש לא מחובר – שולחים ל־Login
        router.push("/login");
        return;
      }

      // 1) מביאים את הקבוצה לפי productId
      const groupRes = await axios.get(
        `${API_URL}/api/groups/by-product/${product.id}`
      );

      // אם לא נמצאה קבוצת רכישה פעילה למוצר – מראים שגיאה
      const group = groupRes.data;
      if (!group || !group.id) {
        setError("לא נמצאה קבוצת רכישה פעילה למוצר הזה");
        return;
      }

      // 2) יוצרים הזמנה בפורמט החדש: groupId + items[]
      await axios.post(
        `${API_URL}/api/orders`,
        {
          groupId: group.id,
          items: [
            {
              productId: product.id,
              quantity: 1,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 3) אחרי יצירת ההזמנה – עוברים ל"ההזמנות שלי"
      router.push("/my-orders");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "שגיאה בביצוע ההזמנה";
      // message לפעמים מגיע כמערך
      if (Array.isArray(msg)) {
        setError(msg.join(" | "));
      } else {
        setError(String(msg));
      }
    } finally {
      setLoading(false);
    }
  }

  
  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>פרטי מוצר</h1>

      <div style={{ marginBottom: "1rem" }}>
        <Link href="/products">⬅ חזרה לרשימת המוצרים</Link>
      </div>

      <section
        style={{
          border: "1px solid #ddd",
          padding: "1rem",
          borderRadius: "4px",
          maxWidth: "400px",
        }}
      >
        // הצגת פרטי המוצר
        <h2>{product.name}</h2>
        <p>קטגוריה: {product.category}</p>
        <p>מחיר: {product.price}₪</p>
        {product.description && <p>תיאור: {product.description}</p>}

        {error && (
          <p style={{ color: "red", marginTop: "0.75rem" }}>{error}</p>
        )}

// כפתור לביצוע הזמנה או הצטרפות לקבוצת רכישה
        <button
          onClick={handleCreateOrder}
          disabled={loading}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            cursor: "pointer",
          }}
        >
          {loading ? "יוצר הזמנה..." : "בצע הזמנה / הצטרף לקבוצה"}
        </button>
        <ProductComments productId={product.id} />

      </section>
    </main>
  );
}

// SSR – טעינת מוצר לפי id
export async function getServerSideProps({ params }) {
  try {
    const res = await axios.get(`${API_URL}/api/products/${params.id}`);
    return {
      props: {
        product: res.data,
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: {
        product: null,
      },
    };
  }
}
