// services/kycApi.js
import api from './api';

// KYC verification function that calls your actual backend
export const verifyKYC = async (data) => {
  try {
    console.log("KYC verification request:", {
      ...data,
      // Mask sensitive data for logging
      aadhaarNumber: data.aadhaarNumber ? `${data.aadhaarNumber.substring(0, 4)}XXXX${data.aadhaarNumber.substring(8)}` : 'Not provided',
      panNumber: data.panNumber ? `${data.panNumber.substring(0, 3)}XXX${data.panNumber.substring(6)}` : 'Not provided'
    });

    // Call your actual backend endpoint
    const response = await api.post('/kyc/verify', {
      panNumber: data.panNumber,
      aadhaarNumber: data.aadhaarNumber,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth
    });

    console.log("KYC verification response:", response.data);
    return response.data;

  } catch (error) {
    console.error("KYC verification API error:", error);
    
    // Handle different error scenarios gracefully
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.error || 
                          error.response.data?.message || 
                          `KYC verification failed (Status: ${error.response.status})`;
      
      // Structure error response similar to successful response
      if (error.response.status === 400 || error.response.status === 422) {
        // Validation errors from backend
        return {
          isVerified: false,
          kycStatus: "failed",
          error: errorMessage,
          validationErrors: error.response.data?.errors
        };
      } else if (error.response.status === 401) {
        return {
          isVerified: false,
          kycStatus: "failed",
          error: "Authentication failed. Please login again."
        };
      } else {
        return {
          isVerified: false,
          kycStatus: "failed",
          error: errorMessage
        };
      }
    } else if (error.request) {
      // Request was made but no response
      return {
        isVerified: false,
        kycStatus: "pending",
        error: "KYC service is currently unavailable. Please try again later."
      };
    } else {
      // Something else happened
      return {
        isVerified: false,
        kycStatus: "failed",
        error: "An error occurred during KYC verification"
      };
    }
  }
};

// Function to get user details (to check current KYC status)
export const getUserDetails = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    
    // Return mock data if backend fails
    return {
      userId: userId,
      firstName: "User",
      lastName: "Name",
      kycStatus: "pending",
      isKycVerified: false,
      dateOfBirth: null
    };
  }
};

// Function to check KYC status without verifying
export const checkKYCStatus = async () => {
  try {
    const response = await api.get('/kyc/status');
    return response.data;
  } catch (error) {
    console.error("Error checking KYC status:", error);
    
    // Check localStorage as fallback
    const kycStatus = localStorage.getItem('kycStatus');
    return {
      isVerified: kycStatus === 'verified',
      kycStatus: kycStatus || 'pending'
    };
  }
};

// Function to update user profile with KYC data
export const updateUserProfile = async (userData) => {
  try {
    const response = await api.patch('/users/profile', userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Mock function for development/testing (keep as backup)
export const mockVerifyKYC = async (data) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate random success/failure
  const isSuccess = Math.random() > 0.3;
  
  if (isSuccess) {
    return {
      isVerified: true,
      kycStatus: "verified",
      panVerification: { 
        status: "valid",
        name: `${data.firstName} ${data.lastName}`,
        isValid: true
      },
      aadhaarVerification: { 
        status: "valid",
        isValid: true
      },
      verifiedAt: new Date().toISOString()
    };
  } else {
    // Simulate different failure scenarios
    const failures = [
      { field: "pan", message: "PAN verification failed. Please check your PAN details." },
      { field: "aadhaar", message: "Aadhaar verification failed. Please check your Aadhaar details." },
      { field: "name", message: "Name doesn't match with PAN/Aadhaar records." },
      { field: "dob", message: "Date of birth doesn't match with records." }
    ];
    
    const randomFailure = failures[Math.floor(Math.random() * failures.length)];
    
    return {
      isVerified: false,
      kycStatus: "failed",
      error: randomFailure.message,
      details: {
        failedField: randomFailure.field,
        panVerification: { 
          status: randomFailure.field === "pan" ? "invalid" : "valid",
          isValid: randomFailure.field !== "pan"
        },
        aadhaarVerification: { 
          status: randomFailure.field === "aadhaar" ? "invalid" : "valid",
          isValid: randomFailure.field !== "aadhaar"
        }
      }
    };
  }
};





import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/wallet", // Your Fastify backend URL
  withCredentials: true, // if using cookies/session
});

// Get balance
export const getWalletBalance = () => API.get("/balance");

// Initiate deposit
export const initiateDeposit = (amount) => API.post("/deposit/initiate", { amount });

// Verify deposit
export const verifyDeposit = (data) => API.post("/deposit/verify", data);

// Get transactions
export const getTransactions = () => API.get("/transactions");