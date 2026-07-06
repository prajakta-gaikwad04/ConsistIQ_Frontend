import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar">

      <h2>ConsistIQ</h2>

      <div className="nav-links">
        <Link to="/profile">
    👤 Profile
</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/tasks">Tasks</Link>
        <Link to="/create-task">Create Task</Link>
        <Link to="/notifications">Notifications</Link>

      </div>

    </div>
  );
}

export default Navbar;