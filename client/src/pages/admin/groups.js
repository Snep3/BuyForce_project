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
  const [groups, setGroups] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]); 
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetMembers, setTargetMembers] = useState("5");
  const [isActive, setIsActive] = useState(false); 
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

  const filteredProducts = availableProducts.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

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
      const token = getToken();
      const headers = { Authorization: `Bearer ${token}` };
      
      const finalStatus = isActive ? "OPEN" : "LOCKED";

      // אנחנו שומרים את רשימת כל ה-IDs בתוך התיאור כדי לא לאבד מידע
      const metaData = { allProductIds: selectedProductIds };
      const finalDescription = `${description} | Data: ${JSON.stringify(metaData)}`;

      const payload = {
        name,
        description: finalDescription,
        targetMembers: Number(targetMembers),
        status: finalStatus,
        activeGroup: isActive,
        productId: selectedProductIds[0] // שולחים את הראשון כברירת מחדל לשרת
      };

      await axios.post(`${API_URL}/api/admin/groups`, payload, { headers });
      
      fetchData();
      setName("");
      setDescription("");
      setSelectedProductIds([]);
      setProductSearch("");
      setIsActive(false); 
    } catch (err) {
      setError("Failed to create group.");
    }
  }

  // פונקציה לחילוץ שמות המוצרים להצגה בטבלה
  const getProductNames = (group) => {
    if (!group.description) return group.product?.name || "N/A";
    
    const parts = group.description.split(" | Data: ");
    if (parts.length < 2) return group.product?.name || "N/A";

    try {
      const data = JSON.parse(parts[1]);
      if (data.allProductIds && Array.isArray(data.allProductIds)) {
        return data.allProductIds
          .map(id => availableProducts.find(p => p.id === id)?.name)
          .filter(name => name)
          .join(", ");
      }
    } catch (e) {
      return group.product?.name || "N/A";
    }
    return group.product?.name || "N/A";
  };

  const getCleanDescription = (desc) => {
    if (!desc) return "";
    return desc.split(" | Data: ")[0];
  };

  const getStatusBadge = (group) => {
    if (group.status === "COMPLETED") return <span style={badgeStyle("#155724", "#d4edda")}>COMPLETED</span>;
    if (group.status === "FAILED") return <span style={badgeStyle("#721c24", "#f8d7da")}>FAILED</span>;
    if (!group.activeGroup || group.status === "LOCKED") return <span style={badgeStyle("#383d41", "#e2e3e5")}>UNACTIVE</span>;
    return <span style={badgeStyle("#004085", "#cce5ff")}>ACTIVE</span>;
  };

  const badgeStyle = (color, bg) => ({
    color: color, backgroundColor: bg, padding: "4px 10px", borderRadius: "12px", fontSize: "0.7rem", fontWeight: "bold"
  });

  return (
    <>
      <NavBar />
      <main style={{ padding: "2rem", fontFamily: "sans-serif", direction: "ltr", textAlign: "left", maxWidth: "1100px", margin: "0 auto" }}>
        <h1>Admin / Group Management</h1>
        
        <section style={{ border: "1px solid #ddd", padding: "1.5rem", borderRadius: 12, marginBottom: "2rem", backgroundColor: "#fff" }}>
          <h2>Create Group</h2>
          <form onSubmit={handleCreate} style={{ display: "grid", gap: "1rem", maxWidth: "600px" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required style={{ flex: 2, padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />
              <input type="number" placeholder="Target" value={targetMembers} onChange={(e) => setTargetMembers(e.target.value)} style={{ flex: 0.5, padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />
            </div>

            <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />
            
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: "bold" }}>
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              Active Group
            </label>

            <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}>
              <input placeholder="🔍 Search products..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} style={{ width: "100%", padding: "6px", marginBottom: "8px", borderRadius: "4px", border: "1px solid #ddd" }} />
              <div style={{ height: "100px", overflowY: "auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px" }}>
                {filteredProducts.map(p => (
                  <label key={p.id} style={{ fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                    <input type="checkbox" checked={selectedProductIds.includes(p.id)} onChange={() => handleProductToggle(p.id)} />
                    {p.name}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" style={{ padding: "12px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
              Create Group with Selected Products
            </button>
          </form>
        </section>

        <section>
          <h2>Groups List</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff" }}>
            <thead>
              <tr style={{ backgroundColor: "#f4f4f4", borderBottom: "2px solid #dee2e6" }}>
                <th style={{ padding: "12px", textAlign: "left" }}>Group Name</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Selected Products</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Progress</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <tr key={g.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px", fontWeight: "bold" }}>{g.name}</td>
                  <td style={{ padding: "12px", color: "#555", fontSize: "0.85rem", maxWidth: "300px" }}>{getProductNames(g)}</td>
                  <td style={{ padding: "12px" }}>{g.joinedCount} / {g.targetMembers}</td>
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