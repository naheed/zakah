/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
    (DOMAIN_CONFIG.validDomains as readonly string[]).includes(hostname) ||
    (DOMAIN_CONFIG.legacyDomains as readonly string[]).includes(hostname)
  );
}
