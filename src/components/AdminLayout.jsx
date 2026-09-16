
import { Link, Outlet } from "react-router-dom";
import { useState } from "react";

const AdminLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userEmail");

    window.location.href = "/";
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}

      <aside className="admin-sidebar">

        <h3 className="admin-logo">
          Admin Panel
        </h3>

        <nav>

          <Link to="/admin" className="admin-nav-link">
            <span className="admin-icon">📊</span>
            <span>Dashboard</span>
          </Link>

          <Link to="/admin/users" className="admin-nav-link">
            <span className="admin-icon">👥</span>
            <span>Users</span>
          </Link>

          <Link to="/dashboard" className="admin-nav-link">
            <span className="admin-icon">🏠</span>
            <span>User Dashboard</span>
          </Link>

          <button
            onClick={logout}
            className="admin-logout"
          >
            🚪 Logout
          </button>

        </nav>
      </aside>


      {/* ================= MOBILE HEADER ================= */}

      <header className="admin-mobile-header">

        <div className="admin-mobile-title">
          <span>👨‍💼</span>
          <span>Admin Panel</span>
        </div>

        <button
          className="admin-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

      </header>


      {/* ================= MOBILE MENU ================= */}

      {menuOpen && (
        <div className="admin-mobile-menu">

          <Link
            to="/admin"
            className="admin-mobile-link"
            onClick={closeMenu}
          >
            📊 Dashboard
          </Link>

          <Link
            to="/admin/users"
            className="admin-mobile-link"
            onClick={closeMenu}
          >
            👥 Users
          </Link>

          <Link
            to="/dashboard"
            className="admin-mobile-link"
            onClick={closeMenu}
          >
            🏠 User Dashboard
          </Link>

          <button
            onClick={() => {
              closeMenu();
              logout();
            }}
            className="admin-mobile-logout"
          >
            🚪 Logout
          </button>

        </div>
      )}


      {/* ================= MAIN CONTENT ================= */}

      <main className="admin-main">
        <Outlet />
      </main>


      {/* ================= RESPONSIVE CSS ================= */}

      <style>{`

        /* =========================================
           DESKTOP
        ========================================= */

        .admin-sidebar {
          position: fixed;
          left: 0;
          top: 0;

          width: 180px;
          height: 100vh;

          background: #1f1c2d;
          color: #ffffff;

          padding: 22px 10px;

          box-sizing: border-box;

          z-index: 1000;
        }

        .admin-logo {
          margin: 5px 0 35px 5px;

          font-size: 17px;
          font-weight: 700;

          color: #ffffff;
        }

        .admin-nav-link {
          display: flex;
          align-items: center;

          gap: 9px;

          width: 100%;

          box-sizing: border-box;

          padding: 12px 8px;
          margin-bottom: 8px;

          color: #ffffff;
          text-decoration: none;

          border-radius: 7px;

          font-size: 13px;
          font-weight: 600;

          transition: background 0.2s ease;
        }

        .admin-nav-link:hover {
          background: #302c45;
        }

        .admin-icon {
          width: 20px;
          min-width: 20px;

          text-align: center;

          font-size: 14px;
        }

        .admin-logout {
          width: 100%;

          padding: 11px 8px;

          margin-top: 20px;

          background: #ef4444;

          color: #ffffff;

          border: none;
          border-radius: 7px;

          cursor: pointer;

          font-weight: 600;
          font-size: 12px;
        }

        .admin-logout:hover {
          background: #dc2626;
        }

        .admin-main {
          margin-left: 180px;

          min-height: 100vh;

          width: calc(100% - 180px);

          background: #eef3f9;

          box-sizing: border-box;

          padding: 12px;
        }

        .admin-mobile-header,
        .admin-mobile-menu {
          display: none;
        }


        /* =========================================
           MOBILE
        ========================================= */

        @media (max-width: 768px) {

          .admin-sidebar {
            display: none;
          }

          .admin-mobile-header {
            display: flex;

            position: sticky;
            top: 0;

            width: 100%;

            height: 60px;

            padding: 0 16px;

            box-sizing: border-box;

            align-items: center;
            justify-content: space-between;

            background: #1f1c2d;

            color: #ffffff;

            z-index: 1000;
          }

          .admin-mobile-title {
            display: flex;

            align-items: center;

            gap: 8px;

            font-size: 17px;

            font-weight: 700;
          }

          .admin-menu-button {
            background: transparent;

            border: none;

            color: #ffffff;

            font-size: 28px;

            cursor: pointer;

            padding: 3px 7px;
          }

          .admin-mobile-menu {
            display: flex;

            flex-direction: column;

            width: 100%;

            background: #272338;

            box-sizing: border-box;

            padding: 8px 12px 12px;

            position: sticky;
            top: 60px;

            z-index: 999;

            box-shadow: 0 5px 15px rgba(0,0,0,.15);
          }

          .admin-mobile-link {
            display: block;

            padding: 13px 12px;

            margin-bottom: 4px;

            color: #ffffff;

            text-decoration: none;

            border-radius: 7px;

            font-size: 14px;

            font-weight: 600;
          }

          .admin-mobile-link:hover {
            background: #39334f;
          }

          .admin-mobile-logout {
            width: 100%;

            padding: 12px;

            margin-top: 6px;

            background: #ef4444;

            color: #ffffff;

            border: none;

            border-radius: 7px;

            font-size: 14px;

            font-weight: 600;

            cursor: pointer;
          }

          .admin-main {
            margin-left: 0;

            width: 100%;

            min-height: calc(100vh - 60px);

            padding: 12px;

            box-sizing: border-box;
          }
        }


        /* =========================================
           SMALL PHONES
        ========================================= */

        @media (max-width: 480px) {

          .admin-mobile-header {
            height: 56px;

            padding: 0 13px;
          }

          .admin-mobile-title {
            font-size: 15px;
          }

          .admin-menu-button {
            font-size: 25px;
          }

          .admin-main {
            padding: 8px;
          }
        }

      `}</style>
    </>
  );
};

export default AdminLayout;

