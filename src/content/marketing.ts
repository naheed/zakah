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
 * Marketing / Landing Page content.
 * Used on the first-time visitor experience.
 */

export const hero = {
    headline: 'Zakat,',
    headlineAccent: 'Clarified.',
    subhead: "Navigate your complex portfolio—401(k)s, crypto, gold, trusts, and more—across 8 scholarly methodologies. Generate a detailed PDF or CSV report in minutes. Private, secure, and accurate.",
} as const;

// REMOVED: valueBadges (Too noisy/redundant)

export const trustBadges = {
    encryption: 'Zero-Knowledge Encryption',
    sessionOnly: 'Session-Only Storage',
} as const;
