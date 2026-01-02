// client/pages/products/index.js
import axios from "axios";
import { API_URL } from "../../config/api";
import Link from "next/link";
import NavBar from "../../components/NavBar";


export default function ProductsPage({ products }) {
  return (
    <>
    <NavBar />
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>מוצרים</h1>

      <div style={{ marginBottom: "1rem" }}>
        <Link href="/">⬅ חזרה לדף הבית</Link>
      </div>

      {products.length === 0 && <p>אין מוצרים עדיין.</p>}

      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "1fr" }}>
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ddd",
              padding: "1rem",
              borderRadius: "4px",
            }}
          >
            <h3>{p.name}</h3>
            <p>מחיר: {p.price}₪</p>
            <p>קטגוריה: {p.category}</p>
            <Link href={`/products/${p.id}`}>לפרטי מוצר ➜</Link>
          </div>
        ))}
      </div>
    </main>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const res = await axios.get(`${API_URL}/api/products`);
    return {
      props: {
        products: res.data,
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: {
        products: [],
      },
    };
  }
}
