import { useState } from "react";
import axios from "axios";
import "../styles/ResetPassword.css";
import { useLocation } from "react-router-dom";

const ResetPassword = () => {
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
const [errors, setErrors] = useState({});
const location = useLocation();
const [email] = useState(location.state?.email || "");

const validateResetPassword = () => {

    const newErrors = {};

    // OTP
    if (!otp.trim()) {
        newErrors.otp = "OTP is required";
    } else if (!/^\d{6}$/.test(otp)) {
        newErrors.otp = "OTP must be exactly 6 digits";
    }

    // New Password
    if (!newPassword) {
        newErrors.newPassword = "New Password is required";
    } else if (newPassword.length < 8) {
        newErrors.newPassword = "Password must be at least 8 characters";
    }

    // Confirm Password
    if (!confirmPassword) {
        newErrors.confirmPassword = "Confirm Password is required";
    } else if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
};
   const resetPassword = async () => {

    if (!validateResetPassword()) {
        return;
    }

    try {

        const res = await axios.post(
            "https://consistiq-backend.onrender.com/auth/reset-password",
            {
                email,
                otp,
                newPassword,
            }
        );

        setMessage(res.data.message || "Password reset successful");

    } catch (error) {

        setMessage("Invalid OTP or error occurred");

    }
};

    return (
        <div className="reset-container">
            <h2>Reset Password</h2>

            <input
                type="email"
                placeholder="Email"
                value={email}
            />

           <input
    type="text"
    placeholder="Enter OTP"
    value={otp}
    onChange={(e) => {
        setOtp(e.target.value);

        setErrors({
            ...errors,
            otp: ""
        });
    }}
/>

{errors.otp && (
    <p style={{ color: "red", fontSize: "13px" }}>
        {errors.otp}
    </p>
)}
            <input
    type="password"
    placeholder="New Password"
    value={newPassword}
    onChange={(e) => {
        setNewPassword(e.target.value);

        setErrors({
            ...errors,
            newPassword: ""
        });
    }}
/>

{errors.newPassword && (
    <p style={{ color: "red", fontSize: "13px" }}>
        {errors.newPassword}
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
/>

{errors.confirmPassword && (
    <p style={{ color: "red", fontSize: "13px" }}>
        {errors.confirmPassword}
    </p>
)}
            <button onClick={resetPassword}>
                Reset Password
            </button>

            {message && <p>{message}</p>}
        </div>
    );
};

export default ResetPassword;