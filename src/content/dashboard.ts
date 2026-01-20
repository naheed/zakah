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
