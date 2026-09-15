import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/ForgotPassword.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
const [errors, setErrors] = useState({});
    const navigate = useNavigate();
const validateEmail = () => {
    const newErrors = {};

    if (!email.trim()) {
        newErrors.email = "Email is required";
} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Enter a valid email address";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
};
    const sendOtp = async () => {

    if (!validateEmail()) {
        return;
    }

    try {
        setLoading(true);

        const res = await axios.post(
    "https://consistiq-backend.onrender.com/auth/forgot-password",
    { email }
);
        setMessage(res.data || "OTP sent successfully");

        navigate("/reset-password", { state: { email } });

    } catch (error) {
        setMessage("Failed to send OTP");
    } finally {
        setLoading(false);
    }
};

   return (
    <div className="forgot-page">

        <div className="forgot-container">

            <div className="forgot-icon">
                🔐
            </div>

            <h2 className="title">
                Forgot Password?
            </h2>

            <p className="forgot-subtitle">
                No worries. Enter your email and we'll send you an OTP to reset your password.
            </p>

            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({
                        ...errors,
                        email: ""
                    });
                }}
                className="email-input"
            />

            {errors.email && (
                <p className="email-error">
                    {errors.email}
                </p>
            )}

            <button
                onClick={sendOtp}
                className="otp-btn"
                disabled={loading}
            >
                {loading ? "Sending OTP..." : "Send OTP"}
            </button>

            {message && (
                <p className="forgot-message">
                    {message}
                </p>
            )}

            <button
                className="back-login"
                onClick={() => navigate("/login")}
            >
                ← Back to Login
            </button>

        </div>

    </div>
);
};

export default ForgotPassword;