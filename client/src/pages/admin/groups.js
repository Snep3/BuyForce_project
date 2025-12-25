import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config/api";
import NavBar from "../../components/NavBar";

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
      const [groupsRes, productsRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/groups`, { headers }),
        axios.get(`${API_URL}/api/admin/products`, { headers })
      ]);
      setGroups(groupsRes.data || []);
      setAvailableProducts(productsRes.data || []);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  const handleProductToggle = (id) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
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
      
      const finalStatus = isActive ? "OPEN" : "LOCKED";
      const metaData = { allProductIds: selectedProductIds };
      const finalDescription = `${description} | Data: ${JSON.stringify(metaData)}`;

      const payload = {
        name,
        description: finalDescription,
        target_members: Number(targetMembers),
        status: finalStatus,
        active_group: isActive,
        productId: selectedProductIds[0],
        deadline: deadline ? new Date(deadline).toISOString() : null,
        joined_count: 0 
      };

      await axios.post(`${API_URL}/api/admin/groups`, payload, { headers });
      
      fetchData();
      setName("");
      setDescription("");
      setDeadline("");
      setSelectedProductIds([]);
      setProductSearch("");
      setIsActive(true); 
    } catch (err) {
      setError("Failed to create group.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const getProductNames = (group) => {
    const directName = group.product?.name;
    if (!group.description) return directName || "N/A";
    const parts = group.description.split(" | Data: ");
    if (parts.length < 2) return directName || "N/A";
    try {
      const data = JSON.parse(parts[1]);
      if (data.allProductIds && Array.isArray(data.allProductIds)) {
        return data.allProductIds
          .map(id => availableProducts.find(p => p.id === id)?.name)
          .filter(Boolean).join(", ") || directName || "N/A";
      }
    } catch (e) { return directName || "N/A"; }
    return directName || "N/A";
  };

  const getStatusBadge = (group) => {
    const status = group.status;
    if (status === "COMPLETED") return <span style={badgeStyle("#155724", "#d4edda")}>COMPLETED</span>;
    if (status === "FAILED") return <span style={badgeStyle("#721c24", "#f8d7da")}>FAILED</span>;
    if (status === "LOCKED") return <span style={badgeStyle("#383d41", "#e2e3e5")}>LOCKED</span>;
    return <span style={badgeStyle("#004085", "#cce5ff")}>ACTIVE</span>;
  };

  const badgeStyle = (color, bg) => ({
    color, backgroundColor: bg, padding: "4px 10px", borderRadius: "12px", fontSize: "0.7rem", fontWeight: "bold"
  });

  return (
    <>
      <NavBar />
      <main style={{ padding: "2rem", fontFamily: "sans-serif", direction: "ltr", textAlign: "left", maxWidth: "1200px", margin: "0 auto" }}>
        <h1>Admin / Group Management</h1>
        
        {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}

        <section style={{ border: "1px solid #ddd", padding: "1.5rem", borderRadius: 12, marginBottom: "2rem", backgroundColor: "#fff" }}>
          <h2>Create Group</h2>
          <form onSubmit={handleCreate} style={{ display: "grid", gap: "1rem", maxWidth: "600px" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required style={{ flex: 2, padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />
              <input type="number" placeholder="Target" value={targetMembers} onChange={(e) => setTargetMembers(e.target.value)} style={{ flex: 0.5, padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "0.8rem", color: "#666" }}>Deadline</label>
              <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />
            </div>

            <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />
            
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              Active Group (OPEN)
            </label>

            <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}>
              <input placeholder="🔍 Search products..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} style={{ width: "100%", padding: "6px", marginBottom: "8px", border: "1px solid #ddd" }} />
              <div style={{ height: "100px", overflowY: "auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px" }}>
                {availableProducts.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase())).map(p => (
                  <label key={p.id} style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    <input type="checkbox" checked={selectedProductIds.includes(p.id)} onChange={() => handleProductToggle(p.id)} />
                    {p.name}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} style={{ padding: "12px", backgroundColor: isSubmitting ? "#ccc" : "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
              {isSubmitting ? "Creating..." : "Create Group"}
            </button>
          </form>
        </section>

        <section style={{ overflowX: "auto" }}>
          <h2>Groups List</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f4f4f4", borderBottom: "2px solid #dee2e6" }}>
                <th style={{ padding: "12px", textAlign: "left" }}>Name</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Products</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Progress</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Deadline</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <tr key={g.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px", fontWeight: "bold" }}>{g.name}</td>
                  <td style={{ padding: "12px", fontSize: "0.8rem" }}>{getProductNames(g)}</td>
                  <td style={{ padding: "12px" }}>{g.joined_count ?? 0} / {g.target_members ?? 0}</td>
                  <td style={{ padding: "12px", fontSize: "0.8rem" }}>
                    {g.deadline ? new Date(g.deadline).toLocaleString() : "No Deadline"}
                  </td>
                  <td style={{ padding: "12px" }}>{getStatusBadge(g)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </>
  );
}