import React, { useState } from "react";
import "./RequestPasswordReset.css";
import { baseURL } from "../varibles.jsx";

function RequestPasswordReset() {
  const [email, setEmail] = useState("");

  const handleRequestReset = async () => {
    try {
      const response = await fetch(`${baseURL}/api/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }), // Send email to backend
      });

      const data = await response.json();
      if (data.success) {
        alert("Password reset link sent to your email");
      } else {
        alert(data.message || "Error sending reset link");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="request-password-reset-container">
      <h2>Forgot Your Password?</h2>
      <p>Enter your email address to receive a password reset link.</p>
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input-field"
      />
      <button className="request-reset-button" onClick={handleRequestReset}>
        Send Reset Link
      </button>
    </div>
  );
}

export default RequestPasswordReset;
