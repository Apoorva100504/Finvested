import React, { useState, useEffect } from "react";
import api from "../../services/api";

const SignupFlow = ({ 
  onSignupComplete, 
  onSwitchToLogin,
  initialEmail = "",
  initialStep = "email" 
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [otpCountdown, setOtpCountdown] = useState(20);
  const [showResendOtp, setShowResendOtp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // OTP countdown
  useEffect(() => {
    let timer;
    if (currentStep === "otp" && otpCountdown > 0) {
      timer = setInterval(() => setOtpCountdown((prev) => prev - 1), 1000);
    } else if (otpCountdown === 0) {
      setShowResendOtp(true);
    }
    return () => clearInterval(timer);
  }, [currentStep, otpCountdown]);

  // Step 1: Email submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/request-otp", { email });
      setCurrentStep("otp");
      setOtpCountdown(20);
      setShowResendOtp(false);
    } catch (err) {
      console.error(err);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: OTP verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(otp)) {
      setError("OTP must be 6 digits.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/verify-otp", {
        email,
        otp,
      });

      if (res.data?.success !== true) {
        setError("Invalid OTP. Please try again.");
        return;
      }

      setCurrentStep("password");
      setOtpCountdown(0);
      setShowResendOtp(false);
    } catch (err) {
      console.error(err);
      setError("Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Password setup
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setCurrentStep("details");
  };

  // Step 4: Complete signup
  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim() || !lastName.trim()) {
      setError("First name and last name are required.");
      return;
    }

    if (phone && phone.length < 10) {
      setError("Please enter a valid phone number (minimum 10 digits).");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/signup", {
        email,
        password,
        firstName,
        lastName,
        phone: phone || null,
      });

      // Call the completion callback
      onSignupComplete(res.data);
      
    } catch (err) {
      console.error("Signup error:", err);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Signup failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    try {
      setLoading(true);
      await api.post("/auth/request-otp", { email });
      setOtpCountdown(20);
      setShowResendOtp(false);
    } catch (err) {
      console.error(err);
      setError("Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Render based on current step
  const renderStep = () => {
    switch (currentStep) {
      case "email":
        return (
          <>
            <h3 className="modal-title-right">Welcome to Groww</h3>
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="continue-button"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Continue"}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button
                onClick={onSwitchToLogin}
                className="text-green-500 hover:underline"
              >
                Already have an account? Login
              </button>
            </div>
          </>
        );

      case "otp":
        return (
          <>
            <h3 className="modal-title-right">Verify OTP</h3>
            <div className="email-display">Your Email: {email}</div>
            <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Enter OTP (6 digits)"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength="6"
              />
              <div className="otp-resend">
                {otpCountdown > 0 ? (
                  <>Resend in {otpCountdown} seconds</>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="resend-button"
                    disabled={loading}
                  >
                    Resend OTP
                  </button>
                )}
              </div>
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          </>
        );

      case "password":
        return (
          <>
            <h3 className="modal-title-right">Set Your Password</h3>
            <div className="email-display">Your Email: {email}</div>
            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
              <div className="password-requirements text-sm text-gray-500">
                Minimum 6 characters
              </div>
              <button type="submit" className="continue-button" disabled={loading}>
                {loading ? "Checking..." : "Next"}
              </button>
            </form>
          </>
        );

      case "details":
        return (
          <>
            <h3 className="modal-title-right">Personal Details</h3>
            <div className="email-display mb-2">Email: {email}</div>
            <form onSubmit={handleDetailsSubmit} className="flex flex-col gap-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="flex-1"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="flex-1"
                />
              </div>
              <input
                type="tel"
                placeholder="Phone Number (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <button type="submit" className="submit-button mt-2" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {error && <div className="error-message mb-2">{error}</div>}
      {loading && <div className="loading-message mb-2">Please wait...</div>}
      {renderStep()}
    </>
  );
};

export default SignupFlow;