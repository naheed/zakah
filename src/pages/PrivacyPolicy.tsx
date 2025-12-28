import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Lock, Eye, AlertTriangle } from "lucide-react";
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
          <p className="text-muted-foreground mb-8">Last updated: December 28, 2024</p>

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
                  <span>Your financial data is encrypted with keys stored only in your browser</span>
                </li>
                <li className="flex items-start gap-2">
                  <Eye className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>We cannot read your encrypted calculations - only you can</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Documents uploaded for AI extraction are processed temporarily and not stored</span>
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
                When you save a calculation, you provide financial information including asset values, 
                liabilities, and other data needed to calculate Zakat. <strong>This data is encrypted 
                before being stored.</strong>
              </p>

              <h3 className="text-lg font-medium text-foreground mt-4">2.3 Uploaded Documents</h3>
              <p className="text-muted-foreground">
                When you upload financial documents (bank statements, brokerage statements, etc.) for 
                automatic data extraction, the document content is temporarily processed by our AI service. 
                The raw documents are <strong>not stored</strong> after processing.
              </p>

              <h3 className="text-lg font-medium text-foreground mt-4">2.4 Usage Data</h3>
              <p className="text-muted-foreground">
                We may collect anonymized usage analytics to improve the Service, including pages visited 
                and feature usage patterns.
              </p>
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
                  <li>Extracted numeric values are encrypted before storage</li>
                  <li>Original documents are not retained after processing</li>
                  <li>Google's AI service may process data according to their privacy policy</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">5. End-to-End Encryption</h2>
              <p className="text-muted-foreground">
                We use strong encryption to protect your financial data:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4">
                <li><strong>Encryption Standard:</strong> AES-256-GCM symmetric encryption</li>
                <li><strong>Key Storage:</strong> Encryption keys are generated and stored locally in your browser's IndexedDB</li>
                <li><strong>Device-Specific:</strong> Keys are unique to each browser/device and are not synced</li>
                <li><strong>Zero-Knowledge:</strong> We cannot decrypt your saved calculations - only you can</li>
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

              <h3 className="text-lg font-medium text-foreground mt-4">6.3 No Sale of Data</h3>
              <p className="text-muted-foreground">
                We do not sell, rent, or trade your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">7. California Privacy Rights (CCPA)</h2>
              <p className="text-muted-foreground">
                If you are a California resident, you have the following rights:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4">
                <li><strong>Right to Know:</strong> Request information about the personal data we collect</li>
                <li><strong>Right to Delete:</strong> Request deletion of your personal data</li>
                <li><strong>Right to Opt-Out:</strong> We do not sell personal information</li>
                <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your rights</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                To exercise these rights, contact us at <a href="mailto:naheed@vora.dev" className="text-primary hover:underline">naheed@vora.dev</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">8. Data Retention</h2>
              <ul className="list-disc list-inside text-muted-foreground ml-4">
                <li>Saved calculations are retained until you delete them</li>
                <li>Account data is retained while your account is active</li>
                <li>Uploaded documents are processed in memory and not retained</li>
                <li>You may delete your account and all associated data at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">9. Data Security</h2>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational measures to protect your data, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4">
                <li>End-to-end encryption for stored financial data</li>
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
