
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Code, FileText, Database, ShieldCheck } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { ZAKAT_PRESETS } from "@/lib/config/presets";
import { ZMCS_DOCS } from "@/content/zmcs-docs";

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
                            Configuration Reference
                        </h2>
                        <p className="text-muted-foreground">
                            Explore the complete list of parameters available in the ZMCS standard.
                            These controls allow precise tuning of the engine to match any valid juristic opinion.
                        </p>

                        <Tabs defaultValue="assets" className="w-full">
                            <TabsList className="w-full justify-start h-auto flex-wrap gap-2 bg-transparent p-0">
                                {ZMCS_DOCS.map((section) => (
                                    <TabsTrigger
                                        key={section.id}
                                        value={section.id}
                                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-background px-4 py-2"
                                    >
                                        {section.title}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            {ZMCS_DOCS.map((section) => (
                                <TabsContent key={section.id} value={section.id} className="mt-6 animate-in fade-in slide-in-from-top-2">
                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center gap-3">
                                                {/* Requires Lucide icon component mapping or passing generic icon */}
                                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                    {/* We can dynamically render the icon if passed correctly, or skip for now */}
                                                    <Database className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <CardTitle>{section.title} Schema</CardTitle>
                                                    <CardDescription>{section.description}</CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="divide-y relative">
                                            {section.fields.map((field, idx) => (
                                                <div key={idx} className="py-6 first:pt-0 last:pb-0 grid md:grid-cols-[1fr_2fr] gap-4">
                                                    {/* Left Column: Field Identity */}
                                                    <div className="space-y-2">
                                                        <div className="font-mono text-sm font-bold text-primary break-all">
                                                            {field.path}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] uppercase tracking-wider font-semibold bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                                                                {field.type}
                                                            </span>
                                                            {field.required ? (
                                                                <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded">
                                                                    Required
                                                                </span>
                                                            ) : (
                                                                <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/50 border px-1.5 py-0.5 rounded">
                                                                    Optional
                                                                </span>
                                                            )}
                                                        </div>
                                                        {field.default && (
                                                            <div className="text-xs text-muted-foreground">
                                                                Default: <code className="bg-muted px-1 rounded">{field.default}</code>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Right Column: Description & Options */}
                                                    <div className="space-y-3">
                                                        <p className="text-sm leading-relaxed text-foreground/90">
                                                            {field.description}
                                                        </p>

                                                        {field.options && (
                                                            <div className="bg-muted/30 rounded-md border border-border/50 overflow-hidden">
                                                                <div className="px-3 py-1.5 bg-muted/50 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b">
                                                                    Valid Options
                                                                </div>
                                                                <div className="divide-y divide-border/30">
                                                                    {field.options.map((opt) => (
                                                                        <div key={opt.value} className="px-3 py-2 text-sm grid grid-cols-[auto_1fr] gap-3">
                                                                            <code className="text-primary font-semibold whitespace-nowrap">"{opt.value}"</code>
                                                                            <span className="text-muted-foreground">{opt.label}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            ))}
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
