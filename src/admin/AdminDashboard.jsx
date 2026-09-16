
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
    fetchDeletedUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "https://consistiq-backend.onrender.com/admin/users",
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
    (user) => user.role !== "ROLE_ADMIN"
  ).length;

  const filteredUsers = users.filter((user) => {
    return (
      (user.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  const changeRole = async (id, role) => {
    try {
      await axios.put(
        `https://consistiq-backend.onrender.com/admin/user/${id}/role?role=${role}`,
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
        `https://consistiq-backend.onrender.com/admin/user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers();
      fetchDeletedUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDeletedUsers = async () => {
    try {
      const res = await axios.get(
        "https://consistiq-backend.onrender.com/admin/users/deleted",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDeletedUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const restoreUser = async (id) => {
    const confirmRestore = window.confirm(
      "Are you sure you want to restore this user?"
    );

    if (!confirmRestore) return;

    try {
      await axios.put(
        `https://consistiq-backend.onrender.com/admin/user/${id}/restore`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers();
      fetchDeletedUsers();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="admin-dashboard-page"
      style={{
        minHeight: "100vh",
        background: "#eef2f7",
        padding: "35px",
      }}
    >
      {/* ================= HEADER ================= */}

      <div
        className="admin-dashboard-header"
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

      {/* ================= STATISTICS CARDS ================= */}

      <div
        className="admin-stats-grid"
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

        {/* Normal User Card */}

        <div style={cardGreen}>
          <div style={iconStyle}>🙋</div>

          <h3 style={cardTitle}>Normal Users</h3>

          <h1 style={cardNumber}>{totalNormalUsers}</h1>
        </div>
      </div>

      {/* ================= ACTIVE / DELETED TABS ================= */}

      <div
        className="admin-user-tabs"
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => setShowDeleted(false)}
          style={{
            ...greenButton,
            background: !showDeleted ? "#2563eb" : "#94a3b8",
          }}
        >
          Active Users
        </button>

        <button
          onClick={() => setShowDeleted(true)}
          style={{
            ...redButton,
            background: showDeleted ? "#ef4444" : "#94a3b8",
          }}
        >
          Deleted Users ({deletedUsers.length})
        </button>
      </div>

      {/* ================= SEARCH BAR ================= */}

      <div
        className="admin-search-section"
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

      {/* ================= ACTIVE / DELETED USERS ================= */}

      {!showDeleted ? (
        <>
          {/* ================= ACTIVE USERS DESKTOP TABLE ================= */}

          <div
            className="admin-users-table"
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
                  <th style={thStyle}>S.No.</th>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Role</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      style={{
                        borderBottom: "1px solid #ececec",
                      }}
                    >
                      <td style={tdStyle}>{index + 1}</td>

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
                          {user.role === "ROLE_ADMIN" ? "ADMIN" : "USER"}
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

          {/* ================= ACTIVE USERS MOBILE CARDS ================= */}

          <div className="admin-mobile-list">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <div className="admin-user-card" key={user.id}>
                  <div className="admin-user-card-header">
                    <span className="admin-user-number">
                      #{index + 1}
                    </span>

                    <span
                      className={`admin-role-badge ${
                        user.role === "ROLE_ADMIN"
                          ? "admin-role"
                          : "user-role"
                      }`}
                    >
                      {user.role === "ROLE_ADMIN" ? "ADMIN" : "USER"}
                    </span>
                  </div>

                  <div className="admin-user-info">
                    <div>
                      <span className="admin-info-label">Name</span>
                      <strong>{user.name}</strong>
                    </div>

                    <div>
                      <span className="admin-info-label">Email</span>
                      <span className="admin-email">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  <div className="admin-mobile-actions">
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
                  </div>
                </div>
              ))
            ) : (
              <div className="admin-mobile-empty">
                No users found.
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* ================= DELETED USERS DESKTOP TABLE ================= */}

          <div
            className="admin-users-table"
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
                  <th style={thStyle}>S.No.</th>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Role</th>
                  <th style={thStyle}>Deleted At</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>

              <tbody>
                {deletedUsers.length > 0 ? (
                  deletedUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      style={{
                        borderBottom: "1px solid #ececec",
                      }}
                    >
                      <td style={tdStyle}>{index + 1}</td>

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
                        {user.role === "ROLE_ADMIN"
                          ? "ADMIN"
                          : "USER"}
                      </td>

                      <td style={tdStyle}>
                        {user.deletedAt
                          ? new Date(
                              user.deletedAt
                            ).toLocaleString()
                          : "-"}
                      </td>

                      <td style={tdStyle}>
                        <button
                          style={greenButton}
                          onClick={() =>
                            restoreUser(user.id)
                          }
                        >
                          Restore
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      style={{
                        padding: "35px",
                        textAlign: "center",
                        color: "#777",
                        fontSize: "18px",
                      }}
                    >
                      No deleted users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ================= DELETED USERS MOBILE CARDS ================= */}

          <div className="admin-mobile-list">
            {deletedUsers.length > 0 ? (
              deletedUsers.map((user, index) => (
                <div className="admin-user-card" key={user.id}>
                  <div className="admin-user-card-header">
                    <span className="admin-user-number">
                      #{index + 1}
                    </span>

                    <span
                      className={`admin-role-badge ${
                        user.role === "ROLE_ADMIN"
                          ? "admin-role"
                          : "user-role"
                      }`}
                    >
                      {user.role === "ROLE_ADMIN"
                        ? "ADMIN"
                        : "USER"}
                    </span>
                  </div>

                  <div className="admin-user-info">
                    <div>
                      <span className="admin-info-label">Name</span>
                      <strong>{user.name}</strong>
                    </div>

                    <div>
                      <span className="admin-info-label">Email</span>
                      <span className="admin-email">
                        {user.email}
                      </span>
                    </div>

                    <div>
                      <span className="admin-info-label">
                        Deleted At
                      </span>

                      <span className="admin-deleted-date">
                        {user.deletedAt
                          ? new Date(
                              user.deletedAt
                            ).toLocaleString()
                          : "-"}
                      </span>
                    </div>
                  </div>

                  <div className="admin-mobile-actions">
                    <button
                      style={greenButton}
                      onClick={() =>
                        restoreUser(user.id)
                      }
                    >
                      Restore
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="admin-mobile-empty">
                No deleted users found.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

/* ================= TABLE ================= */

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

/* ================= BUTTONS ================= */

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

/* ================= CARDS ================= */

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

