export interface User {
  id: number;
  email: string;
  name: string;
  role: "Admin" | "User";
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
}
