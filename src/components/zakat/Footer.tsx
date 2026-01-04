import { Link } from "react-router-dom";

interface FooterProps {
  className?: string;
}

export function Footer({ className = "" }: FooterProps) {
  return (
    <footer className={`py-6 px-4 border-t border-border ${className}`}>
      <div className="max-w-4xl mx-auto">
        {/* Methodology citation + links in one row */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-muted-foreground mb-3">
          <span>Based on AMJA, AAOIFI & Sheikh Joe Bradford</span>
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
        <div className="text-center text-[10px] text-muted-foreground/60 mt-2">
          <span className="inline-flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded font-medium">EARLY ACCESS</span>
            We're actively improving—your data may change as we evolve.
          </span>
        </div>
      </div>
    </footer>
  );
}
