import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, TestTube, FileText, GitBranch } from "@phosphor-icons/react";
import { ArticleLayout } from "@/components/layout/ArticleLayout";
import { Text } from "@/components/ui/typography";

const tocItems = [
    { id: "define", number: 1, label: "Define the Configuration" },
    { id: "register", number: 2, label: "Register the Preset" },
    { id: "verify", number: 3, label: "Verify Compliance" },
    { id: "canonical", number: 4, label: "The Canonical Profile" },
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
                        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                            <li><strong className="text-foreground">Base Config:</strong> Start by copying an existing preset (like <code className="text-sm bg-muted px-1.5 py-0.5 rounded">hanafi.ts</code>).</li>
                            <li><strong className="text-foreground">Metadata:</strong> Define the <code className="text-sm bg-muted px-1.5 py-0.5 rounded">meta</code> section with a unique ID, name, and source attribution.</li>
                            <li><strong className="text-foreground">Rules:</strong> Adjust <code className="text-sm bg-muted px-1.5 py-0.5 rounded">assets</code>, <code className="text-sm bg-muted px-1.5 py-0.5 rounded">liabilities</code>, and <code className="text-sm bg-muted px-1.5 py-0.5 rounded">thresholds</code> sections.</li>
                        </ul>
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
                        <p className="mt-3 text-sm text-muted-foreground"><strong>Expected:</strong> Zakat Due &gt; $0 at 2.5% rate.</p>
                    </CardContent>
                </Card>
            </section>
        </ArticleLayout>
    );
}
