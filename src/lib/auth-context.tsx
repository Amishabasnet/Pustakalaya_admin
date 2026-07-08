"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { apiClient, apiErrorMessage } from "./api-client";
import type { AdminUser } from "./types";

interface AuthContextValue {
  admin: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const res = await apiClient.get("/auth/me");
      const user = res.data.data.user as AdminUser;
      if (user.role !== "admin") {
        setAdmin(null);
      } else {
        setAdmin(user);
      }
    } catch {
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchMe();
    })();
  }, [fetchMe]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await apiClient.post("/auth/signin", { email, password });
      const { user, accessToken } = res.data.data as { user: AdminUser; accessToken?: string };

      if (user.role !== "admin") {
        throw new Error("This account doesn't have admin access.");
      }
      if (accessToken) {
        localStorage.setItem("pustakalaya_admin_token", accessToken);
      }
      setAdmin(user);
    } catch (err) {
      throw new Error(apiErrorMessage(err, "Invalid email or password."));
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post("/auth/signout");
    } catch {
      // ignore — clear client state regardless
    }
    localStorage.removeItem("pustakalaya_admin_token");
    setAdmin(null);
    window.location.href = "/login";
  }, []);

  return (
    <AuthContext.Provider value={{ admin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
