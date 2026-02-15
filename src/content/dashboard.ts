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
 * Dashboard-related content.
 * Zakat dashboard, progress labels, donation tracking.
 */

export const zakatProgress = {
    sectionTitle: 'Your Obligation',
    remainingOf: (total: string) => `remaining of ${total}`,
    fullyDistributed: 'Fully distributed!',
    percentDistributed: (percent: number) => `${percent}% distributed`,
    daysLeft: (days: number) => `${days} days left`,
} as const;

export const donations = {
    trackDonations: 'Track Donations',
    addDonation: 'Add Donation',
    donationsCount: (count: number) => `${count} Donations`,
} as const;
