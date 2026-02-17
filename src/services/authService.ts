import api from "./api";
import type {
  AuthResponse,
  LoginCredentials,
  SetPasswordData,
  ForgotPasswordData,
  ResetPasswordData,
} from "../types/auth";

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

  setPassword: async (data: SetPasswordData): Promise<{ message: string }> => {
    try {
      const response = await api.post<{ message: string }>(
        "/auth/set-password",
        data,
      );
      return response.data;
    } catch (error: any) {
      console.error("[authService] Set password error:", error);
      throw error;
    }
  },

  forgotPassword: async (
    data: ForgotPasswordData,
  ): Promise<{ message: string; resetLink?: string }> => {
    try {
      // Always include the current window location origin for dynamic URL generation
      const payload = {
        email: data.email,
        frontendUrl:
          typeof window !== "undefined" ? window.location.origin : undefined,
      };

      const response = await api.post<{ message: string; resetLink?: string }>(
        "/auth/forgot-password",
        payload,
      );
      return response.data;
    } catch (error: any) {
      console.error("[authService] Forgot password error:", error);
      throw error;
    }
  },

  resetPassword: async (
    data: ResetPasswordData,
  ): Promise<{ message: string }> => {
    try {
      const response = await api.post<{ message: string }>(
        "/auth/reset-password",
        data,
      );
      return response.data;
    } catch (error: any) {
      console.error("[authService] Reset password error:", error);
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
