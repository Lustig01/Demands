import { User } from './user.model';
import { settings } from '../../lib/settings';

export interface TokenInfo {
  rawToken: string;
  claims: Record<string, unknown>;
  user: User;
}

/**
 * Extract roles from JWT claims using dot notation path
 * @param claims - The JWT claims object
 * @param claimPath - Dot notation path to roles (e.g., "groups" or "realm_access.roles")
 */
export function extractRolesFromClaims(
  claims: Record<string, unknown>,
  claimPath: string
): string[] {
  const parts = claimPath.replace(/:/g, '.').split('.');
  let current: unknown = claims;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return [];
    }
  }

  if (typeof current === 'string') {
    return [current];
  }

  if (Array.isArray(current)) {
    return current.filter((item): item is string => typeof item === 'string');
  }

  return [];
}

/**
 * Create TokenInfo from raw token and decoded claims
 */
export function tokenInfoFromClaims(
  rawToken: string,
  claims: Record<string, unknown>
): TokenInfo {
  const roles = extractRolesFromClaims(claims, settings.authGroupClaimPath);

  const user = new User(
    claims.sub as string,
    claims.email as string | undefined,
    claims.preferred_username as string | undefined,
    roles,
    claims.given_name as string | undefined,
    claims.family_name as string | undefined
  );

  return {
    rawToken,
    claims,
    user,
  };
}
