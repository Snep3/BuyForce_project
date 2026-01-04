"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string | null;
};

export default function CartPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) router.push("/login");
      setUser(u);
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    if (!user) return;

    fetch(`/api/cart?userId=${encodeURIComponent(user.uid)}`)
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []));
  }, [user]);

  const removeItem = async (id: number) => {
    await fetch(`/api/cart?id=${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const total = useMemo(
    () => items.reduce((s, i) => s + i.price * i.quantity, 0),
    [items]
  );

  return (
    <main style={{ padding: 40 }}>
      <h1>🛒 סל קניות</h1>

      {items.length === 0 ? (
        <p>הסל ריק</p>
      ) : (
        <>
          {items.map((i) => (
            <div key={i.id} style={{ marginBottom: 16 }}>
              <strong>{i.name}</strong> – ₪{i.price} × {i.quantity}
              <button onClick={() => removeItem(i.id)}>הסר</button>
            </div>
          ))}

          <h2>סה״כ: ₪{total}</h2>
        </>
      )}

      <button onClick={() => router.push("/")}>חזרה לחנות</button>
    </main>

  );


  
}
