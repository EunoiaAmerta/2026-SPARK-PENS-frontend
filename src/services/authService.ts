import api from "./api";
import type { AuthResponse, LoginCredentials } from "../types/auth";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    console.log("[authService] Attempting login with:", credentials.username);
    try {
      const response = await api.post<AuthResponse>("/auth/login", credentials);
      console.log("[authService] Login response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("[authService] Login error:", error);
      console.error("[authService] Error response:", error.response?.data);
      throw error;
    }
  },

  googleLogin: async (credential: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>("/auth/google", {
        credential,
      });
      return response.data;
    } catch (error: any) {
      console.error("[authService] Google login error:", error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getStoredUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  getStoredToken: () => {
    return localStorage.getItem("token");
  },
};
