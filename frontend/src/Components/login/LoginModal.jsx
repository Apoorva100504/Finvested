import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import SignupFlow from "./SignupFlow";
import api from "../../services/api";
import "./LoginModal.css";
import { Eye, EyeOff, ArrowLeft, Mail, CheckCircle } from "lucide-react";

function LoginModal({ isOpen, onClose, mode: initialMode = "login", onLoginSuccess }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [shakeError, setShakeError] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/loginh");
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [resetLinkSent, setResetLinkSent] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [resetPasswordMode, setResetPasswordMode] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  
  const navigate = useNavigate();
  const { login, setError: setAuthError } = useAuth();

  // ✅ NEW: Check for Google OAuth callback in URL
  useEffect(() => {
    // This runs on component mount and when URL changes
    const checkGoogleCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const userId = urlParams.get('userId');
      
      if (token && userId) {
        // Clear URL parameters to prevent re-running
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
        
        // Process Google login
        processGoogleLogin(token, userId);
      }
    };
    
    checkGoogleCallback();
    
    // Listen for URL changes
    const handleLocationChange = () => {
      checkGoogleCallback();
    };
    
    window.addEventListener('popstate', handleLocationChange);
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, [navigate, login, onClose, onLoginSuccess]);

  // ✅ NEW: Function to process Google login
  const processGoogleLogin = async (token, userId) => {
    try {
      // First store the token
      localStorage.setItem("authToken", token);
      
      // Try to get user data from backend using token
      try {
        const response = await api.get(`/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const userData = response.data;
        
        // Complete the login process
        completeGoogleLogin(token, userData);
        
      } catch (fetchError) {
        console.log("Could not fetch user data directly, creating from token");
        
        // If we can't fetch user data, create a basic user object from token
        const userData = {
          id: userId,
          email: "user@google.com", // Default placeholder
          firstName: "Google",
          lastName: "User",
          role: "user",
          isEmailVerified: true,
          provider: "google"
        };
        
        // Complete the login process with basic data
        completeGoogleLogin(token, userData);
      }
      
    } catch (error) {
      console.error("Google login processing error:", error);
      setError("Google login failed. Please try again.");
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
    }
  };

  // ✅ NEW: Function to complete Google login
  const completeGoogleLogin = (token, userData) => {
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
    
    // Trigger success animation
    setSuccessAnimation(true);
    
    // Login the user
    if (login) login(userData, token);
    
    // Notify parent component
    if (onLoginSuccess) {
      onLoginSuccess(userData);
    }
    
    // Close modal after success animation
    setTimeout(() => {
      if (onClose && isOpen) onClose();
      navigate("/loginh");
    }, 1500);
  };

 // NEW: Google login without popup — redirect in same tab
const handleGoogleLogin = () => {
  setError("");
  setGoogleLoading(true);

  const googleAuthUrl = `${api.defaults.baseURL}/auth/google`;

  // Redirect user to Google login page in SAME TAB
  window.location.href = googleAuthUrl;
};

    
   
  // ✅ NEW: Alternative approach - Listen for window messages
  useEffect(() => {
    const handleMessage = (event) => {
      // Security check - only accept messages from our own origin
      if (event.origin !== window.location.origin && 
          !event.origin.includes('localhost') && 
          !event.origin.includes('127.0.0.1')) {
        return;
      }
      
      // Check for Google auth data
      if (event.data && event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        const { token, user } = event.data;
        
        if (token && user) {
          completeGoogleLogin(token, user);
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [login, onClose, onLoginSuccess, navigate]);

  // Reset modal state on open
  useEffect(() => {
    if (!isOpen) return;
    
    setMode(initialMode);
    setEmail("");
    setPassword("");
    setError("");
    setSuccessMessage("");
    setPasswordVisible(false);
    setShakeError(false);
    setSuccessAnimation(false);
    setGoogleLoading(false);
    setRedirectPath("/loginh");
    setForgotPasswordMode(false);
    setResetPasswordMode(false);
    setForgotPasswordEmail("");
    setResetLinkSent(false);
    setOtp("");
    setNewPassword("");
    setConfirmNewPassword("");
  }, [isOpen, initialMode]);

  // Forgot Password Submit - connects to /forgot-password
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    
    if (!forgotPasswordEmail || !forgotPasswordEmail.includes("@")) {
      setError("Please enter a valid email address");
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
      return;
    }
    
    setForgotPasswordLoading(true);
    
    try {
      // ✅ BACKEND ENDPOINT: POST /forgot-password
      const response = await api.post("/forgot-password", {
        email: forgotPasswordEmail.toLowerCase().trim()
      });
      
      setResetLinkSent(true);
      setSuccessMessage("Password reset OTP sent! Check your email.");
      
    } catch (error) {
      console.error("Forgot password error:", error);
      // Still show success message for security
      setResetLinkSent(true);
      setForgotPasswordLoading(false);
    }
  };

  // Reset Password with OTP - connects to /reset-password
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
      return;
    }
    
    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match");
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
      return;
    }
    
    setForgotPasswordLoading(true);
    
    try {
      // ✅ BACKEND ENDPOINT: POST /reset-password
      const response = await api.post("/reset-password", {
        email: forgotPasswordEmail.toLowerCase().trim(),
        otp,
        newPassword
      });
      
      setSuccessMessage("Password reset successfully! You can now login with your new password.");
      setTimeout(() => {
        setResetPasswordMode(false);
        setForgotPasswordMode(false);
        setForgotPasswordEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmNewPassword("");
      }, 2000);
      
    } catch (error) {
      console.error("Reset password error:", error);
      setError(error.response?.data?.error || "Failed to reset password. Please try again.");
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

 const handleLoginSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccessMessage("");
  setShakeError(false);

  // Basic validation
  if (!email || !email.includes("@")) {
    setError("Please enter a valid email address");
    setShakeError(true);
    setTimeout(() => setShakeError(false), 500);
    return;
  }

  if (!password || password.length < 6) {
    setError("Password must be at least 6 characters");
    setShakeError(true);
    setTimeout(() => setShakeError(false), 500);
    return;
  }

  setLoading(true);
  
  try {
    // ✅ BACKEND ENDPOINT: POST /login
    const response = await api.post("/auth/login", {
      email: email.toLowerCase().trim(),
      password
    });

    if (response.data.token && response.data.user) {
      // Store token and user data
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("userData", JSON.stringify(response.data.user));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("loginProvider", "email");
      localStorage.setItem("userEmail", response.data.user.email); // ✅ ADDED
      
      // Dispatch login event for Navbar
      const loginEvent = new CustomEvent('userLoggedIn', { 
        detail: { 
          email: response.data.user.email,
          userData: response.data.user, // ✅ ADDED
          provider: "email"
        } 
      });
      window.dispatchEvent(loginEvent);
      
      // Trigger success animation
      setSuccessAnimation(true);
      
      // Login the user
      if (login) login(response.data.user, response.data.token);
      
      // Notify parent component of successful login
      if (onLoginSuccess) {
        onLoginSuccess(response.data.user);
      }
      
      // Close modal after success animation
      setTimeout(() => {
        onClose();
        navigate(redirectPath);
      }, 1500);
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error) {
    console.error("Login error:", error);
    setError(error.response?.data?.error || "Login failed. Please try again.");
    setShakeError(true);
    setTimeout(() => setShakeError(false), 500);
  } finally {
    setLoading(false);
  }
};
  // Handle signup completion
  const handleSignupComplete = async (signupData) => {
    const { token, user } = signupData;
    
    if (!token || !user) {
      setError("Signup failed. Please try again.");
      return;
    }

    // Store user data
    localStorage.setItem("authToken", token);
    localStorage.setItem("userData", JSON.stringify(user));
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("loginProvider", "email");
    
    // Dispatch login event
    const loginEvent = new CustomEvent('userLoggedIn', { 
      detail: { email: user.email } 
    });
    window.dispatchEvent(loginEvent);
    
    // Trigger success animation
    setSuccessAnimation(true);
    
    // Login the user after signup
    if (login) login(user, token);
    
    // Notify parent component
    if (onLoginSuccess) {
      onLoginSuccess(user);
    }
    
    // Close modal after animation
    setTimeout(() => {
      onClose();
      navigate("/loginh");
    }, 1500);
  };

  // Switch to login mode
  const handleSwitchToLogin = () => {
    setMode("login");
    setForgotPasswordMode(false);
    setResetPasswordMode(false);
    setError("");
    setSuccessMessage("");
    setShakeError(false);
  };

  // Go back to login from forgot password
  const handleBackToLogin = () => {
    setForgotPasswordMode(false);
    setResetPasswordMode(false);
    setError("");
    setSuccessMessage("");
    setForgotPasswordEmail("");
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${successAnimation ? 'animate-success-modal' : ''}`}>
        <button 
          className="modal-close-button hover:bg-gray-100 hover:scale-110 active:scale-95 transition-all duration-200" 
          onClick={onClose}
        >
          &times;
        </button>

        {/* Left Panel */}
        <div className="modal-left-panel relative overflow-hidden">
          {/* Main Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#48E1C4] via-[#5064FF] to-[#48E1C4]"></div>

          {/* Light Diagonal Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(45deg, transparent 48%, white 50%, transparent 52%)`,
                backgroundSize: "50px 50px"
              }}
            ></div>
          </div>

          {/* Soft Floating Dots */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
            <div className="absolute top-8 right-8 w-3 h-3 bg-white rounded-full"></div>
            <div className="absolute top-16 right-16 w-2 h-2 bg-white rounded-full"></div>
            <div className="absolute top-24 right-4 w-4 h-4 bg-white rounded-full"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-center items-center px-8">
            <div className="mb-8 animate-fadeInUp">
              {/* Icon gradient updated */}
              <div className="w-12 h-12 bg-gradient-to-br from-[#48E1C4] via-[#5064FF] to-[#48E1C4] rounded-xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M3 17L9 11L13 15L21 7"
                        stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M21 7V3H17"
                        stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <circle cx="9" cy="11" r="1" fill="white" />
                  <circle cx="13" cy="15" r="1" fill="white" />
                </svg>
              </div>

              <h2 className="modal-title-left text-white text-3xl font-bold mb-2 text-center leading-snug">
                Simple, Free
                <br />
                Investing.
              </h2>
            </div>

            <div className="animate-fadeInUp delay-200">
              <p className="modal-subtitle-left text-white/95 text-xl font-semibold text-center">
                Mutual Funds
              </p>
            </div>

            <div className="w-16 h-1 bg-white/30 rounded-full my-8 animate-fadeInUp delay-300"></div>

            <div className="animate-fadeInUp delay-400">
              <div className="text-center">
                <div className="text-white text-sm mb-2 opacity-90">
                  Trusted by millions of investors
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="modal-right-panel">
          {successAnimation && (
            <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center rounded-xl z-10 animate-fadeIn">
              
              {/* Neon Blue + AquaMint Success Circle */}
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 animate-bounce"
                style={{
                  background: "linear-gradient(135deg, #5064FF, #4FFFC6)",
                  boxShadow: "0 0 15px rgba(80, 100, 255, 0.6), 0 0 25px rgba(79, 255, 198, 0.5)"
                }}
              >
                <span className="text-white text-2xl">✓</span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Login Successful!
              </h3>

              <p className="text-gray-600 text-sm">Redirecting to your dashboard...</p>

              {/* Neon Progress Bar */}
              <div className="w-48 h-1 bg-gray-200 rounded-full mt-4 overflow-hidden">
                <div
                  className="h-full animate-progress-bar"
                  style={{
                    background: "linear-gradient(90deg, #5064FF, #4FFFC6)"
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className={`mb-4 p-3 rounded-lg border ${
              shakeError ? 'animate-shake' : 'animate-fadeIn'
            } bg-red-50 border-red-200 text-red-700`}>
              <div className="flex items-start gap-3">
                <span className="text-red-500 text-lg">⚠️</span>
                <div>
                  <p className="font-medium text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className={`mb-4 p-3 rounded-lg border bg-green-50 border-green-200 text-green-700 animate-fadeIn`}>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-500 mt-0.5" size={20} />
                <div>
                  <p className="font-medium text-sm">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Show SignupFlow component when in signup mode */}
          {mode === "signup" ? (
            <div className="animate-fadeIn">
              <SignupFlow 
                onSignupComplete={handleSignupComplete}
                onSwitchToLogin={handleSwitchToLogin}
              />
            </div>
          ) : forgotPasswordMode ? (
            <div className="animate-fadeIn w-full flex flex-col">
              <div className="flex-1">
                {/* Back button */}
                <button
                  onClick={handleBackToLogin}
                  className="flex items-center gap-2 mb-6 transition-all duration-200 
                           text-sm font-medium 
                           bg-gradient-to-r from-[#48E1C4] via-[#5064FF] to-[#48E1C4] 
                           bg-clip-text text-transparent 
                           hover:from-[#5064FF] hover:via-[#48E1C4] hover:to-[#5064FF]"
                >
                  <ArrowLeft size={18} />
                  <span>Back to login</span>
                </button>

                {!resetPasswordMode ? (
                  <>
                    {/* Forgot Password Title */}
                    <div className="mb-8">
                      <h2
                        className="text-2xl font-bold mb-2 
                                 bg-gradient-to-r from-aquaMint to-neonBlue 
                                 bg-clip-text text-transparent"
                      >
                        Reset Password
                      </h2>

                      <p className="text-sm mb-4 text-center 
                                bg-gradient-to-r from-[#48E1C4] via-[#5064FF] to-[#48E1C4] 
                                bg-clip-text text-transparent">
                        Enter your email and we'll send you an OTP to reset your password.
                      </p>
                    </div>
                    
                    {/* Forgot Password Form */}
                    <form onSubmit={handleForgotPasswordSubmit} className="flex flex-col gap-4">
                      <div className="relative group">
                        <input
                          type="email"
                          placeholder="Your Email Address"
                          value={forgotPasswordEmail}
                          onChange={(e) => setForgotPasswordEmail(e.target.value)}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                                   focus:ring-2 focus:ring-neonBlue focus:border-transparent 
                                   transition-all duration-300 
                                   group-hover:border-aquaMint pr-10"
                          autoFocus
                        />
                        <div className="absolute right-3 top-3 text-gray-400 
                                      group-hover:text-neonBlue transition-colors duration-300">
                          <Mail size={20} />
                        </div>
                      </div>
                      
                      <button 
                        type="submit"
                        className={`submit-button w-full py-3 mt-2 rounded-xl text-white
                                  hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 
                                  hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed
                                  ${forgotPasswordLoading ? 'animate-pulse' : ''}
                                  bg-gradient-to-r from-[#48E1C4] via-[#5064FF] to-[#48E1C4]
                                  hover:from-[#5064FF] hover:via-[#48E1C4] hover:to-[#5064FF]`}
                        disabled={forgotPasswordLoading || resetLinkSent}
                      >
                        {forgotPasswordLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                            Sending OTP...
                          </span>
                        ) : resetLinkSent ? (
                          "OTP Sent ✓"
                        ) : (
                          "Send OTP"
                        )}
                      </button>
                    </form>
                    
                    {/* Success State */}
                    {resetLinkSent && (
                      <div 
                        className="mt-6 p-4 rounded-lg animate-fadeIn border"
                        style={{
                          background: "linear-gradient(to right, #eef3ff, #e6fff7)",
                          borderColor: "#bcd4ff"
                        }}
                      >
                        <div className="flex items-start gap-3">
                          
                          {/* Icon circle */}
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{
                              background: "linear-gradient(135deg, #5064FF22, #4FFFC622)",
                              boxShadow: "0 0 8px rgba(80, 100, 255, 0.3)"
                            }}
                          >
                            <CheckCircle 
                              size={16} 
                              style={{ color: "#5064FF" }} 
                            />
                          </div>

                          <div>
                            <p className="text-sm font-medium" style={{ color: "#5064FF" }}>
                              OTP sent successfully!
                            </p>
                            <p className="text-xs text-gray-600">
                              Check your email for the OTP. It will expire in 10 minutes.
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t" style={{ borderColor: "#cbd5e1" }}>
                          <p className="text-xs text-gray-600 mb-2">
                            Didn't receive the OTP?{" "}
                            <button
                              onClick={() => {
                                setForgotPasswordEmail("");
                                setResetLinkSent(false);
                                setSuccessMessage("");
                              }}
                              className="font-medium"
                              style={{ color: "#4FFFC6" }}
                            >
                              Try again
                            </button>
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* Reset Password with OTP */}
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Your Password</h2>
                      <p className="text-gray-600 text-sm">
                        Enter the OTP sent to <span className="font-medium">{forgotPasswordEmail}</span> and your new password.
                      </p>
                    </div>

                    <form onSubmit={handleResetPasswordSubmit} className="flex flex-col gap-4">
                      
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
                                   focus:ring-2 focus:ring-neonBlue focus:border-transparent 
                                   transition-all duration-300 
                                   group-hover:border-aquaMint 
                                   text-center text-lg tracking-widest"
                        />
                      </div>

                      {/* New Password */}
                      <div className="relative group">
                        <input
                          type={passwordVisible ? "text" : "password"}
                          placeholder="New Password (min 6 characters)"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          minLength="6"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                                   focus:ring-2 focus:ring-neonBlue focus:border-transparent 
                                   transition-all duration-300 group-hover:border-aquaMint pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setPasswordVisible(!passwordVisible)}
                          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                          title={passwordVisible ? "Hide password" : "Show password"}
                        >
                          {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>

                      {/* Confirm Password */}
                      <div className="relative group">
                        <input
                          type={passwordVisible ? "text" : "password"}
                          placeholder="Confirm New Password"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          required
                          minLength="6"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                                   focus:ring-2 focus:ring-neonBlue focus:border-transparent 
                                   transition-all duration-300 group-hover:border-aquaMint pr-10"
                        />
                      </div>

                      {/* Submit */}
                      <button 
                        type="submit" 
                        className={`submit-button w-full py-3 mt-2 rounded-xl text-white
                                    bg-gradient-to-r from-alphaBlue to-neonBlue
                                    hover:scale-[1.02] active:scale-[0.98] 
                                    transition-all duration-300 hover:shadow-lg 
                                    disabled:opacity-70 disabled:cursor-not-allowed ${
                                      forgotPasswordLoading ? 'animate-pulse' : ''
                                    }`}
                        disabled={forgotPasswordLoading}
                      >
                        {forgotPasswordLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                            Resetting password...
                          </span>
                        ) : "Reset Password"}
                      </button>
                    </form>

                    <button
                      onClick={() => setResetPasswordMode(false)}
                      className="mt-4 w-full py-2 text-sm font-medium 
                               bg-gradient-to-r from-[#48E1C4] via-[#5064FF] to-[#48E1C4] 
                               bg-clip-text text-transparent 
                               hover:from-[#5064FF] hover:via-[#48E1C4] hover:to-[#5064FF] 
                               transition-all duration-200"
                    >
                      ← Back to OTP request
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            // Login Mode
            <div className="animate-fadeIn w-full flex flex-col">
              <div className="flex-1">

                {/* Welcome Title */}
                <p
                  className="text-lg font-semibold mb-4 text-center tracking-tight
                           bg-gradient-to-r from-[#48E1C4] via-[#5064FF] to-[#48E1C4]
                           bg-clip-text text-transparent"
                >
                  Welcome 👋
                </p>

                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">

                  {/* Email Input */}
                  <div className="relative group">
                    <input
                      type="email"
                      placeholder="Your Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                               focus:ring-2 focus:ring-neonBlue focus:border-transparent 
                               transition-all duration-300 
                               group-hover:border-aquaMint 
                               pr-10"
                    />
                    <div className="absolute right-3 top-3 text-gray-400 
                                  group-hover:text-neonBlue 
                                  transition-colors duration-300">
                      ✉️
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="relative group">
                    <input
                      type={passwordVisible ? 'text' : 'password'}
                      placeholder="Enter Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength="6"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                               focus:ring-2 focus:ring-neonBlue focus:border-transparent 
                               transition-all duration-300 
                               group-hover:border-aquaMint 
                               pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute right-3 top-3 text-gray-500 
                               hover:text-neonBlue 
                               transition-colors duration-200"
                      title={passwordVisible ? "Hide password" : "Show password"}
                    >
                      {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {/* Forgot Password */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setForgotPasswordMode(true)}
                      className="text-sm text-neonBlue hover:text-aquaMint hover:underline transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Login Button */}
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
                        Logging in...
                      </span>
                    ) : "Login"}
                  </button>
                </form>
              </div>

              {/* Google Login Button */}
              <div className="pt-2">
                <button
                  onClick={handleGoogleLogin}
                  disabled={googleLoading}
                  className="google-login-button w-full hover:scale-[1.02] transition-all"
                >
                  {googleLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-[#4285F4] border-t-transparent"></span>
                      Connecting to Google...
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
              </div>

              {/* Create Account */}
              <div className="border-t border-gray-100 pt-2">
                <p className="text-center text-gray-600 text-sm">
                  Don't have an account?{" "}
                  <button
                    onClick={() => setMode("signup")}
                    className="text-neonBlue font-semibold hover:text-aquaMint hover:underline"
                  >
                    Create one
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginModal;