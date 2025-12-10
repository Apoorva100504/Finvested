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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [otpCountdown, setOtpCountdown] = useState(60);
  const [showResendOtp, setShowResendOtp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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
      await api.post("/send-verification", { email });
      setCurrentStep("otp");
      setOtpCountdown(60);
      setShowResendOtp(false);
      setSuccessMessage("Verification OTP sent to your email!");
    } catch (err) {
      console.error("OTP send error:", err);
      setError(err.response?.data?.error || "Failed to send OTP. Please try again.");
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
      const res = await api.post("/verify-email", {
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
      setSuccessMessage("Email verified successfully!");
    } catch (err) {
      console.error("OTP verification error:", err);
      setError(err.response?.data?.error || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Password setup
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
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
        email: email.toLowerCase().trim(),
        password,
        firstName,
        lastName,
        phone: phone || undefined,
      });

      // Call the completion callback
      if (onSignupComplete) {
        onSignupComplete(res.data);
      }
      
    } catch (err) {
      console.error("Signup error:", err);
      const msg = err.response?.data?.error || "Signup failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    try {
      setLoading(true);
      await api.post("/send-verification", { email });
      setOtpCountdown(60);
      setShowResendOtp(false);
      setSuccessMessage("New OTP sent to your email!");
    } catch (err) {
      console.error("Resend OTP error:", err);
      setError(err.response?.data?.error || "Failed to resend OTP.");
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
            <h3 className="modal-title-right mb-1 text-center">Create Account</h3>
            <p className="text-sm text-gray-500 mb-6 text-center">Join Finvested to start investing</p>
            
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-600 text-sm animate-fadeIn">
                ✅ {successMessage}
              </div>
            )}
            
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Your Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 group-hover:border-green-400 pr-10"
                />
                <div className="absolute right-3 top-3 text-gray-400 group-hover:text-green-500 transition-colors duration-300">
                  ✉️
                </div>
              </div>
              
              <button
                type="submit"
                className="submit-button w-full py-3 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    Sending OTP...
                  </span>
                ) : "Continue with Email"}
              </button>
            </form>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-center text-gray-600 text-sm mb-3">Already have an account?</p>
              <button
                onClick={onSwitchToLogin}
                className="w-full py-2 border border-green-500 text-green-600 font-medium rounded-lg hover:bg-green-50 active:scale-[0.98] transition-all duration-200"
              >
                Login Instead
              </button>
            </div>
            
            <div className="mt-4 text-center text-xs text-gray-500">
              <p>By creating an account, you agree to our Terms & Privacy Policy</p>
            </div>
          </>
        );

      case "otp":
        return (
          <>
            <h3 className="modal-title-right mb-1 text-center">Verify Your Email</h3>
            <div className="email-display mb-6 text-center text-sm text-gray-600 bg-gray-50 py-2 rounded-lg">
              OTP sent to: <span className="font-medium">{email}</span>
            </div>
            
            <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 group-hover:border-green-400 text-center text-lg tracking-widest"
                />
              </div>
              
              <div className="otp-resend text-center text-sm">
                {otpCountdown > 0 ? (
                  <p className="text-gray-500">
                    Resend OTP in <span className="font-medium">{otpCountdown}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-green-600 hover:text-green-700 hover:underline focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    Resend OTP
                  </button>
                )}
              </div>
              
              <button 
                type="submit" 
                className="submit-button w-full py-3 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    Verifying...
                  </span>
                ) : "Verify OTP"}
              </button>
            </form>
            
            <button
              onClick={() => setCurrentStep("email")}
              className="mt-6 w-full py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>←</span> Back to Email
            </button>
          </>
        );

      case "password":
        return (
          <>
            <h3 className="modal-title-right mb-1 text-center">Set Your Password</h3>
            <div className="email-display mb-6 text-center text-sm text-gray-600">
              For: <span className="font-medium">{email}</span>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
              <div className="relative group">
                <input
                  type="password"
                  placeholder="Create Password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 group-hover:border-green-400 pr-10"
                />
              </div>
              
              <div className="relative group">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 group-hover:border-green-400 pr-10"
                />
              </div>
              
              <div className="password-requirements text-sm text-gray-500">
                Password must be at least 6 characters long
              </div>
              
              <button 
                type="submit" 
                className="submit-button w-full py-3 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    Next...
                  </span>
                ) : "Next"}
              </button>
            </form>
            
            <button
              onClick={() => setCurrentStep("otp")}
              className="mt-6 w-full py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>←</span> Back to OTP
            </button>
          </>
        );

      case "details":
        return (
          <>
            <h3 className="modal-title-right mb-1 text-center">Personal Details</h3>
            <div className="email-display mb-6 text-center text-sm text-gray-600">
              Email: <span className="font-medium">{email}</span>
            </div>
            
            <form onSubmit={handleDetailsSubmit} className="flex flex-col gap-4">
              <div className="flex gap-3">
                <div className="relative group flex-1">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 group-hover:border-green-400"
                  />
                </div>
                
                <div className="relative group flex-1">
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 group-hover:border-green-400"
                  />
                </div>
              </div>
              
              <div className="relative group">
                <input
                  type="tel"
                  placeholder="Phone Number (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 group-hover:border-green-400 pr-10"
                />
                <div className="absolute right-3 top-3 text-gray-400">
                  📱
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                Add phone number for security alerts (optional)
              </div>
              
              <button 
                type="submit" 
                className="submit-button w-full py-3 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    Creating Account...
                  </span>
                ) : "Create Account"}
              </button>
            </form>
            
            <button
              onClick={() => setCurrentStep("password")}
              className="mt-6 w-full py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>←</span> Back to Password
            </button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className={`mb-4 p-3 rounded-lg border bg-red-50 border-red-200 text-red-700 animate-fadeIn`}>
          <div className="flex items-start gap-3">
            <span className="text-red-500 text-lg">⚠️</span>
            <div>
              <p className="font-medium text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {renderStep()}
    </div>
  );
};

export default SignupFlow;