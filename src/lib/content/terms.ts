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
        content: "By accessing or using the Zakat Calculator (\"the Service\"), you agree to be bound by these Terms of Service (\"Terms\"). If you do not agree to these Terms, you may not use the Service."
    },
    {
        id: "description",
        number: 2,
        title: "Description of Service",
        icon: FileText,
        content: "The Zakat Calculator is a web-based tool that helps users estimate their Zakat obligations based on the financial information they provide. The Service:",
        listItems: [
            "Calculates estimated Zakat based on user-provided financial data",
            "Allows users to save and retrieve encrypted calculations",
            "Enables document upload for automated data extraction",
            "Provides educational information about Zakat methodologies"
        ]
    },
    {
        id: "not-advice",
        number: 3,
        title: "Not Financial or Religious Advice",
        icon: Warning,
        content: "The Service does not provide financial, tax, legal, or religious advice. The calculations and information provided are for educational and informational purposes only. You should:",
        disclaimer: {
            strong: "The Service does not provide financial, tax, legal, or religious advice.",
            text: "The Service does not provide financial, tax, legal, or religious advice. The calculations and information provided are for educational and informational purposes only. You should:"
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
        id: "encryption",
        number: 5,
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
        number: 6,
        title: "AI Document Processing",
        icon: Lightning,
        content: "When you upload documents for data extraction:",
        listItems: [
            "Documents are processed by third-party AI services (Google Gemini)",
            "We do not guarantee the accuracy of extracted data",
            "You are responsible for verifying all extracted values",
            "Uploaded documents are processed in memory and not permanently stored"
        ]
    },
    {
        id: "warranties",
        number: 7,
        title: "Disclaimer of Warranties",
        icon: Shield,
        content: "THE SERVICE IS PROVIDED \"AS IS\" AND \"AS AVAILABLE\" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:",
        listItems: [
            "Warranties of merchantability or fitness for a particular purpose",
            "Warranties that the Service will be uninterrupted or error-free",
            "Warranties regarding the accuracy of calculations or extracted data",
            "Warranties that the calculations comply with any particular interpretation of Islamic law"
        ]
    },
    {
        id: "liability",
        number: 8,
        title: "Limitation of Liability",
        icon: Scales,
        content: "TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL THE SERVICE, ITS CREATOR, OR AFFILIATES BE LIABLE FOR:",
        listItems: [
            "Any indirect, incidental, special, consequential, or punitive damages",
            "Any loss of profits, data, or other intangible losses",
            "Any damages resulting from reliance on calculated Zakat amounts",
            "Any damages resulting from loss of encryption keys or encrypted data",
            "Any damages arising from AI processing errors or inaccuracies"
        ]
    },
    {
        id: "indemnification",
        number: 9,
        title: "Indemnification",
        icon: Handshake,
        content: "You agree to indemnify and hold harmless the Service and its creator from any claims, damages, or expenses arising from your use of the Service or violation of these Terms."
    },
    {
        id: "intellectual",
        number: 10,
        title: "Intellectual Property",
        icon: Copyright,
        content: "The Service and its original content, features, and functionality are owned by the creator and are protected by applicable intellectual property laws. You may not copy, modify, distribute, or create derivative works without permission."
    },
    {
        id: "termination",
        number: 11,
        title: "Account Termination",
        icon: Prohibit,
        content: "We reserve the right to suspend or terminate your access to the Service at any time, without notice, for conduct that we believe violates these Terms or is harmful to other users or the Service."
    },
    {
        id: "disputes",
        number: 12,
        title: "Dispute Resolution",
        icon: Gavel,
        content: "Any disputes arising from these Terms or your use of the Service shall be resolved through good faith negotiation. If negotiation fails, disputes shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, conducted in California. You agree to waive any right to participate in a class action lawsuit or class-wide arbitration."
    },
    {
        id: "governing",
        number: 13,
        title: "Governing Law",
        icon: Buildings,
        content: "These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions."
    },
    {
        id: "force-majeure",
        number: 14,
        title: "Force Majeure",
        icon: Lightning,
        content: "We shall not be liable for any failure or delay in performing our obligations where such failure or delay results from circumstances beyond our reasonable control, including but not limited to natural disasters, acts of government, internet or infrastructure failures, or third-party service outages."
    },
    {
        id: "assignment",
        number: 15,
        title: "Assignment",
        icon: ArrowsClockwise,
        content: "You may not assign or transfer these Terms or your rights hereunder without our prior written consent. We may assign these Terms without restriction."
    },
    {
        id: "changes",
        number: 16,
        title: "Changes to Terms",
        icon: Eraser,
        content: "We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the new Terms on this page and updating the \"Last updated\" date. Your continued use of the Service after changes constitutes acceptance of the new Terms."
    },
    {
        id: "severability",
        number: 17,
        title: "Severability",
        icon: Files,
        content: "If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect."
    },
    {
        id: "entire",
        number: 18,
        title: "Entire Agreement",
        icon: Scroll,
        content: "These Terms, together with our Privacy Policy, constitute the entire agreement between you and us regarding the Service and supersede all prior agreements and understandings."
    },
    {
        id: "contact",
        number: 19,
        title: "Contact",
        icon: AddressBook,
        content: "For questions about these Terms, please contact:",
        listItems: [
            "Email: naheed@vora.dev"
        ]
    }
];
