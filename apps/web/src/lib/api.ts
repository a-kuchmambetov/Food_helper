import axios from "axios";

// Requests go through the Next.js `/api` rewrite so Better Auth cookies stay first-party.
export const api = axios.create({
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
