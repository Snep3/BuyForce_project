import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { API_URL } from "../../config/api";
import NavBar from "../../components/NavBar";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export default function AdminGroupsPage() {
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");

  // create form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [minParticipants, setMinParticipants] = useState("1");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchGroups() {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      const res = await axios.get(`${API_URL}/api/admin/groups`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setGroups(res.data || []);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to load groups");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError("");

    try {
      const token = getToken();

      const payload = {
        name,
        description: description || undefined,
        minParticipants: Number(minParticipants),
        isActive: !!isActive,
      };

      const res = await axios.post(`${API_URL}/api/admin/groups`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setGroups((prev) => [res.data, ...prev]);

      setName("");
      setDescription("");
      setMinParticipants("1");
      setIsActive(true);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Create failed");
    }
  }

  async function handleDelete(id) {
    if (!confirm("למחוק קבוצה?")) return;

    try {
      const token = getToken();

      await axios.delete(`${API_URL}/api/admin/groups/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setGroups((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Delete failed");
    }
  }

  async function handleEdit(group) {
    const id = group.id;

    const newName = prompt("name", group.name ?? "");
    if (newName === null) return;

    const newDescription = prompt("description", group.description ?? "");
    if (newDescription === null) return;

    const newMin = prompt("minParticipants", String(group.minParticipants ?? 1));
    if (newMin === null) return;

    const newActive = prompt("isActive (true/false)", String(group.isActive ?? true));
    if (newActive === null) return;

    try {
      const token = getToken();

      const payload = {
        name: newName,
        description: newDescription || undefined,
        minParticipants: Number(newMin),
        isActive: newActive === "true",
      };

      const res = await axios.put(`${API_URL}/api/admin/groups/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setGroups((prev) => prev.map((g) => (g.id === id ? res.data : g)));
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Update failed");
    }
  }

  return (
    <>
      <NavBar />

      <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>Admin / Groups</h1>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <Link href="/">🏠 Home</Link>
          <Link href="/admin/products">📦 Admin Products</Link>
          <Link href="/products">🛒 Public Products</Link>
        </div>

        {error && (
          <p style={{ color: "crimson", marginBottom: "1rem" }}>{error}</p>
        )}

        <section
          style={{
            border: "1px solid #ddd",
            padding: "1rem",
            borderRadius: 8,
            marginBottom: "1.5rem",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Create Group</h2>

          <form
            onSubmit={handleCreate}
            style={{ display: "grid", gap: "0.75rem", maxWidth: 420 }}
          >
            <input
              placeholder="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              placeholder="description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              placeholder="minParticipants"
              value={minParticipants}
              onChange={(e) => setMinParticipants(e.target.value)}
            />

            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              isActive
            </label>

            <button type="submit">Create</button>
          </form>
        </section>

        <section>
          <h2 style={{ marginTop: 0 }}>Groups List</h2>

          {loading ? (
            <p>Loading...</p>
          ) : groups.length === 0 ? (
            <p>No groups</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      borderBottom: "1px solid #ddd",
                      padding: "0.5rem",
                    }}
                  >
                    Name
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      borderBottom: "1px solid #ddd",
                      padding: "0.5rem",
                    }}
                  >
                    Min
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      borderBottom: "1px solid #ddd",
                      padding: "0.5rem",
                    }}
                  >
                    Active
                  </th>
                  <th
                    style={{
                      borderBottom: "1px solid #ddd",
                      padding: "0.5rem",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {groups.map((g) => (
                  <tr key={g.id}>
                    <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>
                      {g.name}
                    </td>
                    <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>
                      {g.minParticipants}
                    </td>
                    <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>
                      {String(g.isActive)}
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid #eee",
                        padding: "0.5rem",
                        textAlign: "center",
                      }}
                    >
                      <button onClick={() => handleEdit(g)} style={{ marginRight: 8 }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(g.id)}>Delete</button>
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
