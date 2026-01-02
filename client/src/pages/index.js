import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import NavBar from "../components/NavBar";
import { API_URL } from "../config/api";
import CountdownTimer from "@/components/CountdownTimer";

export default function Home() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

useEffect(() => {
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    try {
      const userObj = JSON.parse(savedUser);
      // בלוגין שמרת res.data.user, ודא שהשדה של ה-ID נקרא שם id
      setUserId(String(userObj.id || userObj._id).trim());
    } catch (e) {
      console.error("Error parsing user from localStorage", e);
    }
  }
  fetchOpenGroups(true);
}, []);
  async function fetchOpenGroups(isInitial = false) {
    try {
      if (isInitial) setLoading(true);
      const res = await axios.get(`${API_URL}/api/groups/open`);
      setGroups(res.data || []);
    } catch (err) {
      console.error("Failed to load groups", err);
    } finally {
      if (isInitial) setLoading(false);
      setActionLoading(null);
    }
  }

 async function handleGroupAction(groupId, isJoined) {
  // 1. שליפת הנתונים מה-LocalStorage כפי שנשמרו בלוגין
  const savedUser = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  // בדיקה אם המשתמש מחובר
  if (!savedUser || !token) {
    return alert("Please login to participate");
  }

  let currentUserId;
  try {
    const userObj = JSON.parse(savedUser);
    currentUserId = userObj.id || userObj._id;
  } catch (e) {
    console.error("Error parsing user data", e);
    return alert("Session error, please login again");
  }

  const normalizedId = String(groupId);
  setActionLoading(normalizedId);

  const action = isJoined ? "leave" : "join";

  try {
    // 2. ביצוע הפעולה עם שליחת ה-Token ב-Headers
    const res = await axios.post(
      `${API_URL}/api/groups/${normalizedId}/${action}`,
      {
        userId: String(currentUserId).trim(),
      },
      {
        headers: {
          // שליחת ה-token בפורמט Bearer כפי שה-Guard מצפה לקבל
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const updatedGroup = res.data;

    // 3. עדכון מקומי של המערך כדי למנוע קפיצות במסך
    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        const currentId = String(group.id || group._id);
        if (currentId === normalizedId) {
          return { ...group, ...updatedGroup };
        }
        return group;
      })
    );
  } catch (err) {
    console.error("Action error:", err.response?.data);
    alert(err.response?.data?.message || "Action failed");
  } finally {
    // 4. שחרור מצב טעינה
    setActionLoading(null);
  }
}

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
        <header style={{ marginBottom: "2rem" }}>
          <h1>BuyForce</h1>
          <p>Collective Buying Power</p>
          <div
            style={{
              marginTop: "1.5rem",
              display: "flex",
              gap: "1rem",
              marginBottom: "3rem",
            }}
          >
            <Link href="/" style={navLinkStyle}>
              🏠 Home
            </Link>
            <Link href="/login" style={navLinkStyle}>
              🔑 Login
            </Link>
            <Link href="/register" style={navLinkStyle}>
              📝 Register
            </Link>
            <Link href="/products" style={navLinkStyle}>
              🛒 Products
            </Link>
            <Link href="/admin/products" style={navLinkStyle}>
              🛠 Admin
            </Link>
          </div>
        </header>

        <section>
          <h2>Live Group Buys</h2>
          {loading ? (
            <p>Loading deals...</p>
          ) : (
            <div style={gridStyle}>
              {groups.map((group) => {
                const currentId = String(group.id || group._id);

                const isJoined =
                  userId &&
                  group.memberships?.some(
                    (m) => String(m.userId).trim() === String(userId).trim()
                  );

                const currentCount = group.joined_count || 0;
                const targetCount = group.target_members || 1;
                const progressPercentage = Math.min(
                  Math.round((currentCount / targetCount) * 100),
                  100
                );

                const isThisButtonLoading =
                  actionLoading !== null && actionLoading === currentId;

                return (
                  <div key={currentId} style={cardStyle}>
                    <h3 style={{ margin: "0 0 10px 0" }}>{group.name}</h3>
                    <div style={priceStyle}>
                      Price: ${group.product?.priceGroup || "0.00"}
                    </div>

                    <div style={productBoxStyle}>
                      <ul style={listStyle}>
                        {group.product && <li>{group.product.name}</li>}
                        {group.fullProducts?.map((p) => (
                          <li key={p.id || p._id}>{p.name}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={statsStyleAbove}>
                      <span>
                        {currentCount} / {targetCount} Members
                      </span>
                      <span style={{ fontWeight: "bold", color: "#007bff" }}>
                        {progressPercentage}%
                      </span>
                    </div>

                    <div style={progressContainer}>
                      <div
                        style={{
                          ...progressFill,
                          width: `${progressPercentage}%`,
                          backgroundColor: "#007bff",
                        }}
                      ></div>
                    </div>

                    <div style={{ marginBottom: "20px" }}></div>

                    <button
                      disabled={isThisButtonLoading}
                      onClick={() => handleGroupAction(currentId, isJoined)}
                      style={{
                        ...buttonStyle,
                        backgroundColor: isThisButtonLoading
                          ? "#ccc"
                          : isJoined
                          ? "#dc3545"
                          : "#28a745",
                        cursor: isThisButtonLoading ? "not-allowed" : "pointer",
                      }}
                    >
                      {isThisButtonLoading
                        ? "Processing..."
                        : isJoined
                        ? "Leave Group"
                        : "Join Group"
                        }
                    </button>
                    <CountdownTimer deadline={group.deadline} />
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

// --- Styles ---
const navLinkStyle = {
  color: "#007bff",
  textDecoration: "none",
  fontWeight: "500",
  fontSize: "1rem",
  border: "1px solid #007bff",
  padding: "5px 12px",
  borderRadius: "6px",
};
const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "25px",
};
const cardStyle = {
  border: "1px solid #e1e4e8",
  borderRadius: "12px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
};
const priceStyle = {
  fontSize: "1.4rem",
  fontWeight: "bold",
  color: "#28a745",
  marginBottom: "15px",
};
const productBoxStyle = {
  backgroundColor: "#f8f9fa",
  padding: "12px",
  borderRadius: "8px",
  marginBottom: "20px",
};
const listStyle = {
  paddingLeft: "20px",
  margin: "5px 0",
  fontSize: "0.85rem",
  color: "#555",
};
const progressContainer = {
  width: "100%",
  height: "12px",
  backgroundColor: "#e9ecef",
  borderRadius: "10px",
  overflow: "hidden",
};
const progressFill = { height: "100%", transition: "width 0.4s ease-in-out" };
const statsStyleAbove = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "0.85rem",
  color: "#6c757d",
  marginBottom: "8px",
  alignItems: "flex-end",
};
const buttonStyle = {
  padding: "12px",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  fontSize: "1rem",
};
