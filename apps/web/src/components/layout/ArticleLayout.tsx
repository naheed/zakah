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

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { Footer } from '@/components/zakat/Footer';
import { ReadingProgress } from '@/components/ui/reading-progress';
import { FloatingToc } from '@/components/ui/floating-toc';
import { getPrimaryUrl } from '@/lib/domainConfig';
import { ArrowLeft } from '@phosphor-icons/react';

interface ArticleLayoutProps {
    title: string;
    description: string;
    urlPath: string;
    tocItems?: { id: string; label: string; number?: number }[];
    children: React.ReactNode;
    headerContent?: React.ReactNode;
    showBackButton?: boolean;
    backLink?: string;
    backLabel?: string;
    hideTitle?: boolean;
}

export const ArticleLayout: React.FC<ArticleLayoutProps> = ({
    title,
    description,
    urlPath,
    tocItems,
    children,
    headerContent,
    showBackButton = true,
    backLink = "/",
    backLabel = "Back to Calculator",
    hideTitle = false,
}) => {
    const navigate = useNavigate();

    return (
        <>
            <Helmet>
                <title>{title} | ZakatFlow</title>
                <meta name="description" content={description} />
                <link rel="canonical" href={getPrimaryUrl(urlPath)} />
                <meta property="og:url" content={getPrimaryUrl(urlPath)} />
            </Helmet>

            <ReadingProgress />
            {tocItems && <FloatingToc items={tocItems} />}

            <div className="min-h-screen bg-background">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    {/* Back Button */}
                    {showBackButton && (
                        <ScrollReveal>
                            <Button
                                variant="ghost"
                                onClick={() => navigate(backLink)}
                                className="mb-8 gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" weight="bold" />
                                {backLabel}
                            </Button>
                        </ScrollReveal>
                    )}

                    {/* Header */}
                    <ScrollReveal delay={0.1}>
                        <header className="mb-12">
                            {!hideTitle && (
                                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-serif">
                                    {title}
                                </h1>
                            )}
                            {headerContent}
                        </header>
                    </ScrollReveal>

                    {/* Main Content */}
                    <main className="space-y-12">
                        {children}
                    </main>

                    {/* CTA Footer in Content */}
                    <ScrollReveal>
                        <div className="mt-16 pt-8 border-t border-border text-center">
                            <Button onClick={() => navigate('/')} className="gap-2">
                                Start Calculating Your Zakat
                                <ArrowLeft className="w-4 h-4 rotate-180" weight="bold" />
                            </Button>
                        </div>
                    </ScrollReveal>
                </div>

                <Footer />
            </div>
        </>
    );
};
