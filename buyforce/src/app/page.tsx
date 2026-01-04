"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";

type Product = {
  id: number;
  name: string;
  price: number;
  old_price: number;
  image_url: string | null;
  category: string;
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setMessage("שגיאה בטעינת מוצרים"));
  }, []);

  const addToCart = async (productId: number) => {
    if (!user) {
      setMessage("יש להתחבר כדי להוסיף לסל");
      return;
    }

    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.uid,
        productId,
        quantity: 1,
      }),
    });

    if (!res.ok) {
      setMessage("שגיאה בהוספה לסל");
      return;
    }

    setMessage("המוצר נוסף לסל");
  };

  return (
    <main style={{ padding: 40 }}>
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 24,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 16,
              background: "white",
            }}
          >
            {p.image_url && (
              <img
                src={p.image_url}
                alt={p.name}
                style={{ width: "100%", height: 160, objectFit: "cover" }}
              />
            )}

            <h3>{p.name}</h3>
            <p>
              ₪{p.price}{" "}
              {p.old_price && (
                <span style={{ textDecoration: "line-through", color: "#888" }}>
                  ₪{p.old_price}
                </span>
              )}
            </p>

            <button onClick={() => addToCart(p.id)}>הוסף לסל</button>
          </div>
        ))}
      </section>

      {message && <p style={{ marginTop: 20, fontWeight: 700 }}>{message}</p>}
    </main>
  );
}
