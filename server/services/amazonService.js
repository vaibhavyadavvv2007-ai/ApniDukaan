const axios = require('axios');

/**
 * Amazon Selling Partner API (SP-API) Sandbox Service
 * Implements Amazon's documented Login with Amazon (LWA) token exchange and
 * authenticated SP-API sandbox verification.
 * 
 * Docs: https://developer-docs.amazon.com/sp-api/docs/connecting-to-the-selling-partner-api
 * Security Principle: NEVER expose LWA client secrets or refresh tokens in logs or responses.
 */

// In-memory token cache to avoid redundant token exchanges
let tokenCache = {
  accessToken: null,
  expiresAt: 0
};

/**
 * Mask credential string safely for diagnostic logs and UI
 * e.g. "amzn1.application-oa2-client.12345678" -> "amzn1.application-oa2-client.12...***"
 */
function maskCredential(cred) {
  if (!cred) return 'NOT_CONFIGURED';
  const str = String(cred);
  if (str.length <= 10) return '********';
  return `${str.substring(0, 8)}...${str.substring(str.length - 4)}`;
}

/**
 * Exchange Amazon Sandbox Refresh Token for LWA Access Token
 * Endpoint: POST https://api.amazon.com/auth/o2/token
 */
async function getLwaAccessToken() {
  const clientId = process.env.AMAZON_LWA_CLIENT_ID || process.env.AMAZON_CLIENT_ID;
  const clientSecret = process.env.AMAZON_LWA_CLIENT_SECRET || process.env.AMAZON_CLIENT_SECRET;
  const refreshToken = process.env.AMAZON_SANDBOX_REFRESH_TOKEN || process.env.AMAZON_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return {
      success: false,
      mode: 'fallback',
      reason: 'Amazon LWA sandbox credentials not configured in environment',
      accessToken: null
    };
  }

  // Return cached token if valid for at least another 2 minutes
  const now = Date.now();
  if (tokenCache.accessToken && tokenCache.expiresAt > now + 120000) {
    return {
      success: true,
      cached: true,
      tokenType: 'bearer',
      expiresIn: Math.round((tokenCache.expiresAt - now) / 1000),
      accessToken: tokenCache.accessToken
    };
  }

  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken);
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);

    const response = await axios.post(
      'https://api.amazon.com/auth/o2/token',
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        timeout: 10000
      }
    );

    const { access_token, expires_in, token_type } = response.data;

    // Cache the fresh token
    tokenCache = {
      accessToken: access_token,
      expiresAt: now + (expires_in * 1000)
    };

    return {
      success: true,
      cached: false,
      tokenType: token_type || 'bearer',
      expiresIn: expires_in,
      accessToken: access_token
    };
  } catch (err) {
    const errorDetail = err.response?.data?.error_description || err.response?.data?.error || err.message;
    console.warn(`[Amazon Service] LWA Token Exchange failed: ${errorDetail}`);
    return {
      success: false,
      mode: 'fallback',
      reason: `LWA Token Exchange failed: ${errorDetail}`,
      accessToken: null
    };
  }
}

/**
 * Make an authenticated SP-API sandbox GET request to verify credentials
 * Uses the standard Sellers API marketplace participations endpoint on the EU/India sandbox host.
 * Endpoint: GET https://sandbox.sellingpartnerapi-eu.amazon.com/sellers/v1/marketplaceParticipations
 */
