// LoginModal.jsx
import React, { useState, useEffect } from 'react';
import './LoginModal.css';

function LoginModal({ isOpen, onClose, mode: initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [currentStep, setCurrentStep] = useState('email'); // 'email', 'otp', 'details'
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(20);
  const [showResendOtp, setShowResendOtp] = useState(false);
  const [error, setError] = useState('');

  // Reset modal state on open
  useEffect(() => {
    setMode(initialMode);
    setCurrentStep(initialMode === 'signup' ? 'email' : 'password');
    setEmail('');
    setPassword('');
    setOtp('');
    setFirstName('');
    setLastName('');
    setError('');
    setOtpCountdown(20);
    setShowResendOtp(false);
  }, [isOpen, initialMode]);

  // OTP countdown
  useEffect(() => {
    let timer;
    if (mode === 'signup' && currentStep === 'otp' && otpCountdown > 0) {
      timer = setInterval(() => setOtpCountdown(prev => prev - 1), 1000);
    } else if (otpCountdown === 0) {
      setShowResendOtp(true);
    }
    return () => clearInterval(timer);
  }, [currentStep, otpCountdown, mode]);

  // Handlers
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (mode === 'signup') {
      setCurrentStep('otp');
      setOtpCountdown(20);
      setShowResendOtp(false);
    } else {
      setCurrentStep('password');
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Check OTP is 6 digits
    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(otp)) {
      setError('OTP must be 6 digits.');
      return;
    }

    if (otp === '123456') {
      setCurrentStep('details');
      setOtpCountdown(0);
      setShowResendOtp(false);
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim() || !lastName.trim() || !password.trim()) {
      setError('All fields are required.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    console.log('Sign Up Success:', email, firstName, lastName, password);

    // Redirect to login step
    setMode('login');
    setCurrentStep('password');
    setPassword('');
    setFirstName('');
    setLastName('');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    console.log('Login Success:', email, password);

    // Dispatch login event
    const loginEvent = new CustomEvent('userLoggedIn', {
      detail: { email },
    });
    window.dispatchEvent(loginEvent);

    // Store login info in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);

    onClose();
  };

  const handleResendOtp = () => {
    setError('');
    setOtpCountdown(20);
    setShowResendOtp(false);
    console.log('Resending OTP...');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>&times;</button>

        {/* Left Panel */}
        <div className="modal-left-panel">
          <h2 className="modal-title-left">Simple, Free Investing.</h2>
          <p className="modal-subtitle-left">Mutual Funds</p>
        </div>

        {/* Right Panel */}
        <div className="modal-right-panel">

          {/* Mode Toggle */}
          <div className="mode-toggle mb-4 flex justify-center gap-4">
            <button
              onClick={() => { setMode('login'); setCurrentStep('password'); }}
              className={`font-semibold ${mode === 'login' ? 'text-green-500' : 'text-gray-500'}`}
            >
              Login
            </button>
            <button
              onClick={() => { setMode('signup'); setCurrentStep('email'); }}
              className={`font-semibold ${mode === 'signup' ? 'text-green-500' : 'text-gray-500'}`}
            >
              Sign Up
            </button>
          </div>

          {/* LOGIN FLOW */}
          {mode === 'login' && currentStep === 'password' && (
            <>
              <h3 className="modal-title-right">Login to Groww</h3>
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                <input
                  type="email"
                  placeholder="Your Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="8"
                />
                <button type="submit" className="submit-button">Login</button>
              </form>
            </>
          )}

          {/* SIGNUP FLOW */}
          {mode === 'signup' && (
            <>
              {currentStep === 'email' && (
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
                    <button type="submit" className="continue-button">Continue</button>
                  </form>
                </>
              )}

              {currentStep === 'otp' && (
                <>
                  <h3 className="modal-title-right">Verify OTP</h3>
                  <div className="email-display">Your Email: {email}</div>
                  <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      maxLength="6"
                    />
                    <div className="otp-resend">
                      Resend in {otpCountdown} seconds
                      {showResendOtp && (
                        <button type="button" onClick={handleResendOtp} className="resend-button">
                          Resend OTP
                        </button>
                      )}
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="submit-button">Submit</button>
                  </form>
                </>
              )}

              {currentStep === 'details' && (
                <>
                  <h3 className="modal-title-right">Set Your Details</h3>
                  <div className="email-display">Your Email: {email}</div>
                  <form onSubmit={handleDetailsSubmit} className="flex flex-col gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                    <input
                      type="password"
                      placeholder="Enter Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength="8"
                    />
                    <div className="password-requirements">Minimum 8 alphanumeric characters</div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="submit-button">Submit</button>
                  </form>
                </>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default LoginModal;
