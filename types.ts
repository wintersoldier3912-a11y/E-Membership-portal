
export interface User {
  id: string;
  mobile?: string;
  email?: string;
  name?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export enum LoginStep {
  ID_INPUT,
  OTP_VERIFY
}

export type AuthMethod = 'sms' | 'email';
