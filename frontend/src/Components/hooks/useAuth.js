// hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [auth, setAuth] = useState({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
  });
  
  const navigate = useNavigate();

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('authToken');
      const userStr = localStorage.getItem('user');
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      
      if (token && userStr && isLoggedIn === 'true') {
        try {
          const user = JSON.parse(userStr);
          setAuth({
            user,
            token,
            isAuthenticated: true,
            loading: false,
            error: null
          });
        } catch (error) {
          console.error('Error parsing user data:', error);
          logout();
        }
      }
    };

    initializeAuth();

    // Listen for login/logout events
    const handleLogin = (event) => {
      const { user, token } = event.detail || {};
      if (user && token) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', user.email);
        
        setAuth(prev => ({
          ...prev,
          user,
          token,
          isAuthenticated: true
        }));
      }
    };

    const handleLogout = () => {
      logout();
    };

    window.addEventListener('userLoggedIn', handleLogin);
    window.addEventListener('userLoggedOut', handleLogout);

    return () => {
      window.removeEventListener('userLoggedIn', handleLogin);
      window.removeEventListener('userLoggedOut', handleLogout);
    };
  }, []);

  const login = useCallback((userData, authToken) => {
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', userData.email);
    
    setAuth({
      user: userData,
      token: authToken,
      isAuthenticated: true,
      loading: false,
      error: null
    });
    
    window.dispatchEvent(new CustomEvent('userLoggedIn', { 
      detail: { user: userData, token: authToken } 
    }));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('fcmToken');
    
    setAuth({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null
    });
    
    window.dispatchEvent(new CustomEvent('userLoggedOut'));
    navigate('/');
  }, [navigate]);

  const updateUserData = useCallback((updatedData) => {
    const currentUserStr = localStorage.getItem('user');
    if (currentUserStr) {
      try {
        const currentUser = JSON.parse(currentUserStr);
        const mergedUser = { ...currentUser, ...updatedData };
        
        localStorage.setItem('user', JSON.stringify(mergedUser));
        
        setAuth(prev => ({
          ...prev,
          user: mergedUser
        }));
        
        window.dispatchEvent(new CustomEvent('userUpdated', { 
          detail: { user: mergedUser } 
        }));
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    }
  }, []);

  const setAuthLoading = useCallback((isLoading) => {
    setAuth(prev => ({ ...prev, loading: isLoading }));
  }, []);

  const setAuthError = useCallback((error) => {
    setAuth(prev => ({ ...prev, error }));
  }, []);

  const clearAuthError = useCallback(() => {
    setAuth(prev => ({ ...prev, error: null }));
  }, []);

  // Check if user is authenticated
  const isAuthenticated = auth.isAuthenticated && auth.token;

  // Get user ID safely
  const userId = auth.user?.id || null;

  // Get user email safely
  const userEmail = auth.user?.email || null;

  // Get user name
  const getUserName = useCallback(() => {
    if (auth.user?.firstName) {
      return `${auth.user.firstName} ${auth.user.lastName || ''}`.trim();
    }
    return auth.user?.email || 'User';
  }, [auth.user]);

  // Get KYC status directly from user object (matches your backend)
  const isKycVerified = auth.user?.isKycVerified === true;

  return {
    // State
    user: auth.user,
    token: auth.token,
    isAuthenticated,
    loading: auth.loading,
    error: auth.error,
    userId,
    userEmail,
    
    // Actions
    login,
    logout,
    updateUser: updateUserData,
    setLoading: setAuthLoading,
    setError: setAuthError,
    clearError: clearAuthError,
    
    // Getters
    isKycVerified,
    getUserName,
    
    // Additional helper
    checkAuth: () => {
      const token = localStorage.getItem('authToken');
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      return !!(token && isLoggedIn === 'true');
    }
  };
};
