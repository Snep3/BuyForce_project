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

  const isLoggedIn = !!user;

  const linkStyle = (href) => ({
    textDecoration: "none",
    fontWeight: router.pathname === href ? "700" : "400",
  });

  return (
    <nav
      style={{
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        padding: "0.75rem 1rem",
        borderBottom: "1px solid #eee",
        marginBottom: "1.25rem",
        fontFamily: "sans-serif",
        flexWrap: "wrap",
      }}
    >
      {/* Public */}
      <Link href="/" style={linkStyle("/")}>
        Home
      </Link>
      <Link href="/products" style={linkStyle("/products")}>
        Products
      </Link>

      {/* User (requires login) */}
      {isLoggedIn && (
        <>
          <Link href="/groups" style={linkStyle("/groups")}>
            Groups
          </Link>
          <Link href="/my-groups" style={linkStyle("/my-groups")}>
            My Groups
          </Link>
          <Link href="/my-orders" style={linkStyle("/my-orders")}>
            My Orders
          </Link>
          <Link href="/wishlist" style={linkStyle("/wishlist")}>
            Wishlist
          </Link>
          <Link href="/profile" style={linkStyle("/profile")}>
            Profile
          </Link>
          <Link href="/notifications" style={linkStyle("/notifications")}>
            Notifications
          </Link>
        </>
      )}

      {/* Admin */}
      {user?.is_admin && (
        <>
          <span style={{ opacity: 0.4 }}>|</span>
          <Link href="/admin/products" style={linkStyle("/admin/products")}>
            Admin Products
          </Link>
          <Link href="/admin/groups" style={linkStyle("/admin/groups")}>
            Admin Groups
          </Link>
        </>
      )}

      <div style={{ marginLeft: "auto", display: "flex", gap: "0.75rem" }}>
        {isLoggedIn ? (
          <>
            <span style={{ opacity: 0.8 }}>
              {user.username || user.email} {user.is_admin ? "(admin)" : ""}
            </span>
            <button onClick={logout} style={{ cursor: "pointer" }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" style={linkStyle("/login")}>
              Login
            </Link>
            <Link href="/register" style={linkStyle("/register")}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
