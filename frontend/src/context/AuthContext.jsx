import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getMe,
  getStoredToken,
  login as loginRequest,
  logout as clearAuth,
  register as registerRequest,
  setStoredToken,
} from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getStoredToken);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      if (!token) {
        if (active) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const profile = await getMe(token);
        if (active) setUser(profile);
      } catch {
        if (active) {
          setStoredToken(null);
          setToken(null);
          setUser(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    bootstrap();

    return () => {
      active = false;
    };
  }, [token]);

  const login = async (email, password) => {
    const data = await loginRequest(email, password);
    setStoredToken(data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (payload) => {
    const data = await registerRequest(payload);
    setStoredToken(data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    clearAuth();
    setToken(null);
    setUser(null);
  };

  const completeOAuthLogin = async (oauthToken) => {
    setStoredToken(oauthToken);
    setToken(oauthToken);
    const profile = await getMe(oauthToken);
    setUser(profile);
    return profile;
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      completeOAuthLogin,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
