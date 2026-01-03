import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { List, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { useIsMobile } from "@/hooks/use-mobile";

interface TocItem {
  id: string;
  label: string;
  number?: number;
}

interface FloatingTocProps {
  items: TocItem[];
  className?: string;
}

export function FloatingToc({ items, className }: FloatingTocProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showFab, setShowFab] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      // Show FAB after scrolling past header
      setShowFab(window.scrollY > 300);

      // Track active section
      const sections = items.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveId(items[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {showFab && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={cn("fixed bottom-6 right-6 z-40", className)}
          >
            <Button
              size="icon"
              variant="default"
              className="h-12 w-12 md:h-14 md:w-14 rounded-full shadow-lg"
              onClick={() => setIsOpen(!isOpen)}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X weight="bold" className="h-5 w-5 md:h-6 md:w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <List weight="bold" className="h-5 w-5 md:h-6 md:w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOC Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel - Mobile: bottom sheet, Desktop: floating panel */}
            <motion.div
              initial={isMobile ? { opacity: 0, y: 100 } : { opacity: 0, y: 20, scale: 0.95 }}
              animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, scale: 1 }}
              exit={isMobile ? { opacity: 0, y: 100 } : { opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={cn(
                "fixed z-50 bg-surface-container border border-border shadow-xl overflow-hidden",
                isMobile 
                  ? "bottom-0 left-0 right-0 rounded-t-2xl max-h-[50vh]" 
                  : "bottom-24 right-6 w-72 max-h-[60vh] rounded-2xl"
              )}
            >
              {/* Drag indicator for mobile */}
              {isMobile && (
                <div className="flex justify-center py-2">
                  <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
                </div>
              )}
              
              <div className={cn("p-4 overflow-y-auto", isMobile ? "max-h-[calc(50vh-24px)]" : "max-h-[60vh]")}>
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Table of Contents
                </h3>
                <nav className={cn("space-y-1", isMobile && "pb-safe")}>
                  {items.map((item, index) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => scrollToSection(item.id)}
                      className={cn(
                        "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors",
                        "flex items-center gap-2 min-h-[44px]",
                        activeId === item.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50 active:bg-muted"
                      )}
                    >
                      {item.number !== undefined && (
                        <span
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0",
                            activeId === item.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {item.number}
                        </span>
                      )}
                      <span className="truncate">{item.label}</span>
                    </motion.button>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
