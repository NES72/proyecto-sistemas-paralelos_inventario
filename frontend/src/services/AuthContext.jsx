import { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, setAuth as persisteAuth, clearAuth } from './auth';

export { getAuth, getToken, clearAuth } from './auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuthState] = useState(getAuth());

  useEffect(() => {
    const onLogout = () => setAuthState(null);
    window.addEventListener('auth-clear', onLogout);
    return () => window.removeEventListener('auth-clear', onLogout);
  }, []);

  const login = (data) => {
    persisteAuth(data);
    setAuthState(getAuth());
  };

  const logout = () => {
    clearAuth();
    setAuthState(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}