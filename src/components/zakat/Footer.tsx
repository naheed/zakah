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

import { Link } from "react-router-dom";

import { footer } from "@/content/marketing";

interface FooterProps {
  className?: string;
}

export function Footer({ className = "" }: FooterProps) {
  return (
    <footer className={`py-6 px-4 border-t border-border ${className}`}>
      <div className="max-w-4xl mx-auto">
        {/* Methodology citation + links in one row */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-muted-foreground mb-3">
          <span>{footer.methodologyDisclaimer}</span>
          <span className="text-muted-foreground/50">•</span>
          <Link
            to="/methodology"
            className="text-primary hover:underline"
          >
            Methodology
          </Link>
          <span className="text-muted-foreground/50">•</span>
          <Link
            to="/privacy"
            className="text-primary hover:underline"
          >
            Privacy
          </Link>
          <span className="text-muted-foreground/50">•</span>
          <Link
            to="/terms"
            className="text-primary hover:underline"
          >
            Terms
          </Link>
          <span className="text-muted-foreground/50">•</span>
          <Link
            to="/about"
            className="text-primary hover:underline"
          >
            About
          </Link>
        </div>

        {/* Beta Disclaimer */}
        <div className="text-center text-[10px] text-muted-foreground mt-2">
          <span className="inline-flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded font-medium">EARLY ACCESS</span>
            We're actively improving—your data may change as we evolve.
          </span>
        </div>
      </div>
    </footer>
  );
}
