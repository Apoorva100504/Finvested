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
  const [googleLoading, setGoogleLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // ✅ NEW: Check for Google OAuth callback in URL
  useEffect(() => {
    const checkGoogleCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const userId = urlParams.get('userId');
      
      if (token && userId) {
        // Clear URL parameters to prevent re-running
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
        
        // Process Google signup/login
        processGoogleAuth(token, userId);
      }
    };
    
    checkGoogleCallback();
  }, []);

  // ✅ NEW: Function to process Google authentication
  const processGoogleAuth = async (token, userId) => {
    try {
      // First store the token
      localStorage.setItem("authToken", token);
      
      // Try to get user data from backend
      try {
        const response = await api.get(`/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const userData = response.data;
        
        // Complete the signup/login process
        completeGoogleSignup(token, userData);
        
      } catch (fetchError) {
        console.log("Could not fetch user data directly");
        
        // Create basic user object
        const userData = {
          id: userId,
          email: email || "user@google.com",
          firstName: firstName || "Google",
          lastName: lastName || "User",
          role: "user",
          isEmailVerified: true,
          provider: "google"
        };
        
        // Complete the process with basic data
        completeGoogleSignup(token, userData);
      }
      
    } catch (error) {
      console.error("Google authentication error:", error);
      setError("Google authentication failed. Please try again.");
    }
  };

  // ✅ NEW: Function to complete Google signup
  const completeGoogleSignup = (token, userData) => {
    // Store user data
    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("loginProvider", "google");
    
    // Dispatch login event for Navbar
    const loginEvent = new CustomEvent('userLoggedIn', { 
      detail: { 
        email: userData.email,
        provider: "google"
      } 
    });
    window.dispatchEvent(loginEvent);
    
    // Call the completion callback
    if (onSignupComplete) {
      onSignupComplete({
        token,
        user: userData
      });
    }
  };

 // Updated: Google Signup (NO popup, same tab redirect)
const handleGoogleSignup = () => {
  setError("");
  setGoogleLoading(true);

  // Store current email if user typed it
  if (email) {
    localStorage.setItem('pendingGoogleEmail', email);
  }

  // Redirect directly to Google OAuth
  const googleAuthUrl = `${api.defaults.baseURL}/auth/google`;

  window.location.href = googleAuthUrl;
};

  // ✅ NEW: Listen for window messages
  useEffect(() => {
    const handleMessage = (event) => {
      // Security check
      if (event.origin !== window.location.origin && 
          !event.origin.includes('localhost') && 
          !event.origin.includes('127.0.0.1')) {
        return;
      }
      
      // Check for Google auth data
      if (event.data && event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        const { token, user } = event.data;
        
        if (token && user) {
          completeGoogleSignup(token, user);
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onSignupComplete]);

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
      await api.post("/auth/send-verification", { email });
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
      const res = await api.post("/auth/verify-email", {
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

 const handlePasswordSubmit = (e) => {
  e.preventDefault();
  setError("");

  const strong = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
  if (!strong.test(password)) {
    setError("Password must be ≥6 chars and include uppercase, lowercase, number and special char.");
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
      const res = await api.post("/auth/signup", {
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
            <h3
              className="modal-title-right mb-1 text-center 
                         bg-gradient-to-r from-aquaMint to-neonBlue 
                         bg-clip-text text-transparent"
            >
              Create Account
            </h3>

            <p className="text-sm mb-6 text-center 
                          bg-gradient-to-r from-[#48E1C4] via-[#5064FF] to-[#48E1C4] 
                          bg-clip-text text-transparent">
              Join Finvested to start investing
            </p>

            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-600 text-sm animate-fadeIn">
                ✅ {successMessage}
              </div>
            )}
            
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
              {/* Email Input */}
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Your Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-neonBlue focus:border-transparent 
                           transition-all duration-300 group-hover:border-aquaMint pr-10"
                />
                <div className="absolute right-3 top-3 text-gray-400 group-hover:text-neonBlue transition-colors duration-300">
                  ✉️
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`submit-button w-full py-3 mt-2 hover:scale-[1.02] active:scale-[0.98] 
                          transition-all duration-300 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed
                          ${loading ? 'animate-pulse' : ''} 
                          bg-gradient-to-r from-[#48E1C4] via-[#5064FF] to-[#48E1C4] text-white rounded-xl
                          hover:from-[#5064FF] hover:via-[#48E1C4] hover:to-[#5064FF]`}
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

            {/* Google Signup Button */}
            <button
              onClick={handleGoogleSignup}
              disabled={googleLoading}
              className="group relative w-full py-3 px-4 border-2 border-[#5064FF]/30 
                         rounded-xl bg-white 
                         hover:border-[#48E1C4] hover:bg-[#48e1c41a]
                         transition-all duration-300 flex items-center justify-center gap-3 
                         hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 mb-3 mt-6"
            >
              {googleLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-[#5064FF] border-t-transparent"></span>
                  Connecting...
                </span>
              ) : (
                <>
                  <div className="group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#5064FF" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#48E1C4" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#9BEFE2" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#7BA9FF" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>

                  <span className="text-gray-700 font-medium group-hover:text-[#5064FF] transition-colors duration-200">
                    Continue with Google
                  </span>
                </>
              )}
            </button>
            
            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <button
                  onClick={onSwitchToLogin}
                  className="text-neonBlue font-medium hover:text-aquaMint hover:underline transition-colors duration-200"
                >
                  Login Instead
                </button>
              </p>
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

              {/* OTP Input */}
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-[#5064FF] 
                           transition-all duration-300 
                           group-hover:border-[#48E1C4]
                           text-center text-lg tracking-widest"
                />
              </div>

              {/* Resend OTP */}
              <div className="otp-resend text-center text-sm">
                {otpCountdown > 0 ? (
                  <p className="text-gray-500">
                    Resend OTP in <span className="font-medium">{otpCountdown}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-[#5064FF] hover:text-[#48E1C4] hover:underline 
                             transition-colors duration-200 disabled:opacity-50"
                    disabled={loading}
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                className="submit-button w-full py-3 rounded-xl text-white
                           bg-gradient-to-r from-[#48E1C4] via-[#5064FF] to-[#48E1C4]
                           hover:scale-[1.02] active:scale-[0.98]
                           hover:shadow-lg transition-all duration-300
                           disabled:opacity-70"
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

            {/* Back Button */}
            <button
              onClick={() => setCurrentStep("email")}
              className="mt-6 w-full py-2 text-gray-600 
                         hover:text-gray-800 hover:bg-gray-50 
                         rounded-lg transition-all duration-200 
                         flex items-center justify-center gap-2"
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

              {/* Password */}
              <div className="relative group">
                <input
                  type="password"
                  placeholder="Create Password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg
                           focus:ring-2 focus:ring-[#5064FF]
                           transition-all duration-300 
                           group-hover:border-[#48E1C4] pr-10"
                />
              </div>

              {/* Confirm Password */}
              <div className="relative group">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg
                           focus:ring-2 focus:ring-[#5064FF]
                           transition-all duration-300 
                           group-hover:border-[#48E1C4] pr-10"
                />
              </div>

              <div className="password-requirements text-sm text-gray-500">
                Password must be at least 6 characters long
              </div>

              {/* NEXT BUTTON */}
              <button 
                type="submit"
                className="submit-button w-full py-3 text-white rounded-xl
                           bg-gradient-to-r from-[#48E1C4] via-[#5064FF] to-[#48E1C4]
                           hover:scale-[1.02] active:scale-[0.98]
                           hover:shadow-lg transition-all duration-300
                           disabled:opacity-70 disabled:cursor-not-allowed"
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

            {/* Back to OTP */}
            <button
              onClick={() => setCurrentStep("otp")}
              className="mt-6 w-full py-2 text-gray-600 
                         hover:text-gray-800 hover:bg-gray-50 
                         rounded-lg transition-all duration-200 
                         flex items-center justify-center gap-2"
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

              {/* First + Last Name */}
              <div className="flex gap-3">
                <div className="relative group flex-1">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-[#5064FF] focus:border-transparent
                             transition-all duration-300 group-hover:border-[#48E1C4]"
                  />
                </div>
                
                <div className="relative group flex-1">
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-[#5064FF] focus:border-transparent
                             transition-all duration-300 group-hover:border-[#48E1C4]"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="relative group">
                <input
                  type="tel"
                  placeholder="Phone Number (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-[#5064FF] focus:border-transparent
                           transition-all duration-300 group-hover:border-[#48E1C4] pr-10"
                />
                <div className="absolute right-3 top-3 text-gray-400">
                  📱
                </div>
              </div>

              <div className="text-sm text-gray-500">
                Add phone number for security alerts (optional)
              </div>

              {/* CREATE ACCOUNT BUTTON */}
              <button 
                type="submit"
                className="submit-button w-full py-3 text-white rounded-xl
                           bg-gradient-to-r from-[#48E1C4] via-[#5064FF] to-[#48E1C4]
                           hover:scale-[1.02] active:scale-[0.98]
                           hover:shadow-lg transition-all duration-300
                           disabled:opacity-70 disabled:cursor-not-allowed mt-2"
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

            {/* Back */}
            <button
              onClick={() => setCurrentStep("password")}
              className="mt-6 w-full py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 
                         rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
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