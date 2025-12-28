import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | Zakat Flow</title>
        <meta name="description" content="Terms of Service for the Zakat Flow application." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Calculator
            </Button>
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 27, 2025</p>

          <div className="prose prose-sm dark:prose-invert max-w-none space-y-8">

            {/* Important Notice */}
            <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-6 not-prose">
              <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Important Disclaimer
              </h2>
              <p className="text-sm text-muted-foreground">
                This calculator provides estimates for educational purposes only. It is <strong>not a 
                substitute for consultation with qualified Islamic scholars</strong> regarding your 
                specific Zakat obligations. The calculations are based on general interpretations and 
                may not reflect the specific rulings applicable to your situation.
              </p>
            </div>

            <section>
              <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing or using the Zakat Calculator ("the Service"), you agree to be bound by these 
                Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">2. Description of Service</h2>
              <p className="text-muted-foreground">
                The Zakat Calculator is a web-based tool that helps users estimate their Zakat obligations 
                based on the financial information they provide. The Service:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4">
                <li>Calculates estimated Zakat based on user-provided financial data</li>
                <li>Allows users to save and retrieve encrypted calculations</li>
                <li>Enables document upload for automated data extraction</li>
                <li>Provides educational information about Zakat methodologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">3. Not Financial or Religious Advice</h2>
              <p className="text-muted-foreground">
                <strong>The Service does not provide financial, tax, legal, or religious advice.</strong> The 
                calculations and information provided are for educational and informational purposes only. 
                You should:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4">
                <li>Consult with qualified Islamic scholars for authoritative Zakat rulings</li>
                <li>Consult with tax professionals regarding tax implications</li>
                <li>Verify calculations independently before making financial decisions</li>
                <li>Understand that different schools of Islamic jurisprudence may have varying opinions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">4. User Responsibilities</h2>
              <p className="text-muted-foreground">You are responsible for:</p>
              <ul className="list-disc list-inside text-muted-foreground ml-4">
                <li><strong>Accurate Data Entry:</strong> Providing accurate and complete financial information</li>
                <li><strong>Account Security:</strong> Maintaining the security of your account credentials</li>
                <li><strong>Encryption Keys:</strong> Understanding that encryption keys are stored in your browser 
                  and that clearing browser data will result in loss of access to encrypted calculations</li>
                <li><strong>Backup:</strong> Downloading PDF reports or maintaining backups of important calculations</li>
                <li><strong>Legal Compliance:</strong> Ensuring your use of the Service complies with applicable laws</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">5. Encryption and Data Loss</h2>
              <p className="text-muted-foreground">
                Your saved calculations are encrypted using keys stored locally in your browser. You acknowledge that:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4">
                <li>Encryption keys are device-specific and not backed up by us</li>
                <li>Clearing browser data, reinstalling your browser, or using a different device will result in 
                  loss of access to your encrypted calculations</li>
                <li>We cannot recover encrypted data if you lose your encryption keys</li>
                <li>You are solely responsible for maintaining access to your encryption keys</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">6. AI Document Processing</h2>
              <p className="text-muted-foreground">
                When you upload documents for data extraction:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4">
                <li>Documents are processed by third-party AI services (Google Gemini)</li>
                <li>We do not guarantee the accuracy of extracted data</li>
                <li>You are responsible for verifying all extracted values</li>
                <li>Uploaded documents are processed in memory and not permanently stored</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">7. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
                EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4">
                <li>Warranties of merchantability or fitness for a particular purpose</li>
                <li>Warranties that the Service will be uninterrupted or error-free</li>
                <li>Warranties regarding the accuracy of calculations or extracted data</li>
                <li>Warranties that the calculations comply with any particular interpretation of Islamic law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">8. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL THE SERVICE, ITS CREATOR, 
                OR AFFILIATES BE LIABLE FOR:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4">
                <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                <li>Any loss of profits, data, or other intangible losses</li>
                <li>Any damages resulting from reliance on calculated Zakat amounts</li>
                <li>Any damages resulting from loss of encryption keys or encrypted data</li>
                <li>Any damages arising from AI processing errors or inaccuracies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">9. Indemnification</h2>
              <p className="text-muted-foreground">
                You agree to indemnify and hold harmless the Service and its creator from any claims, 
                damages, or expenses arising from your use of the Service or violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">10. Intellectual Property</h2>
              <p className="text-muted-foreground">
                The Service and its original content, features, and functionality are owned by the creator 
                and are protected by applicable intellectual property laws. You may not copy, modify, 
                distribute, or create derivative works without permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">11. Account Termination</h2>
              <p className="text-muted-foreground">
                We reserve the right to suspend or terminate your access to the Service at any time, 
                without notice, for conduct that we believe violates these Terms or is harmful to other 
                users or the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">12. Dispute Resolution</h2>
              <p className="text-muted-foreground">
                Any disputes arising from these Terms or your use of the Service shall be resolved through 
                good faith negotiation. If negotiation fails, disputes shall be resolved through binding 
                arbitration in accordance with the rules of the American Arbitration Association, conducted 
                in California. You agree to waive any right to participate in a class action lawsuit or 
                class-wide arbitration.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">13. Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms shall be governed by and construed in accordance with the laws of the 
                State of California, United States, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">14. Force Majeure</h2>
              <p className="text-muted-foreground">
                We shall not be liable for any failure or delay in performing our obligations where such 
                failure or delay results from circumstances beyond our reasonable control, including but 
                not limited to natural disasters, acts of government, internet or infrastructure failures, 
                or third-party service outages.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">15. Assignment</h2>
              <p className="text-muted-foreground">
                You may not assign or transfer these Terms or your rights hereunder without our prior 
                written consent. We may assign these Terms without restriction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">16. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these Terms at any time. We will notify you of material 
                changes by posting the new Terms on this page and updating the "Last updated" date. 
                Your continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">17. Severability</h2>
              <p className="text-muted-foreground">
                If any provision of these Terms is found to be unenforceable, the remaining provisions 
                will continue in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">18. Entire Agreement</h2>
              <p className="text-muted-foreground">
                These Terms, together with our Privacy Policy, constitute the entire agreement between 
                you and us regarding the Service and supersede all prior agreements and understandings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">19. Contact</h2>
              <p className="text-muted-foreground">
                For questions about these Terms, please contact:
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
