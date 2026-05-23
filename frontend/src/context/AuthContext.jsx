import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('gym_admin_token'));

  function saveToken(t) {
    localStorage.setItem('gym_admin_token', t);
    setToken(t);
  }

  function logout() {
    localStorage.removeItem('gym_admin_token');
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, saveToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
