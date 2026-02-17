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

import { ShieldCheck, Key, GitBranch } from "@phosphor-icons/react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";
import { privacy } from "@/content/marketing";

const TIERS = [
  {
    icon: ShieldCheck,
    title: privacy.managed.title,
    subtitle: privacy.managed.subtitle,
    description: privacy.managed.description,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-500/20",
    border: "border-blue-200 dark:border-blue-500/20",
  },
  {
    icon: Key,
    title: privacy.sovereign.title,
    subtitle: privacy.sovereign.subtitle,
    description: privacy.sovereign.description,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-500/20",
    border: "border-emerald-200 dark:border-emerald-500/20",
  },
];

export function PrivacySection() {
  return (
    <section className="py-16 md:py-24 px-4">
      <ScrollReveal className="text-center mb-12 max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{privacy.heading}</h2>
        <p className="text-muted-foreground">{privacy.subhead}</p>
      </ScrollReveal>

      <StaggerContainer className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6 mb-8">
        {TIERS.map((tier) => (
          <StaggerItem key={tier.title}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`bg-card rounded-2xl border ${tier.border} p-6 h-full flex flex-col shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className={`w-12 h-12 rounded-xl ${tier.bg} flex items-center justify-center mb-4`}>
                <tier.icon className={`w-6 h-6 ${tier.color}`} weight="duotone" />
              </div>
              <h3 className="font-semibold text-lg text-foreground">{tier.title}</h3>
              <p className="text-xs text-muted-foreground font-medium mb-3">{tier.subtitle}</p>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{tier.description}</p>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Open Source badge */}
      <ScrollReveal delay={0.2} className="text-center">
        <a
          href="https://github.com/naheed/zakah"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors"
        >
          <GitBranch className="w-4 h-4" weight="duotone" />
          Open Source (AGPL-3.0) — audit every line of code
        </a>
      </ScrollReveal>
    </section>
  );
}
