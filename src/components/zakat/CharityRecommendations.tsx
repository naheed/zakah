import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ArrowSquareOut, Buildings, Users, Stethoscope, GraduationCap, Globe } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/zakatCalculations";

interface Charity {
  id: string;
  name: string;
  category: string;
  icon: typeof Heart;
  description: string;
  url: string;
  zakatEligible: boolean;
}

const charities: Charity[] = [
  {
    id: "icna-relief",
    name: "ICNA Relief",
    category: "Humanitarian",
    icon: Users,
    description: "US-based relief providing food, shelter, and emergency assistance to those in need.",
    url: "https://icnarelief.org/zakat",
    zakatEligible: true,
  },
  {
    id: "islamic-relief",
    name: "Islamic Relief USA",
    category: "Global Aid",
    icon: Globe,
    description: "International humanitarian organization providing emergency relief and development programs.",
    url: "https://irusa.org/zakat",
    zakatEligible: true,
  },
  {
    id: "helping-hand",
    name: "Helping Hand for Relief",
    category: "Humanitarian",
    icon: Heart,
    description: "Disaster relief, hunger prevention, and orphan sponsorship worldwide.",
    url: "https://hhrd.org/zakat",
    zakatEligible: true,
  },
  {
    id: "nzf",
    name: "National Zakat Foundation",
    category: "US Muslims",
    icon: Buildings,
    description: "Distributes Zakat to eligible Muslims in the United States.",
    url: "https://nzfusa.org",
    zakatEligible: true,
  },
  {
    id: "penny-appeal",
    name: "Penny Appeal USA",
    category: "Healthcare",
    icon: Stethoscope,
    description: "Healthcare, education, and emergency response in underserved communities.",
    url: "https://pennyappealusa.org/zakat",
    zakatEligible: true,
  },
  {
    id: "mwf",
    name: "Muslim Welfare Foundation",
    category: "Education",
    icon: GraduationCap,
    description: "Educational support and poverty alleviation programs.",
    url: "https://muslimwelfarefoundation.org",
    zakatEligible: true,
  },
];

interface CharityRecommendationsProps {
  zakatDue: number;
  currency: string;
  className?: string;
}

export function CharityRecommendations({ zakatDue, currency, className }: CharityRecommendationsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (zakatDue <= 0) return null;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2">
        <Heart weight="duotone" className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Where to Give Your Zakat</h3>
      </div>
      
      <p className="text-sm text-muted-foreground">
        These organizations are trusted to distribute Zakat to eligible recipients according to Islamic guidelines.
      </p>

      <div className="grid gap-3">
        {charities.map((charity, index) => {
          const Icon = charity.icon;
          const isExpanded = expandedId === charity.id;
          
          return (
            <motion.div
              key={charity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "group border rounded-xl transition-colors overflow-hidden",
                isExpanded 
                  ? "border-primary/30 bg-primary/5" 
                  : "border-border bg-card hover:border-primary/20"
              )}
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : charity.id)}
                className="w-full p-4 flex items-start gap-3 text-left"
              >
                <div className={cn(
                  "p-2 rounded-lg shrink-0 transition-colors",
                  isExpanded ? "bg-primary/15" : "bg-muted"
                )}>
                  <Icon 
                    weight="duotone" 
                    className={cn(
                      "w-5 h-5",
                      isExpanded ? "text-primary" : "text-muted-foreground"
                    )} 
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{charity.name}</span>
                    {charity.zakatEligible && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-tertiary/15 text-tertiary uppercase tracking-wider">
                        Zakat
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{charity.category}</p>
                </div>
              </button>
              
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4"
                >
                  <p className="text-sm text-muted-foreground mb-4 ml-12">
                    {charity.description}
                  </p>
                  <div className="ml-12 flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="gap-2"
                      onClick={() => window.open(charity.url, "_blank", "noopener,noreferrer")}
                    >
                      Donate {formatCurrency(zakatDue, currency)}
                      <ArrowSquareOut weight="bold" className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(charity.url, "_blank", "noopener,noreferrer")}
                    >
                      Visit Website
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
      
      <p className="text-xs text-muted-foreground text-center pt-2">
        Always verify that your Zakat reaches eligible recipients (the eight categories in Surah At-Tawbah 9:60).
      </p>
    </div>
  );
}
