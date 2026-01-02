import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function NavBar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("user");
    setUser(raw ? JSON.parse(raw) : null);
  }, [router.pathname]);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  return (
    <nav
      style={{
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        padding: "0.75rem 1rem",
        borderBottom: "1px solid #eee",
        marginBottom: "1.5rem",
        fontFamily: "sans-serif",
      }}
    >
      <Link href="/">Home</Link>
      <Link href="/products">Products</Link>
      
      {/* הקישור החדש מופיע כאן, מימין ל-Products, רק אם המשתמש מחובר */}
      {user && <Link href="/my-groups">My Groups</Link>}

      {user?.is_admin && (
        <>
          <Link href="/admin/products">Admin Products</Link>
          <Link href="/admin/groups">Admin Groups</Link>
        </>
      )}

      <div style={{ marginLeft: "auto", display: "flex", gap: "0.75rem" }}>
        {user ? (
          <>
            <span style={{ opacity: 0.8 }}>
              {user.username} {user.is_admin ? "(admin)" : ""}
            </span>
            <button onClick={logout} style={{ cursor: "pointer" }}>
              Logout
            </button>
          </>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}