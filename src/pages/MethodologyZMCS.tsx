
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Code, FileText, Database, ShieldCheck } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { ZAKAT_PRESETS } from "@/lib/config/presets";

export function MethodologyZMCS() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="mb-8">
                <Link to="/methodology">
                    <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent hover:text-primary">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Methodology
                    </Button>
                </Link>
                <h1 className="text-4xl font-black tracking-tight mt-4">ZMCS Specification</h1>
                <p className="text-xl text-muted-foreground mt-2">
                    The Zakat Methodology Configuration Standard (ZMCS) is the open data format powering ZakatFlow.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
                <div className="space-y-8">

                    {/* Section 1: Introduction */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Database className="w-6 h-6 text-primary" />
                            What is ZMCS?
                        </h2>
                        <p className="leading-relaxed">
                            Zakat calculations define <strong>what</strong> assets are taxable, at <strong>what</strong> rate, and which deductions apply.
                            Historically, these rules were hardcoded into calculators, forcing users into a "black box."
                        </p>
                        <p className="leading-relaxed">
                            <strong>ZMCS</strong> treats these rules as <em>data</em>, not code. It is a strictly typed JSON schema that defines every variable in the Zakat equation.
                            This allows us to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>Support multiple Madhahib (Schools of Thought) instantly.</li>
                            <li>Allow scholars to audit specific rule sets without reading code.</li>
                            <li>Enable organizations to publish their own "Gold Standard" configs.</li>
                        </ul>
                    </section>

                    {/* Section 2: Schema Explorer */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Code className="w-6 h-6 text-primary" />
                            Schema Structure
                        </h2>
                        <Tabs defaultValue="assets" className="w-full">
                            <TabsList className="w-full justify-start">
                                <TabsTrigger value="assets">Assets</TabsTrigger>
                                <TabsTrigger value="liabilities">Liabilities</TabsTrigger>
                                <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
                            </TabsList>

                            <TabsContent value="assets" className="mt-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Asset Rules</CardTitle>
                                        <CardDescription>Defines zakatability for wealth categories.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 font-mono text-sm">
                                        <div className="p-4 bg-muted/50 rounded-lg">
                                            <div className="text-blue-500 font-bold">jewelry.zakatable <span className="text-muted-foreground font-normal">: boolean</span></div>
                                            <p className="text-muted-foreground mt-1 mb-3">If true, personal gold/silver jewelry is included.</p>

                                            <div className="text-blue-500 font-bold">retirement.valuation_method <span className="text-muted-foreground font-normal">: enum</span></div>
                                            <p className="text-muted-foreground mt-1 mb-3">
                                                <span className="text-foreground">"total_value"</span>: 100% of balance.<br />
                                                <span className="text-foreground">"accessible_value"</span>: Balance minus taxes/penalties.
                                            </p>

                                            <div className="text-blue-500 font-bold">investments.passive.rate <span className="text-muted-foreground font-normal">: number (0-1)</span></div>
                                            <p className="text-muted-foreground mt-1">Percentage of passive investments subject to Zakat (e.g., 0.3 for 30% rule).</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="liabilities" className="mt-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Liability Rules</CardTitle>
                                        <CardDescription>Defines how debts reduce Zakat.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 font-mono text-sm">
                                        <div className="p-4 bg-muted/50 rounded-lg">
                                            <div className="text-blue-500 font-bold">method <span className="text-muted-foreground font-normal">: enum</span></div>
                                            <p className="text-muted-foreground mt-1">
                                                <span className="text-foreground">"no_deduction"</span>: Debts do not reduce wealth (Shafi'i).<br />
                                                <span className="text-foreground">"deduct_all_debts"</span>: All debts are deductible (Hanafi).<br />
                                                <span className="text-foreground">"deduct_immediate_only"</span>: Only bills due now.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="thresholds" className="mt-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Thresholds</CardTitle>
                                        <CardDescription>Base constants for calculation.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 font-mono text-sm">
                                        <div className="p-4 bg-muted/50 rounded-lg">
                                            <div className="text-blue-500 font-bold">nisab.default_standard <span className="text-muted-foreground font-normal">: "gold" | "silver"</span></div>
                                            <p className="text-muted-foreground mt-1 mb-3">Which metal sets the minimum threshold (Silver is safer/lower).</p>

                                            <div className="text-blue-500 font-bold">zakat_rate.lunar <span className="text-muted-foreground font-normal">: number</span></div>
                                            <p className="text-muted-foreground mt-1">Standard 0.025 (2.5%).</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </section>

                    {/* Section 3: Live Presets */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <ShieldCheck className="w-6 h-6 text-primary" />
                            Official Presets
                        </h2>
                        <p>These are the standard configurations currently loaded in the ZakatFlow engine.</p>

                        <div className="grid gap-4 md:grid-cols-2">
                            {Object.entries(ZAKAT_PRESETS).map(([id, config]) => (
                                <Card key={id} className="border-l-4 border-l-primary/50">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg">{config.meta.name}</CardTitle>
                                        <CardDescription>ID: <code className="text-xs bg-muted px-1 py-0.5 rounded">{id}</code></CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground mb-4">{config.meta.description}</p>
                                        <div className="text-xs space-y-1">
                                            <div className="flex justify-between">
                                                <span>Jewelry:</span>
                                                <span className="font-medium">{config.assets.precious_metals.jewelry.zakatable ? "Zakatable" : "Exempt"}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Debt Deduction:</span>
                                                <span className="font-medium">{config.liabilities.method.replace(/_/g, ' ')}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>401k Val:</span>
                                                <span className="font-medium">{config.assets.retirement.zakatability === 'net_accessible' ? "Net Accessible" : config.assets.retirement.zakatability === 'exempt' ? "Exempt" : "Full Value"}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        {/* Section 4: Sample Configuration */}
                    <section className="space-y-4">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <FileText className="w-6 h-6 text-primary" />
                                Sample Configuration
                            </h2>
                            <p>Below is the actual JSON configuration for the <strong>Balanced (Sheikh Joe Bradford)</strong> methodology used in ZakatFlow.</p>

                            <div className="relative">
                                <div className="absolute right-4 top-4">
                                    <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(JSON.stringify(ZAKAT_PRESETS['balanced'], null, 2))}>
                                        Copy JSON
                                    </Button>
                                </div>
                                <ScrollArea className="h-[500px] w-full rounded-md border bg-muted/50 p-4">
                                    <pre className="text-xs font-mono leading-relaxed">
                                        {JSON.stringify(ZAKAT_PRESETS['balanced'], null, 2)}
                                    </pre>
                                </ScrollArea>
                            </div>
                    </section>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <FileText className="w-5 h-5" />
                                Resources
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Link to="/methodology/zmcs/contributing">
                                <Button variant="outline" className="w-full justify-start">
                                    <Code className="w-4 h-4 mr-2" />
                                    Contributor Guide
                                </Button>
                            </Link>
                            <Button variant="outline" className="w-full justify-start" disabled>
                                <Database className="w-4 h-4 mr-2" />
                                Download Schema (JSON)
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
                        <p className="font-bold text-foreground mb-1">Version Info</p>
                        <p>ZMCS Standard: v1.0</p>
                        <p>Engine Build: 2.1.0</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
