import { useEffect, useState } from "react"; // 1. הוספנו ייבוא של React Hooks
import axios from "axios";                   // 2. הוספנו ייבוא של axios
import Link from "next/link";
import NavBar from "../components/NavBar";
import { API_URL } from "../config/api";     // 3. הוספנו ייבוא של כתובת השרת

export default function Home() {
  // 4. הגדרת המשתנה groups - זה פותר את השגיאה groups is not defined
  const [groups, setGroups] = useState([]);

  // 5. משיכת הנתונים מהשרת ברגע שהדף נטען
  useEffect(() => {
    async function fetchGroups() {
      try {
        // אנחנו קוראים ל-endpoint שמחזיר רק קבוצות פתוחות
        const res = await axios.get(`${API_URL}/api/groups/open`);
        setGroups(res.data);
      } catch (err) {
        console.error("Failed to fetch groups:", err);
      }
    }
    fetchGroups();
  }, []);

  return (
    <>
      <NavBar />
      <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>BuyForce</h1>
        <p>ברוך הבא למערכת הקניות המרוכזות</p>

        <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          <Link href="/login">🔑 התחברות</Link>
          <Link href="/register">📝 הרשמה</Link>
          <Link href="/products">🛒 מוצרים</Link>
          <Link href="/admin/groups">🛠 Admin</Link>
        </div>

        <h2>קבוצות רכישה פעילות:</h2>
        
        {/* אם אין קבוצות, נציג הודעה מתאימה */}
        {groups.length === 0 ? (
          <p>טוען קבוצות או שאין קבוצות פעילות כרגע...</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem" }}>
            {groups.map(group => (
              <div key={group.id} style={{ border: "1px solid #ddd", padding: "1rem", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                <h3 style={{ marginTop: 0 }}>{group.name}</h3>
                
                {/* הצגת האחוז החדש מהשרת */}
                <p style={{ marginBottom: "5px" }}>Progress: <strong>{group.progress_pct ?? 0}%</strong></p>
                
                {/* Progress Bar ויזואלי */}
                <div style={{ width: "100%", height: "10px", backgroundColor: "#eee", borderRadius: "5px", overflow: "hidden" }}>
                  <div style={{ 
                    width: `${group.progress_pct ?? 0}%`, 
                    height: "100%", 
                    backgroundColor: group.progress_pct >= 100 ? "#28a745" : "#007bff", 
                    transition: "width 0.5s ease"
                  }} />
                </div>

                <p style={{ fontSize: "0.8rem", color: "#666" }}>
                  {group.joined_count} / {group.target_members}
                </p>

            <Link href={`/groups/${group.id}`} style={{ textDecoration: 'none' }}>
            <span style={{ color: '#007bff', fontWeight: 'bold', cursor: 'pointer' }}>
              for details and join
            </span>
</Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}