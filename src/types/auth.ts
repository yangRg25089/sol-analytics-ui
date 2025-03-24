export interface User {
  id: string;
  email: string;
  solana_address?: string;
  is_token_issuer: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

export interface GoogleAuthResponse {
  code: string;
  state: string;
}
