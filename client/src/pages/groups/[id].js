import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { API_URL } from "../../config/api";
import NavBar from "../../components/NavBar";

export default function GroupDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchGroup();
  }, [id]);

  const fetchGroup = async () => {
    const token = localStorage.getItem("token");
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    try {
      const res = await axios.get(`${API_URL}/api/groups/${id}`, config);
      setGroup(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleAction = async (action) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("please log in first");
    try {
      const res = await axios.post(
        `${API_URL}/api/groups/${id}/${action}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setGroup(res.data); // מעדכן את הסטטוס והכפתור מיד
    } catch (err) {
      alert("פעולה נכשלה");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!group) return <p>קבוצה לא נמצאה</p>;

  return (
    <>
      <NavBar />
      <main style={styles.container}>
        <div style={styles.card}>
          {/* תצוגת מוצר */}
          <div style={styles.productInfo}>
            <img
              src={group.product?.imageUrl || "/box.png"}
              style={styles.img}
            />
            <div>
              <h1 style={styles.title}>{group.name}</h1>
              <p style={styles.desc}>{group.product?.description}</p>
              <div style={styles.priceTag}>
                מחיר קבוצה: {group.product?.priceGroup}₪
              </div>
            </div>
          </div>

          <hr style={styles.hr} />

          {/* פס התקדמות */}
          <div style={styles.progressSection}>
            <div style={styles.stats}>
              <span>
                התקדמות: <strong>{group.progress_pct}%</strong>
              </span>
              <span>
                {group.joined_count} / {group.target_members} חברים
              </span>
            </div>
            <div style={styles.progressBarBg}>
              <div
                style={{
                  ...styles.progressBarFill,
                  width: `${group.progress_pct}%`,
                }}
              />
            </div>
          </div>

          {/* כפתור דינמי - כאן הקסם קורה */}
          {group.isCurrentUserMember ? (
            <button
              onClick={() => handleAction("leave")}
              style={styles.leaveBtn}
            >
             Leave Group
            </button>
          ) : (
            <button
              onClick={() => handleAction("join")}
              disabled={group.status !== "OPEN"}
              style={styles.joinBtn}
            >
             Join Group
            </button>
          )}
        </div>
      </main>
    </>
  );
}

const styles = {
  container: {
    padding: "2rem",
    direction: "rtl",
    fontFamily: "Arial",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    maxWidth: "600px",
    width: "100%",
    border: "1px solid #ddd",
    borderRadius: "20px",
    padding: "2rem",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
  productInfo: { display: "flex", gap: "1.5rem", marginBottom: "1rem" },
  img: {
    width: "120px",
    height: "120px",
    borderRadius: "10px",
    objectFit: "cover",
  },
  title: { margin: 0, fontSize: "1.8rem" },
  desc: { color: "#666", fontSize: "0.9rem" },
  priceTag: {
    fontSize: "1.4rem",
    fontWeight: "bold",
    color: "#28a745",
    marginTop: "10px",
  },
  hr: { margin: "2rem 0", border: "0", borderTop: "1px solid #eee" },
  progressSection: { marginBottom: "2rem" },
  stats: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  progressBarBg: {
    width: "100%",
    height: "14px",
    backgroundColor: "#eee",
    borderRadius: "7px",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#007bff",
    borderRadius: "7px",
    transition: "width 0.5s ease",
  },
  joinBtn: {
    width: "100%",
    padding: "1rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "1.1rem",
    cursor: "pointer",
    fontWeight: "bold",
  },
  leaveBtn: {
    width: "100%",
    padding: "1rem",
    backgroundColor: "white",
    color: "#dc3545",
    border: "2px solid #dc3545",
    borderRadius: "10px",
    fontSize: "1.1rem",
    cursor: "pointer",
  },
};
