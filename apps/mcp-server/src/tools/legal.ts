/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Privacy Policy Summary (ChatGPT-readable version of zakatflow.org/privacy)
// ---------------------------------------------------------------------------
const PRIVACY_SUMMARY = `# ZakatFlow Privacy Policy Summary
**Full policy:** https://zakatflow.org/privacy

## What We Collect
- **Account Info**: Email, display name, profile picture (Google OAuth sign-in)
- **Financial Data**: Asset values and liabilities you enter (encrypted before storage)
- **Uploaded Documents**: Processed by AI in-memory, immediately discarded
- **Usage Analytics**: Anonymized, aggregate statistics only

## ChatGPT Integration (§4a)
When you use ZakatFlow through ChatGPT:
- Your financial inputs are processed **in-memory** and immediately discarded
- We do **NOT** store your raw financial data in plaintext
- **Anonymized analytics only**: SHA-256 session hash + rounded totals (assets to $1K, Zakat to $100)
- **Encrypted sessions**: AES-256-GCM if you use multi-step calculations
- We do **NOT** use your data to train AI models
- We do **NOT** sell, share, or rent your data

## Data Deletion
- Use the \`delete_my_data\` tool to instantly delete all your ChatGPT session data
- Web users: Settings → Danger Zone → Delete All Data / Delete Account
- Contact: privacy@vora.dev

## Encryption
- Session data: AES-256-GCM (key in browser sessionStorage)
- Saved calculations: AES-256-GCM (Managed or Sovereign zero-knowledge mode)
- All data encrypted at rest and in transit (HTTPS)

## Children's Privacy
- Not intended for users under 13 (consistent with OpenAI's requirements)
- Users under 18 should use under parental supervision

## Open Source
- Our entire codebase is open-source (AGPL v3) at github.com/naheed/zakah
- Anyone can verify our encryption and privacy claims`;

// ---------------------------------------------------------------------------
// Terms of Service Summary (ChatGPT-readable version of zakatflow.org/terms)
// ---------------------------------------------------------------------------
const TERMS_SUMMARY = `# ZakatFlow Terms of Service Summary
**Full terms:** https://zakatflow.org/terms

## Service Description
ZakatFlow is a web-based tool that helps estimate Zakat obligations based on user-provided financial data. It supports 8 scholarly methodologies.

## Guidance, Not Advice
**Important:** ZakatFlow does NOT provide financial, tax, legal, or religious advice — whether accessed via the web or ChatGPT. All calculations are for educational and informational purposes only.

We recommend you:
- Consult qualified Islamic scholars for authoritative Zakat rulings
- Consult tax professionals regarding tax implications
- Verify calculations independently before making financial decisions

## ChatGPT AI Integration (§8)
- **Financial Disclaimer**: The AI may help organize your financial information, but calculations use scholarly methodologies — not AI judgment
- **Multi-Methodology**: Supporting 8 methodologies does not constitute endorsement of any one approach
- **Data Handling**: Inputs processed in-memory, immediately discarded (see Privacy Policy §4a)
- **Age Restriction**: 13+ (OpenAI requirement), under 18 requires parental supervision
- **Open Source**: AGPL v3 — inspect the code at github.com/naheed/zakah
- **Third-Party**: Also subject to OpenAI's Terms of Use when using via ChatGPT

## Warranties
The Service is provided "AS IS" and "AS AVAILABLE." We cannot guarantee uninterrupted or error-free operation.

## Intellectual Property
Code is open-source under AGPL v3. The "ZakatFlow" brand name, logo, and hosted service are proprietary.

## Governing Law
State of California, United States.

## Contact
Email: privacy@vora.dev`;

export function registerLegalTools(server: McpServer) {
    server.tool(
        "view_legal",
        "View ZakatFlow's Privacy Policy or Terms of Service. Returns a structured summary of the requested legal document with a link to the full version on zakatflow.org.",
        {
            document: z.enum(["privacy", "terms"]).describe("Which legal document to view: 'privacy' for Privacy Policy, 'terms' for Terms of Service."),
        },
        async (params) => {
            const { document } = params;

            const content = document === "privacy" ? PRIVACY_SUMMARY : TERMS_SUMMARY;
            const url = document === "privacy"
                ? "https://zakatflow.org/privacy#chatgpt"
                : "https://zakatflow.org/terms#chatgpt";

            return {
                content: [{
                    type: "text" as const,
                    text: `${content}\n\n---\n📄 **Read the full ${document === "privacy" ? "Privacy Policy" : "Terms of Service"}:** ${url}`
                }]
            };
        }
    );
}
