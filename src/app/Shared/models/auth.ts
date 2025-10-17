export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthDTO {
  message: string;
  isAuthenticated: boolean;
  token: string;
  expireOn: Date;
}