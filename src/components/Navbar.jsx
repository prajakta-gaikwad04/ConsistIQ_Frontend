import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Badge } from "@mui/material";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ChecklistIcon from "@mui/icons-material/Checklist";
import AddTaskIcon from "@mui/icons-material/AddTask";

import { getUnreadCount } from "../services/NotificationService";
import "../styles/dashboard.css";

function Navbar() {

  const location = useLocation();

  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <>
      <header className="dashboard-topbar">

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>


        {/* BRAND */}
        <Link to="/dashboard" className="brand">

          <div className="brand-mark">
            <TrackChangesIcon />
          </div>

          <span>ConsistIQ</span>

        </Link>


        {/* DESKTOP NAVIGATION */}
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

          {/* DESKTOP NOTIFICATION */}
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


        {/* MOBILE NOTIFICATION */}
        <Link
          to="/notifications"
          className={`mobile-notification-link ${
            location.pathname === "/notifications" ? "active" : ""
          }`}
          aria-label="Notifications"
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsNoneIcon />
          </Badge>
        </Link>

      </header>


      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <nav className="mobile-navigation">

          <Link
            to="/profile"
            className={`mobile-nav-link ${
              location.pathname === "/profile" ? "active" : ""
            }`}
          >
            <PersonIcon />
            <span>Profile</span>
          </Link>


          <Link
            to="/dashboard"
            className={`mobile-nav-link ${
              location.pathname === "/dashboard" ? "active" : ""
            }`}
          >
            <DashboardIcon />
            <span>Dashboard</span>
          </Link>


          <Link
            to="/tasks"
            className={`mobile-nav-link ${
              location.pathname === "/tasks" ? "active" : ""
            }`}
          >
            <ChecklistIcon />
            <span>Tasks</span>
          </Link>


          <Link
            to="/create-task"
            className={`mobile-nav-link ${
              location.pathname === "/create-task" ? "active" : ""
            }`}
          >
            <AddTaskIcon />
            <span>Create Task</span>
          </Link>

        </nav>
      )}
    </>
  );
}

export default Navbar;