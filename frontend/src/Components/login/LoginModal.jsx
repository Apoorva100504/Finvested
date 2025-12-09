// LoginModal.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import SignupFlow from "./SignupFlow";
import "./LoginModal.css";

function LoginModal({ isOpen, onClose, mode: initialMode = "login", onLoginSuccess }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [shakeError, setShakeError] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/loginh");
  
  const navigate = useNavigate();
  const { login, setError: setAuthError } = useAuth();

  // Reset modal state on open
  useEffect(() => {
    if (!isOpen) return;
    setMode(initialMode);
    setEmail("");
    setPassword("");
    setError("");
    setPasswordVisible(false);
    setShakeError(false);
    setSuccessAnimation(false);
    
    // Set redirect path to logged-in homepage
    setRedirectPath("/loginh");
  }, [isOpen, initialMode]);

  // Login submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShakeError(false);

    // Demo login validation
    if (!email.includes("@") || password.length < 6) {
      setError("Invalid email or password. Use any email and min 6 char password.");
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
      return;
    }

    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Demo login success
      const demoUser = {
        email,
        name: email.split("@")[0],
        id: `demo_user_${Date.now()}`
      };
      
      const demoToken = `demo_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Store in localStorage for demo
      localStorage.setItem("demoAuthToken", demoToken);
      localStorage.setItem("demoUser", JSON.stringify(demoUser));
      localStorage.setItem("userEmail", email);
      localStorage.setItem("isLoggedIn", "true");
      
      // Dispatch login event for Navbar
      const loginEvent = new CustomEvent('userLoggedIn', { detail: { email } });
      window.dispatchEvent(loginEvent);
      
      // Trigger login animation
      setSuccessAnimation(true);
      
      // Login the user
      if (login) login(demoUser, demoToken);
      
      // Notify parent component of successful login
      if (onLoginSuccess) {
        onLoginSuccess(demoUser);
      }
      
      // Close modal after success animation
      setTimeout(() => {
        onClose();
        navigate(redirectPath); // Navigate to logged-in homepage
      }, 1500);
      
      setLoading(false);
    }, 1500);
  };

  // Handle signup completion
  const handleSignupComplete = async (signupData) => {
    const { token, user } = signupData;
    
    // Store user data
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("isLoggedIn", "true");
    
    // Dispatch login event
    const loginEvent = new CustomEvent('userLoggedIn', { detail: { email: user.email } });
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
      navigate("/loginh"); // Navigate to logged-in homepage
    }, 1500);
  };

  // Switch to login mode
  const handleSwitchToLogin = () => {
    setMode("login");
    setError("");
    setShakeError(false);
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
  {/* Solid blue background */}
  <div className="absolute inset-0 bg-[#0066FF]"></div>
  
  {/* Simple diagonal line pattern */}
  <div className="absolute inset-0 opacity-5">
    <div className="absolute inset-0" style={{
      backgroundImage: `linear-gradient(45deg, transparent 48%, white 50%, transparent 52%)`,
      backgroundSize: '50px 50px'
    }}></div>
  </div>
  
  {/* Simple dots pattern */}
  <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
    <div className="absolute top-8 right-8 w-3 h-3 bg-white rounded-full"></div>
    <div className="absolute top-16 right-16 w-2 h-2 bg-white rounded-full"></div>
    <div className="absolute top-24 right-4 w-4 h-4 bg-white rounded-full"></div>
  </div>
  
  {/* Simple upward trend line */}
  <div className="absolute bottom-16 left-8 w-24 h-16 opacity-20">
    <svg width="100%" height="100%" viewBox="0 0 100 60">
      <path 
        d="M0,40 L25,25 L50,30 L75,15 L100,10" 
        stroke="white" 
        strokeWidth="3" 
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="0" cy="40" r="2" fill="white" />
      <circle cx="25" cy="25" r="2" fill="white" />
      <circle cx="50" cy="30" r="2" fill="white" />
      <circle cx="75" cy="15" r="2" fill="white" />
      <circle cx="100" cy="10" r="2" fill="white" />
    </svg>
  </div>
  
  {/* Main content */}
  <div className="relative z-10 h-full flex flex-col justify-center items-center px-8">
    {/* Simple icon/logo */}
    <div className="mb-8 animate-fadeInUp">
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 mx-auto shadow-lg">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#0066FF">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
      </div>
      
      <h2 className="modal-title-left text-white text-3xl font-bold mb-2 text-center leading-snug">
        Simple, Free
        <br />
        Investing.
      </h2>
    </div>
    
    {/* Mutual Funds text */}
    <div className="animate-fadeInUp delay-200">
      <p className="modal-subtitle-left text-white/95 text-xl font-semibold text-center">
        Mutual Funds
      </p>
    </div>
    
    {/* Simple divider */}
    <div className="w-16 h-1 bg-white/30 rounded-full my-8 animate-fadeInUp delay-300"></div>
    
    {/* Simple stats */}
    <div className="animate-fadeInUp delay-400">
      <div className="text-center">
        <div className="text-white text-sm mb-2 opacity-90">Trusted by millions of investors</div>
        
      </div>
    </div>
    
    {/* Simple footer */}
    <div className="absolute bottom-6 left-0 right-0 text-center animate-fadeInUp delay-500">
      <div className="text-white/50 text-xs">
        Start your investment journey today
      </div>
    </div>
  </div>
</div>

        {/* Right Panel */}
        <div className="modal-right-panel">
          {/* Success Animation Overlay */}
          {successAnimation && (
            <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center rounded-xl z-10 animate-fadeIn">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 animate-bounce">
                <span className="text-white text-2xl">✓</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Login Successful!</h3>
              <p className="text-gray-600 text-sm">Redirecting to your dashboard...</p>
              <div className="w-48 h-1 bg-gray-200 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-green-500 animate-progress-bar"></div>
              </div>
            </div>
          )}

          {/* Mode Toggle - Only show when in initial states */}
          {(mode === "login" || (mode === "signup" && !email)) && (
            <div className="mode-toggle mb-6 flex justify-center gap-4 animate-fadeIn">
              <button
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className={`font-semibold pb-1 relative transition-all duration-300 ${
                  mode === "login" 
                    ? "text-green-500" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Login
                {mode === "login" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500 animate-expandWidth"></span>
                )}
              </button>
              <button
                onClick={() => {
                  setMode("signup");
                  setError("");
                }}
                className={`font-semibold pb-1 relative transition-all duration-300 ${
                  mode === "signup" 
                    ? "text-green-500" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Sign Up
                {mode === "signup" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500 animate-expandWidth"></span>
                )}
              </button>
            </div>
          )}

          {/* Error display with animation */}
          {error && (
            <div className={`mb-4 p-3 rounded-lg border ${
              shakeError ? 'animate-shake' : 'animate-fadeIn'
            } bg-red-50 border-red-200 text-red-700`}>
              <div className="flex items-start gap-3">
                <span className="text-red-500 text-lg">⚠️</span>
                <div>
                  <p className="font-medium text-sm">{error}</p>
                  <p className="text-xs mt-1 opacity-75">Demo: Use any email and password (min 6 chars)</p>
                </div>
              </div>
            </div>
          )}

          {/* LOGIN FLOW */}
          {mode === "login" && (
            <div className="animate-fadeIn">
              <h3 className="modal-title-right mb-1">Login to Groww</h3>
              <p className="text-sm text-gray-500 mb-6 text-center">Welcome back! Please enter your details.</p>
              
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                <div className="relative group">
                  <input
                    type="email"
                    placeholder="Your Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 group-hover:border-green-400 pr-10"
                    autoFocus
                  />
                  <div className="absolute right-3 top-3 text-gray-400 group-hover:text-green-500 transition-colors duration-300">
                    ✉️
                  </div>
                </div>
                
                <div className="relative group">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 group-hover:border-green-400 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    title={passwordVisible ? "Hide password" : "Show password"}
                  >
                    {passwordVisible ? "🙈" : "👁️"}
                  </button>
                </div>
                
                <button 
                  type="submit" 
                  className={`submit-button w-full py-3 mt-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed ${
                    loading ? 'animate-pulse' : ''
                  }`}
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
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-center text-gray-600 text-sm mb-3">Don't have an account?</p>
                <button
                  onClick={() => {
                    setMode("signup");
                    setError("");
                  }}
                  className="w-full py-2 border border-green-500 text-green-600 font-medium rounded-lg hover:bg-green-50 active:scale-[0.98] transition-all duration-200"
                >
                  Create Account
                </button>
              </div>
              
              <div className="mt-4 text-center text-xs text-gray-500">
                <p>Demo: Use any email and password (min 6 characters)</p>
              </div>
            </div>
          )}

          {/* SIGNUP FLOW */}
          {mode === "signup" && (
            <SignupFlow
              onSignupComplete={handleSignupComplete}
              onSwitchToLogin={handleSwitchToLogin}
              initialEmail={email}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginModal;