import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { ApiError, apiFetch } from "../../../shared/lib/api";
import { AuthContext, type AuthStatus, type AuthUser } from "../context/auth-context";

type AuthResponse = { user: AuthUser; renewAfterMs: number };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [renewAt, setRenewAt] = useState<number | null>(null);

  const acceptSession = useCallback((response: AuthResponse) => {
    setUser(response.user);
    setRenewAt(Date.now() + response.renewAfterMs);
    setStatus("authenticated");
  }, []);

  useEffect(() => {
    let active = true;
    apiFetch<AuthResponse>("/api/auth/me")
      .then((response) => {
        if (active) acceptSession(response);
      })
      .catch(() => {
        if (active) {
          setUser(null);
          setRenewAt(null);
          setStatus("anonymous");
        }
      });
    return () => {
      active = false;
    };
  }, [acceptSession]);

  const login = useCallback(async (username: string, password: string) => {
    const response = await apiFetch<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    acceptSession(response);
  }, [acceptSession]);

  const logout = useCallback(async () => {
    try {
      await apiFetch<void>("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
      setRenewAt(null);
      setStatus("anonymous");
    }
  }, []);

  const renewSession = useCallback(async () => {
    try {
      const response = await apiFetch<AuthResponse>("/api/auth/refresh", { method: "POST" });
      acceptSession(response);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setUser(null);
        setRenewAt(null);
        setStatus("anonymous");
      }
      throw error;
    }
  }, [acceptSession]);

  const value = useMemo(
    () => ({ user, status, renewAt, login, logout, renewSession }),
    [user, status, renewAt, login, logout, renewSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
