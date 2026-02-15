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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, TestTube, FileText, GitBranch, ChatText } from "@phosphor-icons/react";
import { ArticleLayout } from "@/components/layout/ArticleLayout";
import { Text } from "@/components/ui/typography";

const tocItems = [
    { id: "define", number: 1, label: "Define the Configuration" },
    { id: "register", number: 2, label: "Register the Preset" },
    { id: "verify", number: 3, label: "Verify Compliance" },
    { id: "canonical", number: 4, label: "The Canonical Profile" },
    { id: "helptext", number: 5, label: "Write User Help Text" },
    { id: "submit", number: 6, label: "Submit Contribution" },
];

export function MethodologyContributing() {
    const headerContent = (
        <Text variant="lead">
            Add a new fiqh opinion, scholar's view, or organizational standard to ZakatFlow.
        </Text>
    );

    return (
        <ArticleLayout
            title="Contributing a New Methodology"
            description="Guide for contributing new Zakat calculation methodologies to ZakatFlow's ZMCS standard."
            urlPath="/methodology/zmcs/contributing"
            tocItems={tocItems}
            headerContent={headerContent}
            backLink="/methodology/zmcs"
            backLabel="Back to ZMCS Specification"
        >
            {/* Step 1 */}
            <section id="define" className="scroll-mt-24">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Code className="w-5 h-5 text-primary" />
                            1. Define the Configuration
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p>Create a new TypeScript file in <code className="text-sm bg-muted px-1.5 py-0.5 rounded">src/lib/config/presets/</code> (e.g., <code className="text-sm bg-muted px-1.5 py-0.5 rounded">my_methodology.ts</code>).</p>
                        <div className="p-3 bg-muted/40 rounded-md border border-border/50 text-sm">
                            <p className="font-semibold mb-1 text-xs uppercase tracking-wide text-muted-foreground">Type Contract</p>
                            <code className="block font-mono text-xs">
                                import &#123; ZakatMethodologyConfig &#125; from '@/lib/config/types';<br />
                                <br />
                                export const MY_CONFIG: ZakatMethodologyConfig = &#123; ... &#125;;
                            </code>
                        </div>
                        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                            <li><strong className="text-foreground">Base Config:</strong> Start by copying an existing preset (like <code className="text-sm bg-muted px-1.5 py-0.5 rounded">hanafi.ts</code>).</li>
                            <li><strong className="text-foreground">Metadata:</strong> Define the <code className="text-sm bg-muted px-1.5 py-0.5 rounded">meta</code> section with a unique ID, name, and source attribution.</li>
                            <li><strong className="text-foreground">Rules:</strong> Adjust <code className="text-sm bg-muted px-1.5 py-0.5 rounded">assets</code>, <code className="text-sm bg-muted px-1.5 py-0.5 rounded">liabilities</code>, and <code className="text-sm bg-muted px-1.5 py-0.5 rounded">thresholds</code> sections.</li>
                        </ul>
                        <p className="text-xs text-muted-foreground italic">
                            💡 Tip: Consult the <strong>ZMCS Specification</strong> tab for valid enum values for each field.
                        </p>
                    </CardContent>
                </Card>
            </section>

            {/* Step 2 */}
            <section id="register" className="scroll-mt-24">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <GitBranch className="w-5 h-5 text-primary" />
                            2. Register the Preset
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Add your config to <code className="text-sm bg-muted px-1.5 py-0.5 rounded">src/lib/config/presets/index.ts</code>:</p>
                        <pre className="mt-3 p-4 bg-muted/50 rounded-lg text-xs font-mono overflow-x-auto">
                            {`import { MY_METHODOLOGY_CONFIG } from './my_methodology';

export const ZAKAT_PRESETS = {
  // ...existing presets
  'my-methodology': MY_METHODOLOGY_CONFIG,
};`}
                        </pre>
                    </CardContent>
                </Card>
            </section>

            {/* Step 3 */}
            <section id="verify" className="scroll-mt-24">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TestTube className="w-5 h-5 text-primary" />
                            3. Verify Compliance
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p>Run the compliance test suite to ensure your methodology meets system standards:</p>
                        <pre className="p-4 bg-muted/50 rounded-lg text-xs font-mono overflow-x-auto">
                            {`npm test src/lib/__tests__/zmcs_compliance.test.ts`}
                        </pre>
                        <p className="text-sm text-muted-foreground">This ensures the config is structurally valid, produces a calculation &gt; 0 for the canonical test case, and does not crash the calculator.</p>
                        <p className="text-xs text-muted-foreground italic mt-2">
                            🚀 Tip: Run <code className="bg-muted px-1 py-0.5 rounded">npm run dev</code> to launch the app locally. Your new preset will appear in the dropdown immediately.
                        </p>
                    </CardContent>
                </Card>
            </section>

            {/* Step 4 */}
            <section id="canonical" className="scroll-mt-24">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            4. The "Super Ahmed" Canonical Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-3">All methodologies are tested against "Super Ahmed" to ensure baseline rationality:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div className="p-2 bg-muted/50 rounded"><strong>Cash:</strong> $100,000</div>
                            <div className="p-2 bg-muted/50 rounded"><strong>401k:</strong> $100,000 (Vested)</div>
                            <div className="p-2 bg-muted/50 rounded"><strong>Investments:</strong> $100,000 (Passive)</div>
                            <div className="p-2 bg-muted/50 rounded"><strong>Gold Jewelry:</strong> $5,000</div>
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground"><strong>Expected:</strong> Zakat Due &gt; $0 at 2.5% rate. <span className="italic">(This ensures your methodology doesn't accidentally exempt a clearly wealthy individual due to conflicting rules.)</span></p>
                    </CardContent>
                </Card>
            </section>

            {/* Step 5 */}
            <section id="helptext" className="scroll-mt-24">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ChatText className="w-5 h-5 text-primary" />
                            5. Write User Help Text
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p>Each ZMCS config field can have a corresponding user-facing tooltip in the calculator. These are managed in <code className="text-sm bg-muted px-1.5 py-0.5 rounded">src/content/fiqhExplanations.ts</code>.</p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li><strong className="text-foreground">Static entries:</strong> Add to <code className="text-sm bg-muted px-1.5 py-0.5 rounded">staticExplanations</code> for content that is universally true across all methodologies.</li>
                            <li><strong className="text-foreground">Dynamic entries:</strong> Add inside <code className="text-sm bg-muted px-1.5 py-0.5 rounded">getFiqhExplanations(config)</code> for content that adapts based on the active methodology (e.g., liability method, passive rate).</li>
                            <li><strong className="text-foreground">Cross-reference:</strong> Set <code className="text-sm bg-muted px-1.5 py-0.5 rounded">helpText</code> on the corresponding <code className="text-sm bg-muted px-1.5 py-0.5 rounded">ZMCSField</code> in <code className="text-sm bg-muted px-1.5 py-0.5 rounded">zmcs-docs.ts</code> to link the spec to the tooltip key.</li>
                        </ul>
                        <div className="mt-3 p-3 bg-muted/30 rounded-lg border border-border/40 text-sm text-muted-foreground space-y-1">
                            <p className="font-semibold text-foreground">Content Standards</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Use <em>"This methodology..."</em> not <em>"We..."</em> for methodology-specific text</li>
                                <li>Keep explanations ESL-friendly: Subject + Verb + Object</li>
                                <li>Cite scholarly sources where helpful, without being academic</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </section>
            {/* Step 6 */}
            <section id="submit" className="scroll-mt-24">
                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <GitBranch className="w-5 h-5 text-primary" />
                            6. Submit Your Contribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p>Ready to share your methodology with the community?</p>
                        <ol className="list-decimal pl-6 space-y-2 text-sm text-foreground/80">
                            <li><strong>Fork</strong> the repository and create a new branch: <code className="bg-background px-1.5 py-0.5 rounded text-xs">feat/add-my-methodology</code></li>
                            <li><strong>Commit</strong> your changes (config file, registry update, and verification proof).</li>
                            <li><strong>Open a Pull Request</strong> on GitHub.</li>
                        </ol>
                        <p className="text-sm text-muted-foreground pt-2">
                            Our team (scholars and developers) will review the fiqh logic, verify the unit tests, and merge your contribution.
                        </p>
                    </CardContent>
                </Card>
            </section>
        </ArticleLayout>
    );
}
