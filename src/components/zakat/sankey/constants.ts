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

export const ASSET_COLORS: Record<string, string> = {
    "Cash & Savings": "#10b981",      // Emerald-500
    "Precious Metals": "#eab308",     // Yellow-500
    "Crypto & Digital": "#8b5cf6",    // Violet-500
    "Investments": "#3b82f6",         // Blue-500
    "Investment Portfolio": "#3b82f6", // Alias
    "Retirement": "#f43f5e",          // Rose-500
    "Retirement Accounts": "#f43f5e", // Alias
    "Trusts": "#14b8a6",              // Teal-500
    "Real Estate": "#f97316",         // Orange-500
    "Business": "#06b6d4",            // Cyan-500
    "Business Assets": "#06b6d4",     // Alias
    "Debts Owed to You": "#64748b",   // Slate-500
    "Illiquid Assets": "#a855f7",     // Purple-500
    "Other Assets": "#a855f7",        // Alias

    // Demo-specific (simplified 4-category view)
    "cash": "#10b981",                // Emerald-500
    "investments": "#3b82f6",         // Blue-500
    "retirement": "#f43f5e",          // Rose-500
    "other": "#a855f7",               // Purple-500

    // Destination nodes
    "zakat": "#16a34a",               // Green-600
    "retained": "#64748b",            // Slate-500
    "exempt": "#94a3b8",              // Slate-400
    "net": "#1e293b",                 // Slate-800

    // Nodes
    "Gross Zakatable Wealth": "#f59e0b", // Amber-500
    "Liabilities": "#ef4444",         // Red-500
    "Net Zakatable Wealth": "#1e293b", // Slate-800
    "Zakat Due": "#059669",           // Emerald-600
};

export const ASSET_DESCRIPTIONS: Record<string, string> = {
    "Cash & Savings": "Bank accounts, cash on hand, digital wallets",
    "Precious Metals": "Gold, silver, and other precious metals",
    "Crypto & Digital": "Bitcoin, Ethereum, staked assets, NFTs",
    "Investments": "Stocks, bonds, mutual funds (30% rule may apply)",
    "Retirement": "401(k), IRA, pension (adjusted for accessibility)",
    "Trusts": "Revocable and accessible irrevocable trusts",
    "Real Estate": "Investment properties for sale or income",
    "Business": "Inventory, receivables, business cash",
    "Debts Owed to You": "Good debts and recovered bad debts",
    "Illiquid Assets": "Other illiquid assets and livestock",
    "Gross Zakatable Wealth": "Total zakatable assets before deductions",
    "Liabilities": "Deductible immediate debts and expenses",
    "Net Zakatable Wealth": "Total wealth eligible for Zakat",
    "Zakat Due": "Your obligatory Zakat payment",
};
