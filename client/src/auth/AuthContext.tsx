import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import type { AuthUser } from '../types/auth';
import {
  tryRestoreSession,
  getAuthorizationUrl,
  getLogoutUrl,
  clearTokens,
  setReturnTo,
} from './tokenManager';
import api from '../lib/api';

interface AuthContextInternalValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => void;
  /** Called by AuthCallback after successful token exchange */
  completeLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextInternalValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

async function fetchCurrentUser(): Promise<AuthUser> {
  const response = await api.get<AuthUser>('/auth/me');
  return response.data;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const initRef = useRef(false);

  const isAuthenticated = user !== null;

  const login = useCallback(async () => {
    setReturnTo(location.pathname);
    const url = await getAuthorizationUrl();
    window.location.href = url;
  }, [location.pathname]);

  const logout = useCallback(async () => {
    const url = await getLogoutUrl();
    clearTokens();
    setUser(null);
    window.location.href = url;
  }, []);

  /** Called after a successful token exchange (from callback or refresh) */
  const completeLogin = useCallback(async () => {
    try {
      const currentUser = await fetchCurrentUser();
      setUser(currentUser);
      setError(null);
    } catch {
      setError('Failed to fetch user info');
      clearTokens();
      setUser(null);
    }
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    // Don't attempt restore if we're on the callback route — AuthCallback handles that
    if (location.pathname === '/auth/callback') {
      setIsLoading(false);
      return;
    }

    (async () => {
      try {
        const restored = await tryRestoreSession();
        if (restored) {
          await completeLogin();
        }
      } catch {
        // Session restore failed — user will need to log in
      } finally {
        setIsLoading(false);
      }
    })();
  }, [location.pathname, completeLogin]);

  // Listen for session expiry and unauthorized events
  useEffect(() => {
    const handleExpired = () => {
      clearTokens();
      setUser(null);
      setError('session_expired');
    };

    const handleUnauthorized = () => {
      // Only handle if we thought we were authenticated
      if (user) {
        clearTokens();
        setUser(null);
        setError('unauthorized');
      }
    };

    window.addEventListener('auth:session-expired', handleExpired);
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:session-expired', handleExpired);
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [user]);

  const value: AuthContextInternalValue = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    completeLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
