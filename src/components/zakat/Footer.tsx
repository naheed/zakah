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
      </div>
    </footer>
  );
}
