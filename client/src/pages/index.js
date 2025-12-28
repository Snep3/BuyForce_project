// client/src/pages/index.js
import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>ברוך הבא ל-BuyForce</h1>

      <p style={{ marginTop: "0.5rem" }}>
        בחר מהפעולות הבאות כדי להתחיל:
      </p>

      <ul style={{ marginTop: "1rem", lineHeight: "1.8" }}>
        <li>
          <Link href="/login">התחברות למערכת</Link>
        </li>
        <li>
          <Link href="/products">צפייה ברשימת המוצרים</Link>
        </li>
        <li>
          <Link href="/my-orders">ההזמנות שלי</Link>
        </li>
      </ul>
    </main>
  );
}
