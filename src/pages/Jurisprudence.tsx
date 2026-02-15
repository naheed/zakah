import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ArticleLayout } from "@/components/layout/ArticleLayout";
import { Text } from "@/components/ui/typography";

const tocItems = [
    { id: "intro", number: 1, label: "Introduction" },
    { id: "hanafi", number: 2, label: "The Hanafi School" },
    { id: "maliki", number: 3, label: "The Maliki School" },
    { id: "shafii", number: 4, label: "The Shafi'i School" },
    { id: "contemporary", number: 5, label: "Contemporary Applications" },
];

export default function Jurisprudence() {
    const headerContent = (
        <Text variant="lead">
            A diachronic and synchronic analysis of Zakat methodologies across the four canonical Sunni schools.
        </Text>
    );

    return (
        <ArticleLayout
            title="The Jurisprudence of Zakat"
            description="Comprehensive analysis of Zakat rulings across four Sunni schools (Hanafi, Shafi'i, Maliki, Hanbali) with contemporary applications for 401(k), crypto, and stocks."
            urlPath="/jurisprudence"
            tocItems={tocItems}
            headerContent={headerContent}
        >
            {/* 1. Introduction */}
            <ScrollReveal>
                <section id="intro" className="space-y-6 scroll-mt-24">
                    <h2 className="text-2xl font-serif font-medium">1. Introduction: The Framework</h2>
                    <p className="leading-relaxed text-muted-foreground">
                        The study of Zakat (obligatory almsgiving) represents a sophisticated intersection of theology, law, sociology, and economics. Unlike voluntary charity (Sadaqah), Zakat is a codified fiscal obligation characterized by precise thresholds (Nisab) and defined cycles (Hawl).
                    </p>
                    <p className="leading-relaxed text-muted-foreground">
                        This reference provides an analysis anchored in the primary texts of the four canonical Sunni schools:
                    </p>

                    <div className="rounded-lg border overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">School</th>
                                    <th className="px-4 py-3 text-left font-medium">Primary Text</th>
                                    <th className="px-4 py-3 text-left font-medium">Author</th>
                                    <th className="px-4 py-3 text-left font-medium">Era</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                <tr>
                                    <td className="px-4 py-3 font-medium">Hanafi</td>
                                    <td className="px-4 py-3 text-muted-foreground">Al-Hidayah</td>
                                    <td className="px-4 py-3 text-muted-foreground">Al-Marghinani</td>
                                    <td className="px-4 py-3 text-muted-foreground">d. 1197 CE</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium">Maliki</td>
                                    <td className="px-4 py-3 text-muted-foreground">Mukhtasar Khalil</td>
                                    <td className="px-4 py-3 text-muted-foreground">Khalil ibn Ishaq</td>
                                    <td className="px-4 py-3 text-muted-foreground">d. 1374 CE</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium">Shafi'i</td>
                                    <td className="px-4 py-3 text-muted-foreground">Al-Majmu'</td>
                                    <td className="px-4 py-3 text-muted-foreground">Al-Nawawi</td>
                                    <td className="px-4 py-3 text-muted-foreground">d. 1277 CE</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium">Hanbali</td>
                                    <td className="px-4 py-3 text-muted-foreground">Al-Mughni</td>
                                    <td className="px-4 py-3 text-muted-foreground">Ibn Qudamah</td>
                                    <td className="px-4 py-3 text-muted-foreground">d. 1223 CE</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </ScrollReveal>

            {/* 2. Hanafi School */}
            <ScrollReveal>
                <section id="hanafi" className="space-y-6 scroll-mt-24">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-serif font-medium">2. The Hanafi School</h2>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-success-container text-on-success-container">Rationalism</span>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-foreground">Debt Logic</h3>
                        <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-success">
                            <p className="italic text-muted-foreground mb-2">"Dayn yamna' wujub al-Zakat"</p>
                            <p className="font-medium">Debt prevents the obligation of Zakat.</p>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Originating in Kufa's trade centers, the Hanafi school views Zakat as a tax on "surplus" wealth. If you owe money, your ownership is considered "defective" because creditor rights are attached to it.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            <strong>Modern Application (12-Month Rule):</strong> Classical application would exempt millionaires with large mortgages. Contemporary scholars (AAOIFI, Mufti Taqi Usmani) restrict this deduction to payments due within the coming lunar year only.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-foreground">Jewelry</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            The Hanafi position is that gold/silver jewelry is <strong>zakatable</strong> regardless of use. This pragmatically taxes the substance (gold) rather than the form, preventing hoarding loopholes.
                        </p>
                    </div>
                </section>
            </ScrollReveal>

            {/* 3. Maliki School */}
            <ScrollReveal>
                <section id="maliki" className="space-y-6 scroll-mt-24">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-serif font-medium">3. The Maliki School</h2>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary-container text-on-primary-container">Economic Velocity</span>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-foreground">Mudir vs. Muhtakir (Unique to Maliki)</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            This school distinguishes traders based on the velocity of their transactions:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                            <li>
                                <strong className="text-foreground">Mudir (Active Trader):</strong> Buys and sells continuously (retailers, day traders). Valued annually.
                            </li>
                            <li>
                                <strong className="text-foreground">Muhtakir (Speculator):</strong> Holds goods for appreciation (real estate investors). Zakat is paid <strong>only upon sale</strong> for one year, preventing distress sales for illiquid assets.
                            </li>
                        </ul>
                    </div>
                </section>
            </ScrollReveal>

            {/* 4. Shafi'i School */}
            <ScrollReveal>
                <section id="shafii" className="space-y-6 scroll-mt-24">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-serif font-medium">4. The Shafi'i School</h2>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-tertiary-container text-on-tertiary-container">Systematic Theology</span>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-foreground">Absolute Liability</h3>
                        <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-tertiary">
                            <p className="font-medium">Debt does NOT prevent Zakat.</p>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Zakat is viewed as a claim on the wealth itself, not the person. Just as a mortgage doesn't prevent prayer, debt doesn't prevent Zakat. This represents the "Gross Asset" tax model.
                        </p>
                    </div>
                </section>
            </ScrollReveal>

            {/* 5. Contemporary Applications */}
            <ScrollReveal>
                <section id="contemporary" className="space-y-6 scroll-mt-24">
                    <h2 className="text-2xl font-serif font-medium">5. Contemporary Applications</h2>

                    <div className="space-y-6">
                        {/* Retirement */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-medium text-foreground">Retirement Accounts (401k/IRA)</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Retirement funds represent wealth that is technically owned but practically inaccessible. ZakatFlow implements the <strong>Net Accessible Value</strong> approach (endorsed by AMJA Fatwa #77832):
                            </p>
                            <div className="p-4 bg-muted text-sm font-mono rounded">
                                Net Accessible = Vested Balance × (1 - Tax Rate - 10% Penalty)
                            </div>
                        </div>

                        {/* Crypto */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-medium text-foreground">Cryptocurrency</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                <strong>Payment Tokens (BTC/ETH):</strong> Treated as currency. Fully zakatable at market value.
                                <br />
                                <strong>Utility NFTs:</strong> Generally exempt if used for access/membership, not speculation.
                            </p>
                        </div>

                        {/* Passive Investments */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-medium text-foreground">Passive Investments (The 30% Rule)</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                For passive investors in ETFs/Index Funds where calculating specific zakatable assets (cash/receivables) inside the companies is impossible, AAOIFI allows using a <strong>30% proxy</strong> (approximate weight of liquid assets in global equities).
                            </p>
                            <p className="text-sm text-muted-foreground italic">
                                Note: Traditional madhabs (and our non-Balanced modes) generally require 100% market valuation if specific financial data is unavailable.
                            </p>
                        </div>
                    </div>
                </section>
            </ScrollReveal>
        </ArticleLayout>
    );
}
