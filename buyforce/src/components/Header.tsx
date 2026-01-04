"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) {
      setCartCount(0);
      return;
    }

    fetch(`/api/cart?userId=${encodeURIComponent(user.uid)}`)
      .then((r) => r.json())
      .then((data) => {
        const items = Array.isArray(data) ? data : [];
        const count = items.reduce(
          (sum: number, it: any) => sum + (Number(it.quantity) || 1),
          0
        );
        setCartCount(count);
      })
      .catch(() => {});
  }, [user]);

  return (
    <header
      style={{
        background: "white",
        padding: "16px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #eee",
      }}
    >
      <div
        style={{ cursor: "pointer", fontWeight: 800 }}
        onClick={() => router.push("/")}
      >
        🛒 GroupBuy
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {user && (
          <span style={{ fontWeight: 700 }}>
            שלום, {user.displayName || user.email}
          </span>
        )}

        <button onClick={() => router.push("/cart")}>
          סל ({cartCount})
        </button>

        {user ? (
          <button onClick={() => signOut(auth)}>Logout</button>
        ) : (
          <button onClick={() => router.push("/login")}>Sign In</button>
        )}
      </div>
    </header>
  );
}
