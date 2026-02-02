/** Matches the response from GET /api/auth/me */
export interface AuthUser {
  sub: string;
  email: string;
  username: string;
  fullName: string;
  roles: string[];
}

/** Standard OAuth2 token response */
export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  id_token?: string;
}

/** Subset of OIDC discovery document fields we use */
export interface OidcConfig {
  authorization_endpoint: string;
  token_endpoint: string;
  end_session_endpoint?: string;
  issuer: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => void;
}
