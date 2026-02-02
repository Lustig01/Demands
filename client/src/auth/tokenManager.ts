import type { TokenResponse } from '../types/auth';
import { generateCodeVerifier, generateCodeChallenge } from './pkce';
import { getAuthorizationEndpoint, getEndSessionEndpoint } from './oidcDiscovery';

const API_BASE_URL = import.meta.env.VITE_API_URL as string;
const OIDC_AUTHORITY = import.meta.env.VITE_OIDC_AUTHORITY as string;
const CLIENT_ID = import.meta.env.VITE_OIDC_CLIENT_ID as string;

const REDIRECT_URI = `${window.location.origin}/auth/callback`;
const STORAGE_KEYS = {
  refreshToken: 'oidc_refresh_token',
  codeVerifier: 'pkce_code_verifier',
  state: 'oauth_state',
  returnTo: 'auth_return_to',
} as const;

// In-memory only — never persisted to storage
let accessToken: string | null = null;
let refreshTimerId: ReturnType<typeof setTimeout> | null = null;

/**
 * Build the authorization URL and redirect the user to the OIDC provider.
 * Stores PKCE verifier and state in sessionStorage for the callback.
 */
export async function getAuthorizationUrl(): Promise<string> {
  const verifier = generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);
  const state = crypto.randomUUID();

  sessionStorage.setItem(STORAGE_KEYS.codeVerifier, verifier);
  sessionStorage.setItem(STORAGE_KEYS.state, state);

  const authEndpoint = await getAuthorizationEndpoint();

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'openid profile email',
    code_challenge: challenge,
    code_challenge_method: 'S256',
    state,
  });

  return `${authEndpoint}?${params.toString()}`;
}

/**
 * Exchange an authorization code for tokens via the server proxy.
 * Validates state, uses stored PKCE verifier, and schedules refresh.
 */
export async function exchangeCodeForTokens(
  code: string,
  state: string,
): Promise<TokenResponse> {
  const storedState = sessionStorage.getItem(STORAGE_KEYS.state);
  if (state !== storedState) {
    throw new Error('OAuth state mismatch');
  }

  const verifier = sessionStorage.getItem(STORAGE_KEYS.codeVerifier);
  if (!verifier) {
    throw new Error('Missing PKCE code verifier');
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: verifier,
  });

  const response = await fetch(`${API_BASE_URL}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Token exchange failed');
  }

  const tokens: TokenResponse = await response.json();
  storeTokens(tokens);

  // Clean up PKCE and state
  sessionStorage.removeItem(STORAGE_KEYS.codeVerifier);
  sessionStorage.removeItem(STORAGE_KEYS.state);

  return tokens;
}

/**
 * Refresh the access token using the stored refresh token.
 * Returns the new token response, or throws if refresh fails.
 */
export async function refreshAccessToken(): Promise<TokenResponse> {
  const refreshToken = sessionStorage.getItem(STORAGE_KEYS.refreshToken);
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: CLIENT_ID,
    refresh_token: refreshToken,
  });

  const response = await fetch(`${API_BASE_URL}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!response.ok) {
    clearTokens();
    throw new Error('Token refresh failed');
  }

  const tokens: TokenResponse = await response.json();
  storeTokens(tokens);
  return tokens;
}

/**
 * Attempt to restore a session from a stored refresh token.
 * Returns true if the session was restored successfully.
 */
export async function tryRestoreSession(): Promise<boolean> {
  const refreshToken = sessionStorage.getItem(STORAGE_KEYS.refreshToken);
  if (!refreshToken) return false;

  try {
    await refreshAccessToken();
    return true;
  } catch {
    return false;
  }
}

/** Returns the current in-memory access token */
export function getAccessToken(): string | null {
  return accessToken;
}

/** Clear all auth state (memory + sessionStorage) */
export function clearTokens(): void {
  accessToken = null;
  sessionStorage.removeItem(STORAGE_KEYS.refreshToken);
  if (refreshTimerId) {
    clearTimeout(refreshTimerId);
    refreshTimerId = null;
  }
}

/**
 * Build the OIDC end-session (logout) URL.
 * Falls back to a simple authority-based URL if discovery has no end_session_endpoint.
 */
export async function getLogoutUrl(): Promise<string> {
  const endSessionEndpoint = await getEndSessionEndpoint();

  const postLogoutRedirect = window.location.origin;
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    post_logout_redirect_uri: postLogoutRedirect,
  });

  if (endSessionEndpoint) {
    return `${endSessionEndpoint}?${params.toString()}`;
  }

  // Fallback: standard OIDC path convention
  return `${OIDC_AUTHORITY}/protocol/openid-connect/logout?${params.toString()}`;
}

/** Store the path the user intended to visit before being redirected to login */
export function setReturnTo(path: string): void {
  sessionStorage.setItem(STORAGE_KEYS.returnTo, path);
}

/** Retrieve and clear the stored return-to path */
export function consumeReturnTo(): string {
  const path = sessionStorage.getItem(STORAGE_KEYS.returnTo);
  sessionStorage.removeItem(STORAGE_KEYS.returnTo);
  return path || '/dashboard';
}

// --- Private helpers ---

function storeTokens(tokens: TokenResponse): void {
  accessToken = tokens.access_token;
  if (tokens.refresh_token) {
    sessionStorage.setItem(STORAGE_KEYS.refreshToken, tokens.refresh_token);
  }
  scheduleRefresh(tokens.expires_in);
}

function scheduleRefresh(expiresIn: number): void {
  if (refreshTimerId) {
    clearTimeout(refreshTimerId);
  }

  // Refresh 30 seconds before expiry, minimum 5 seconds
  const delay = Math.max((expiresIn - 30) * 1000, 5000);

  refreshTimerId = setTimeout(async () => {
    try {
      await refreshAccessToken();
    } catch {
      window.dispatchEvent(new CustomEvent('auth:session-expired'));
    }
  }, delay);
}
