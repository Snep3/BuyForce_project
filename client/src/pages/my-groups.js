import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config/api";
import NavBar from "../components/NavBar";
import CountdownTimer from "@/components/CountdownTimer";

export default function MyGroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // פונקציה לטעינת הקבוצות שהמשתמש חבר בהן
  const fetchMyGroups = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/groups/user/my-groups`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(res.data);
    } catch (err) {
      console.error("Error loading my groups:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyGroups();
  }, []);

  // פונקציה לעזיבת קבוצה
  const handleLeaveGroup = async (groupId) => {
    if (!confirm("Are you sure you want to leave this group?")) return;

    try {
      const token = localStorage.getItem("token");
      // השגת userId מ-localStorage (נשמר בזמן ה-Login)
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id || user?.userId;

      await axios.post(`${API_URL}/api/groups/${groupId}/leave`, 
        { userId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // עדכון ה-UI: הסרת הקבוצה מהרשימה
      setGroups(prev => prev.filter(g => g.id !== groupId));
    } catch (err) {
      alert("Failed to leave the group");
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>Loading your groups...</div>;

  return (
    <div dir="ltr" style={{ fontFamily: 'sans-serif' }}>
      <NavBar />
      <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <header style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>My Groups</h1>
          <p style={{ color: '#666' }}>Track the status of the groups you have joined.</p>
        </header>

        {groups.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#f9f9f9', borderRadius: '10px' }}>
            <p>You haven't joined any groups yet.</p>
            <a href="/" style={{ color: '#007bff', textDecoration: 'underline' }}>Back to Home to explore products</a>
          </div>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
            gap: "1.5rem" 
          }}>
            {groups.map((group) => (
              <div key={group.id} className="group-card" style={{
                border: "1px solid #eee",
                borderRadius: "12px",
                padding: "1.5rem",
                boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                background: "white"
              }}>
                <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem", fontWeight: 'bold' }}>
                  {group.name || `Group Buy #${group.id.substring(0,5)}`}
                </h2>
                
                {/* Progress Bar Section */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", marginBottom: "8px" }}>
                    <span>Progress:</span>
                    <span style={{ fontWeight: "bold", color: "#007bff" }}>{group.progress_pct}%</span>
                  </div>
                  <div style={{ width: "100%", backgroundColor: "#eee", height: "12px", borderRadius: "6px", overflow: "hidden" }}>
                    <div style={{ 
                      width: `${group.progress_pct}%`, 
                      backgroundColor: "#007bff", 
                      height: "100%",
                      transition: "width 0.5s ease"
                    }} />
                  </div>
                </div>

                <div style={{ fontSize: "0.9rem", color: "#444", marginBottom: "1.5rem" }}>
                   <p style={{ margin: '5px 0' }}>Status: <strong style={{ color: group.status === 'OPEN' ? '#28a745' : '#dc3545' }}>{group.status}</strong></p>
                </div>

                <button 
                  onClick={() => handleLeaveGroup(group.id)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    transition: "background 0.3s"
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#a71d2a'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                >
                  Leave Group
                </button>
      {group && group.deadline ? (
            <CountdownTimer deadline={group.deadline} />
          ) : (
        <span>No deadline set</span>
          )
          }
         </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}