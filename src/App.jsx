import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyOtp from "./pages/VerifyOtp";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import CreateTask from "./pages/CreateTask";
import UpdateTask from "./pages/updateTask";
import Analytics from "./pages/Analytics";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

import AdminDashboard from "./admin/AdminDashboard";
import Users from "./admin/Users";
const RootRedirect = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (role === "ROLE_ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}

        <Route
  path="/"
  element={
    localStorage.getItem("token") ? (
      localStorage.getItem("role") === "ROLE_ADMIN" ? (
        <Navigate to="/admin" replace />
      ) : (
        <Navigate to="/dashboard" replace />
      )
    ) : (
      <Login />
    )
  }
/>
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
<Route path="/verify-otp" element={<VerifyOtp />} />
        {/* User Protected Routes */}

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/create-task" element={<CreateTask />} />
          <Route path="/update-task/:id" element={<UpdateTask />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Admin Routes */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
        </Route>

        {/* Unauthorized */}

        <Route
          path="/unauthorized"
          element={<h2>You are not authorized to access this page.</h2>}
        />

        {/* 404 - MUST BE LAST */}

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;