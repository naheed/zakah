import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Lock, Eye, Warning, Clock, UserCircle, FileText, Robot, LockKey, UsersThree, Gavel, Database, ShieldCheck, Baby, Pencil, AddressBook } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/zakat/Footer";
import { getPrimaryUrl } from "@/lib/domainConfig";
import { ReadingProgress } from "@/components/ui/reading-progress";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { AnimatedSectionHeader } from "@/components/ui/animated-section-header";

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | ZakatFlow</title>
        <meta name="description" content="Privacy Policy for ZakatFlow - Learn how we protect your financial data with end-to-end encryption." />
        <link rel="canonical" href={getPrimaryUrl('/privacy')} />
        <meta property="og:url" content={getPrimaryUrl('/privacy')} />
      </Helmet>
      
      <ReadingProgress />
      
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <ScrollReveal>
            <Link to="/">
              <Button variant="ghost" size="sm" className="mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Calculator
              </Button>
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <header className="mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 font-serif">
                Privacy Policy
              </h1>
              <p className="text-muted-foreground">Last updated: December 28, 2025</p>
            </header>
          </ScrollReveal>

          <div className="space-y-10">
            
            {/* Key Highlights */}
            <ScrollReveal delay={0.15}>
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" weight="duotone" />
                  Key Privacy Highlights
                </h2>
                <StaggerContainer className="space-y-2" staggerDelay={0.05}>
                  <StaggerItem>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Lock className="w-4 h-4 text-primary mt-0.5 shrink-0" weight="duotone" />
                      <span>Session data is encrypted with AES-256-GCM using a key stored only in your browser session</span>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Eye className="w-4 h-4 text-primary mt-0.5 shrink-0" weight="duotone" />
                      <span>Saved calculations are fully encrypted — names, amounts, and all data are unreadable to us (true zero-knowledge)</span>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" weight="duotone" />
                      <span>Closing your browser clears the session encryption key, making session data unreadable</span>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Warning className="w-4 h-4 text-primary mt-0.5 shrink-0" weight="duotone" />
                      <span>Uploaded documents are processed by AI and immediately discarded — only extracted values are kept</span>
                    </div>
                  </StaggerItem>
                </StaggerContainer>
              </div>
            </ScrollReveal>

            {/* Section 1 */}
            <section id="introduction">
              <AnimatedSectionHeader number={1} title="Introduction" />
              <ScrollReveal>
                <p className="text-muted-foreground">
                  This Privacy Policy describes how the Zakat Calculator ("we," "our," or "the Service") collects, 
                  uses, and protects your information when you use our web application. We are committed to protecting 
                  your privacy and ensuring the security of your financial data.
                </p>
              </ScrollReveal>
            </section>

            {/* Section 2 */}
            <section id="collection">
              <AnimatedSectionHeader number={2} title="Information We Collect" />
              
              <ScrollReveal>
                <h3 className="text-lg font-medium text-foreground mt-4 mb-2">2.1 Account Information</h3>
                <p className="text-muted-foreground mb-2">
                  When you sign in with Google OAuth, we receive:
                </p>
              </ScrollReveal>
              <StaggerContainer className="ml-4" staggerDelay={0.05}>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside">Your email address</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside">Your display name</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside">Your profile picture URL</li></StaggerItem>
              </StaggerContainer>

              <ScrollReveal>
                <h3 className="text-lg font-medium text-foreground mt-6 mb-2">2.2 Financial Data You Enter</h3>
                <p className="text-muted-foreground">
                  When you use the calculator, you provide financial information including asset values, 
                  liabilities, and other data needed to calculate Zakat. This data is encrypted 
                  before being stored (see Section 5 for details).
                </p>
              </ScrollReveal>

              <ScrollReveal>
                <h3 className="text-lg font-medium text-foreground mt-6 mb-2">2.3 Uploaded Documents</h3>
                <p className="text-muted-foreground mb-2">
                  When you upload financial documents (bank statements, brokerage statements, etc.) for 
                  automatic data extraction:
                </p>
              </ScrollReveal>
              <StaggerContainer className="ml-4" staggerDelay={0.05}>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Original files are not stored</strong> — they are processed in memory and immediately discarded</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Extracted numeric values only</strong> are retained (e.g., account balances)</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Document metadata is session-only</strong> — filenames, institution names, and AI-generated summaries are shown during your session but are <em>not</em> persisted to storage</li></StaggerItem>
              </StaggerContainer>

              <ScrollReveal>
                <h3 className="text-lg font-medium text-foreground mt-6 mb-2">2.4 Usage Data</h3>
                <p className="text-muted-foreground">
                  We may collect anonymized usage analytics to improve the Service, including pages visited 
                  and feature usage patterns.
                </p>
              </ScrollReveal>

              <ScrollReveal>
                <h3 className="text-lg font-medium text-foreground mt-6 mb-2">2.5 Browser Session Storage</h3>
                <p className="text-muted-foreground mb-2">
                  While you use the calculator, your current session data (form values and extracted document values) 
                  is stored in your browser's localStorage. This data is:
                </p>
              </ScrollReveal>
              <StaggerContainer className="ml-4" staggerDelay={0.05}>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Encrypted with AES-256-GCM</strong> using a session-specific key</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">The encryption key is stored in sessionStorage</strong> — it is automatically cleared when you close your browser</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Once the key is cleared, the encrypted data becomes unreadable</strong> — effectively deleted upon browser close</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside">For permanent storage, you must sign in and save your calculation (which uses separate end-to-end encryption with persistent keys)</li></StaggerItem>
              </StaggerContainer>
              
              <ScrollReveal>
                <div className="bg-muted/50 rounded-lg p-4 border border-border mt-4">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Note:</strong> On shared or public computers, closing the browser ensures your 
                    session data cannot be recovered. For maximum privacy, you can also clear your browser 
                    data manually.
                  </p>
                </div>
              </ScrollReveal>
            </section>

            {/* Section 3 */}
            <section id="usage">
              <AnimatedSectionHeader number={3} title="How We Use Your Information" />
              <StaggerContainer className="ml-4" staggerDelay={0.05}>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside">Calculate your Zakat obligation based on the data you provide</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside">Enable you to save and retrieve your encrypted calculations</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside">Allow you to share calculations with designated recipients (e.g., spouse)</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside">Extract financial values from uploaded documents</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside">Collect anonymous aggregate statistics for social proof (see 3.1)</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside">Improve and maintain the Service</li></StaggerItem>
              </StaggerContainer>
              
              <ScrollReveal>
                <h3 className="text-lg font-medium text-foreground mt-6 mb-2">3.1 Anonymous Usage Metrics</h3>
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <p className="text-muted-foreground mb-3">
                    We collect anonymous, aggregate statistics to display social proof on our landing page 
                    (e.g., "1,234 calculations completed"). This data:
                  </p>
                  <StaggerContainer className="ml-4" staggerDelay={0.05}>
                    <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Is fully anonymous</strong> — we use a cryptographically hashed session ID that cannot be reversed or linked to you</li></StaggerItem>
                    <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Contains no personal information</strong> — only rounded totals (assets rounded to nearest $1,000, Zakat to nearest $100)</li></StaggerItem>
                    <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Is not linked to your account</strong> — even if you're signed in, this data cannot identify you</li></StaggerItem>
                    <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Records only the date</strong> — no timestamp, IP address, or browser information</li></StaggerItem>
                    <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Is deduplicated per session per day</strong> — recalculating doesn't inflate numbers</li></StaggerItem>
                  </StaggerContainer>
                  <p className="text-muted-foreground mt-3">
                    This anonymous data helps demonstrate the utility of our tool to new visitors while 
                    maintaining complete privacy for all users.
                  </p>
                </div>
              </ScrollReveal>
              
              <ScrollReveal>
                <h3 className="text-lg font-medium text-foreground mt-6 mb-2">3.2 Referral Tracking</h3>
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <p className="text-muted-foreground mb-3">
                    When you share your personal invite link, we track anonymous referral statistics:
                  </p>
                  <StaggerContainer className="ml-4" staggerDelay={0.05}>
                    <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Referral counts</strong> — we track how many people used your invite link to calculate their Zakat</li></StaggerItem>
                    <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Privacy threshold</strong> — aggregate financial metrics (total Zakat calculated) are only shown to you after a minimum of 5 referrals to prevent individual identification</li></StaggerItem>
                    <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Same privacy protections</strong> — referral data uses hashed session IDs and rounded values, just like general usage metrics</li></StaggerItem>
                    <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">No personal data shared</strong> — referrers never see individual calculations, only aggregate totals</li></StaggerItem>
                  </StaggerContainer>
                  <p className="text-muted-foreground mt-3">
                    This threshold ensures that no individual's financial calculation can be identified or attributed, 
                    even by the person who shared the link with them.
                  </p>
                </div>
              </ScrollReveal>
            </section>

            {/* Section 4 */}
            <section id="ai-processing">
              <AnimatedSectionHeader number={4} title="AI Document Processing" />
              <ScrollReveal>
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <p className="text-muted-foreground mb-3">
                    <strong className="text-foreground">Important:</strong> When you upload a document for data extraction, the document 
                    content is sent to Google's Gemini AI service for processing. This enables us to extract 
                    financial values from your statements automatically.
                  </p>
                  <StaggerContainer className="ml-4" staggerDelay={0.05}>
                    <StaggerItem><li className="text-muted-foreground list-disc list-inside">Raw document content is transmitted to Google's AI service</li></StaggerItem>
                    <StaggerItem><li className="text-muted-foreground list-disc list-inside">Original documents are <strong className="text-foreground">not stored</strong> after processing (typically completes in seconds)</li></StaggerItem>
                    <StaggerItem><li className="text-muted-foreground list-disc list-inside">Only extracted numeric values are encrypted and stored</li></StaggerItem>
                    <StaggerItem><li className="text-muted-foreground list-disc list-inside">Document metadata (filename, institution name, summary) is shown during your session but cleared when you close your browser</li></StaggerItem>
                    <StaggerItem><li className="text-muted-foreground list-disc list-inside">Google's AI service may process data according to their privacy policy</li></StaggerItem>
                  </StaggerContainer>
                </div>
              </ScrollReveal>
            </section>

            {/* Section 5 */}
            <section id="encryption">
              <AnimatedSectionHeader number={5} title="Encryption & Data Protection" />
              <ScrollReveal>
                <p className="text-muted-foreground mb-4">
                  We use multiple layers of encryption to protect your financial data:
                </p>
              </ScrollReveal>
              
              <ScrollReveal>
                <h3 className="text-lg font-medium text-foreground mt-4 mb-2">5.1 Session Data Encryption</h3>
                <p className="text-muted-foreground mb-2">
                  While you use the calculator (before signing in or saving):
                </p>
              </ScrollReveal>
              <StaggerContainer className="ml-4" staggerDelay={0.05}>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Encryption Standard:</strong> AES-256-GCM symmetric encryption</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Key Storage:</strong> Encryption key stored in browser sessionStorage</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Automatic Clearing:</strong> Key is deleted when browser closes, making data unreadable</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Session-Specific:</strong> Each browser session gets a unique encryption key</li></StaggerItem>
              </StaggerContainer>

              <ScrollReveal>
                <h3 className="text-lg font-medium text-foreground mt-6 mb-2">5.2 Saved Calculation Encryption (Zero-Knowledge)</h3>
                <p className="text-muted-foreground mb-2">
                  When you sign in and save a calculation, <strong className="text-foreground">all data is encrypted before leaving your browser</strong>:
                </p>
              </ScrollReveal>
              <StaggerContainer className="ml-4" staggerDelay={0.05}>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Encryption Standard:</strong> AES-256-GCM symmetric encryption</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">What's Encrypted:</strong> Calculation name, year, all financial data, Zakat amount, and all metadata</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Key Storage:</strong> Encryption keys generated and stored locally in your browser's IndexedDB</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Device-Specific:</strong> Keys are unique to each browser/device and are never transmitted</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Sharing Security:</strong> RSA-4096 key exchange for securely sharing with others</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">True Zero-Knowledge:</strong> Our servers store only encrypted blobs — we cannot see your calculation names, years, financial details, or Zakat amounts</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Database Contents:</strong> Only encrypted data, timestamps, and your user ID are stored</li></StaggerItem>
              </StaggerContainer>

              <ScrollReveal>
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mt-4">
                  <p className="text-sm text-foreground font-medium flex items-center gap-2">
                    <Warning className="w-4 h-4 text-destructive" weight="duotone" />
                    Important: Key Loss Warning
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    If you clear your browser data or use a different device, your encryption keys will be lost. 
                    We cannot recover your encrypted data without your keys. Consider backing up your calculations 
                    by downloading the PDF report.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-4">
                  <p className="text-sm text-foreground font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" weight="duotone" />
                    Recommendation
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    For permanent, encrypted storage of your calculations, sign in and save your work. 
                    Session data is secure but temporary — it becomes unreadable when you close your browser.
                  </p>
                </div>
              </ScrollReveal>
            </section>

            {/* Section 6 */}
            <section id="sharing">
              <AnimatedSectionHeader number={6} title="Data Sharing" />
              
              <ScrollReveal>
                <h3 className="text-lg font-medium text-foreground mt-4 mb-2">6.1 Shared Calculations</h3>
                <p className="text-muted-foreground mb-2">
                  When you share a calculation with another person (e.g., your spouse):
                </p>
              </ScrollReveal>
              <StaggerContainer className="ml-4" staggerDelay={0.05}>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside">You invite them by email address</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside">When they sign in, their browser generates a unique public/private key pair</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside">The shared data is then encrypted specifically for them using RSA-4096 key exchange</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside">Only the designated recipient can decrypt the shared data with their private key</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside">Your original calculation remains encrypted with your own keys</li></StaggerItem>
              </StaggerContainer>
              <ScrollReveal>
                <p className="text-muted-foreground mt-2">
                  <strong className="text-foreground">Note:</strong> The share is created when you invite someone, but the data is encrypted 
                  for them once they log in and their encryption keys are generated. Until then, they can see 
                  that a share exists but cannot access the encrypted financial details.
                </p>
              </ScrollReveal>

              <ScrollReveal>
                <h3 className="text-lg font-medium text-foreground mt-6 mb-2">6.2 Service Providers</h3>
                <p className="text-muted-foreground mb-2">
                  We use the following third-party services:
                </p>
              </ScrollReveal>
              <StaggerContainer className="ml-4" staggerDelay={0.05}>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Google Cloud / Gemini AI:</strong> Document processing and data extraction</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Supabase:</strong> Database and authentication infrastructure</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Google OAuth:</strong> Authentication provider</li></StaggerItem>
              </StaggerContainer>

              <ScrollReveal>
                <h3 className="text-lg font-medium text-foreground mt-6 mb-2">6.3 No Sale or Sharing of Data</h3>
                <p className="text-muted-foreground">
                  We do not sell, rent, share, or trade your personal information to third parties for 
                  monetary or other valuable consideration. We do not engage in cross-context behavioral 
                  advertising. Therefore, we do not offer an opt-out mechanism for such practices.
                </p>
              </ScrollReveal>
            </section>

            {/* Section 7 */}
            <section id="california">
              <AnimatedSectionHeader number={7} title="California Privacy Rights (CCPA/CPRA)" />
              <ScrollReveal>
                <p className="text-muted-foreground mb-4">
                  If you are a California resident, you have the following rights under the California Consumer 
                  Privacy Act (CCPA) as amended by the California Privacy Rights Act (CPRA):
                </p>
              </ScrollReveal>
              
              <ScrollReveal>
                <h3 className="text-lg font-medium text-foreground mt-4 mb-2">7.1 Your Rights</h3>
              </ScrollReveal>
              <StaggerContainer className="ml-4" staggerDelay={0.05}>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Right to Know:</strong> Request information about the categories and specific pieces of personal data we collect, use, and disclose</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Right to Delete:</strong> Delete your data directly in Settings, or request deletion by contacting us</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Right to Correct:</strong> Request correction of inaccurate personal data we maintain about you</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Right to Opt-Out of Sale/Sharing:</strong> We do not sell or share personal information, so this right does not apply</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Right to Limit Use of Sensitive Personal Information:</strong> Your financial data is encrypted and used only to provide the Service</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Right to Non-Discrimination:</strong> We will not discriminate against you for exercising any of these rights</li></StaggerItem>
              </StaggerContainer>

              <ScrollReveal>
                <h3 className="text-lg font-medium text-foreground mt-6 mb-2">7.2 Sensitive Personal Information</h3>
                <p className="text-muted-foreground">
                  We collect financial information which may be considered sensitive personal information under CPRA. 
                  This information is used solely to calculate your Zakat obligation and is encrypted before storage. 
                  We do not use sensitive personal information for purposes other than providing the Service.
                </p>
              </ScrollReveal>

              <ScrollReveal>
                <h3 className="text-lg font-medium text-foreground mt-6 mb-2">7.3 How to Exercise Your Rights</h3>
                <p className="text-muted-foreground mb-2">
                  You can exercise most of your privacy rights directly within the app:
                </p>
              </ScrollReveal>
              <StaggerContainer className="ml-4" staggerDelay={0.05}>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Delete All Data:</strong> Go to Settings → Danger Zone → "Delete All Data" to remove all saved calculations while keeping your account</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Delete Account:</strong> Go to Settings → Danger Zone → "Delete Account" to permanently delete your account and all associated data</li></StaggerItem>
              </StaggerContainer>
              <ScrollReveal>
                <p className="text-muted-foreground mt-2">
                  For other requests or if you prefer, contact us at{" "}
                  <a href="mailto:naheed@vora.dev" className="text-primary hover:underline">naheed@vora.dev</a>. 
                  We will respond to verifiable requests within 45 days. If we need more time (up to 90 days total), 
                  we will notify you.
                </p>
              </ScrollReveal>

              <ScrollReveal>
                <h3 className="text-lg font-medium text-foreground mt-6 mb-2">7.4 Verification Process</h3>
                <p className="text-muted-foreground">
                  To protect your privacy, we will verify your identity before responding to requests. We may ask 
                  you to confirm information associated with your account (such as your email address). For deletion 
                  requests, we may require additional confirmation.
                </p>
              </ScrollReveal>

              <ScrollReveal>
                <h3 className="text-lg font-medium text-foreground mt-6 mb-2">7.5 Authorized Agents</h3>
                <p className="text-muted-foreground">
                  You may designate an authorized agent to make requests on your behalf. The agent must provide 
                  proof of authorization (such as a power of attorney or signed permission), and we may still 
                  verify your identity directly.
                </p>
              </ScrollReveal>
            </section>

            {/* Section 8 */}
            <section id="retention">
              <AnimatedSectionHeader number={8} title="Data Retention & Deletion" />
              <ScrollReveal>
                <p className="text-muted-foreground mb-2">We retain your data for the following periods:</p>
              </ScrollReveal>
              <StaggerContainer className="ml-4" staggerDelay={0.05}>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Session Data:</strong> Encrypted in browser localStorage; effectively deleted when you close your browser (encryption key is cleared from sessionStorage)</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Account Information:</strong> Retained while your account is active; deleted immediately upon account deletion</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Saved Calculations:</strong> End-to-end encrypted and retained until you delete them or delete your account</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Uploaded Documents:</strong> Processed in memory only; not retained after extraction (typically seconds)</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Document Metadata:</strong> Shown during session only; not persisted to storage</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Usage Analytics:</strong> Aggregated data retained for up to 24 months</li></StaggerItem>
              </StaggerContainer>
              
              <ScrollReveal>
                <h3 className="text-lg font-medium text-foreground mt-6 mb-2">8.1 Self-Service Deletion</h3>
                <p className="text-muted-foreground mb-2">
                  You can delete your data at any time through the Settings page:
                </p>
              </ScrollReveal>
              <StaggerContainer className="ml-4" staggerDelay={0.05}>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Delete All Data:</strong> Removes all saved calculations and shared access while keeping your account active</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Delete Account:</strong> Permanently deletes your account, profile, and all associated data</li></StaggerItem>
              </StaggerContainer>
              <ScrollReveal>
                <p className="text-muted-foreground mt-2">
                  Both actions are immediate and irreversible. Local encryption keys stored in your browser are also cleared during deletion.
                </p>
              </ScrollReveal>
            </section>

            {/* Section 9 */}
            <section id="security">
              <AnimatedSectionHeader number={9} title="Data Security" />
              <ScrollReveal>
                <p className="text-muted-foreground mb-2">
                  We implement appropriate technical and organizational measures to protect your data, including:
                </p>
              </ScrollReveal>
              <StaggerContainer className="ml-4" staggerDelay={0.05}>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside">Session-specific encryption for browser-stored data</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside">End-to-end encryption for saved calculations</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside">Secure HTTPS connections</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside">Row-level security policies in our database</li></StaggerItem>
                <StaggerItem><li className="text-muted-foreground list-disc list-inside">Regular security reviews</li></StaggerItem>
              </StaggerContainer>
            </section>

            {/* Section 10 */}
            <section id="children">
              <AnimatedSectionHeader number={10} title="Children's Privacy" />
              <ScrollReveal>
                <p className="text-muted-foreground">
                  The Service is not intended for use by individuals under the age of 18. We do not 
                  knowingly collect personal information from children.
                </p>
              </ScrollReveal>
            </section>

            {/* Section 11 */}
            <section id="changes">
              <AnimatedSectionHeader number={11} title="Changes to This Policy" />
              <ScrollReveal>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify you of any material 
                  changes by posting the new policy on this page and updating the "Last updated" date.
                </p>
              </ScrollReveal>
            </section>

            {/* Section 12 */}
            <section id="contact">
              <AnimatedSectionHeader number={12} title="Contact Us" />
              <ScrollReveal>
                <p className="text-muted-foreground">
                  If you have questions about this Privacy Policy or our data practices, please contact:
                </p>
                <p className="text-muted-foreground mt-2">
                  <strong className="text-foreground">Email:</strong>{" "}
                  <a href="mailto:naheed@vora.dev" className="text-primary hover:underline">
                    naheed@vora.dev
                  </a>
                </p>
              </ScrollReveal>
            </section>

          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
