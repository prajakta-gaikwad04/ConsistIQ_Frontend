import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp } from "../services/authService";
import "../styles/VerifyOtp.css";
const VerifyOtp = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";
    const [otp, setOtp] = useState("");

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
            const response = await verifyOtp({
                email: email,
                otp: otp.trim()
            });

            console.log("Verify OTP Response:", response.data);

            localStorage.setItem("token", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("userEmail", email);

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
    className="verify-otp-page"
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
    className="verify-otp-card"
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
                <h1 style={{ textAlign: "center" }}>
                    Verify OTP
                </h1>

                <p
                    style={{
                        textAlign: "center",
                        opacity: 0.8,
                        marginBottom: "30px"
                    }}
                >
                    OTP has been sent to your email
                </p>

                <p
                    style={{
                        textAlign: "center",
                        marginBottom: "20px"
                    }}
                >
                    {email}
                </p>

                <input
    className="verify-otp-input"
    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    style={{
                        width: "100%",
                        padding: "14px",
                        marginBottom: "20px",
                        borderRadius: "12px",
                        border: "none",
                        outline: "none",
                        boxSizing: "border-box"
                    }}
                />

                <button
    className="verify-otp-button"
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

                <p
                    style={{
                        textAlign: "center",
                        marginTop: "20px"
                    }}
                >
                    <button
    className="verify-otp-back"
    type="button"
    onClick={() => navigate("/login")}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#ffd166",
                            cursor: "pointer",
                            fontSize: "14px"
                        }}
                    >
                        Back to Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default VerifyOtp;