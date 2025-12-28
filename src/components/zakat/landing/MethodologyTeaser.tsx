import { BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function MethodologyTeaser() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/20 p-6 md:p-8">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-primary" />
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Grounded in Scholarship
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Our methodology synthesizes guidance from leading Islamic finance authorities: Sheikh Joe Bradford's 
                "Simple Zakat Guide", AMJA (Assembly of Muslim Jurists of America) fatwas, Zakat.fyi resources, 
                Islamic Finance Guru, and AAOIFI Shariah Standard 35.
              </p>
              <Link to="/methodology">
                <Button variant="outline" size="sm" className="gap-2">
                  Read Our Methodology
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
