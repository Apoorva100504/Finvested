// LoginModal.jsx
import React, { useState, useEffect } from 'react';
import './LoginModal.css'; // Import the CSS file for styling
import MobileVerification from './MobileVerification'; // Import the MobileVerification component

function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [currentStep, setCurrentStep] = useState('email'); // 'email', 'otp', 'password', 'mobileVerification'
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(20);
  const [showResendOtp, setShowResendOtp] = useState(false);
  const [error, setError] = useState('');

  // Effect for OTP countdown
  useEffect(() => {
    let timer;
    if (currentStep === 'otp' && otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);
    } else if (otpCountdown === 0) {
      setShowResendOtp(true);
    }
    return () => clearInterval(timer);
  }, [currentStep, otpCountdown]);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError('');
    const name = email.split('@')[0];
    setFirstName(name);
    console.log('Email submitted:', email);
    setCurrentStep('otp');
    setOtpCountdown(20); // Reset countdown for new OTP
    setShowResendOtp(false);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError('');
    console.log('OTP submitted:', otp);
    if (otp === '123456') { // Mock OTP verification
      setCurrentStep('password');
      setOtpCountdown(0); // Stop countdown
      setShowResendOtp(false);
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setError('');
    console.log('Password submitted:', password);
    setCurrentStep('mobileVerification');
  };

  const handleResendOtp = () => {
    setError('');
    setOtpCountdown(20);
    setShowResendOtp(false);
    console.log('Resending OTP...');
  };

  const handleMobileVerificationComplete = () => {
    onLoginSuccess(); // Final login success callback
    onClose(); // Close the modal
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>&times;</button>

        <div className="modal-left-panel">
          <h2 className="modal-title-left">Simple, Free Investing.</h2>
          <p className="modal-subtitle-left">Mutual Funds</p>
        </div>

        <div className="modal-right-panel">
          {currentStep === 'email' && (
            <>
              <h3 className="modal-title-right">Welcome to Groww</h3>
              <button className="google-signin-button">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google__Google_Organization/revision/latest/scale-to-width-down/100?cb=20230317131707"
                  alt="Google Icon"
                />
                Continue with Google
              </button>
              <div className="or-divider">Or</div>
              <form onSubmit={handleEmailSubmit}>
                <input
                  type="email"
                  placeholder="Your Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="continue-button">Continue</button>
              </form>
              <p className="terms-privacy">
                By proceeding, you agree to T&C, Privacy Policy & Tariff Rates
              </p>
            </>
          )}

          {currentStep === 'otp' && (
            <>
              <h3 className="modal-title-right">Join Groww</h3>
              <div className="email-display">Your Email Address: {email}</div>
              <form onSubmit={handleOtpSubmit}>
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

          {currentStep === 'password' && (
            <>
              <h3 className="modal-title-right">Join Groww</h3>
              <div className="email-display">Your Email Address: {email}</div>
              <form onSubmit={handlePasswordSubmit}>
                <div className="password-input-container">
                  <input
                    type="password"
                    placeholder="Set Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="8"
                  />
                </div>
                <div className="password-requirements">
                  Minimum 8 alphanumeric characters required
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="submit-button">Submit</button>
              </form>
            </>
          )}

          {currentStep === 'mobileVerification' && (
            <MobileVerification
              email={email}
              onMobileVerificationComplete={handleMobileVerificationComplete}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
