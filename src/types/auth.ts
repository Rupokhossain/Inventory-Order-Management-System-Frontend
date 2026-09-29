export type UserRole = "ADMIN" | "MANAGER" | "CUSTOMER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: string;
  avatar?: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken?: string;
    user: User;
  };
}