import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const handleLogout = () => {

    // Remove authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userEmail");

    // Reset Axios redirect flag, if it was previously triggered
    window.__authRedirectTriggered = false;

    // Go to Login page
    navigate("/", { replace: true });
  };

  return (
    <div className="navbar">

      <h2>ConsistIQ</h2>

      <div className="nav-links">

        <Link to="/profile">
          👤 Profile
        </Link>

        <Link to="/dashboard">
          Dashboard
        </Link>

        <Link to="/tasks">
          Tasks
        </Link>

        <Link to="/create-task">
          Create Task
        </Link>

        <Link to="/notifications">
          Notifications
        </Link>

        <button
          onClick={handleLogout}
          style={{
            marginLeft: "15px",
            padding: "8px 15px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Navbar;