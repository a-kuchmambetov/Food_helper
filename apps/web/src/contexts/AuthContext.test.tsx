import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "./AuthContext";
import { useAuth } from "./useAuth";

const api = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  request: vi.fn(),
  interceptors: { response: { use: vi.fn() } },
}));
vi.mock("axios", () => ({
  default: {
    create: () => api,
    isAxiosError: (error: { isAxiosError?: boolean }) => !!error.isAxiosError,
  },
}));
const user = {
  id: "user-1",
  email: "test@example.com",
  name: "Test",
  role: "user",
  emailVerified: true,
};
beforeEach(() => {
  vi.clearAllMocks();
  api.get.mockResolvedValue({ data: null });
  api.post.mockResolvedValue({ data: {} });
});

describe("Better Auth session integration", () => {
  it("restores a cookie session without a local access token", async () => {
    api.get.mockResolvedValue({ data: { user } });
    const { result } = renderHook(useAuth, { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(api.get).toHaveBeenCalledWith("/auth/get-session");
    expect(result.current.user).toMatchObject({
      userId: "user-1",
      isVerified: true,
    });
    expect(result.current.isAuthenticated).toBe(true);
  });
  it("signs in, updates the profile, changes password, and signs out using Better Auth endpoints", async () => {
    const { result } = renderHook(useAuth, { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.loading).toBe(false));
    api.post.mockResolvedValueOnce({ data: { user } });
    await act(() => result.current.login(user.email, "password", true));
    expect(api.post).toHaveBeenCalledWith("/auth/sign-in/email", {
      email: user.email,
      password: "password",
      rememberMe: true,
    });
    expect(result.current.isAuthenticated).toBe(true);
    api.get.mockResolvedValue({ data: { user: { ...user, name: "Updated" } } });
    await act(() => result.current.updateProfile({ name: "Updated" }));
    expect(result.current.user?.name).toBe("Updated");
    await act(() => result.current.changePassword("old", "new-password"));
    expect(api.post).toHaveBeenCalledWith("/auth/change-password", {
      currentPassword: "old",
      newPassword: "new-password",
      revokeOtherSessions: true,
    });
    await act(() => result.current.logout());
    expect(api.post).toHaveBeenCalledWith("/auth/sign-out", {});
    expect(result.current.isAuthenticated).toBe(false);
  });
  it("registers and verifies email without logging in prematurely", async () => {
    const { result } = renderHook(useAuth, { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      expect(
        (
          await result.current.register({
            email: user.email,
            name: user.name,
            password: "password",
          })
        ).requiresEmailVerification,
      ).toBe(true);
      await result.current.verifyEmail("verification-token");
      await result.current.resendVerificationEmail(user.email);
    });
    expect(api.get).toHaveBeenCalledWith("/auth/verify-email", {
      params: { token: "verification-token" },
    });
    expect(api.post).toHaveBeenCalledWith("/auth/send-verification-email", {
      email: user.email,
    });
    expect(result.current.isAuthenticated).toBe(false);
  });
  it("clears an expired session after a protected request is rejected", async () => {
    api.get.mockResolvedValue({ data: { user } });
    const { result } = renderHook(useAuth, { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));
    const error = { isAxiosError: true, response: { status: 401 } };
    api.request.mockRejectedValue(error);
    await act(async () => {
      await expect(
        result.current.makeAuthenticatedRequest("/inventory/user"),
      ).rejects.toEqual(error);
    });
    expect(result.current.user).toBeNull();
  });
});
