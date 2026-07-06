import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import CreateTask from "./pages/CreateTask";
import UpdateTask from "./pages/updateTask";
import Analytics from "./pages/Analytics";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

import AdminDashboard from "./admin/AdminDashboard";
import Users from "./admin/Users";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}

        <Route
    path="/"
    element={
        !localStorage.getItem("token")
            ? <Login />
            : localStorage.getItem("role") === "ROLE_ADMIN"
                ? <Navigate to="/admin" replace />
                : <Navigate to="/dashboard" replace />
    }
/>

        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

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

        {/* 404 Route - Keep LAST */}

        <Route path="*" element={<Navigate to="/" />} />
<Route
    path="/unauthorized"
    element={<h2>You are not authorized to access this page.</h2>}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;