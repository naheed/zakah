import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowSquareOut, Globe, Users, Lightbulb, HandHeart, CaretDown } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/zakatCalculations";

interface Charity {
  id: string;
  name: string;
  category: string;
  icon: typeof Globe;
  accentColor: string;
  description: string;
  donateUrl: string;
  websiteUrl: string;
}

const charities: Charity[] = [
  {
    id: "islamic-relief",
    name: "Islamic Relief USA",
    category: "Global Humanitarian Aid",
    icon: Globe,
    accentColor: "hsl(142, 60%, 40%)", // Green
    description: "One of the largest Islamic humanitarian organizations, providing emergency relief, sustainable development, and orphan sponsorship in over 40 countries worldwide.",
    donateUrl: "https://irusa.org/zakat/",
    websiteUrl: "https://irusa.org",
  },
  {
    id: "icna-relief",
    name: "ICNA Relief",
    category: "Domestic & International Aid",
    icon: Users,
    accentColor: "hsl(220, 70%, 50%)", // Blue
    description: "Provides disaster relief, hunger prevention, refugee assistance, and women's transitional housing across the United States and internationally.",
    donateUrl: "https://icnarelief.org/donate/",
    websiteUrl: "https://icnarelief.org",
  },
  {
    id: "zakat-foundation",
    name: "Zakat Foundation of America",
    category: "Zakat Distribution",
    icon: HandHeart,
    accentColor: "hsl(45, 90%, 45%)", // Gold
    description: "Dedicated exclusively to Zakat distribution, helping those in need through emergency aid, education, healthcare, and economic empowerment programs.",
    donateUrl: "https://secure.zakat.org/np/clients/zakat/donation.jsp",
    websiteUrl: "https://www.zakat.org",
  },
  {
    id: "givelight",
    name: "GiveLight Foundation",
    category: "Orphan Care & Education",
    icon: Lightbulb,
    accentColor: "hsl(280, 60%, 50%)", // Purple
    description: "Focuses on orphan care, education, and sustainable community development, providing holistic support to vulnerable children and families.",
    donateUrl: "https://givelight.org/donate/",
    websiteUrl: "https://givelight.org",
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
      <p className="text-sm text-muted-foreground">
        These trusted organizations distribute Zakat to eligible recipients according to Islamic guidelines.
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
                "group border rounded-xl transition-all overflow-hidden",
                isExpanded 
                  ? "border-primary/30 bg-gradient-to-br from-primary/5 to-transparent shadow-sm" 
                  : "border-border bg-card hover:border-primary/20 hover:shadow-sm"
              )}
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : charity.id)}
                className="w-full p-4 flex items-center gap-3 text-left"
              >
                <div 
                  className="p-2.5 rounded-xl shrink-0 transition-all"
                  style={{ 
                    backgroundColor: isExpanded ? `${charity.accentColor}20` : 'hsl(var(--muted))',
                  }}
                >
                  <Icon 
                    weight="duotone" 
                    className="w-5 h-5 transition-colors"
                    style={{ color: isExpanded ? charity.accentColor : 'hsl(var(--muted-foreground))' }}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-foreground">{charity.name}</span>
                  <p className="text-sm text-muted-foreground">{charity.category}</p>
                </div>

                <CaretDown 
                  weight="bold" 
                  className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform shrink-0",
                    isExpanded && "rotate-180"
                  )} 
                />
              </button>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4">
                      <p className="text-sm text-muted-foreground mb-4 ml-12">
                        {charity.description}
                      </p>
                      <div className="ml-12 flex flex-wrap gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          className="gap-2"
                          style={{ 
                            backgroundColor: charity.accentColor,
                            borderColor: charity.accentColor 
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(charity.donateUrl, "_blank", "noopener,noreferrer");
                          }}
                        >
                          Donate {formatCurrency(zakatDue, currency)}
                          <ArrowSquareOut weight="bold" className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(charity.websiteUrl, "_blank", "noopener,noreferrer");
                          }}
                        >
                          Visit Website
                          <ArrowSquareOut weight="bold" className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
