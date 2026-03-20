import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        if (parsed.role === 'Admin' || parsed.role === 'Staff') {
          setUser(parsed);
        } else {
          setUser(null);
        }
      } catch (err) {
        localStorage.clear();
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('/auth/login', { email, password });
    const data = res.data;
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify({
      id: data.userId,
      fullName: data.fullName,
      email: data.email,
      role: data.role,
    }));
    localStorage.setItem('customer', JSON.stringify({
      id: data.userId,
      fullName: data.fullName,
      email: data.email,
      role: data.role,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    }));
    if (data.role === 'Admin' || data.role === 'Staff') {
      setUser({
        id: data.userId,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
      });
    } else {
      setUser(null);
    }
    return data;
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await axios.post('/auth/revoke', { refreshToken });
    } catch (err) {
      console.log(err);
    }
    localStorage.clear();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);