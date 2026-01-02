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
      // תיקון: הוסר ה-/admin מהנתיב
      const res = await axios.get(`${API_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  const getExactCategoryName = (input) => {
    if (!input) return "";
    const val = String(input).trim();
    const idToName = {
      "1": "Electronics",
      "2": "Home Appliances",
      "3": "Phones",
      "4": "Headphones",
      "5": "Laptops",
      "6": "Mixed",
      "7": "Fashion",
      "8": "Gadgets",
      "9": "Seasonal Items"
    };
    if (idToName[val]) return idToName[val];
    const lowerInput = val.toLowerCase();
    const foundName = Object.values(idToName).find(name => name.toLowerCase() === lowerInput);
    return foundName || val;
  };

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    try {
      const token = getToken();
      const payload = {
        name,
        price: Number(price),
        category: getExactCategoryName(category),
      };
      if (stock !== "") payload.stock = Number(stock);
      if (description?.trim()) payload.description = description;

      // תיקון: הוסר ה-/admin מהנתיב
      const res = await axios.post(`${API_URL}/api/products`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts((prev) => [res.data, ...prev]);
      setName(""); setPrice(""); setCategory(""); setStock(""); setDescription("");
    } catch (err) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(", ") : msg || "Create failed");
    }
  }

  async function handleEdit(product) {
    const id = product.id || product._id;
    const newName = prompt("Name:", product.name);
    if (!newName) return;
    const newPrice = prompt("Price:", product.price);
    if (!newPrice) return;
    const currentCat = typeof product.category === 'object' ? product.category.name : product.category;
    const catInput = prompt("Category (Name or ID):", currentCat);
    if (!catInput) return;

    try {
      const token = getToken();
      const payload = {
        name: newName,
        price: Number(newPrice),
        category: getExactCategoryName(catInput), 
      };
      const newStock = prompt("Stock:", product.stock);
      if (newStock !== null && newStock !== "") payload.stock = Number(newStock);
      
      // תיקון: הוסר ה-/admin מהנתיב
      const res = await axios.put(`${API_URL}/api/products/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.map((p) => ((p.id || p._id) === id ? res.data : p)));
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  }

  async function handleDelete(id) {
  if (!confirm("Are you sure?")) return;
  try {
    const token = getToken();
    await axios.delete(`${API_URL}/api/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // הסרה מהרשימה אם המחיקה הצליחה
    setProducts((prev) => prev.filter((p) => (p.id || p._id) !== id));
  } catch (err) {
    if (err.response?.status === 404) {
      // אם המוצר ממילא לא קיים בשרת, פשוט נסיר אותו מהמסך
      setProducts((prev) => prev.filter((p) => (p.id || p._id) !== id));
    } else {
      setError("Delete failed");
    }
  }
}
  return (
    <>
      <NavBar />
      <main style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
        <h1>Admin / Products</h1>

        <nav style={{ 
          display: "flex", 
          gap: "1rem", 
          marginBottom: "2rem", 
          padding: "10px", 
          background: "#f8f9fa", 
          borderRadius: "8px",
          border: "1px solid #e0e0e0"
        }}>
          <Link href="/admin/products" style={{ 
            padding: "8px 16px",
            borderRadius: "5px",
            textDecoration: "none",
            fontWeight: "bold",
            backgroundColor: "#007bff", 
            color: "#fff" 
          }}>
            📦 Admin Products
          </Link>

          <Link href="/admin/groups" style={{ 
            padding: "8px 16px",
            borderRadius: "5px",
            textDecoration: "none",
            fontWeight: "bold",
            color: "#007bff"
          }}>
            👥 Admin Groups
          </Link>

          <Link href="/products" style={{ 
            padding: "8px 16px",
            textDecoration: "none",
            color: "#007bff",
            marginLeft: "auto"
          }}>
            🛒 View Store
          </Link>
        </nav>

        {error && <div style={{ color: "white", background: "#d9534f", padding: "15px", borderRadius: "5px", marginBottom: "20px" }}>{error}</div>}

        <section style={{ border: "1px solid #ddd", padding: "1rem", borderRadius: 8, marginBottom: "1.5rem" }}>
          <h2>Create Product</h2>
          <form onSubmit={handleCreate} style={{ display: "grid", gap: "0.75rem", maxWidth: 420 }}>
            <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
            <input placeholder="Category (e.g. 2 or Electronics)" value={category} onChange={(e) => setCategory(e.target.value)} required />
            <input placeholder="Stock (Optional)" value={stock} onChange={(e) => setStock(e.target.value)} />
            <input placeholder="Description (Optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
            <button type="submit" style={{ padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
              Create Product
            </button>
          </form>
        </section>

        <section>
          <h2>Products List</h2>
          {loading ? <p>Loading products...</p> : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8f8f8" }}>
                  <th style={{ textAlign: "left", padding: "10px", borderBottom: "2px solid #ddd" }}>Name</th>
                  <th style={{ textAlign: "left", padding: "10px", borderBottom: "2px solid #ddd" }}>Price</th>
                  <th style={{ textAlign: "left", padding: "10px", borderBottom: "2px solid #ddd" }}>Category</th>
                  <th style={{ textAlign: "left", padding: "10px", borderBottom: "2px solid #ddd" }}>Stock</th>
                  <th style={{ textAlign: "left", padding: "10px", borderBottom: "2px solid #ddd" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id || p._id}>
                    <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{p.name}</td>
                    <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>${p.price}</td>
                    <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                      {typeof p.category === 'object' ? p.category?.name : (p.category || 'General')}
                    </td>
                    <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{p.stock ?? 0}</td>
                    <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                      <button onClick={() => handleEdit(p)} style={{ marginRight: "5px" }}>Edit</button>
                      <button onClick={() => handleDelete(p.id || p._id)} style={{ color: "red" }}>Delete</button>
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