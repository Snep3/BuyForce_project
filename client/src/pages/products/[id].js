// client/src/pages/products/[id].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { http } from "../../config/http";

function normalizeImageUrl(url) {
  const u = (url || "").trim();
  if (!u) return "";
  if (!/^https?:\/\//i.test(u)) return `https://${u}`;
  return u;
}

export default function ProductDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        setImgError("");
        const res = await http.get(`/api/products/${id}`);
        setProduct(res.data);
      } catch (e) {
        console.error(e);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>Product</h1>
        <p>Loading...</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>Product</h1>
        <p>Not found</p>
      </main>
    );
  }

  const src = product.imageUrl ? normalizeImageUrl(product.imageUrl) : "";

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: 900 }}>
      <h1>{product.name}</h1>

      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: "1.25rem" }}>
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            overflow: "hidden",
            background: "#fafafa",
            height: 280,
            display: "grid",
            placeItems: "center",
            padding: 8,
          }}
        >
          {src && !imgError ? (
            <img
              src={src}
              alt={product.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              onError={() =>
                setImgError("Failed to load image (bad URL / blocked hotlink / mixed-content)")
              }
            />
          ) : null}

          {!src ? <span style={{ opacity: 0.6 }}>No image</span> : null}

          {src && imgError ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "red", fontSize: 12 }}>{imgError}</div>
              <div style={{ fontSize: 11, opacity: 0.75, marginTop: 6 }}>
                URL: {src}
              </div>
            </div>
          ) : null}
        </div>

        <div>
          <p style={{ fontSize: 18, marginTop: 0 }}>
            <b>Price:</b> ₪{product.price}
          </p>
          <p>
            <b>Category:</b> {product.category}
          </p>
          <p>
            <b>Stock:</b> {product.stock}
          </p>
          {product.description ? (
            <p>
              <b>Description:</b> {product.description}
            </p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
