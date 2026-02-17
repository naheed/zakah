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
import { Scroll, FileText, Warning, UserCircle, LockKey, Lightning, Shield, Scales, Handshake, Copyright, Prohibit, Gavel, Buildings, ArrowsClockwise, Eraser, Files, AddressBook } from "@phosphor-icons/react";

export interface TermSection {
    id: string;
    number: number;
    title: string;
    icon: ElementType;
    content?: string;
    listItems?: string[];
    disclaimer?: {
        strong: string;
        text: string;
    };
}

export const termsSections: TermSection[] = [
    {
        id: "acceptance",
        number: 1,
        title: "Acceptance of Terms",
        icon: Scroll,
        content: "By accessing or using ZakatFlow (\"the Service\"), you agree to be bound by these Terms of Service (\"Terms\"). If you do not agree to these Terms, you may not use the Service."
    },
    {
        id: "description",
        number: 2,
        title: "Description of Service",
        icon: FileText,
        content: "ZakatFlow is a web-based tool that helps users estimate their Zakat obligations based on the financial information they provide. The Service:",
        listItems: [
            "Calculates estimated Zakat based on user-provided financial data",
            "Allows users to save and retrieve encrypted calculations",
            "Enables document upload for automated data extraction",
            "Provides educational information about Zakat methodologies"
        ]
    },
    {
        id: "guidance",
        number: 3,
        title: "Guidance, Not Advice",
        icon: Warning,
        content: "We designed this Service to empower you with calculation tools and educational resources. However, Zakat is a deeply personal act of worship, and financial situations are unique. We recommend that you:",
        disclaimer: {
            strong: "Important:",
            text: "Important: The Service does not provide financial, tax, legal, or religious advice. All calculations are for educational purposes only."
        },
        listItems: [
            "Consult with qualified Islamic scholars for authoritative Zakat rulings",
            "Consult with tax professionals regarding tax implications",
            "Verify calculations independently before making financial decisions",
            "Understand that different schools of Islamic jurisprudence may have varying opinions"
        ]
    },
    {
        id: "responsibilities",
        number: 4,
        title: "User Responsibilities",
        icon: UserCircle,
        content: "You are responsible for:",
        listItems: [
            "Accurate Data Entry: Providing accurate and complete financial information",
            "Account Security: Maintaining the security of your account credentials",
            "Encryption Keys: Understanding that encryption keys are stored in your browser and that clearing browser data will result in loss of access to encrypted calculations",
            "Backup: Downloading PDF reports or maintaining backups of important calculations",
            "Legal Compliance: Ensuring your use of the Service complies with applicable laws"
        ]
    },
    {
        id: "plaid",
        number: 5,
        title: "Secure Bank Connections (Plaid)",
        icon: Lightning,
        content: "We partner with Plaid Inc. (\"Plaid\") to securely connect your bank accounts.",
        listItems: [
            "Grant of Authority: By connecting, you grant Plaid the authority to access and transmit your financial information to us, governed by their Privacy Policy.",
            "Service Boundaries: Plaid is an independent service provider. While we trust our partners, we cannot accept liability for data handling that occurs on their systems."
        ]
    },
    {
        id: "encryption",
        number: 6,
        title: "Encryption and Data Loss",
        icon: LockKey,
        content: "Your saved calculations are encrypted using keys stored locally in your browser. You acknowledge that:",
        listItems: [
            "Encryption keys are device-specific and not backed up by us",
            "Clearing browser data, reinstalling your browser, or using a different device will result in loss of access to your encrypted calculations",
            "We cannot recover encrypted data if you lose your encryption keys",
            "You are solely responsible for maintaining access to your encryption keys"
        ]
    },
    {
        id: "ai-processing",
        number: 7,
        title: "AI Document Processing",
        icon: Lightning,
        content: "When you upload documents for data extraction:",
        listItems: [
            "Automated Assistance: We use AI to help extract data, but automation can make mistakes.",
            "Your Final Audit: We provide the tools, but you provide the judgment. Please verify all extracted numbers before finalizing.",
            "Liability Limits: Because we cannot control the quality of Uploaded documents or AI interpretation, we cannot accept liability for calculation errors."
        ]
    },
    {
        id: "warranties",
        number: 8,
        title: "Service Sustainability & Warranties",
        icon: Shield,
        content: "To provide this Service sustainably, we must limit our legal warranties. We build with care, but software is complex:",
        listItems: [
            "The Service is provided \"AS IS\" and \"AS AVAILABLE\".",
            "We cannot guarantee that the Service will always be uninterrupted or error-free.",
            "While verify our methodology, we cannot warrant that it meets every interpretation of Islamic law.",
            "You are the final reviewer of your own Zakat calculation."
        ]
    },
    {
        id: "liability",
        number: 9,
        title: "Liability Limits",
        icon: Scales,
        content: "We encourage you to verify your results. To the maximum extent permitted by law, the Service and its creator shall not be liable for:",
        listItems: [
            "Indirect, incidental, or consequential damages",
            "Loss of data or profits",
            "Errors in Zakat calculation or under/over-payment",
            "Issues arising from third-party services like Plaid or AI providers"
        ]
    },
    {
        id: "indemnification",
        number: 10,
        title: "Indemnification",
        icon: Handshake,
    },
    {
        id: "intellectual",
        number: 11,
        title: "Intellectual Property",
        icon: Copyright,
        content: "The ZakatFlow code is open-source and licensed under the GNU Affero General Public License v3.0 (AGPL v3). You are free to inspect, modify, and redistribute the code under the terms of this license. However, the 'ZakatFlow' brand name, logo, and hosted service are proprietary."
    },
    {
        id: "termination",
        number: 12,
        title: "Account Termination",
        icon: Prohibit,
        content: "We reserve the right to suspend or terminate your access to the Service at any time, without notice, for conduct that we believe violates these Terms or is harmful to other users or the Service."
    },
    {
        id: "disputes",
        number: 13,
        title: "Dispute Resolution",
        icon: Gavel,
        content: "Any disputes arising from these Terms or your use of the Service shall be resolved through good faith negotiation. If negotiation fails, disputes shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, conducted in California. You agree to waive any right to participate in a class action lawsuit or class-wide arbitration."
    },
    {
        id: "governing",
        number: 14,
        title: "Governing Law",
        icon: Buildings,
        content: "These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions."
    },
    {
        id: "force-majeure",
        number: 15,
        title: "Force Majeure",
        icon: Lightning,
        content: "We shall not be liable for any failure or delay in performing our obligations where such failure or delay results from circumstances beyond our reasonable control, including but not limited to natural disasters, acts of government, internet or infrastructure failures, or third-party service outages."
    },
    {
        id: "assignment",
        number: 16,
        title: "Assignment",
        icon: ArrowsClockwise,
        content: "You may not assign or transfer these Terms or your rights hereunder without our prior written consent. We may assign these Terms without restriction."
    },
    {
        id: "changes",
        number: 17,
        title: "Changes to Terms",
        icon: Eraser,
        content: "We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the new Terms on this page and updating the \"Last updated\" date. Your continued use of the Service after changes constitutes acceptance of the new Terms."
    },
    {
        id: "severability",
        number: 18,
        title: "Severability",
        icon: Files,
        content: "If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect."
    },
    {
        id: "entire",
        number: 19,
        title: "Entire Agreement",
        icon: Scroll,
        content: "These Terms, together with our Privacy Policy, constitute the entire agreement between you and us regarding the Service and supersede all prior agreements and understandings."
    },
    {
        id: "contact",
        number: 20,
        title: "Contact",
        icon: AddressBook,
        content: "For questions about these Terms, please contact:",
        listItems: [
            "Email: privacy@vora.dev"
        ]
    }
];
