import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8081/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const totalUsers = users.length;

  const totalAdmins = users.filter(
    (user) => user.role === "ROLE_ADMIN"
  ).length;

  const totalNormalUsers = users.filter(
    (user) =>
      user.role === "ROLE_USER" ||
      user.role === "USER"
  ).length;

  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  const changeRole = async (id, role) => {
    try {
      await axios.put(
        `http://localhost:8081/admin/user/${id}/role?role=${role}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:8081/admin/user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#eef2f7",
        padding: "35px",
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              color: "#1f2937",
              fontSize: "34px",
              fontWeight: "700",
            }}
          >
            👨‍💼 Admin Dashboard
          </h1>

          <p
            style={{
              color: "#6b7280",
              marginTop: "8px",
              fontSize: "15px",
            }}
          >
            Manage all users and administrator accounts
          </p>
        </div>
      </div>

      {/* Statistics Cards */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "22px",
          marginBottom: "35px",
        }}
      >
                {/* Total Users Card */}

        <div style={cardBlue}>
          <div style={iconStyle}>👥</div>

          <h3 style={cardTitle}>Total Users</h3>

          <h1 style={cardNumber}>{totalUsers}</h1>
        </div>

        {/* Admin Card */}

        <div style={cardPurple}>
          <div style={iconStyle}>👑</div>

          <h3 style={cardTitle}>Administrators</h3>

          <h1 style={cardNumber}>{totalAdmins}</h1>
        </div>

        {/* User Card */}

        <div style={cardGreen}>
          <div style={iconStyle}>🙋</div>

          <h3 style={cardTitle}>Normal Users</h3>

          <h1 style={cardNumber}>{totalNormalUsers}</h1>
        </div>
      </div>

      {/* Search Bar */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "380px",
            maxWidth: "100%",
            padding: "14px 18px",
            borderRadius: "30px",
            border: "1px solid #ddd",
            outline: "none",
            fontSize: "15px",
            boxShadow: "0 5px 15px rgba(0,0,0,.08)",
          }}
        />
      </div>

      {/* Users Table */}

      <div
        style={{
          background: "#fff",
          borderRadius: "18px",
          overflow: "hidden",
          boxShadow: "0 10px 25px rgba(0,0,0,.08)",
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "900px",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#1e293b",
                color: "#fff",
              }}
            >
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
                      {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  style={{
                    borderBottom: "1px solid #ececec",
                    transition: "0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f8fafc";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#ffffff";
                  }}
                >
                  <td style={tdStyle}>{user.id}</td>

                  <td style={tdStyle}>
                    <div
                      style={{
                        fontWeight: "600",
                        color: "#1f2937",
                      }}
                    >
                      {user.name}
                    </div>
                  </td>

                  <td style={tdStyle}>{user.email}</td>

                  <td style={tdStyle}>
                    <span
                      style={{
                        background:
                          user.role === "ROLE_ADMIN"
                            ? "#22c55e"
                            : "#3b82f6",
                        color: "#fff",
                        padding: "7px 16px",
                        borderRadius: "25px",
                        fontSize: "13px",
                        fontWeight: "600",
                      }}
                    >
                      {user.role === "ROLE_ADMIN"
                        ? "ADMIN"
                        : "USER"}
                    </span>
                  </td>

                  <td style={tdStyle}>
                    {user.role !== "ROLE_ADMIN" ? (
                      <button
                        style={greenButton}
                        onClick={() =>
                          changeRole(user.id, "ROLE_ADMIN")
                        }
                      >
                        Make Admin
                      </button>
                    ) : (
                      <button
                        style={orangeButton}
                        onClick={() =>
                          changeRole(user.id, "ROLE_USER")
                        }
                      >
                        Remove Admin
                      </button>
                    )}

                    <button
                      style={redButton}
                      onClick={() => deleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    padding: "35px",
                    textAlign: "center",
                    color: "#777",
                    fontSize: "18px",
                  }}
                >
                  No users found.
                </td>
              </tr>
            )}
                      </tbody>
        </table>
      </div>
    </div>
          );
};

/* ---------------- TABLE ---------------- */

const thStyle = {
  padding: "18px",
  textAlign: "left",
  fontWeight: "700",
  fontSize: "15px",
};

const tdStyle = {
  padding: "18px",
  fontSize: "15px",
};

/* ---------------- BUTTONS ---------------- */

const greenButton = {
  background: "#22c55e",
  color: "#fff",
  border: "none",
  padding: "10px 15px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  marginRight: "10px",
  transition: ".3s",
};

const orangeButton = {
  background: "#f59e0b",
  color: "#fff",
  border: "none",
  padding: "10px 15px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  marginRight: "10px",
  transition: ".3s",
};

const redButton = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "10px 15px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  transition: ".3s",
};

/* ---------------- CARDS ---------------- */

const iconStyle = {
  fontSize: "42px",
  marginBottom: "10px",
};

const cardTitle = {
  margin: "10px 0",
  fontWeight: "600",
  fontSize: "18px",
};

const cardNumber = {
  margin: 0,
  fontSize: "34px",
  fontWeight: "700",
};

const cardBlue = {
  background: "linear-gradient(135deg,#2563eb,#3b82f6)",
  color: "#fff",
  borderRadius: "18px",
  padding: "25px",
  boxShadow: "0 12px 25px rgba(37,99,235,.25)",
};

const cardPurple = {
  background: "linear-gradient(135deg,#7c3aed,#8b5cf6)",
  color: "#fff",
  borderRadius: "18px",
  padding: "25px",
  boxShadow: "0 12px 25px rgba(124,58,237,.25)",
};

const cardGreen = {
  background: "linear-gradient(135deg,#16a34a,#22c55e)",
  color: "#fff",
  borderRadius: "18px",
  padding: "25px",
  boxShadow: "0 12px 25px rgba(34,197,94,.25)",
};

export default AdminDashboard;