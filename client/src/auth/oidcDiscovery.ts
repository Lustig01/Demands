import type { OidcConfig } from '../types/auth';

const OIDC_AUTHORITY = import.meta.env.VITE_OIDC_AUTHORITY as string;

let cachedConfig: OidcConfig | null = null;

async function fetchDiscoveryDocument(): Promise<OidcConfig> {
  if (cachedConfig) return cachedConfig;

  const url = `${OIDC_AUTHORITY}/.well-known/openid-configuration`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`OIDC discovery failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  cachedConfig = {
    authorization_endpoint: data.authorization_endpoint,
    token_endpoint: data.token_endpoint,
    end_session_endpoint: data.end_session_endpoint,
    issuer: data.issuer,
  };

  return cachedConfig;
}

export async function getAuthorizationEndpoint(): Promise<string> {
  const config = await fetchDiscoveryDocument();
  return config.authorization_endpoint;
}

export async function getEndSessionEndpoint(): Promise<string | undefined> {
  const config = await fetchDiscoveryDocument();
  return config.end_session_endpoint;
}

export async function getIssuer(): Promise<string> {
  const config = await fetchDiscoveryDocument();
  return config.issuer;
}

/** Clears the cached discovery document (useful for testing or recovery) */
export function clearDiscoveryCache(): void {
  cachedConfig = null;
}
