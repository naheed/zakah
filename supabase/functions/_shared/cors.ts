// Allowed origins for CORS - restrict to production and development domains
const ALLOWED_ORIGINS = [
  'https://zakahflow.com',
  'https://www.zakahflow.com',
  'https://zakatflow.com',
  'https://www.zakatflow.com',
  // Lovable preview domains
  /^https:\/\/[a-z0-9-]+\.lovableproject\.com$/,
  /^https:\/\/[a-z0-9-]+\.lovable\.app$/,
  // Local development
  'http://localhost:5173',
  'http://localhost:3000',
];

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

export function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin = origin && isOriginAllowed(origin) ? origin : 'https://zakahflow.com';
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}