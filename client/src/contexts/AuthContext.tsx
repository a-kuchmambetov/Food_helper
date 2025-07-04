import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface User {
  userId: string;
  email: string;
  name: string;
  role: "user" | "admin" | "moderator";
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<void>;
  register: (
    userData: RegisterData
  ) => Promise<{ requiresEmailVerification: boolean; message: string }>;
  verifyEmail: (token: string) => Promise<{ user: User; message: string }>;
  resendVerificationEmail: (email: string) => Promise<{ message: string }>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  makeAuthenticatedRequest: (
    url: string,
    options?: AxiosRequestConfig
  ) => Promise<AxiosResponse>;
  isAuthenticated: boolean;
}

interface RegisterData {
  email: string;
  name: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export AuthContext for use in useAuth.ts
export { AuthContext };

// useAuth hook moved to useAuth.ts for Fast Refresh compatibility

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      // Don't attempt refresh if we don't have a refresh token cookie
      const hasRefreshCookie = document.cookie.includes("refreshToken");
      if (!hasRefreshCookie) {
        console.log("No refresh token cookie found, skipping refresh");
        return false;
      }

      const response = await axios.post(
        `${API_URL}/auth/refresh-token`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const data = response.data;
        setAccessToken(data.accessToken);
        localStorage.setItem("accessToken", data.accessToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Token refresh error:", error);
      // Clear any invalid tokens on refresh failure
      setAccessToken(null);
      localStorage.removeItem("accessToken");
      return false;
    }
  }, []);
  const logout = useCallback(async (): Promise<void> => {
    try {
      const token = accessToken || localStorage.getItem("accessToken");
      if (token) {
        await axios.post(
          `${API_URL}/auth/logout`,
          {
            userId: user?.userId, // Include user ID as backup
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem("accessToken");
    }
  }, [accessToken, user?.userId]); // Set up axios interceptor for automatic token handling

  useEffect(() => {
    const setupInterceptors = () => {
      // Request interceptor to add token to headers
      const requestInterceptor = axios.interceptors.request.use(
        (config) => {
          if (accessToken) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
          return config;
        },
        (error) => Promise.reject(error)
      ); // Response interceptor to handle token refresh
      const responseInterceptor = axios.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;

          // Don't try to refresh tokens for login/register/auth routes
          const isAuthRoute =
            originalRequest?.url?.includes("/auth/login") ||
            originalRequest?.url?.includes("/auth/register") ||
            originalRequest?.url?.includes("/auth/refresh-token");

          if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !isAuthRoute &&
            accessToken // Only try to refresh if we have an access token
          ) {
            originalRequest._retry = true;

            const refreshed = await refreshToken();
            if (refreshed) {
              const newToken = localStorage.getItem("accessToken");
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return axios(originalRequest);
            } else {
              await logout();
            }
          }

          return Promise.reject(error);
        }
      );

      return {
        requestInterceptor,
        responseInterceptor,
        cleanup: () => {
          axios.interceptors.request.eject(requestInterceptor);
          axios.interceptors.response.eject(responseInterceptor);
        },
      };
    };

    const interceptors = setupInterceptors();
    return interceptors.cleanup;
  }, [accessToken, logout, refreshToken]); // Check if user is authenticated on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        setAccessToken(token);
        try {
          const isValid = await verifyToken(token);
          if (!isValid) {
            console.log("Token invalid, attempting refresh...");
            // Only try to refresh if we have a refresh token cookie
            const hasRefreshCookie = document.cookie.includes("refreshToken");
            if (hasRefreshCookie) {
              const refreshed = await refreshToken();
              if (!refreshed) {
                console.log("Token refresh failed, logging out...");
                // Explicitly clear user state and token
                setUser(null);
                setAccessToken(null);
                localStorage.removeItem("accessToken");
              }
            } else {
              console.log("No refresh token available, clearing session...");
              // No refresh token available, clear the session
              setUser(null);
              setAccessToken(null);
              localStorage.removeItem("accessToken");
            }
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          // Explicitly clear user state and token on error
          setUser(null);
          setAccessToken(null);
          localStorage.removeItem("accessToken");
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [refreshToken]);

  // Clear sensitive data on page unload for security
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Only clear if user is not authenticated to avoid losing session unnecessarily
      // if (!user) {
      //   localStorage.removeItem("accessToken");
      // }
    };

    const handleVisibilityChange = () => {
      // Optional: Implement session timeout on tab switch if needed
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user]);
  const makeAuthenticatedRequest = async (
    url: string,
    options: AxiosRequestConfig = {}
  ) => {
    const token = accessToken || localStorage.getItem("accessToken");

    const config: AxiosRequestConfig = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      withCredentials: true,
    };

    try {
      const response = await axios({
        url: `${API_URL}${url}`,
        ...config,
      });

      return response;
    } catch (error) {
      // Handle token refresh if needed
      if (
        axios.isAxiosError(error) &&
        error.response?.status === 401 &&
        token
      ) {
        const refreshed = await refreshToken();
        if (refreshed) {
          const newToken = localStorage.getItem("accessToken");
          const retryConfig = {
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${newToken}`,
            },
          };
          return await axios({
            url: `${API_URL}${url}`,
            ...retryConfig,
          });
        } else {
          logout();
          throw new Error("Authentication failed");
        }
      }
      throw error;
    }
  };
  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      const response = await axios.get(`${API_URL}/auth/verify-token`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        const data = response.data;
        setUser(data.user);
        return true;
      }
      // Clear user state when token is invalid
      setUser(null);
      return false;
    } catch (error) {
      console.error("Token verification error:", error);
      // Clear user state on error
      setUser(null);
      return false;
    }
  };
  const login = async (
    email: string,
    password: string,
    rememberMe: boolean = false
  ): Promise<void> => {
    setLoading(true);

    // Clear any existing tokens before attempting login
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("accessToken");

    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        {
          email,
          password,
          rememberMe,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const data = response.data;

      // Check if user's email is verified
      if (!data.user.isVerified) {
        throw new Error(
          "Please verify your email address before logging in. Check your inbox for the verification link."
        );
      }

      setUser(data.user);
      setAccessToken(data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);
    } catch (error) {
      // Ensure tokens are cleared on login failure
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem("accessToken");

      if (axios.isAxiosError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error("Login failed");
    } finally {
      setLoading(false);
    }
  };
  const register = async (
    userData: RegisterData
  ): Promise<{ requiresEmailVerification: boolean; message: string }> => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      const data = response.data;

      // Return registration result - don't auto-login if email verification is required
      const result = {
        requiresEmailVerification: data.requiresEmailVerification || false,
        message: data.message,
      };
      return result;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error("Registration failed");
    }
  };

  const verifyEmail = async (
    token: string
  ): Promise<{ user: User; message: string }> => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/verify-email`,
        {
          token,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const data = response.data;

      // Don't set user state - verification doesn't mean login
      // The user should log in manually after verification

      return {
        user: data.user,
        message: data.message,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error("Email verification failed");
    }
  };

  const resendVerificationEmail = async (
    email: string
  ): Promise<{ message: string }> => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/auth/resend-verification`,
        {
          email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const data = response.data;

      return {
        message: data.message,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error("Failed to resend verification email");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    const response = await makeAuthenticatedRequest("/auth/profile", {
      method: "PUT",
      data: userData,
    });

    const data = response.data;

    if (response.status !== 200) {
      throw new Error(data.error || "Profile update failed");
    }

    setUser(data.user);
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    const response = await makeAuthenticatedRequest("/auth/change-password", {
      method: "POST",
      data: {
        currentPassword,
        newPassword,
        confirmPassword: newPassword,
      },
    });

    const data = response.data;
    if (response.status !== 200) {
      throw new Error(data.error || "Password change failed");
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    verifyEmail,
    resendVerificationEmail,
    logout,
    updateProfile,
    changePassword,
    makeAuthenticatedRequest,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
