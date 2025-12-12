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
      const userStr = localStorage.getItem('userData'); // Changed from 'user' to 'userData'
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
          // Clear localStorage without triggering logout event
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('userEmail');
          setAuth({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: null
          });
        }
      }
    };

    initializeAuth();

    // Listen for login events only (removed logout event to prevent recursion)
    const handleLogin = (event) => {
      const { user, token } = event.detail || {};
      if (user && token) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(user)); // Changed from 'user' to 'userData'
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

    window.addEventListener('userLoggedIn', handleLogin);

    return () => {
      window.removeEventListener('userLoggedIn', handleLogin);
    };
  }, []);

  const login = useCallback((userData, authToken) => {
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('userData', JSON.stringify(userData)); // Changed from 'user' to 'userData'
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
    localStorage.removeItem('userData'); // Changed from 'user' to 'userData'
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('loginProvider');

    setAuth({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null
    });

    // Dispatch logout event for Navbar (different event name to avoid recursion)
    window.dispatchEvent(new Event('userLoggedOut'));
    navigate('/');
  }, [navigate]);

  const updateUserData = useCallback((updatedData) => {
    const currentUserStr = localStorage.getItem('userData'); // Changed from 'user' to 'userData'
    if (currentUserStr) {
      try {
        const currentUser = JSON.parse(currentUserStr);
        const mergedUser = { ...currentUser, ...updatedData };

        localStorage.setItem('userData', JSON.stringify(mergedUser)); // Changed from 'user' to 'userData'

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

  // Get user ID safely
  const userId = auth.user?.id || null;

  // Get user email safely
  const userEmail = auth.user?.email || null;

  // Get user name
  const getUserName = useCallback(() => {
    if (auth.user?.firstName || auth.user?.first_name) {
      const firstName = auth.user.firstName || auth.user.first_name || '';
      const lastName = auth.user.lastName || auth.user.last_name || '';
      return `${firstName} ${lastName}`.trim();
    }
    return auth.user?.email?.split('@')[0] || 'User';
  }, [auth.user]);

  return {
    // State
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
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
    getUserName,

    // Additional helper
    checkAuth: () => {
      const token = localStorage.getItem('authToken');
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      return !!(token && isLoggedIn === 'true');
    }
  };
};