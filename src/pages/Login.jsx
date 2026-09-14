import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, verifyOtp } from "../services/authService";
const Login = () => {
     const navigate = useNavigate();

    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });
const [errors, setErrors] = useState({});
    const [otp, setOtp] = useState("");
const [showOtp, setShowOtp] = useState(false);

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

    try {

        const response = await loginUser(loginData);

        if (response.data === "OTP Sent Successfully") {

            alert("OTP Sent to your Email");
            setShowOtp(true);
            return;
        }

    } catch (error) {

        console.log(error);
        alert("Login Failed");
    }
};

  const handleVerifyOtp = async () => {

    if (!otp.trim()) {
        alert("Please enter OTP");
        return;
    }

    if (!/^\d{6}$/.test(otp.trim())) {
        alert("OTP must be 6 digits");
        return;
    }

    try {

        console.log({
            email: loginData.email,
            otp: otp.trim()
        });

        const response = await verifyOtp({
            email: loginData.email,
            otp: otp.trim()
        });

        console.log("Verify OTP Response:", response.data);

        // Save authentication data
        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("userEmail", loginData.email);

        // Redirect based on role
        if (response.data.role === "ROLE_ADMIN") {
            navigate("/admin", { replace: true });
        } else {
            navigate("/dashboard", { replace: true });
        }

    } catch (error) {
    console.error("OTP Verification Error:", error);

    const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Invalid OTP. Please try again.";

    alert(message);

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

{showOtp && (
  <>
    <input
      type="text"
      placeholder="Enter OTP"
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
      style={{
        width: "100%",
        padding: "14px",
        marginBottom: "5px",
        borderRadius: "12px",
        border: "none",
        outline: "none"
      }}
    />

    {errors.otp && (
      <p
        style={{
          color: "#ff4d4f",
          fontSize: "13px",
          marginBottom: "15px",
          marginTop: "5px"
        }}
      >
        {errors.otp}
      </p>
    )}
  </>
)}
   {!showOtp ? (

  <button
    type="submit"
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
    Login
  </button>

) : (

  <button
    type="button"
    onClick={handleVerifyOtp}
    style={{
      width: "100%",
      padding: "14px",
      border: "none",
      borderRadius: "12px",
      background: "#06d6a0",
      color: "#fff",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer"
    }}
  >
    Verify OTP
  </button>

)}

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
