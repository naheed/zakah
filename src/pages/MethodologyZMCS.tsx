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

import { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { Code, FileText, Database, ShieldCheck, Copy, Check, CaretRight, CheckCircle, WarningCircle, Users, GitBranch } from "@phosphor-icons/react";
import { Link, useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ZAKAT_PRESETS } from "@/lib/config/presets";
import { ZMCS_TEMPLATE } from "@/content/config-template";
import { ZMCS_DOCS, ZMCSField } from "@/content/zmcs-docs";
import { ArticleLayout } from "@/components/layout/ArticleLayout";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

const tocItems = [
    { id: "what-is-zmcs", number: 1, label: "What is ZMCS?" },
    { id: "registry", number: 2, label: "Methodology Registry" },
    { id: "config-reference", number: 3, label: "Configuration Reference" },
    { id: "presets", number: 4, label: "Explorer & JSON" },
];

// ─── Type badge config ───────────────────────────────────────────────────────
const TYPE_STYLES: Record<string, { label: string; className: string }> = {
    string: { label: "STRING", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
    "string (url)": { label: "URL", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
    boolean: { label: "BOOL", className: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300" },
    number: { label: "NUM", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
    "number (0-1)": { label: "RATE", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
    enum: { label: "ENUM", className: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300" },
};

// ─── Split a dot path into breadcrumb + leaf ─────────────────────────────────
function FieldPath({ path }: { path: string }) {
    const parts = path.split(".");
    const leaf = parts.pop()!;
    const breadcrumb = parts.join(" › ");

    return (
        <div className="font-mono text-sm">
            {breadcrumb && (
                <span className="text-muted-foreground/50 text-xs">
                    {breadcrumb}
                    <span className="mx-0.5">›</span>
                </span>
            )}
            <span className="font-semibold text-primary">{leaf}</span>
        </div>
    );
}

// ─── Single field row (stacked layout) ───────────────────────────────────────
function FieldRow({ field }: { field: ZMCSField }) {
    const typeStyle = TYPE_STYLES[field.type] || { label: field.type.toUpperCase(), className: "bg-muted text-muted-foreground" };

    return (
        <div className="py-5 first:pt-0 last:pb-0 space-y-2.5">
            {/* Row 1: Path */}
            <FieldPath path={field.path} />

            {/* Row 2: Type + Required + Default — inline metadata */}
            <div className="flex items-center gap-2 flex-wrap">
                <span className={cn("text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded", typeStyle.className)}>
                    {typeStyle.label}
                </span>
                {field.required ? (
                    <span className="text-[10px] uppercase tracking-wider font-bold text-primary">
                        required
                    </span>
                ) : (
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground/40">
                        optional
                    </span>
                )}
                {field.default && (
                    <>
                        <span className="text-muted-foreground/30">·</span>
                        <span className="text-xs text-muted-foreground">
                            Default: <code className="bg-muted px-1 py-0.5 rounded text-[11px]">{field.default}</code>
                        </span>
                    </>
                )}
            </div>

            {/* Row 3: Description — full width for readability */}
            <p className="text-sm leading-relaxed text-foreground/80">
                {field.description}
            </p>

            {/* Row 4: Enum options (if any) */}
            {field.options && (
                <div className="mt-1 rounded-lg border border-border/60 overflow-hidden bg-muted/20">
                    {field.options.map((opt, i) => (
                        <div
                            key={opt.value}
                            className={cn(
                                "flex gap-3 px-3 py-2.5 text-sm",
                                i > 0 && "border-t border-border/40"
                            )}
                        >
                            <code className="text-primary font-semibold whitespace-nowrap shrink-0 text-xs pt-0.5">
                                "{opt.value}"
                            </code>
                            <span className="text-muted-foreground text-[13px] leading-relaxed">{opt.label}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Row 5: Help text cross-reference */}
            {field.helpText && (
                <p className="text-xs text-muted-foreground/60 italic">
                    💡 Calculator tooltip: <code className="bg-muted px-1 py-0.5 rounded text-[10px] not-italic">{field.helpText}</code>
                </p>
            )}
        </div>
    );
}

// ─── Group fields by their group property ────────────────────────────────────
function GroupedFields({ fields }: { fields: ZMCSField[] }) {
    // Collect fields into ordered groups
    const groups: { name: string; icon?: ZMCSField["groupIcon"]; fields: ZMCSField[] }[] = [];

    fields.forEach((field) => {
        const groupName = field.group || "General";
        const existing = groups.find((g) => g.name === groupName);
        if (existing) {
            existing.fields.push(field);
        } else {
            groups.push({ name: groupName, icon: field.groupIcon, fields: [field] });
        }
    });

    // If only one group (e.g., Metadata), skip the group headers
    if (groups.length <= 1) {
        return (
            <div className="divide-y divide-border/50">
                {fields.map((field, idx) => (
                    <FieldRow key={idx} field={field} />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {groups.map((group) => (
                <div key={group.name}>
                    {/* Sub-group header */}
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-primary/15">
                        {group.icon && (
                            <div className="p-1.5 rounded-md bg-primary/8">
                                <group.icon className="w-4 h-4 text-primary" weight="duotone" />
                            </div>
                        )}
                        <h4 className="text-xs font-bold uppercase tracking-wider text-primary/70">
                            {group.name}
                        </h4>
                        <span className="text-[10px] text-muted-foreground/50 ml-auto">
                            {group.fields.length} {group.fields.length === 1 ? "param" : "params"}
                        </span>
                    </div>
                    {/* Fields in this group */}
                    <div className="divide-y divide-border/40 pl-2 border-l-2 border-primary/10">
                        {group.fields.map((field, idx) => (
                            <FieldRow key={idx} field={field} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ... existing imports

export function MethodologyZMCS() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [copied, setCopied] = useState(false);

    // Get preset from URL or default to 'bradford'
    const presetParam = searchParams.get("preset");
    const selectedPreset = (presetParam && ZAKAT_PRESETS[presetParam]) ? presetParam : "bradford";
    const selectedConfig = ZAKAT_PRESETS[selectedPreset];

    // Scroll to section if hash is present (handling hydration timing)
    useEffect(() => {
        if (window.location.hash) {
            const id = window.location.hash.replace("#", "");
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth" });
                }, 100);
            }
        }
    }, [location.hash]); // Re-run if hash changes

    const setSelectedPreset = (presetId: string) => {
        setSearchParams({ preset: presetId }, { replace: true });
    };

    const handleCopy = () => {
        // Copy the current URL with the preset param and hash
        const urlArgs = new URLSearchParams();
        urlArgs.set("preset", selectedPreset);
        const url = `${window.location.origin}${window.location.pathname}?${urlArgs.toString()}#presets`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadTemplate = () => {
        const jsonString = JSON.stringify(ZMCS_TEMPLATE, null, 2);
        const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
        saveAs(blob, "zmcs-v2.template.json");
    };

    const headerContent = (
        <div className="space-y-4">
            <Text variant="lead">
                The Zakat Methodology Configuration Standard (ZMCS) is the open data format powering ZakatFlow.
            </Text>
            <div className="flex flex-wrap gap-3">
                <Link to="/methodology/zmcs/contributing">
                    <Button variant="outline" className="gap-2">
                        <Code className="w-4 h-4" />
                        Contributor Guide
                    </Button>
                </Link>

                <Button variant="outline" className="gap-2" onClick={handleDownloadTemplate}>
                    <Database className="w-4 h-4" />
                    Download Schema (JSON)
                </Button>
            </div >
            <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
                <p className="font-bold text-foreground mb-1">Version Info</p>
                <p>ZMCS Standard: v1.0</p>
                <p>Engine Build: 2.1.0</p>
            </div>
        </div >
    );

    return (
        <ArticleLayout
            title="ZMCS Specification"
            description="The Zakat Methodology Configuration Standard — the open JSON schema powering ZakatFlow's multi-madhab calculation engine."
            urlPath="/methodology/zmcs"
            tocItems={tocItems}
            headerContent={headerContent}
        >
            {/* Section 1: Introduction */}
            <section id="what-is-zmcs" className="space-y-4 scroll-mt-24">
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
                </ul>
            </section>

            {/* Section 2: Methodology Registry */}
            <section id="registry" className="space-y-6 scroll-mt-24">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                    Methodology Registry
                </h2>
                <p className="text-muted-foreground">
                    ZakatFlow maintains a curated registry of verified ZMCS configurations. These presets are tested against thousands of edge cases to ensure compliance with their source texts.
                </p>

                <Card>
                    <CardHeader>
                        <CardTitle>Official Calculation Standards</CardTitle>
                        <CardDescription>
                            Presets maintained by the ZakatFlow team based on authoritative scholarly sources.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Methodology</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Author / Source</TableHead>
                                        <TableHead className="text-right">Version</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Object.values(ZAKAT_PRESETS)
                                        .sort((a, b) => (a.meta.tier === 'official' && b.meta.tier !== 'official') ? -1 : 1)
                                        .map((preset) => (
                                            <TableRow key={preset.meta.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex flex-col">
                                                        <span>{preset.meta.name}</span>
                                                        <span className="text-xs text-muted-foreground sr-only">{preset.meta.description}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {preset.meta.tier === 'official' ? (
                                                        <Badge variant="default" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 flex w-fit gap-1 items-center pl-1 pr-2">
                                                            <CheckCircle weight="fill" className="w-3.5 h-3.5" /> Official
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="flex w-fit gap-1 items-center pl-1 pr-2">
                                                            <Users weight="duotone" className="w-3.5 h-3.5" /> Community
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {preset.meta.author}
                                                    {preset.meta.reference && (
                                                        <div className="flex items-center gap-1 mt-0.5 text-xs text-primary">
                                                            <ShieldCheck weight="fill" className="w-3 h-3" />
                                                            Scholarly Source
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right font-mono text-xs text-muted-foreground">
                                                    v{preset.meta.version}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <div className="p-4 bg-muted/30 rounded-lg border border-border flex gap-4 items-start mt-4">
                    <div className="p-2 bg-primary/10 rounded-full text-primary shrink-0">
                        <GitBranch size={24} weight="duotone" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm">Future Proofing & Contributions</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                            The ZMCS standard is designed to be extensible. New Madhab opinions or modern fatwas (e.g., regarding crypto staking or DeFi yields) can be added as new configuration files without changing the core calculator engine code.
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            To contribute a preset, please submit a Pull Request to our <a href="#" className="text-primary hover:underline">GitHub repository</a> with the requisite scholarly citations.
                        </p>
                    </div>
                </div>
            </section>

            {/* Section 3: Configuration Reference */}
            <section id="config-reference" className="space-y-6 scroll-mt-24">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Code className="w-6 h-6 text-primary" />
                    Configuration Reference
                </h2>
                <p className="text-muted-foreground">
                    Explore the complete list of parameters available in the ZMCS standard.
                    These controls allow precise tuning of the engine to match any valid juristic opinion.
                </p>

                <Tabs defaultValue="assets" className="w-full">
                    <TabsList className="w-full justify-start h-auto flex-wrap gap-2 bg-transparent p-0 overflow-x-auto">
                        {ZMCS_DOCS.map((section) => (
                            <TabsTrigger
                                key={section.id}
                                value={section.id}
                                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-background px-4 py-2 shrink-0"
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
                                        <div className="p-2 rounded-lg bg-primary-container text-on-primary-container">
                                            {section.icon && <section.icon className="w-5 h-5" weight="fill" />}
                                        </div>
                                        <div>
                                            <CardTitle>{section.title} Schema</CardTitle>
                                            <CardDescription>{section.description}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <GroupedFields fields={section.fields} />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    ))}
                </Tabs>
            </section>

            {/* Section 4: Preset Explorer */}
            <section id="presets" className="space-y-6 scroll-mt-24">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                    Preset Explorer
                </h2>
                <p className="text-muted-foreground">
                    Select a methodology to view its full JSON configuration. These are the standard configs loaded in the ZakatFlow engine.
                </p>

                {/* Compact preset chip selector */}
                <div className="flex flex-wrap gap-2">
                    {Object.entries(ZAKAT_PRESETS).map(([id, config]) => {
                        const isSelected = selectedPreset === id;
                        return (
                            <button
                                key={id}
                                onClick={() => setSelectedPreset(id)}
                                className={cn(
                                    "px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                                    isSelected
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50"
                                )}
                            >
                                {config.meta.name}
                            </button>
                        );
                    })}
                </div>

                {/* Expanded detail panel for selected preset */}
                <Card className="animate-in fade-in slide-in-from-top-1 duration-200">
                    <CardContent className="pt-5 pb-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1 min-w-0">
                                <h3 className="font-bold text-lg leading-tight">{selectedConfig.meta.name}</h3>
                                <code className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{selectedPreset}</code>
                            </div>
                            <div className="shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                <Check className="w-3.5 h-3.5 text-primary-foreground" weight="bold" />
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {selectedConfig.meta.description}
                        </p>
                        {selectedConfig.meta.tooltip && (
                            <div className="flex gap-2 items-start p-2 bg-muted/40 rounded text-xs text-muted-foreground border border-border/50">
                                <span className="shrink-0 font-bold uppercase tracking-wider text-[10px] pt-0.5 text-primary/70">Tooltip:</span>
                                <span>{selectedConfig.meta.tooltip}</span>
                            </div>
                        )}
                        {/* Quick comparison stats */}
                        <div className="pt-2 border-t border-border/40 grid grid-cols-3 gap-4 text-xs">
                            <div>
                                <span className="text-muted-foreground/60">Jewelry</span>
                                <p className="font-semibold mt-0.5">{selectedConfig.assets.precious_metals.jewelry.zakatable ? "Zakatable" : "Exempt"}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground/60">Debt Method</span>
                                <p className="font-semibold mt-0.5">{selectedConfig.liabilities.method.replace(/_/g, ' ')}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground/60">401k</span>
                                <p className="font-semibold mt-0.5">
                                    {selectedConfig.assets.retirement.zakatability === 'net_accessible' ? "Net accessible" :
                                        selectedConfig.assets.retirement.zakatability === 'exempt' ? "Exempt" :
                                            selectedConfig.assets.retirement.zakatability === 'full' ? "Full balance" :
                                                selectedConfig.assets.retirement.zakatability.replace(/_/g, ' ')}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* JSON viewer — immediately visible below detail panel */}
                <div className="relative">
                    <div className="flex items-center justify-between px-4 py-3 bg-muted/70 rounded-t-lg border border-b-0 border-border/60">
                        <div className="flex items-center gap-2 text-sm">
                            <FileText className="w-4 h-4 text-primary" />
                            <span className="font-medium">{selectedConfig.meta.name}</span>
                            <CaretRight className="w-3 h-3 text-muted-foreground/50" />
                            <code className="text-xs text-muted-foreground">{selectedPreset}.json</code>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    navigator.clipboard.writeText(JSON.stringify(selectedConfig, null, 2));
                                }}
                                className="gap-1.5 h-7 text-xs text-muted-foreground hover:text-foreground"
                            >
                                <Code className="w-3.5 h-3.5" />
                                JSON
                            </Button>
                            <div className="w-px h-4 bg-border/50 self-center" />
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopy}
                            className="gap-1.5 h-7 text-xs"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-3.5 h-3.5" />
                                    Copied
                                </>
                            ) : (
                                <>
                                    <Copy className="w-3.5 h-3.5" />
                                    Copy Link
                                </>
                            )}
                        </Button>
                    </div>
                    <ScrollArea className="h-[500px] w-full rounded-b-lg border border-border/60 bg-muted/20 p-4">
                        <pre className="text-xs font-mono leading-relaxed text-foreground/90">
                            {JSON.stringify(selectedConfig, null, 2)}
                        </pre>
                    </ScrollArea>
                </div>
            </section>
        </ArticleLayout >
    );
}
