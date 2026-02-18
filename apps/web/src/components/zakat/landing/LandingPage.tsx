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

import { useRef } from "react";
import { HeroSection } from "./HeroSection";
import { StickyHeader } from "./StickyHeader";
import { SocialProofBar } from "./SocialProofBar";
import { SankeyBrandMoment } from "./SankeyBrandMoment";
import { ThreeWaysIn } from "./ThreeWaysIn";
import { WhatsCovered } from "./WhatsCovered";
import { PrivacySection } from "./PrivacySection";
import { FinalCTA } from "./FinalCTA";
import { Footer } from "../Footer";

interface LandingPageProps {
    onNext: () => void;
}

export function LandingPage({ onNext }: LandingPageProps) {
    const ctaRef = useRef<HTMLButtonElement>(null);
    const finalCtaRef = useRef<HTMLDivElement>(null);

    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
            {/* Sticky Header — slides in after Hero CTA scrolls away, hides near FinalCTA */}
            <StickyHeader onNext={onNext} hideWhenVisible={finalCtaRef} />

            {/* Section 1: Hero */}
            <HeroSection onNext={onNext} ctaRef={ctaRef} />

            {/* Section 2: Social Proof */}
            <SocialProofBar />

            {/* Section 3: Sankey Brand Moment (Gray bg) */}
            <div className="bg-muted/30">
                <SankeyBrandMoment />
            </div>

            {/* Section 4: Three Ways In (White bg) */}
            <ThreeWaysIn onNext={onNext} />

            {/* Section 5: What's Covered (Gray bg) */}
            <div className="bg-muted/30">
                <WhatsCovered />
            </div>

            {/* Section 6: Privacy (White bg) */}
            <PrivacySection />

            {/* Section 7: Final CTA */}
            <div ref={finalCtaRef}>
                <FinalCTA onNext={onNext} />
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
