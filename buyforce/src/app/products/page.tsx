"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

type Product = {
  id: number;
  name: string;
  price: number;
  old_price: number;
  category: string;
  image_url: string | null;
};

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(setProducts)
      .catch(() => setMsg("שגיאה בטעינת מוצרים"));
  }, []);

  const addToCart = async (productId: number) => {
    if (!user) {
      setMsg("יש להתחבר");
      return;
    }

    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.uid, productId }),
    });

    if (!res.ok) setMsg("שגיאה בהוספה לסל");
  };

  return (
    <main style={{ padding: 40 }}>
      <h1>🛍️ מוצרים</h1>

      {msg && <p style={{ color: "red" }}>{msg}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, 250px)", gap: 20 }}>
        {products.map(p => (
          <div key={p.id} style={{ border: "1px solid #ddd", padding: 16 }}>
            <img src={p.image_url ?? ""} style={{ width: "100%", height: 160, objectFit: "cover" }} />
            <h3>{p.name}</h3>
            <p>₪{p.price}</p>
            <button onClick={() => addToCart(p.id)}>הוסף לסל</button>
          </div>
        ))}
      </div>
    </main>
  );
}
