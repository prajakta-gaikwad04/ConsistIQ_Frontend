import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {
const [errors, setErrors] = useState({});
const [confirmPassword, setConfirmPassword] = useState("");
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
    const { name, value } = e.target;

    setUser({
        ...user,
        [name]: value
    });

    setErrors({
        ...errors,
        [name]: ""
    });
};
const validateRegister = () => {

    const newErrors = {};

    // Name
    if (!user.name.trim()) {
        newErrors.name = "Full Name is required";
    } else if (user.name.trim().length < 3) {
        newErrors.name = "Name must be at least 3 characters";
    } else if (!/^[A-Za-z ]+$/.test(user.name)) {
        newErrors.name = "Only letters and spaces are allowed";
    }

    // Email
    if (!user.email.trim()) {
        newErrors.email = "Email is required";
    } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)
    ) {
        newErrors.email = "Enter a valid email";
    }

    // Password
    if (!user.password) {
        newErrors.password = "Password is required";
    } else if (user.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
    }

    // Confirm Password
    if (!confirmPassword) {
        newErrors.confirmPassword = "Confirm Password is required";
    } else if (user.password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
};
    const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateRegister()) {
        return;
    }

    try {

        const response = await registerUser(user);

        alert(response.data);

        setUser({
            name: "",
            email: "",
            password: ""
        });

        setConfirmPassword("");

    } catch (error) {

        console.error(error);
        alert("Registration Failed");

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
        maxWidth: "450px",
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
          Create Account ✨
        </h1>

        <p
          style={{
            textAlign: "center",
            opacity: 0.8,
            marginBottom: "30px"
          }}
        >
          Start organizing your tasks with ConsistIQ
        </p>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={user.name}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "15px",
            borderRadius: "12px",
            border: "none",
            outline: "none"
          }}
        />
{errors.name && (
    <p style={{ color: "#ff4d4f", fontSize: "13px", marginBottom: "15px" }}>
        {errors.name}
    </p>
)}
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={user.email}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "15px",
            borderRadius: "12px",
            border: "none",
            outline: "none"
          }}
        />
{errors.email && (
    <p style={{ color: "#ff4d4f", fontSize: "13px", marginBottom: "15px" }}>
        {errors.email}
    </p>
)}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}
         
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "20px",
            borderRadius: "12px",
            border: "none",
            outline: "none"
          }}
        />
{errors.password && (
    <p style={{ color: "#ff4d4f", fontSize: "13px", marginBottom: "15px" }}>
        {errors.password}
    </p>
)}
<input
    type="password"
    placeholder="Confirm Password"
    value={confirmPassword}
    onChange={(e) => {
        setConfirmPassword(e.target.value);
        setErrors({
            ...errors,
            confirmPassword: ""
        });
    }}
    style={{
        width: "100%",
        padding: "14px",
        marginBottom: "5px",
        borderRadius: "12px",
        border: "none",
        outline: "none"
    }}
/>

{errors.confirmPassword && (
    <p style={{ color: "#ff4d4f", fontSize: "13px", marginBottom: "15px" }}>
        {errors.confirmPassword}
    </p>
)}
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
          Create Account
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "20px"
          }}
        >
          Already Registered?{" "}
          <Link
            to="/"
            style={{
              color: "#ffd166",
              textDecoration: "none",
              fontWeight: "bold"
            }}
          >
            Login Here
          </Link>
        </p>
      </form>
    </div>
  </div>
);
}

export default Register;