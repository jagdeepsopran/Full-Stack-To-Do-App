import React, { useState, useEffect } from "react";
import "./ResetPassword.css";
import { useParams } from "react-router-dom";
import { baseURL } from "../varibles.jsx";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { token } = useParams();

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${baseURL}/api/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }), // Send token and password
      });

      const data = await response.json();
      if (data.success) {
        alert("Password reset successfully");
        window.location.href = "/login"; // Redirect to login page
      } else {
        alert(data.message || "Error resetting password");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Your Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input-field"
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="input-field"
      />
      <button className="reset-button" onClick={handleResetPassword}>
        Reset Password
      </button>
    </div>
  );
}

export default ResetPassword;
