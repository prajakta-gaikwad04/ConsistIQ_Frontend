import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Badge } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";

import { getUnreadCount } from "../services/NotificationService";
import "../styles/dashboard.css";

function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();

  const [unreadCount, setUnreadCount] = useState(0);

  const loadUnreadCount = async () => {
    try {
      const response = await getUnreadCount();
      setUnreadCount(response.data || 0);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  };

  useEffect(() => {
    loadUnreadCount();
  }, []);

  

  return (
    <header className="dashboard-topbar">

      <Link to="/dashboard" className="brand">
        <div className="brand-mark">
          <TrackChangesIcon />
        </div>

        <span>ConsistIQ</span>
      </Link>

      <nav className="top-navigation">

        <Link
          to="/profile"
          className={`top-nav-link ${
            location.pathname === "/profile" ? "active" : ""
          }`}
        >
          Profile
        </Link>

        <Link
          to="/dashboard"
          className={`top-nav-link ${
            location.pathname === "/dashboard" ? "active" : ""
          }`}
        >
          Dashboard
        </Link>

        <Link
          to="/tasks"
          className={`top-nav-link ${
            location.pathname === "/tasks" ? "active" : ""
          }`}
        >
          Tasks
        </Link>

        <Link
          to="/create-task"
          className={`top-nav-link ${
            location.pathname === "/create-task" ? "active" : ""
          }`}
        >
          Create Task
        </Link>

        <Link
          to="/notifications"
          className={`top-nav-link notification-link ${
            location.pathname === "/notifications" ? "active" : ""
          }`}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsNoneIcon />
          </Badge>
        </Link>

       

      </nav>

    </header>
  );
}

export default Navbar;