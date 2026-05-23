'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  getAuth,
  login as authLogin,
  logout as authLogout,
  register as authRegister,
} from '@/lib/services/auth-service';
import type { AuthState, User } from '@/lib/types';

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => void;
  register: (email: string, password: string, displayName: string) => void;
  logout: () => void;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setAuth(getAuth());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback((email: string, password: string) => {
    const state = authLogin(email, password);
    setAuth(state);
  }, []);

  const register = useCallback(
    (email: string, password: string, displayName: string) => {
      const state = authRegister(email, password, displayName);
      setAuth(state);
    },
    []
  );

  const logout = useCallback(() => {
    authLogout();
    setAuth(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: auth?.user ?? null,
        accessToken: auth?.accessToken ?? null,
        loading,
        login,
        register,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
