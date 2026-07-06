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
            "http://localhost:8081/auth/forgot-password",
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
        <div className="forgot-container">
            <h2>Forgot Password</h2>

           <input
    type="email"
    placeholder="Enter Email"
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
    <p
        style={{
            color: "red",
            fontSize: "14px",
            marginTop: "5px",
            marginBottom: "10px"
        }}
    >
        {errors.email}
    </p>
)}

            <button onClick={sendOtp} className="otp-btn">
                {loading ? "Sending..." : "Send OTP"}
            </button>

            {message && <p>{message}</p>}
        </div>
    );
};

export default ForgotPassword;