// src/Components/Auth/AuthSuccess.jsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api'; // Adjust path to your api.js

const AuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleGoogleAuthSuccess = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      const userId = params.get('userId');

      if (!token || !userId) {
        console.error('Missing token or userId in URL');
        navigate('/login');
        return;
      }

      try {
        // Store the token
        localStorage.setItem('authToken', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('isLoggedIn', 'true');

        // Set the token for API requests
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Fetch user data
        const response = await api.get('/auth/user');
        const userData = response.data;

        // Store user data
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('userEmail', userData.email);

        // Dispatch login event for Navbar
        const loginEvent = new CustomEvent('userLoggedIn', {
          detail: { 
            user: userData, 
            token: token,
            email: userData.email
          }
        });
        window.dispatchEvent(loginEvent);

        // Redirect to dashboard or home
        navigate('/dashboard');

      } catch (error) {
        console.error('Error in Google auth success:', error);
        
        // Clear invalid data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('isLoggedIn');
        
        navigate('/login');
      }
    };

    handleGoogleAuthSuccess();
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Completing Google Sign In...
        </h2>
        <p className="text-gray-600">
          Please wait while we authenticate your account.
        </p>
      </div>
    </div>
  );
};

export default AuthSuccess;