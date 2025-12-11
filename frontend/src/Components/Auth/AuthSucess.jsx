
// src/Components/Auth/AuthSuccess.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
function AuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userId = params.get('userId');
    
    console.log('Google OAuth Success - Token:', token ? 'Yes' : 'No');
    console.log('Google OAuth Success - UserId:', userId ? 'Yes' : 'No');
    
    if (token && userId) {
      // Store token
      localStorage.setItem('authToken', token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('loginProvider', 'google');
      
      // Get user data (simulate for now)
      const userData = {
        id: userId,
        email: 'google-user@example.com',
        firstName: 'Google',
        lastName: 'User'
      };
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Trigger login event for Navbar
      const loginEvent = new CustomEvent('userLoggedIn', { 
        detail: { 
          email: userData.email,
          provider: "google"
        } 
      });
      window.dispatchEvent(loginEvent);
      
      console.log('Google login successful, redirecting to dashboard...');
      
      // Redirect to dashboard after 1 second
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } else {
      console.log('No token found, redirecting to login...');
      navigate('/login');
    }
  }, [location, navigate]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Successful!</h2>
        <p className="text-gray-600 mb-6">Welcome to Finvested</p>
        
        {/* Loading animation */}
        <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gradient-to-r from-green-400 to-blue-500 animate-progress w-full"></div>
        </div>
        
        <p className="text-sm text-gray-500 mt-4">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
export default AuthSuccess;