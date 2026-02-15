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
 * Report / Results content.
 * Used on the results page, PDF export, and CSV export.
 */

export const hero = {
    zakatDueLabel: 'Your Obligation',
    viewFullReport: 'View Full Report',
} as const;

export const summary = {
    totalAssets: 'Total Assets',
    zakatableWealth: 'Zakatable Wealth',
    netWealth: 'Net Wealth',
    deductions: 'Exempt Amounts',
} as const;

export const export_ = {
    downloadPdf: 'Download PDF',
    downloadCsv: 'Download CSV',
    print: 'Print',
} as const;
