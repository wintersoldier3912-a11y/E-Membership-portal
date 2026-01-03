
import React, { useState, useEffect } from 'react';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { AuthState, User } from './types';

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  });

  // Simulate initial session check
  useEffect(() => {
    const checkSession = async () => {
      // In a real MERN app, we'd call GET /auth/me which checks the HttpOnly cookie
      const savedUser = localStorage.getItem('sim_user');
      if (savedUser) {
        setAuthState({
          user: JSON.parse(savedUser),
          isAuthenticated: true,
          loading: false,
          error: null,
        });
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };
    checkSession();
  }, []);

  const handleLoginSuccess = (user: User) => {
    localStorage.setItem('sim_user', JSON.stringify(user));
    setAuthState({
      user,
      isAuthenticated: true,
      loading: false,
      error: null,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('sim_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  };

  if (authState.loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {authState.isAuthenticated ? (
        <Dashboard user={authState.user!} onLogout={handleLogout} />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
};

export default App;
