import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Lock, Eye, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Zakat Calculator</title>
        <meta name="description" content="Privacy Policy for the Zakat Calculator - Learn how we protect your financial data with end-to-end encryption." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Calculator
            </Button>
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 28, 2025</p>

          <div className="prose prose-sm dark:prose-invert max-w-none space-y-8">
            
            {/* Key Highlights */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 not-prose">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Key Privacy Highlights
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Lock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Session data is encrypted with AES-256-GCM using a key stored only in your browser session</span>
                </li>
                <li className="flex items-start gap-2">
                  <Eye className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Saved calculations are fully encrypted — names, amounts, and all data are unreadable to us (true zero-knowledge)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Closing your browser clears the session encryption key, making session data unreadable</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Uploaded documents are processed by AI and immediately discarded — only extracted values are kept</span>
                </li>
              </ul>
            </div>

            <section>
              <h2 className="text-xl font-semibold text-foreground">1. Introduction</h2>
              <p className="text-muted-foreground">
                This Privacy Policy describes how the Zakat Calculator ("we," "our," or "the Service") collects, 
                uses, and protects your information when you use our web application. We are committed to protecting 
                your privacy and ensuring the security of your financial data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">2. Information We Collect</h2>
              
              <h3 className="text-lg font-medium text-foreground mt-4">2.1 Account Information</h3>
              <p className="text-muted-foreground">
                When you sign in with Google OAuth, we receive:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4">
                <li>Your email address</li>
                <li>Your display name</li>
                <li>Your profile picture URL</li>
              </ul>

              <h3 className="text-lg font-medium text-foreground mt-4">2.2 Financial Data You Enter</h3>
              <p className="text-muted-foreground">
                When you use the calculator, you provide financial information including asset values, 
                liabilities, and other data needed to calculate Zakat. This data is encrypted 
                before being stored (see Section 5 for details).
              </p>

              <h3 className="text-lg font-medium text-foreground mt-4">2.3 Uploaded Documents</h3>
              <p className="text-muted-foreground">
                When you upload financial documents (bank statements, brokerage statements, etc.) for 
                automatic data extraction:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2">
                <li><strong>Original files are not stored</strong> — they are processed in memory and immediately discarded</li>
                <li><strong>Extracted numeric values only</strong> are retained (e.g., account balances)</li>
                <li><strong>Document metadata is session-only</strong> — filenames, institution names, and AI-generated summaries 
                    are shown during your session but are <em>not</em> persisted to storage</li>
              </ul>

              <h3 className="text-lg font-medium text-foreground mt-4">2.4 Usage Data</h3>
              <p className="text-muted-foreground">
                We may collect anonymized usage analytics to improve the Service, including pages visited 
                and feature usage patterns.
              </p>

              <h3 className="text-lg font-medium text-foreground mt-4">2.5 Browser Session Storage</h3>
              <p className="text-muted-foreground">
                While you use the calculator, your current session data (form values and extracted document values) 
                is stored in your browser's localStorage. This data is:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2">
                <li><strong>Encrypted with AES-256-GCM</strong> using a session-specific key</li>
                <li><strong>The encryption key is stored in sessionStorage</strong> — it is automatically 
                    cleared when you close your browser</li>
                <li><strong>Once the key is cleared, the encrypted data becomes unreadable</strong> — 
                    effectively deleted upon browser close</li>
                <li>For permanent storage, you must sign in and save your calculation (which uses 
                    separate end-to-end encryption with persistent keys)</li>
              </ul>
              <div className="bg-muted/50 rounded-lg p-4 border border-border mt-3">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> On shared or public computers, closing the browser ensures your 
                  session data cannot be recovered. For maximum privacy, you can also clear your browser 
                  data manually.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside text-muted-foreground ml-4">
                <li>Calculate your Zakat obligation based on the data you provide</li>
                <li>Enable you to save and retrieve your encrypted calculations</li>
                <li>Allow you to share calculations with designated recipients (e.g., spouse)</li>
                <li>Extract financial values from uploaded documents</li>
                <li>Improve and maintain the Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">4. AI Document Processing</h2>
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <p className="text-muted-foreground">
                  <strong>Important:</strong> When you upload a document for data extraction, the document 
                  content is sent to Google's Gemini AI service for processing. This enables us to extract 
                  financial values from your statements automatically.
                </p>
                <ul className="list-disc list-inside text-muted-foreground ml-4 mt-3">
                  <li>Raw document content is transmitted to Google's AI service</li>
                  <li>Original documents are <strong>not stored</strong> after processing (typically completes in seconds)</li>
                  <li>Only extracted numeric values are encrypted and stored</li>
                  <li>Document metadata (filename, institution name, summary) is shown during your session 
                      but cleared when you close your browser</li>
                  <li>Google's AI service may process data according to their privacy policy</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">5. Encryption & Data Protection</h2>
              <p className="text-muted-foreground">
                We use multiple layers of encryption to protect your financial data:
              </p>
              
              <h3 className="text-lg font-medium text-foreground mt-4">5.1 Session Data Encryption</h3>
              <p className="text-muted-foreground">
                While you use the calculator (before signing in or saving):
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4">
                <li><strong>Encryption Standard:</strong> AES-256-GCM symmetric encryption</li>
                <li><strong>Key Storage:</strong> Encryption key stored in browser sessionStorage</li>
                <li><strong>Automatic Clearing:</strong> Key is deleted when browser closes, making data unreadable</li>
                <li><strong>Session-Specific:</strong> Each browser session gets a unique encryption key</li>
              </ul>

              <h3 className="text-lg font-medium text-foreground mt-4">5.2 Saved Calculation Encryption (Zero-Knowledge)</h3>
              <p className="text-muted-foreground">
                When you sign in and save a calculation, <strong>all data is encrypted before leaving your browser</strong>:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4">
                <li><strong>Encryption Standard:</strong> AES-256-GCM symmetric encryption</li>
                <li><strong>What's Encrypted:</strong> Calculation name, all financial data, Zakat amount, and all metadata</li>
                <li><strong>Key Storage:</strong> Encryption keys generated and stored locally in your browser's IndexedDB</li>
                <li><strong>Device-Specific:</strong> Keys are unique to each browser/device and are never transmitted</li>
                <li><strong>True Zero-Knowledge:</strong> Our servers store only encrypted blobs — we cannot see your 
                    calculation names, financial details, or Zakat amounts</li>
                <li><strong>Database Contents:</strong> Only encrypted data, timestamps, and your user ID are stored</li>
              </ul>

              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mt-4">
                <p className="text-sm text-foreground font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  Important: Key Loss Warning
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  If you clear your browser data or use a different device, your encryption keys will be lost. 
                  We cannot recover your encrypted data without your keys. Consider backing up your calculations 
                  by downloading the PDF report.
                </p>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-4">
                <p className="text-sm text-foreground font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Recommendation
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  For permanent, encrypted storage of your calculations, sign in and save your work. 
                  Session data is secure but temporary — it becomes unreadable when you close your browser.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">6. Data Sharing</h2>
              
              <h3 className="text-lg font-medium text-foreground mt-4">6.1 Shared Calculations</h3>
              <p className="text-muted-foreground">
                When you share a calculation with another person (e.g., your spouse), the calculation is 
                re-encrypted using their public key. Only the designated recipient can decrypt the shared data.
              </p>

              <h3 className="text-lg font-medium text-foreground mt-4">6.2 Service Providers</h3>
              <p className="text-muted-foreground">
                We use the following third-party services:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4">
                <li><strong>Google Cloud / Gemini AI:</strong> Document processing and data extraction</li>
                <li><strong>Supabase:</strong> Database and authentication infrastructure</li>
                <li><strong>Google OAuth:</strong> Authentication provider</li>
              </ul>

              <h3 className="text-lg font-medium text-foreground mt-4">6.3 No Sale or Sharing of Data</h3>
              <p className="text-muted-foreground">
                We do not sell, rent, share, or trade your personal information to third parties for 
                monetary or other valuable consideration. We do not engage in cross-context behavioral 
                advertising. Therefore, we do not offer an opt-out mechanism for such practices.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">7. California Privacy Rights (CCPA/CPRA)</h2>
              <p className="text-muted-foreground">
                If you are a California resident, you have the following rights under the California Consumer 
                Privacy Act (CCPA) as amended by the California Privacy Rights Act (CPRA):
              </p>
              
              <h3 className="text-lg font-medium text-foreground mt-4">7.1 Your Rights</h3>
              <ul className="list-disc list-inside text-muted-foreground ml-4">
                <li><strong>Right to Know:</strong> Request information about the categories and specific pieces of personal data we collect, use, and disclose</li>
                <li><strong>Right to Delete:</strong> Request deletion of your personal data, subject to certain exceptions</li>
                <li><strong>Right to Correct:</strong> Request correction of inaccurate personal data we maintain about you</li>
                <li><strong>Right to Opt-Out of Sale/Sharing:</strong> We do not sell or share personal information, so this right does not apply</li>
                <li><strong>Right to Limit Use of Sensitive Personal Information:</strong> Your financial data is encrypted and used only to provide the Service</li>
                <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising any of these rights</li>
              </ul>

              <h3 className="text-lg font-medium text-foreground mt-4">7.2 Sensitive Personal Information</h3>
              <p className="text-muted-foreground">
                We collect financial information which may be considered sensitive personal information under CPRA. 
                This information is used solely to calculate your Zakat obligation and is encrypted before storage. 
                We do not use sensitive personal information for purposes other than providing the Service.
              </p>

              <h3 className="text-lg font-medium text-foreground mt-4">7.3 How to Exercise Your Rights</h3>
              <p className="text-muted-foreground">
                To exercise your California privacy rights, contact us at{" "}
                <a href="mailto:naheed@vora.dev" className="text-primary hover:underline">naheed@vora.dev</a>. 
                We will respond to verifiable requests within 45 days. If we need more time (up to 90 days total), 
                we will notify you.
              </p>

              <h3 className="text-lg font-medium text-foreground mt-4">7.4 Verification Process</h3>
              <p className="text-muted-foreground">
                To protect your privacy, we will verify your identity before responding to requests. We may ask 
                you to confirm information associated with your account (such as your email address). For deletion 
                requests, we may require additional confirmation.
              </p>

              <h3 className="text-lg font-medium text-foreground mt-4">7.5 Authorized Agents</h3>
              <p className="text-muted-foreground">
                You may designate an authorized agent to make requests on your behalf. The agent must provide 
                proof of authorization (such as a power of attorney or signed permission), and we may still 
                verify your identity directly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">8. Data Retention</h2>
              <p className="text-muted-foreground">We retain your data for the following periods:</p>
              <ul className="list-disc list-inside text-muted-foreground ml-4">
                <li><strong>Session Data:</strong> Encrypted in browser localStorage; effectively deleted when you close 
                    your browser (encryption key is cleared from sessionStorage)</li>
                <li><strong>Account Information:</strong> Retained while your account is active and for up to 30 days after deletion request</li>
                <li><strong>Saved Calculations:</strong> End-to-end encrypted and retained until you delete them or delete your account</li>
                <li><strong>Uploaded Documents:</strong> Processed in memory only; not retained after extraction (typically seconds)</li>
                <li><strong>Document Metadata:</strong> Shown during session only; not persisted to storage</li>
                <li><strong>Usage Analytics:</strong> Aggregated data retained for up to 24 months</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                You may delete your account and request deletion of all associated data at any time by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">9. Data Security</h2>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational measures to protect your data, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4">
                <li>Session-specific encryption for browser-stored data</li>
                <li>End-to-end encryption for saved calculations</li>
                <li>Secure HTTPS connections</li>
                <li>Row-level security policies in our database</li>
                <li>Regular security reviews</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">10. Children's Privacy</h2>
              <p className="text-muted-foreground">
                The Service is not intended for use by individuals under the age of 18. We do not 
                knowingly collect personal information from children.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">11. Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any material 
                changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">12. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have questions about this Privacy Policy or our data practices, please contact:
              </p>
              <p className="text-muted-foreground mt-2">
                <strong>Email:</strong> <a href="mailto:naheed@vora.dev" className="text-primary hover:underline">naheed@vora.dev</a>
              </p>
            </section>

          </div>
        </div>
      </div>
    </>
  );
}
