import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const API_URL = import.meta.env.VITE_API_URL;

interface User {
  userId: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: "user" | "admin" | "moderator";
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  refreshToken: () => Promise<boolean>;
  isAuthenticated: boolean;
}

interface RequestConfig {
  headers?: Record<string, string>;
  url?: string;
  [key: string]: unknown;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

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
      const response = await fetch(`${API_URL}/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
        localStorage.setItem("accessToken", data.accessToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Token refresh error:", error);
      return false;
    }
  }, []);
  const logout = useCallback(async (): Promise<void> => {
    try {
      const token = accessToken || localStorage.getItem("accessToken");
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            userId: user?.userId, // Include user ID as backup
          }),
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem("accessToken");
    }
  }, [accessToken, user?.userId]);
  // Set up axios interceptor for automatic token handling
  useEffect(() => {
    const setupInterceptors = () => {
      // Request interceptor to add token to headers
      const requestInterceptor = (config: RequestConfig) => {
        if (accessToken) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      };

      // Response interceptor to handle token refresh
      const responseInterceptor = (response: Response) => response;

      const responseErrorInterceptor = async (error: {
        response?: { status: number };
        config?: RequestConfig & { _retry?: boolean };
      }) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          const refreshed = await refreshToken();
          if (refreshed && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return fetch(
              originalRequest.url || "",
              originalRequest as RequestInit
            );
          } else {
            await logout();
          }
        }

        return Promise.reject(error);
      };

      return {
        requestInterceptor,
        responseInterceptor,
        responseErrorInterceptor,
      };
    };
    setupInterceptors();
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
            const refreshed = await refreshToken();
            if (!refreshed) {
              console.log("Token refresh failed, logging out...");
              await logout();
            }
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          await logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [logout, refreshToken]);

  // Clear sensitive data on page unload for security
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Only clear if user is not authenticated to avoid losing session unnecessarily
      if (!user) {
        localStorage.removeItem("accessToken");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [user]);

  // Handle browser tab/window close - cleanup session
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clear any sensitive data on page unload if needed
      // This is a security measure but localStorage will persist
      // for legitimate single-page navigation
    };

    const handleVisibilityChange = () => {
      // Optional: You could implement session timeout on tab switch
      // if (document.hidden && user) {
      //   // Start session timeout timer
      // }
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
    options: RequestInit = {}
  ) => {
    const token = accessToken || localStorage.getItem("accessToken");

    const config = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: "include" as RequestCredentials,
    };

    let response = await fetch(`${API_URL}${url}`, config);

    // Handle token refresh if needed
    if (response.status === 401 && token) {
      const refreshed = await refreshToken();
      if (refreshed) {
        const newToken = localStorage.getItem("accessToken");
        response = await fetch(`${API_URL}${url}`, {
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${newToken}`,
          },
        });
      } else {
        logout();
        throw new Error("Authentication failed");
      }
    }

    return response;
  };

  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/verify-token`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Token verification error:", error);
      return false;
    }
  };
  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      setUser(data.user);
      setAccessToken(data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);
    } finally {
      setLoading(false);
    }
  };
  const register = async (userData: RegisterData): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Auto-login after successful registration
      await login(userData.email, userData.password);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    const response = await makeAuthenticatedRequest("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
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
      body: JSON.stringify({
        currentPassword,
        newPassword,
        confirmPassword: newPassword,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Password change failed");
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshToken,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
