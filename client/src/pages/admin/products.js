import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { API_URL } from "../../config/api";
import NavBar from "../../components/NavBar";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export default function AdminProductsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      setError("");
      const token = getToken();
      const res = await axios.get(`${API_URL}/api/admin/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    try {
      const token = getToken();
      
      // יצירת אובייקט בסיסי עם שדות החובה
      const payload = {
        name,
        price: Number(price),
        category,
      };

      // הוספת stock רק אם הוא לא ריק, אחרת השרת ישתמש בברירת מחדל
      if (stock !== "") {
        payload.stock = Number(stock);
      }

      // שינוי קריטי: שליחת תיאור רק אם הוא לא ריק. 
      // אם הוא ריק, אנחנו לא שולחים את השדה בכלל כדי למנוע את שגיאת "should not be empty"
      if (description && description.trim() !== "") {
        payload.description = description;
      }

      const res = await axios.post(`${API_URL}/api/admin/products`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts((prev) => [res.data, ...prev]);
      // איפוס שדות הטופס
      setName(""); setPrice(""); setCategory(""); setStock(""); setDescription("");
    } catch (err) {
      setError(err?.response?.data?.message || "Create failed");
    }
  }

  async function handleEdit(product) {
    const id = product.id || product._id;
    const newName = prompt("name", product.name ?? "");
    if (newName === null) return;
    const newPrice = prompt("price", String(product.price ?? ""));
    if (newPrice === null) return;
    const newCategory = prompt("category", typeof product.category === 'object' ? product.category.name : product.category);
    if (newCategory === null) return;
    const newStock = prompt("stock", String(product.stock ?? 0));
    const newDescription = prompt("description", product.description ?? "");

    try {
      const token = getToken();
      const payload = {
        name: newName,
        price: Number(newPrice),
        category: newCategory,
      };

      if (newStock !== "" && newStock !== null) {
        payload.stock = Number(newStock);
      }

      // אותו היגיון בעריכה: אם התיאור החדש ריק, לא שולחים אותו כדי לא להכשיל וולידציה
      if (newDescription && newDescription.trim() !== "") {
        payload.description = newDescription;
      }

      const res = await axios.put(`${API_URL}/api/admin/products/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts((prev) =>
        prev.map((p) => ((p.id || p._id) === id ? res.data : p))
      );
    } catch (err) {
      setError(err?.response?.data?.message || "Update failed");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure?")) return;
    try {
      const token = getToken();
      await axios.delete(`${API_URL}/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => (p.id || p._id) !== id));
    } catch (err) {
      setError("Delete failed");
    }
  }

  return (
    <>
      <NavBar />
      <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>Admin / Products</h1>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <Link href="/">🏠 Home</Link>
          <Link href="/admin/groups">👥 Admin Groups</Link>
          <Link href="/products">🛒 Public Products</Link>
        </div>

        {error && <p style={{ color: "crimson" }}>{error}</p>}

        <section style={{ border: "1px solid #ddd", padding: "1rem", borderRadius: 8, marginBottom: "1.5rem" }}>
          <h2>Create Product</h2>
          <form onSubmit={handleCreate} style={{ display: "grid", gap: "0.75rem", maxWidth: 420 }}>
            <input placeholder="name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input placeholder="price" value={price} onChange={(e) => setPrice(e.target.value)} required />
            <input placeholder="category (ID or Name)" value={category} onChange={(e) => setCategory(e.target.value)} required />
            <input placeholder="stock (optional)" value={stock} onChange={(e) => setStock(e.target.value)} />
            <input placeholder="description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
            <button type="submit">Create</button>
          </form>
        </section>

        <section>
          <h2>Products List</h2>
          {loading ? <p>Loading...</p> : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: "0.5rem" }}>Name</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: "0.5rem" }}>Price</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: "0.5rem" }}>Category</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: "0.5rem" }}>Stock</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: "0.5rem" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id || p._id}>
                    <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>{p.name}</td>
                    <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>{p.price}</td>
                    <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>
                      {typeof p.category === 'object' ? p.category?.name : (p.category || 'General')}
                    </td>
                    <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>{p.stock ?? 0}</td>
                    <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>
                      <button onClick={() => handleEdit(p)}>Edit</button>
                      <button onClick={() => handleDelete(p.id || p._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </>
  );
}