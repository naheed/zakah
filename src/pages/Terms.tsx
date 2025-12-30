import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Warning, ArrowLeft, Scales, Scroll, Shield, LockKey, FileText, Lightning, Handshake, Copyright, UserCircle, Gavel, Buildings, Prohibit, ArrowsClockwise, Eraser, Files, AddressBook } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/zakat/Footer";
import { getPrimaryUrl } from "@/lib/domainConfig";
import { ReadingProgress } from "@/components/ui/reading-progress";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { AnimatedSectionHeader } from "@/components/ui/animated-section-header";

const sections = [
  { id: "acceptance", number: 1, title: "Acceptance of Terms", icon: Scroll },
  { id: "description", number: 2, title: "Description of Service", icon: FileText },
  { id: "not-advice", number: 3, title: "Not Financial or Religious Advice", icon: Warning },
  { id: "responsibilities", number: 4, title: "User Responsibilities", icon: UserCircle },
  { id: "encryption", number: 5, title: "Encryption and Data Loss", icon: LockKey },
  { id: "ai-processing", number: 6, title: "AI Document Processing", icon: Lightning },
  { id: "warranties", number: 7, title: "Disclaimer of Warranties", icon: Shield },
  { id: "liability", number: 8, title: "Limitation of Liability", icon: Scales },
  { id: "indemnification", number: 9, title: "Indemnification", icon: Handshake },
  { id: "intellectual", number: 10, title: "Intellectual Property", icon: Copyright },
  { id: "termination", number: 11, title: "Account Termination", icon: Prohibit },
  { id: "disputes", number: 12, title: "Dispute Resolution", icon: Gavel },
  { id: "governing", number: 13, title: "Governing Law", icon: Buildings },
  { id: "force-majeure", number: 14, title: "Force Majeure", icon: Lightning },
  { id: "assignment", number: 15, title: "Assignment", icon: ArrowsClockwise },
  { id: "changes", number: 16, title: "Changes to Terms", icon: Eraser },
  { id: "severability", number: 17, title: "Severability", icon: Files },
  { id: "entire", number: 18, title: "Entire Agreement", icon: Scroll },
  { id: "contact", number: 19, title: "Contact", icon: AddressBook },
];

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | ZakatFlow</title>
        <meta name="description" content="Terms of Service for the ZakatFlow application." />
        <link rel="canonical" href={getPrimaryUrl('/terms')} />
        <meta property="og:url" content={getPrimaryUrl('/terms')} />
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
                Terms of Service
              </h1>
              <p className="text-muted-foreground">Last updated: December 27, 2025</p>
            </header>
          </ScrollReveal>

          <div className="space-y-10">

            {/* Important Notice */}
            <ScrollReveal delay={0.15}>
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Warning className="w-5 h-5 text-destructive" weight="duotone" />
                  Important Disclaimer
                </h2>
                <p className="text-sm text-muted-foreground">
                  This calculator provides estimates for educational purposes only. It is <strong className="text-foreground">not a 
                  substitute for consultation with qualified Islamic scholars</strong> regarding your 
                  specific Zakat obligations. The calculations are based on general interpretations and 
                  may not reflect the specific rulings applicable to your situation.
                </p>
              </div>
            </ScrollReveal>

            {/* Section 1 */}
            <section id="acceptance">
              <AnimatedSectionHeader number={1} title="Acceptance of Terms" />
              <ScrollReveal>
                <p className="text-muted-foreground">
                  By accessing or using the Zakat Calculator ("the Service"), you agree to be bound by these 
                  Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service.
                </p>
              </ScrollReveal>
            </section>

            {/* Section 2 */}
            <section id="description">
              <AnimatedSectionHeader number={2} title="Description of Service" />
              <ScrollReveal>
                <p className="text-muted-foreground mb-4">
                  The Zakat Calculator is a web-based tool that helps users estimate their Zakat obligations 
                  based on the financial information they provide. The Service:
                </p>
              </ScrollReveal>
              <StaggerContainer className="ml-4" staggerDelay={0.05}>
                <StaggerItem>
                  <li className="text-muted-foreground list-disc list-inside">Calculates estimated Zakat based on user-provided financial data</li>
                </StaggerItem>
                <StaggerItem>
                  <li className="text-muted-foreground list-disc list-inside">Allows users to save and retrieve encrypted calculations</li>
                </StaggerItem>
                <StaggerItem>
                  <li className="text-muted-foreground list-disc list-inside">Enables document upload for automated data extraction</li>
                </StaggerItem>
                <StaggerItem>
                  <li className="text-muted-foreground list-disc list-inside">Provides educational information about Zakat methodologies</li>
                </StaggerItem>
              </StaggerContainer>
            </section>

            {/* Section 3 */}
            <section id="not-advice">
              <AnimatedSectionHeader number={3} title="Not Financial or Religious Advice" />
              <ScrollReveal>
                <p className="text-muted-foreground mb-4">
                  <strong className="text-foreground">The Service does not provide financial, tax, legal, or religious advice.</strong> The 
                  calculations and information provided are for educational and informational purposes only. 
                  You should:
                </p>
              </ScrollReveal>
              <StaggerContainer className="ml-4" staggerDelay={0.05}>
                <StaggerItem>
                  <li className="text-muted-foreground list-disc list-inside">Consult with qualified Islamic scholars for authoritative Zakat rulings</li>
                </StaggerItem>
                <StaggerItem>
                  <li className="text-muted-foreground list-disc list-inside">Consult with tax professionals regarding tax implications</li>
                </StaggerItem>
                <StaggerItem>
                  <li className="text-muted-foreground list-disc list-inside">Verify calculations independently before making financial decisions</li>
                </StaggerItem>
                <StaggerItem>
                  <li className="text-muted-foreground list-disc list-inside">Understand that different schools of Islamic jurisprudence may have varying opinions</li>
                </StaggerItem>
              </StaggerContainer>
            </section>

            {/* Section 4 */}
            <section id="responsibilities">
              <AnimatedSectionHeader number={4} title="User Responsibilities" />
              <ScrollReveal>
                <p className="text-muted-foreground mb-4">You are responsible for:</p>
              </ScrollReveal>
              <StaggerContainer className="ml-4" staggerDelay={0.05}>
                <StaggerItem>
                  <li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Accurate Data Entry:</strong> Providing accurate and complete financial information</li>
                </StaggerItem>
                <StaggerItem>
                  <li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Account Security:</strong> Maintaining the security of your account credentials</li>
                </StaggerItem>
                <StaggerItem>
                  <li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Encryption Keys:</strong> Understanding that encryption keys are stored in your browser and that clearing browser data will result in loss of access to encrypted calculations</li>
                </StaggerItem>
                <StaggerItem>
                  <li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Backup:</strong> Downloading PDF reports or maintaining backups of important calculations</li>
                </StaggerItem>
                <StaggerItem>
                  <li className="text-muted-foreground list-disc list-inside"><strong className="text-foreground">Legal Compliance:</strong> Ensuring your use of the Service complies with applicable laws</li>
                </StaggerItem>
              </StaggerContainer>
            </section>

            {/* Section 5 */}
            <section id="encryption">
              <AnimatedSectionHeader number={5} title="Encryption and Data Loss" />
              <ScrollReveal>
                <p className="text-muted-foreground mb-4">
                  Your saved calculations are encrypted using keys stored locally in your browser. You acknowledge that:
                </p>
              </ScrollReveal>
              <StaggerContainer className="ml-4" staggerDelay={0.05}>
                <StaggerItem>
                  <li className="text-muted-foreground list-disc list-inside">Encryption keys are device-specific and not backed up by us</li>
                </StaggerItem>
                <StaggerItem>
                  <li className="text-muted-foreground list-disc list-inside">Clearing browser data, reinstalling your browser, or using a different device will result in loss of access to your encrypted calculations</li>
                </StaggerItem>
                <StaggerItem>
                  <li className="text-muted-foreground list-disc list-inside">We cannot recover encrypted data if you lose your encryption keys</li>
                </StaggerItem>
                <StaggerItem>
                  <li className="text-muted-foreground list-disc list-inside">You are solely responsible for maintaining access to your encryption keys</li>
                </StaggerItem>
              </StaggerContainer>
            </section>

            {/* Section 6 */}
            <section id="ai-processing">
              <AnimatedSectionHeader number={6} title="AI Document Processing" />
              <ScrollReveal>
                <p className="text-muted-foreground mb-4">
                  When you upload documents for data extraction:
                </p>
              </ScrollReveal>
              <StaggerContainer className="ml-4" staggerDelay={0.05}>
                <StaggerItem>
                  <li className="text-muted-foreground list-disc list-inside">Documents are processed by third-party AI services (Google Gemini)</li>
                </StaggerItem>
                <StaggerItem>
                  <li className="text-muted-foreground list-disc list-inside">We do not guarantee the accuracy of extracted data</li>
                </StaggerItem>
                <StaggerItem>
                  <li className="text-muted-foreground list-disc list-inside">You are responsible for verifying all extracted values</li>
                </StaggerItem>
                <StaggerItem>
                  <li className="text-muted-foreground list-disc list-inside">Uploaded documents are processed in memory and not permanently stored</li>
                </StaggerItem>
              </StaggerContainer>
            </section>

            {/* Section 7 */}
            <section id="warranties">
              <AnimatedSectionHeader number={7} title="Disclaimer of Warranties" />
              <ScrollReveal>
                <p className="text-muted-foreground mb-4">
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
                  EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
                </p>
              </ScrollReveal>
              <StaggerContainer className="ml-4" staggerDelay={0.05}>
                <StaggerItem>
                  <li className="text-muted-foreground list-disc list-inside">Warranties of merchantability or fitness for a particular purpose</li>
                </StaggerItem>
                <StaggerItem>
                  <li className="text-muted-foreground list-disc list-inside">Warranties that the Service will be uninterrupted or error-free</li>
                </StaggerItem>
                <StaggerItem>
                  <li className="text-muted-foreground list-disc list-inside">Warranties regarding the accuracy of calculations or extracted data</li>
                </StaggerItem>
                <StaggerItem>
                  <li className="text-muted-foreground list-disc list-inside">Warranties that the calculations comply with any particular interpretation of Islamic law</li>
                </StaggerItem>
              </StaggerContainer>
            </section>

            {/* Section 8 */}
            <section id="liability">
              <AnimatedSectionHeader number={8} title="Limitation of Liability" />
              <ScrollReveal>
                <p className="text-muted-foreground mb-4">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL THE SERVICE, ITS CREATOR, 
                  OR AFFILIATES BE LIABLE FOR:
                </p>
              </ScrollReveal>
              <StaggerContainer className="ml-4" staggerDelay={0.05}>
                <StaggerItem>
                  <li className="text-muted-foreground list-disc list-inside">Any indirect, incidental, special, consequential, or punitive damages</li>
                </StaggerItem>
                <StaggerItem>
                  <li className="text-muted-foreground list-disc list-inside">Any loss of profits, data, or other intangible losses</li>
                </StaggerItem>
                <StaggerItem>
                  <li className="text-muted-foreground list-disc list-inside">Any damages resulting from reliance on calculated Zakat amounts</li>
                </StaggerItem>
                <StaggerItem>
                  <li className="text-muted-foreground list-disc list-inside">Any damages resulting from loss of encryption keys or encrypted data</li>
                </StaggerItem>
                <StaggerItem>
                  <li className="text-muted-foreground list-disc list-inside">Any damages arising from AI processing errors or inaccuracies</li>
                </StaggerItem>
              </StaggerContainer>
            </section>

            {/* Section 9 */}
            <section id="indemnification">
              <AnimatedSectionHeader number={9} title="Indemnification" />
              <ScrollReveal>
                <p className="text-muted-foreground">
                  You agree to indemnify and hold harmless the Service and its creator from any claims, 
                  damages, or expenses arising from your use of the Service or violation of these Terms.
                </p>
              </ScrollReveal>
            </section>

            {/* Section 10 */}
            <section id="intellectual">
              <AnimatedSectionHeader number={10} title="Intellectual Property" />
              <ScrollReveal>
                <p className="text-muted-foreground">
                  The Service and its original content, features, and functionality are owned by the creator 
                  and are protected by applicable intellectual property laws. You may not copy, modify, 
                  distribute, or create derivative works without permission.
                </p>
              </ScrollReveal>
            </section>

            {/* Section 11 */}
            <section id="termination">
              <AnimatedSectionHeader number={11} title="Account Termination" />
              <ScrollReveal>
                <p className="text-muted-foreground">
                  We reserve the right to suspend or terminate your access to the Service at any time, 
                  without notice, for conduct that we believe violates these Terms or is harmful to other 
                  users or the Service.
                </p>
              </ScrollReveal>
            </section>

            {/* Section 12 */}
            <section id="disputes">
              <AnimatedSectionHeader number={12} title="Dispute Resolution" />
              <ScrollReveal>
                <p className="text-muted-foreground">
                  Any disputes arising from these Terms or your use of the Service shall be resolved through 
                  good faith negotiation. If negotiation fails, disputes shall be resolved through binding 
                  arbitration in accordance with the rules of the American Arbitration Association, conducted 
                  in California. You agree to waive any right to participate in a class action lawsuit or 
                  class-wide arbitration.
                </p>
              </ScrollReveal>
            </section>

            {/* Section 13 */}
            <section id="governing">
              <AnimatedSectionHeader number={13} title="Governing Law" />
              <ScrollReveal>
                <p className="text-muted-foreground">
                  These Terms shall be governed by and construed in accordance with the laws of the 
                  State of California, United States, without regard to its conflict of law provisions.
                </p>
              </ScrollReveal>
            </section>

            {/* Section 14 */}
            <section id="force-majeure">
              <AnimatedSectionHeader number={14} title="Force Majeure" />
              <ScrollReveal>
                <p className="text-muted-foreground">
                  We shall not be liable for any failure or delay in performing our obligations where such 
                  failure or delay results from circumstances beyond our reasonable control, including but 
                  not limited to natural disasters, acts of government, internet or infrastructure failures, 
                  or third-party service outages.
                </p>
              </ScrollReveal>
            </section>

            {/* Section 15 */}
            <section id="assignment">
              <AnimatedSectionHeader number={15} title="Assignment" />
              <ScrollReveal>
                <p className="text-muted-foreground">
                  You may not assign or transfer these Terms or your rights hereunder without our prior 
                  written consent. We may assign these Terms without restriction.
                </p>
              </ScrollReveal>
            </section>

            {/* Section 16 */}
            <section id="changes">
              <AnimatedSectionHeader number={16} title="Changes to Terms" />
              <ScrollReveal>
                <p className="text-muted-foreground">
                  We reserve the right to modify these Terms at any time. We will notify you of material 
                  changes by posting the new Terms on this page and updating the "Last updated" date. 
                  Your continued use of the Service after changes constitutes acceptance of the new Terms.
                </p>
              </ScrollReveal>
            </section>

            {/* Section 17 */}
            <section id="severability">
              <AnimatedSectionHeader number={17} title="Severability" />
              <ScrollReveal>
                <p className="text-muted-foreground">
                  If any provision of these Terms is found to be unenforceable, the remaining provisions 
                  will continue in full force and effect.
                </p>
              </ScrollReveal>
            </section>

            {/* Section 18 */}
            <section id="entire">
              <AnimatedSectionHeader number={18} title="Entire Agreement" />
              <ScrollReveal>
                <p className="text-muted-foreground">
                  These Terms, together with our Privacy Policy, constitute the entire agreement between 
                  you and us regarding the Service and supersede all prior agreements and understandings.
                </p>
              </ScrollReveal>
            </section>

            {/* Section 19 */}
            <section id="contact">
              <AnimatedSectionHeader number={19} title="Contact" />
              <ScrollReveal>
                <p className="text-muted-foreground">
                  For questions about these Terms, please contact:
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
