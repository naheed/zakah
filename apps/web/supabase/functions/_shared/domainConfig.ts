/**
 * Edge Function Domain Configuration
 * 
 * Centralized CORS configuration for all Supabase Edge Functions.
 * Update this file when adding new domains.
 */

// All allowed origins for CORS
export const ALLOWED_ORIGINS: (string | RegExp)[] = [
  // Primary domain
  'https://zakatflow.org',
  'https://www.zakatflow.org',
  
  // Backward compatible domains
  'https://zakat.vora.dev',
  'https://www.zakat.vora.dev',
  
  // Legacy domains (still supported)
  'https://zakahflow.com',
  'https://www.zakahflow.com',
  
  // Lovable preview domains
  /^https:\/\/[a-z0-9-]+\.lovableproject\.com$/,
  /^https:\/\/[a-z0-9-]+\.lovable\.app$/,
  
  // Local development
  'http://localhost:5173',
  'http://localhost:3000',
];

// Default origin for fallback (primary domain)
export const DEFAULT_ORIGIN = 'https://zakatflow.org';

/**
 * Check if an origin is allowed
 */
export function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  
  return ALLOWED_ORIGINS.some(allowed => {
    if (typeof allowed === 'string') {
      return origin === allowed;
    }
    // RegExp pattern
    return allowed.test(origin);
  });
}

/**
 * Get CORS headers for a request
 */
export function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin = origin && isOriginAllowed(origin) ? origin : DEFAULT_ORIGIN;
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  };
}