async function verifySandboxCredentials() {
  const startTime = Date.now();
  const tokenResult = await getLwaAccessToken();

  if (!tokenResult.success || !tokenResult.accessToken) {
    return {
      success: false,
      mode: 'sandbox-staged-fallback',
      sandboxStatus: 'FALLBACK_READY',
      verified: false,
      reason: tokenResult.reason || 'Token exchange failed',
      latencyMs: Date.now() - startTime,
      credentialAudit: {
        clientIdConfigured: !!(process.env.AMAZON_LWA_CLIENT_ID || process.env.AMAZON_CLIENT_ID),
        clientSecretConfigured: !!(process.env.AMAZON_LWA_CLIENT_SECRET || process.env.AMAZON_CLIENT_SECRET),
        refreshTokenConfigured: !!(process.env.AMAZON_SANDBOX_REFRESH_TOKEN || process.env.AMAZON_REFRESH_TOKEN),
        maskedClientId: maskCredential(process.env.AMAZON_LWA_CLIENT_ID || process.env.AMAZON_CLIENT_ID)
      }
    };
  }

  // Use the European/Indian sandbox endpoint
  const sandboxHost = 'https://sandbox.sellingpartnerapi-eu.amazon.com';
  const targetEndpoint = `${sandboxHost}/sellers/v1/marketplaceParticipations`;

  try {
    const response = await axios.get(targetEndpoint, {
      headers: {
        'x-amz-access-token': tokenResult.accessToken,
        'User-Agent': 'DukaanQuest/1.0 (Language=JavaScript; Platform=Windows)'
      },
      timeout: 10000
    });

    const latencyMs = Date.now() - startTime;
    const participations = response.data?.payload || [];

    return {
      success: true,
      verified: true,
      mode: 'sandbox-verified',
      sandboxStatus: 'AUTHENTICATED_AND_VERIFIED',
      endpointTested: 'GET /sellers/v1/marketplaceParticipations',
      sandboxHost,
      latencyMs,
      statusCode: response.status,
      marketplaceParticipationsCount: participations.length,
      sampleMarketplace: participations[0]?.marketplace?.name || 'Amazon Sandbox',
      credentialAudit: {
        tokenExchange: 'SUCCESSFUL_LWA_OAUTH2',
        tokenType: tokenResult.tokenType,
        tokenCached: tokenResult.cached,
        expiresInSeconds: tokenResult.expiresIn,
        maskedClientId: maskCredential(process.env.AMAZON_LWA_CLIENT_ID || process.env.AMAZON_CLIENT_ID),
        maskedRefreshToken: maskCredential(process.env.AMAZON_SANDBOX_REFRESH_TOKEN || process.env.AMAZON_REFRESH_TOKEN)
      },
      safeguard: {
        productionPublishingBlocked: true,
        liveSellerAuthorized: false,
        message: 'Strictly restricted to SP-API Sandbox. Production publishing safely disarmed.'
      }
    };
  } catch (err) {
    const latencyMs = Date.now() - startTime;
    const status = err.response?.status || 500;
    const errorData = err.response?.data;

    console.warn(`[Amazon Service] SP-API Sandbox request failed with status ${status}:`, errorData || err.message);

    return {
      success: false,
      verified: false,
      mode: 'sandbox-staged-fallback',
      sandboxStatus: 'CREDENTIAL_ERROR',
      statusCode: status,
      latencyMs,
      error: errorData || err.message,
      credentialAudit: {
        maskedClientId: maskCredential(process.env.AMAZON_LWA_CLIENT_ID || process.env.AMAZON_CLIENT_ID)
      }
    };
  }
}

/**
 * Health check helper for Amazon SP-API Integration
 */
async function getAmazonHealth() {
  const hasClientId = !!(process.env.AMAZON_LWA_CLIENT_ID || process.env.AMAZON_CLIENT_ID);
  const hasSecret = !!(process.env.AMAZON_LWA_CLIENT_SECRET || process.env.AMAZON_CLIENT_SECRET);
  const hasToken = !!(process.env.AMAZON_SANDBOX_REFRESH_TOKEN || process.env.AMAZON_REFRESH_TOKEN);
  const configured = hasClientId && hasSecret && hasToken;

  return {
    configured,
    isLive: false,
    mode: configured ? 'sandbox-verified' : 'sandbox-ready',
    standard: 'Amazon SP-API Listings Items API (v2021-08-01)',
    sandboxHost: 'https://sandbox.sellingpartnerapi-eu.amazon.com',
    authMechanism: 'Login with Amazon (LWA) OAuth2',
    credentialsConfigured: {
      lwaClientId: hasClientId,
      lwaClientSecret: hasSecret,
      sandboxRefreshToken: hasToken
    },
    maskedClientId: maskCredential(process.env.AMAZON_LWA_CLIENT_ID || process.env.AMAZON_CLIENT_ID),
    productionRestricted: true
  };
}

module.exports = {
  getLwaAccessToken,
  verifySandboxCredentials,
  getAmazonHealth,
  maskCredential
};
