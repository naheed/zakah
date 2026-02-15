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
 * Assets-related content.
 * Account type labels, empty states, freshness indicators.
 */

export const accountTypeLabels = {
    CHECKING: 'Checking',
    SAVINGS: 'Savings',
    BROKERAGE: 'Brokerage',
    RETIREMENT_401K: '401(k)',
    RETIREMENT_IRA: 'IRA',
    ROTH_IRA: 'Roth IRA',
    CRYPTO_WALLET: 'Crypto',
    REAL_ESTATE: 'Real Estate',
    TRUST: 'Trust',
    METALS: 'Precious Metals',
    BUSINESS: 'Business',
    OTHER: 'Other',
} as const;

export const freshness = {
    today: 'Today',
    yesterday: 'Yesterday',
    daysAgo: (days: number) => `${days}d ago`,
} as const;

export const emptyState = {
    noAccounts: 'No accounts added yet',
    addAccount: 'Add Account',
} as const;
