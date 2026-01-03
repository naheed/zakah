/**
 * CORS Configuration for Edge Functions
 * 
 * Re-exports from centralized domain config for backward compatibility.
 * Import directly from domainConfig.ts for new functions.
 */

export {
  ALLOWED_ORIGINS,
  DEFAULT_ORIGIN,
  isOriginAllowed,
  getCorsHeaders,
} from './domainConfig.ts';