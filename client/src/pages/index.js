// client/pages/index.js
import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>BuyForce</h1>
      <p>ברוך הבא למערכת הקניות המרוכזות</p>

      <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
        <Link href="/login">🔑 התחברות</Link>
        <Link href="/register">📝 הרשמה</Link>
        <Link href="/products">🛒 מוצרים</Link>
      </div>
    </main>
  );
}
