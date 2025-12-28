import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export function MethodologyTeaser() {
  return (
    <section className="py-6 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="w-4 h-4 text-primary flex-shrink-0" />
          <span>
            Based on AMJA, AAOIFI, Sheikh Joe Bradford & Islamic Finance Guru
          </span>
          <span className="text-muted-foreground/50">•</span>
          <Link 
            to="/methodology" 
            className="text-primary hover:underline whitespace-nowrap"
          >
            Read methodology
          </Link>
        </div>
      </div>
    </section>
  );
}
