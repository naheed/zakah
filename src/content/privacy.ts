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

import { ElementType } from "react";
import { Shield, Lock, Eye, Clock, Warning, UserCircle, FileText, Robot, LockKey, UsersThree, Gavel, Buildings, Prohibit, ArrowsClockwise, Eraser, Files, AddressBook } from "@phosphor-icons/react";

export interface HighlightItem {
    icon: ElementType;
    text: string;
}

export interface SectionContent {
    id: string;
    title: string;
    content?: string;
    subsections?: {
        title?: string;
        content?: string;
        listItems?: string[];
        note?: string;
    }[];
    listItems?: string[];
    warning?: string;
    recommendation?: string;
    note?: string;
}


export const privacyHighlights: HighlightItem[] = [
    {
        icon: Lock,
        text: "Session data is encrypted with AES-256-GCM using a key stored only in your browser session"
    },
    {
        icon: Eye,
        text: "Saved calculations are fully encrypted — names, amounts, and all data are unreadable to us (true zero-knowledge)"
    },
    {
        icon: Clock,
        text: "Closing your browser clears the session encryption key, making session data unreadable"
    },
    {
        icon: Warning,
        text: "Uploaded documents are processed by AI and immediately discarded — only extracted values are kept"
    }
];

export const privacySections: SectionContent[] = [
    {
        id: "introduction",
        title: "Introduction",
        content: `This Privacy Policy describes how ZakatFlow ("we," "our," or "the Service"), provided by vora.dev, collects, uses, and protects your information when you use our website and services. We are committed to protecting your privacy and ensuring the security of your financial data.`
    },
    {
        id: "collection",
        title: "Information We Collect",
        subsections: [
            {
                title: "2.1 Account Information (Personal Information)",
                content: "When you sign in with Google OAuth, we collect:",
                listItems: [
                    "Your email address",
                    "Your display name",
                    "Your profile picture URL"
                ]
            },
            {
                title: "2.2 Financial Data You Enter",
                content: "When you use the calculator, you provide financial information including asset values, liabilities, and other data needed to calculate Zakat. This data is encrypted using one of our two encryption tiers (Managed or Sovereign). See Section 5 for details."
            },
            {
                title: "2.3 Uploaded Documents (AI Parsing)",
                content: "When you upload financial documents (bank statements, brokerage statements, etc.) for automatic data extraction:",
                listItems: [
                    "Data Extracted: We parse these documents to extract numeric values (like account balances) needed for your calculation.",
                    "Ephemeral Processing: Documents are processed securely and not permanently stored. See Section 4 (AI Document Processing) for full security details.",
                    "Metadata: Filenames are session-only and cleared when you close your browser."
                ]
            },
            {
                title: "2.4 Third-Party Integrations (Where Available)",
                content: "If you choose to use optional third-party integrations (such as Plaid for bank connectivity) where available in your region:",
                listItems: [
                    "We use Plaid Inc. (\"Plaid\") to gather data from your financial institutions",
                    "By connecting your account, you grant Plaid the right, power, and authority to act on your behalf to access and transmit your personal and financial information",
                    "You agree to your personal and financial information being transferred, stored, and processed by Plaid in accordance with the Plaid Privacy Policy"
                ]
            },
            {
                title: "2.5 Usage Data",
                content: "We may collect anonymized usage analytics to improve the Service, including pages visited and feature usage patterns."
            },
            {
                content: "While you use the calculator, your current session data (form values and extracted document values) is stored in your browser's localStorage. This data is:",
                listItems: [
                    "Local Storage: Data stays on your device during your session.",
                    "Encrypted: We use zero-knowledge encryption so we cannot read your session data.",
                    "Temporary: See Section 5.1 (Session Data Encryption) for details on how keys are cleared to ensure privacy."
                ],
                note: "Note: On shared or public computers, closing the browser ensures your session data cannot be recovered. For maximum privacy, you can also clear your browser data manually."
            }
        ]
    },
    {
        id: "usage",
        title: "How We Use Your Information",
        listItems: [
            "Calculate your Zakat obligation based on the data you provide",
            "Enable you to save and retrieve your encrypted calculations",
            "Allow you to share calculations with designated recipients (e.g., spouse)",
            "Extract financial values from uploaded documents",
            "Collect anonymous aggregate statistics for social proof (see 3.1)",
            "Improve and maintain the Service"
        ],
        subsections: [
            {
                title: "3.1 Anonymous Usage Metrics",
                content: `We collect anonymous, aggregate statistics to display social proof on our landing page (e.g., "1,234 calculations completed"). This data:`,
                listItems: [
                    "Is fully anonymous — we use a cryptographically hashed session ID that cannot be reversed or linked to you",
                    "Is anonymized immediately — we strictly retain only rounded totals (assets rounded to nearest $1,000, Zakat to nearest $100)",
                    "Is not linked to your account — even if you're signed in, this data cannot identify you",
                    "Records only the date — no timestamp, IP address, or browser information",
                    "Is deduplicated per session per day — recalculating doesn't inflate numbers"
                ],
                note: "This anonymous data helps demonstrate the utility of our tool to new visitors while maintaining complete privacy for all users."
            },
            {
                title: "3.2 Referral Tracking",
                content: "When you share your personal invite link, we track anonymous referral statistics:",
                listItems: [
                    "Referral counts — we track how many people used your invite link to calculate their Zakat",
                    "Privacy threshold — aggregate financial metrics (total Zakat calculated) are only shown to you after a minimum of 5 referrals to prevent individual identification",
                    "Same privacy protections — referral data uses hashed session IDs and rounded values, just like general usage metrics",
                    "No personal data shared — referrers never see individual calculations, only aggregate totals"
                ],
                note: "This threshold ensures that no individual's financial calculation can be identified or attributed, even by the person who shared the link with them."
            }
        ]
    },
    {
        id: "ai-processing",
        title: "AI Document Processing",
        subsections: [
            {
                title: "Transparency & Trust",
                content: "We use advanced AI to save you from manual data entry. To do this securely:",
                listItems: [
                    "We use enterprise-grade partners (currently Google Gemini) with strong privacy commitments.",
                    "Your raw documents are processed in ephemeral memory—they exist only for the seconds it takes to read them.",
                    "We never use your personal financial data to train public AI models."
                ]
            }
        ]
    },
    {
        id: "encryption",
        title: "Encryption & Data Protection",
        content: "We use multiple layers of encryption to protect your financial data:",
        subsections: [
            {
                title: "5.1 Session Data Encryption",
                content: "While you use the calculator (before signing in or saving):",
                listItems: [
                    "Encryption Standard: AES-256-GCM symmetric encryption",
                    "Key Storage: Encryption key stored in browser sessionStorage",
                    "Automatic Clearing: Key is deleted when browser closes, making data unreadable",
                    "Session-Specific: Each browser session gets a unique encryption key"
                ]
            },
            {
                title: "5.2 Encryption Tiers (Managed vs. Sovereign)",
                content: "We offer two ways to secure your saved Zakat data, giving you control over the balance between convenience and absolute privacy:",
                listItems: [
                    "Managed Mode (Default): Your encryption key is stored in our database, protected by strict Row-Level Security (RLS). Only your authenticated session can access it. This mode is frictionless as you don't need a recovery phrase.",
                    "Sovereign Mode (Opt-in): Your encryption key is wrapped using a 12-word recovery phrase that only you know. Our servers never see the unencrypted key. This is a true zero-knowledge, zero-friction-protection model.",
                    "Encryption Standard: All saved data uses AES-256-GCM symmetric encryption, regardless of mode.",
                    "What's Encrypted: Calculation names, asset values, Zakat amounts, and all metadata blobs.",
                    "Device-Specific Keys: Keys are generated client-side and handled in memory for maximum security."
                ]
            }
        ],
        warning: "Important: Access Recovery\nIn Managed Mode, we can assist in restoring account access, but your encryption keys are tied to your identity. In Sovereign Mode, if you lose your recovery phrase, your data is permanently lost. We cannot reset your phrase or recover data in Sovereign Mode.",
        recommendation: "Recommendation\nMost users should use Managed Mode for convenience. Choose Sovereign Mode only if you are comfortable managing your own recovery phrases (e.g., using a password manager)."
    },
    {
        id: "sharing",
        title: "Data Sharing",
        subsections: [
            {
                title: "6.1 Shared Calculations",
                content: "When you share a calculation with another person (e.g., your spouse):",
                listItems: [
                    "You invite them by email address",
                    "When they sign in, their browser generates a unique public/private key pair",
                    "The shared data is then encrypted specifically for them using RSA-4096 key exchange",
                    "Only the designated recipient can decrypt the shared data with their private key",
                    "Your original calculation remains encrypted with your own keys"
                ],
                note: "Note: The share is created when you invite someone, but the data is encrypted for them once they log in and their encryption keys are generated. Until then, they can see that a share exists but cannot access the encrypted financial details."
            },
            {
                title: "6.2 Service Providers",
                content: "We use the following third-party services:",
                listItems: [
                    "Google Cloud / Gemini AI: Document processing and data extraction",
                    "Supabase: Database and authentication infrastructure",
                    "Google OAuth: Authentication provider",
                    "Plaid: Banking connectivity (if enabled by you)"
                ]
            },
            {
                title: "6.3 No Sale or Sharing of Data",
                content: "We do not sell, rent, share, or trade your personal information to third parties for monetary or other valuable consideration. We do not engage in cross-context behavioral advertising. Therefore, we do not offer an opt-out mechanism for such practices."
            }
        ]
    },
    {
        id: "california",
        title: "California Privacy Rights (CCPA/CPRA)",
        content: "If you are a California resident, you have the following rights under the California Consumer Privacy Act (CCPA) as amended by the California Privacy Rights Act (CPRA):",
        subsections: [
            {
                title: "7.1 Your Rights",
                listItems: [
                    "Right to Know: Request information about the categories and specific pieces of personal data we collect, use, and disclose",
                    "Right to Delete: Delete your data directly in Settings, or request deletion by contacting us",
                    "Right to Correct: Request correction of inaccurate personal data we maintain about you",
                    "Right to Opt-Out of Sale/Sharing: We do not sell or share personal information, so this right does not apply",
                    "Right to Limit Use of Sensitive Personal Information: Your financial data is encrypted and used only to provide the Service",
                    "Right to Non-Discrimination: We will not discriminate against you for exercising any of these rights"
                ]
            },
            {
                title: "7.2 Sensitive Personal Information",
                content: "We collect financial information which may be considered sensitive personal information under CPRA. This information is used solely to calculate your Zakat obligation and is encrypted before storage. We do not use sensitive personal information for purposes other than providing the Service."
            },
            {
                title: "7.3 How to Exercise Your Rights",
                content: "You can exercise most of your privacy rights directly within the app:",
                listItems: [
                    "Delete All Data: Go to Settings → Danger Zone → \"Delete All Data\" to remove all saved calculations while keeping your account",
                    "Delete Account: Go to Settings → Danger Zone → \"Delete Account\" to permanently delete your account and all associated data"
                ],
                note: "For other requests or if you prefer, contact us at naheed@vora.dev. We will respond to verifiable requests within 45 days. If we need more time (up to 90 days total), we will notify you."
            },
            {
                title: "7.4 Verification Process",
                content: "To protect your privacy, we will verify your identity before responding to requests. We may ask you to confirm information associated with your account (such as your email address). For deletion requests, we may require additional confirmation."
            },
            {
                title: "7.5 Authorized Agents",
                content: "You may designate an authorized agent to make requests on your behalf. The agent must provide proof of authorization (such as a power of attorney or signed permission), and we may still verify your identity directly."
            }
        ]
    },
    {
        id: "retention",
        title: "Data Retention & Deletion",
        content: "We retain your data for the following periods:",
        listItems: [
            "Session Data: Encrypted in browser localStorage; effectively deleted when you close your browser (encryption key is cleared from sessionStorage)",
            "Account Information: Retained while your account is active; deleted immediately upon account deletion",
            "Saved Calculations: End-to-end encrypted and retained until you delete them or delete your account",
            "Uploaded Documents: Processed in memory only; not retained after extraction (typically seconds)",
            "Document Metadata: Shown during session only; not persisted to storage",
            "Usage Analytics: Aggregated data retained for up to 24 months"
        ],
        subsections: [
            {
                title: "8.1 Self-Service Deletion",
                content: "You can delete your data at any time through the Settings page:",
                listItems: [
                    "Delete All Data: Removes all saved calculations and shared access while keeping your account active",
                    "Delete Account: Permanently deletes your account, profile, and all associated data"
                ],
                note: "Both actions are immediate and irreversible. Local encryption keys stored in your browser are also cleared during deletion."
            },
            {
                title: "8.2 Bank Connection Privacy (Plaid)",
                content: "If you disconnect a bank account (unlink it), we immediately delete the access tokens and raw transaction cache for that institution. However, we retain the *results* of your past Zakat calculations (the final report) as part of your permanent spiritual record, so you always have a history of your obligations."
            }
        ]
    },
    {
        id: "security",
        title: "Data Security",
        content: "We implement appropriate technical and organizational measures to protect your data, including:",
        listItems: [
            "Session-specific encryption for browser-stored data",
            "End-to-end encryption for saved calculations",
            "Secure HTTPS connections",
            "Row-level security policies in our database",
            "Regular security reviews",
            "Verifiable Code: Our entire codebase is open-source (AGPL v3), allowing independent security experts to verify our encryption and privacy claims"
        ]
    },
    {
        id: "children",
        title: "Children's Privacy",
        content: "The Service is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children."
    },
    {
        id: "changes",
        title: "Changes to This Policy",
        content: "We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the \"Last updated\" date."
    },
    {
        id: "contact",
        title: "Contact Us",
        content: "If you have questions about this Privacy Policy or our data practices, please contact:",
        note: "Email: privacy@vora.dev"
    }
];
