export interface User {
  id: number;
  email: string;
  name: string;
  role: "Admin" | "User";
}

export interface AuthResponse {
  token: string;
  user: User;
  needsPasswordSetup: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
}

export interface SetPasswordData {
  userId: number;
  newPassword: string;
}

export interface ForgotPasswordData {
  email: string;
  frontendUrl?: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}
