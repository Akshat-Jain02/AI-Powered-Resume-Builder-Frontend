import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { authService } from '../api/auth.service';

const AuthContext = createContext(null);

function decodeJwt(token) {
  try {
    const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(b64));
  } catch {
    return null;
  }
}

function msUntilExpiry(token) {
  const p = decodeJwt(token);
  if (!p?.exp) return -1;
  return p.exp * 1000 - Date.now();
}

function getRolesFromToken(token) {
  const payload = decodeJwt(token);
  if (!payload) return ['USER'];
  
  let roles = [];
  if (payload.roles) {
    roles = Array.isArray(payload.roles) ? payload.roles : [payload.roles];
  } else if (payload.role) {
    roles = [payload.role];
  } else if (payload.authorities) {
    roles = Array.isArray(payload.authorities) ? payload.authorities : [payload.authorities];
  }

  return roles.map(r => {
    const s = typeof r === 'string' ? r : (r?.authority || '');
    return s.replace('ROLE_', '');
  });
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const timerRef              = useRef(null);

  const scheduleAutoLogout = (token) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const ms = msUntilExpiry(token);
    if (ms > 0) {
      timerRef.current = setTimeout(() => doLogout(true), ms);
    }
  };

  const doLogout = (expired = false) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setUser(null);
    if (expired) window.location.replace('/login?expired=1');
  };

  useEffect(() => {
    const token    = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      const ms = msUntilExpiry(token);
      if (ms <= 0) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
      } else {
        const roles = getRolesFromToken(token);
        setUser({ username, token, roles });
        scheduleAutoLogout(token);
      }
    }
    setLoading(false);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const token = res.token || res.accessToken || res.jwt;
    if (!token) throw new Error('No token received from server');
    const roles = getRolesFromToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('username', credentials.username);
    localStorage.setItem('role', roles[0] || 'USER');
    setUser({ username: credentials.username, token, roles });
    scheduleAutoLogout(token);
    return res;
  };

  const setUserFromOAuth = ({ username, token }) => {
    const roles = getRolesFromToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('role', roles[0] || 'USER');
    setUser({ username, token, roles });
    scheduleAutoLogout(token);
  };

  const register = async (data) => authService.register(data);
  const logout = () => doLogout(false);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, setUserFromOAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
