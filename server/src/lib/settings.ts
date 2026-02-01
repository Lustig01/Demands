export const settings = {
  // OIDC
  oidcDiscoveryUrl: process.env.OIDC_DISCOVERY_URL || '',
  authAudience: process.env.AUTH_AUDIENCE || 'demands-api',
  authGroupClaimPath: process.env.AUTH_GROUP_CLAIM_PATH || 'groups',
  authAdminGroup: process.env.AUTH_ADMIN_GROUP || 'admin',

  // Auth Client
  authClientType: process.env.AUTH_CLIENT_TYPE || 'keycloak',

  // Keycloak
  keycloakUrl: process.env.KEYCLOAK_URL || '',
  keycloakRealm: process.env.KEYCLOAK_REALM || '',
  keycloakClientId: process.env.KEYCLOAK_CLIENT_ID || '',
  keycloakClientSecret: process.env.KEYCLOAK_CLIENT_SECRET || '',

  // Custom
  customAuthClientUrl: process.env.CUSTOM_AUTH_CLIENT_URL || '',
  customAuthClientApiKey: process.env.CUSTOM_AUTH_CLIENT_API_KEY || '',
};
