// client/src/pages/index.js
import Link from "next/link";
import NavBar from "../components/NavBar";


export default function Home() {
  return (
    <>
    <NavBar />
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>BuyForce</h1>
      <p>ברוך הבא למערכת הקניות המרוכזות</p>

      <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
        <Link href="/login">🔑 התחברות</Link>
        <Link href="/register">📝 הרשמה</Link>
        <Link href="/products">🛒 מוצרים</Link>
        <Link href="/admin/products">🛠 Admin</Link>
      </div>
    </main>
    </>
  );
}
