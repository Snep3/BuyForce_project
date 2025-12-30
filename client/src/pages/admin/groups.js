import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { API_URL } from "../../config/api";
import NavBar from "../../components/NavBar";
const now = new Date().toISOString().slice(0,16); // פורמט מתאים ל-input של datetime-local

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export default function AdminGroupsPage() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [groups, setGroups] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetMembers, setTargetMembers] = useState("10");
  const [deadline, setDeadline] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [productSearch, setProductSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      setError("");
      const token = getToken();
      const headers = { Authorization: `Bearer ${token}` };

      // תיקון: הוסר ה-/admin מהנתיבים
      const [groupsRes, productsRes] = await Promise.all([
        axios.get(`${API_URL}/api/groups`, { headers }),
        axios.get(`${API_URL}/api/products`, { headers }),
      ]);
      setGroups(groupsRes.data || []);
      setAvailableProducts(productsRes.data || []);
    } catch (err) {
      setError("Failed to load data from server");
    } finally {
      setLoading(false);
    }
  }

  const handleProductToggle = (id) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    if (selectedProductIds.length === 0) {
      setError("Please select at least one product");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = getToken();
      const headers = { Authorization: `Bearer ${token}` };

      const payload = {
        name,
        description: description,
        productIds: selectedProductIds,
        target_members: Number(targetMembers),
        status: isActive ? "OPEN" : "LOCKED",
        activeGroup: isActive,
        productId: selectedProductIds[0],
        deadline: deadline ? new Date(deadline).toISOString() : null,
        joined_count: 0,
      };

      // תיקון: הוסר ה-/admin מהנתיב
      await axios.post(`${API_URL}/api/groups`, payload, { headers });

      fetchData(); // רענון הרשימה
      setName("");
      setDescription("");
      setSelectedProductIds([]);
      setDeadline("");
    } catch (err) {
      setError("Failed to create group. Check if all fields are valid.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const getProductNames = (group) => {
    const ids = group.productIds || (group.productId ? [group.productId] : []);
    if (ids.length === 0) return "N/A";

    return (
      ids
        .map(
          (id) =>
            availableProducts.find((p) => p.id === id || p._id === id)?.name
        )
        .filter(Boolean)
        .join(", ") || "N/A"
    );
  };

  const getStatusBadge = (group) => {
    const status = group.status;
    if (status === "COMPLETED")
      return <span style={badgeStyle("#155724", "#d4edda")}>COMPLETED</span>;
    if (status === "FAILED")
      return <span style={badgeStyle("#721c24", "#f8d7da")}>FAILED</span>;
    if (status === "LOCKED")
      return <span style={badgeStyle("#383d41", "#e2e3e5")}>LOCKED</span>;
    return <span style={badgeStyle("#004085", "#cce5ff")}>ACTIVE</span>;
  };

  const badgeStyle = (color, bg) => ({
    color,
    backgroundColor: bg,
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "0.7rem",
    fontWeight: "bold",
  });

  return (
    <>
      <NavBar />
      <main
        style={{
          padding: "2rem",
          fontFamily: "sans-serif",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1>Admin / Group Management</h1>

        <nav
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
            padding: "10px",
            background: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
            alignItems: "center",
          }}
        >
          <Link
            href="/admin/products"
            style={{
              padding: "8px 16px",
              textDecoration: "none",
              color: "#007bff",
              fontWeight: "bold",
            }}
          >
            📦 Admin Products
          </Link>
          <Link
            href="/admin/groups"
            style={{
              padding: "8px 16px",
              borderRadius: "5px",
              textDecoration: "none",
              fontWeight: "bold",
              backgroundColor: "#007bff",
              color: "#ffffff",
            }}
          >
            👥 Admin Groups
          </Link>
          <Link
            href="/products"
            style={{
              padding: "8px 16px",
              textDecoration: "none",
              color: "#007bff",
              marginLeft: "auto",
            }}
          >
            🛒 View Store
          </Link>
        </nav>

        {error && (
          <div
            style={{
              color: "white",
              background: "#d9534f",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}

        <section
          style={{
            border: "1px solid #ddd",
            padding: "1.5rem",
            borderRadius: 12,
            marginBottom: "2rem",
            backgroundColor: "#fff",
          }}
        >
          <h2>Create New Group</h2>
          <form
            onSubmit={handleCreate}
            style={{ display: "grid", gap: "1rem", maxWidth: "600px" }}
          >
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                placeholder="Group Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ flex: 2, padding: "10px" }}
              />
              <input
                type="number"
                placeholder="Target Members"
                value={targetMembers}
                onChange={(e) => setTargetMembers(e.target.value)}
                style={{ flex: 1, padding: "10px" }}
              />
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "5px" }}
            >
              <label style={{ fontSize: "0.8rem", color: "#666" }}>
                Deadline
              </label>
              <input
                type="datetime-local"
                value={deadline}
                min={now}
                onChange={(e) => setDeadline(e.target.value)}
                style={{ padding: "10px" }}
              />
            </div>

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ padding: "10px", minHeight: "60px" }}
            />

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              Set as Active (OPEN)
            </label>

            <div
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <p
                style={{
                  margin: "0 0 5px 0",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                }}
              >
                Select Products:
              </p>
              <input
                placeholder="🔍 Search products..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                style={{ width: "100%", padding: "6px", marginBottom: "8px" }}
              />
              <div
                style={{
                  height: "120px",
                  overflowY: "auto",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "5px",
                }}
              >
                {availableProducts
                  .filter((p) =>
                    p.name.toLowerCase().includes(productSearch.toLowerCase())
                  )
                  .map((p) => (
                    <label
                      key={p.id || p._id}
                      style={{
                        fontSize: "0.85rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedProductIds.includes(p.id || p._id)}
                        onChange={() => handleProductToggle(p.id || p._id)}
                      />
                      {p.name}
                    </label>
                  ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "12px",
                backgroundColor: isSubmitting ? "#ccc" : "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {isSubmitting ? "Creating..." : "Create Group"}
            </button>
          </form>
        </section>

        <section>
          <h2>Existing Groups</h2>
          {loading ? (
            <p>Loading groups...</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    backgroundColor: "#f4f4f4",
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  <th style={{ padding: "12px", textAlign: "left" }}>Name</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>
                    Products
                  </th>
                  <th style={{ padding: "12px", textAlign: "left" }}>
                    Progress
                  </th>
                  <th style={{ padding: "12px", textAlign: "left" }}>
                    Deadline
                  </th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((g) => (
                  <tr
                    key={g.id || g._id}
                    style={{ borderBottom: "1px solid #eee" }}
                  >
                    <td style={{ padding: "12px", fontWeight: "bold" }}>
                      {g.name}
                    </td>
                    <td style={{ padding: "12px", fontSize: "0.8rem" }}>
                      {getProductNames(g)}
                    </td>
                    <td style={{ padding: "12px" }}>
                      {g.joined_count ?? 0} / {g.target_members ?? 0}
                    </td>
                    <td style={{ padding: "12px", fontSize: "0.8rem" }}>
                      {g.deadline
                        ? new Date(g.deadline).toLocaleString()
                        : "No Deadline"}
                    </td>
                    <td style={{ padding: "12px" }}>{getStatusBadge(g)}</td>
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
