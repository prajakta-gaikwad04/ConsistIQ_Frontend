import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import "../styles/Login.css";
const Login = () => {
     const navigate = useNavigate();
const [loading, setLoading] = useState(false);
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });
const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });
    };
const validateLogin = () => {
    const newErrors = {};

    // Email
    if (!loginData.email.trim()) {
        newErrors.email = "Email is required";
   } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)
) {
    newErrors.email = "Enter a valid email";
}

    // Password
    if (!loginData.password) {
        newErrors.password = "Password is required";
    } else if (loginData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
};
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateLogin()) {
        return;
    }

    setLoading(true);

    try {
        const response = await loginUser(loginData);

        if (response.data === "OTP Sent Successfully") {
            navigate("/verify-otp", {
                state: {
                    email: loginData.email
                }
            });

            return;
        }

        alert(response.data);

    } catch (error) {
        console.log(error);

        const message =
            error.response?.data ||
            "Login Failed";

        alert(message);

    } finally {
        setLoading(false);
    }
};
  
  return (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background:
        "linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)",
      padding: "20px"
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: "420px",
        background: "rgba(255,255,255,0.12)",
        backdropFilter: "blur(18px)",
        borderRadius: "24px",
        padding: "40px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        color: "#fff"
      }}
    >
      <form onSubmit={handleSubmit}>
        <h1
          style={{
            textAlign: "center",
            marginBottom: "10px"
          }}
        >
          Welcome Back 👋
        </h1>

        <p
          style={{
            textAlign: "center",
            opacity: 0.8,
            marginBottom: "30px"
          }}
        >
          Login to continue managing your tasks
        </p>

        <input
  type="email"
  name="email"
  placeholder="Email Address"
  value={loginData.email}
  onChange={handleChange}
  style={{
    width: "100%",
    padding: "14px",
    marginBottom: "5px",
    borderRadius: "12px",
    border: "none",
    outline: "none"
  }}
/>

{errors.email && (
  <p
    style={{
      color: "#ff4d4f",
      fontSize: "13px",
      marginBottom: "15px",
      marginTop: "5px"
    }}
  >
    {errors.email}
  </p>
)}

  <input
  type="password"
  name="password"
  placeholder="Password"
  value={loginData.password}
  onChange={handleChange}
  style={{
    width: "100%",
    padding: "14px",
    marginBottom: "5px",
    borderRadius: "12px",
    border: "none",
    outline: "none"
  }}
/>

{errors.password && (
  <p
    style={{
      color: "#ff4d4f",
      fontSize: "13px",
      marginBottom: "15px",
      marginTop: "5px"
    }}
  >
    {errors.password}
  </p>
)}

<p
  style={{
    textAlign: "right",
    marginBottom: "20px"
  }}
>
  <Link
    to="/forgot-password"
    style={{
      color: "#ffd166",
      textDecoration: "none"
    }}
  >
    Forgot Password?
  </Link>
</p>

<button
    type="submit"
     disabled={loading}
    style={{
        width: "100%",
        padding: "14px",
        border: "none",
        borderRadius: "12px",
        background: "#ff6b6b",
        color: "#fff",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer"
    }}
>
    {loading ? "Sending OTP..." : "Login"}
</button>

        <p
          style={{
            textAlign: "center",
            marginTop: "20px"
          }}
        >
          New User?{" "}
          <Link
            to="/register"
            style={{
              color: "#ffd166",
              textDecoration: "none",
              fontWeight: "bold"
            }}
          >
            Register Here
          </Link>
        </p>
      </form>
    </div>
  </div>
);
}
export default Login
