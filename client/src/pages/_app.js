// client/src/pages/_app.js
import "@/styles/globals.css";
import { useEffect } from "react";
import { useRouter } from "next/router";

function getAuth() {
  if (typeof window === "undefined") return { token: null, user: null };
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  return { token, user };
}

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // חוסמים רק Routes של Admin
    const isAdminRoute = router.pathname.startsWith("/admin");
    if (!isAdminRoute) return;

    const { token, user } = getAuth();
    const isUserAdmin = user?.is_admin || user?.isAdmin;
    if (!token || !isUserAdmin) {
      router.replace("/login");
    }
  }, [router.pathname]);

  return <Component {...pageProps} />;
}
