import { Link, Outlet } from "react-router-dom";

const AdminLayout = () => {

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userEmail");

    window.location.href = "/";
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        background: "#eef3f9",
      }}
    >

      {/* ================= SIDEBAR ================= */}
      <aside
        style={{
          width: "155px",
          minWidth: "155px",
          minHeight: "100vh",
          background: "#1f1c2d",
          color: "#ffffff",
          padding: "20px 6px",
          boxSizing: "border-box",
        }}
      >

        {/* Logo / Title */}
        <h3
          style={{
            margin: "3px 0 30px 0",
            paddingLeft: "0px",
            fontSize: "13px",
            fontWeight: "700",
            color: "#ffffff",
          }}
        >
          Admin Panel
        </h3>

        {/* Navigation */}
        <nav>

          <Link to="/admin" style={navLinkStyle}>
            <span style={iconStyle}>📊</span>
            <span>Dashboard</span>
          </Link>

          <Link to="/admin/users" style={navLinkStyle}>
            <span style={iconStyle}>👥</span>
            <span>Users</span>
          </Link>

          <Link to="/dashboard" style={navLinkStyle}>
            <span style={iconStyle}>🏠</span>
            <span>User Dashboard</span>
          </Link>

          {/* Logout */}
          <button
            onClick={logout}
            style={{
              width: "100%",
              padding: "9px 6px",
              marginTop: "18px",
              background: "#ef4444",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "11px",
              textAlign: "center",
            }}
          >
            🚪 Logout
          </button>

        </nav>
      </aside>


      {/* ================= MAIN CONTENT ================= */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
          padding: "12px",
          boxSizing: "border-box",
        }}
      >
        <Outlet />
      </main>

    </div>
  );
};


/* ================= NAVIGATION STYLE ================= */

const navLinkStyle = {
  display: "flex",
  alignItems: "center",
  gap: "7px",

  width: "100%",
  boxSizing: "border-box",

  padding: "10px 3px",
  marginBottom: "7px",

  color: "#ffffff",
  textDecoration: "none",

  borderRadius: "6px",

  fontWeight: "600",
  fontSize: "11px",

  transition: "background 0.2s ease",
};


/* ================= ICON STYLE ================= */

const iconStyle = {
  width: "17px",
  minWidth: "17px",
  textAlign: "center",
  fontSize: "11px",
};


export default AdminLayout;