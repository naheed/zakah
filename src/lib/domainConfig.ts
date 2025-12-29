/**
 * Domain Configuration - Single source of truth for all domain references
 * 
 * Update this file when adding new domains or changing the primary domain.
 */

export const DOMAIN_CONFIG = {
  // Primary domain for canonical URLs, referrals, PDFs, and branding
  primary: 'zakatflow.org',
  
  // All valid production domains (for backward compatibility)
  validDomains: [
    'zakatflow.org',
    'www.zakatflow.org',
    'zakat.vora.dev',
  ] as const,
  
  // Legacy domains (still supported for CORS but not actively used)
  legacyDomains: [
    'zakahflow.com',
    'www.zakahflow.com',
  ] as const,
  
  // Brand name for UI/PDF display
  brandName: 'ZakatFlow',
  
  // Contact email
  contactEmail: 'naheed@vora.dev',
} as const;

/**
 * Get the primary URL with optional path
 */
export function getPrimaryUrl(path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : path ? `/${path}` : '';
  return `https://${DOMAIN_CONFIG.primary}${cleanPath}`;
}

/**
 * Get the invite URL for a referral code
 */
export function getInviteUrl(code: string): string {
  return getPrimaryUrl(`/invite/${code}`);
}

/**
 * Check if a hostname is a valid domain for this application
 */
export function isValidDomain(hostname: string): boolean {
  return (
    DOMAIN_CONFIG.validDomains.includes(hostname as any) ||
    DOMAIN_CONFIG.legacyDomains.includes(hostname as any)
  );
}
