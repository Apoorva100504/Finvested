import React, { useState, useEffect } from 'react';
import './LoginModal.css'; // Reusing styles from LoginModal for consistency

function MobileVerification({ email, onMobileVerificationComplete, onClose }) {
  const [currentStep, setCurrentStep] = useState('enterMobile'); // 'enterMobile', 'enterOtp', 'registered'
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(20);
  const [showResendOtp, setShowResendOtp] = useState(false);
  const [error, setError] = useState('');

  // Effect for OTP countdown
  useEffect(() => {
    let timer;
    if (currentStep === 'enterOtp' && otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);
    } else if (otpCountdown === 0) {
      setShowResendOtp(true);
    }
    return () => clearInterval(timer);
  }, [currentStep, otpCountdown]);

  const handleMobileSubmit = (e) => {
    e.preventDefault();
    setError('');
    // In a real app, you'd send mobile number to backend to get OTP
    console.log('Mobile number submitted:', mobileNumber);
    setCurrentStep('enterOtp');
    setOtpCountdown(20); // Reset countdown for new OTP
    setShowResendOtp(false);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError('');
    // In a real app, you'd verify OTP with the backend
    console.log('OTP submitted:', otp);
    if (otp === '123456') { // Mock OTP verification
      setCurrentStep('registered');
      setOtpCountdown(0); // Stop countdown
      setShowResendOtp(false);
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleResendOtp = () => {
    setError('');
    setOtpCountdown(20);
    setShowResendOtp(false);
    // In a real app, you'd request a new OTP from the backend
    console.log('Resending OTP...');
  };

  const handleContinue = () => {
    onMobileVerificationComplete(); // Callback to parent to close modal and redirect
    onClose(); // Close the modal
  };

  return (
    <>
      {currentStep === 'enterMobile' && (
        <>
          <h3 className="modal-title-right">Verify Mobile Number</h3>
          <div className="email-display">Logged in as: {email}</div> {/* Display logged-in email */}
          <form onSubmit={handleMobileSubmit} className="w-full">
            <div className="mobile-input-group">
              <span className="mobile-prefix">+91</span>
              <input
                type="tel" // Use tel for phone numbers
                placeholder="Mobile Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
                pattern="[0-9]{10}" // Basic validation for 10 digits
                maxLength="10"
              />
            </div>
            <button type="submit" className="continue-button">Send OTP</button>
          </form>
        </>
      )}

      {currentStep === 'enterOtp' && (
        <>
          <h3 className="modal-title-right">Enter OTP</h3>
          <div className="email-display">
            Enter the verification code sent to +91 {mobileNumber}
          </div>
          <form onSubmit={handleOtpSubmit} className="w-full">
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength="6"
              className="otp-input" // Custom class for OTP input styling if needed
            />
            <div className="otp-resend">
              Resend in {otpCountdown} seconds
              {showResendOtp && (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="resend-button"
                >
                  Resend OTP
                </button>
              )}
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="submit-button">Confirm OTP</button>
          </form>
        </>
      )}

      {currentStep === 'registered' && (
        <>
          <div className="success-message-container">
            <div className="checkmark-circle">
              <div className="checkmark"></div>
            </div>
            <h3 className="modal-title-right">Mobile Number Registered</h3>
          </div>
          <button onClick={handleContinue} className="continue-button mt-8">Continue</button>
        </>
      )}
    </>
  );
}

export default MobileVerification;
