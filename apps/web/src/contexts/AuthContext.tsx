"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

export interface User {
  userId: string;
  email: string;
  name: string;
  role: string;
  isVerified: boolean;
}
interface SessionUser {
  id: string;
  email: string;
  name: string;
  role?: string | null;
  emailVerified: boolean;
}
interface RegisterData {
  email: string;
  name: string;
  password: string;
}
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<void>;
  register: (
    data: RegisterData,
  ) => Promise<{ requiresEmailVerification: boolean; message: string }>;
  verifyEmail: (token: string) => Promise<{ message: string }>;
  resendVerificationEmail: (email: string) => Promise<{ message: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;
  makeAuthenticatedRequest: (
    url: string,
    options?: AxiosRequestConfig,
  ) => Promise<AxiosResponse>;
}
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  withCredentials: true,
});
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error))
      error.message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message;
    return Promise.reject(error);
  },
);
const toUser = (user: SessionUser): User => ({
  userId: user.id,
  email: user.email,
  name: user.name,
  role: user.role || "unapproved",
  isVerified: user.emailVerified,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshSession = useCallback(async () => {
    const { data } = await api.get<{ user: SessionUser } | null>(
      "/auth/get-session",
    );
    setUser(data?.user ? toUser(data.user) : null);
  }, []);
  useEffect(() => {
    let active = true;
    api
      .get<{ user: SessionUser } | null>("/auth/get-session")
      .then(({ data }) => {
        if (active) setUser(data?.user ? toUser(data.user) : null);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  const makeAuthenticatedRequest = useCallback(
    async (url: string, options: AxiosRequestConfig = {}) => {
      try {
        return await api.request({ ...options, url });
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401)
          setUser(null);
        throw error;
      }
    },
    [],
  );
  const login = useCallback(
    async (email: string, password: string, rememberMe = false) => {
      const { data } = await api.post<{ user: SessionUser }>(
        "/auth/sign-in/email",
        { email, password, rememberMe },
      );
      setUser(toUser(data.user));
    },
    [],
  );
  const register = useCallback(async (data: RegisterData) => {
    await api.post("/auth/sign-up/email", data);
    return {
      requiresEmailVerification: true,
      message: "Check your email to verify your account before signing in.",
    };
  }, []);
  const logout = useCallback(async () => {
    await api.post("/auth/sign-out", {});
    setUser(null);
  }, []);
  const verifyEmail = useCallback(async (token: string) => {
    await api.get("/auth/verify-email", { params: { token } });
    return { message: "Email verified successfully" };
  }, []);
  const resendVerificationEmail = useCallback(async (email: string) => {
    await api.post("/auth/send-verification-email", { email });
    return { message: "If verification is needed, a new email has been sent." };
  }, []);
  const updateProfile = useCallback(
    async (data: Partial<User>) => {
      await api.post("/auth/update-user", { name: data.name });
      await refreshSession();
    },
    [refreshSession],
  );
  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      await api.post("/auth/change-password", {
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });
    },
    [],
  );
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        verifyEmail,
        resendVerificationEmail,
        updateProfile,
        changePassword,
        makeAuthenticatedRequest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
