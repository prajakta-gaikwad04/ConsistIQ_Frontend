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
    <div style={{ display: "flex" }}>

      {/* Sidebar */}
      <div
        style={{
          width: "260px",
          height: "100vh",
          background: "#1f1c2c",
          color: "white",
          padding: "30px 20px",
        }}
      >
        <h3>Admin Panel</h3>

        <nav style={{ marginTop: "35px" }}>

  <Link to="/admin" style={navLinkStyle}>
    📊 Dashboard
  </Link>

  <Link to="/admin/users" style={navLinkStyle}>
    👥 Users
  </Link>

  <Link to="/dashboard" style={navLinkStyle}>
    🏠 User Dashboard
  </Link>

  <button
    onClick={logout}
    style={{
      width: "100%",
      padding: "14px",
      marginTop: "20px",
      background: "#e74c3c",
      color: "white",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "15px",
    }}
  >
    🚪 Logout
  </button>

</nav>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  display: "block",
  padding: "8px 0",
};
const navLinkStyle = {
  display: "flex",
  alignItems: "center",
  padding: "14px 16px",
  marginBottom: "10px",
  color: "#ffffff",
  textDecoration: "none",
  borderRadius: "10px",
  fontWeight: "500",
  fontSize: "16px",
  transition: "0.3s",
};
export default AdminLayout;