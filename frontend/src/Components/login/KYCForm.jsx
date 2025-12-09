import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function KYCForm({ isOpen, onClose, onVerified }) {
  const [panNumber, setPanNumber] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Get user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Pre-fill user data if available
        if (parsedUser.firstName) setFirstName(parsedUser.firstName);
        if (parsedUser.lastName) setLastName(parsedUser.lastName);
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    // Basic validation
    if (panNumber.length !== 10) {
      setError("PAN number must be 10 characters");
      return;
    }
    if (aadhaarNumber.length !== 12) {
      setError("Aadhaar number must be 12 digits");
      return;
    }
    if (!dateOfBirth) {
      setError("Date of birth is required");
      return;
    }

    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock verification success
      const mockVerificationData = {
        isVerified: true,
        firstName,
        lastName,
        panNumber,
        aadhaarNumber: `****${aadhaarNumber.slice(-4)}`,
        dateOfBirth,
        verifiedAt: new Date().toISOString(),
        kycId: `KYC_${Date.now()}`,
        status: "APPROVED"
      };

      setResult(mockVerificationData);

      // Update localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          const updatedUser = {
            ...parsed,
            kycStatus: "verified",
            isKycVerified: true,
            firstName: firstName || parsed.firstName,
            lastName: lastName || parsed.lastName,
            dateOfBirth: dateOfBirth,
            panNumber: panNumber,
            kycDetails: mockVerificationData
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          localStorage.setItem("kycStatus", "verified");
          localStorage.setItem("kycCompleted", "true");
        } catch (err) {
          console.error("Error updating localStorage:", err);
        }
      } else {
        // Create new user object if not exists
        const newUser = {
          kycStatus: "verified",
          isKycVerified: true,
          firstName,
          lastName,
          dateOfBirth,
          panNumber,
          kycDetails: mockVerificationData
        };
        localStorage.setItem("user", JSON.stringify(newUser));
        localStorage.setItem("kycStatus", "verified");
        localStorage.setItem("kycCompleted", "true");
      }

      // Show success
      alert("🎉 KYC verification successful!");
      
      // Call onVerified callback if provided
      if (onVerified) {
        onVerified();
      }
      
      setTimeout(() => onClose(), 1500);
      
    } catch (err) {
      console.error("KYC Error:", err);
      setError(err.message || "KYC verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle cross mark click - close modal directly
  const handleClose = () => {
    onClose();
  };

  // Handle modal background click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSkipKYC = () => {
    // Update localStorage to indicate KYC is pending
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        parsed.kycStatus = "pending";
        parsed.isKycVerified = false;
        localStorage.setItem("user", JSON.stringify(parsed));
      } catch (err) {
        console.error("Error updating user:", err);
      }
    }
    
    localStorage.setItem("kycStatus", "pending");
    localStorage.setItem("kycCompleted", "false");
    
    alert("⚠️ KYC verification skipped.\nYou can complete it later from your profile settings.\nNote: Some features may be limited.");
    onClose();
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100 rounded-lg">
              <span className="text-emerald-600 text-sm">📋</span>
            </div>
            <h2 className="text-lg font-bold text-gray-800">KYC Verification</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-700 text-lg transition-colors"
          >
            ✕
          </button>
        </div>
        
        <p className="text-gray-600 text-xs mb-4">
          Complete KYC to unlock full trading features. Your information is stored locally for testing.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-700">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="Enter first name"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-700">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Enter last name"
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
            />
          </div>

          {/* PAN Number */}
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">
              PAN Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm uppercase focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition"
              value={panNumber}
              onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
              placeholder="ABCDE1234F"
              maxLength={10}
              required
            />
            <p className="text-xs text-gray-500 mt-1">10-character PAN without spaces</p>
          </div>

          {/* Aadhaar Number */}
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">
              Aadhaar Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition"
              value={aadhaarNumber}
              onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="12 digit number"
              maxLength={12}
              required
            />
            <p className="text-xs text-gray-500 mt-1">12-digit Aadhaar without spaces</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-lg py-3 text-xs font-semibold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Verifying...
              </>
            ) : (
              <>
                <span>✓</span>
                Verify KYC
              </>
            )}
          </button>
        </form>

        {/* Skip KYC Link */}
        <div className="mt-4 text-center">
          <button
            onClick={handleSkipKYC}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Complete KYC later
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 text-xs text-red-700 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
            <div className="flex items-center gap-1">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Result - Success */}
        {result && result.isVerified && (
          <div className="mt-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-emerald-100 rounded-full">
                <span className="text-emerald-600 text-sm">✅</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-700">KYC Verification Successful!</h3>
                <p className="text-xs text-emerald-600">Your account is now fully verified (Local Storage)</p>
              </div>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{firstName} {lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">PAN Status:</span>
                <span className="font-medium text-emerald-600">✓ Verified</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Aadhaar Status:</span>
                <span className="font-medium text-emerald-600">✓ Verified</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}