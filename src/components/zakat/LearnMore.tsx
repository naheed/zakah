import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface LearnMoreProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  variant?: "default" | "tip";
}

export function LearnMore({ 
  title, 
  children, 
  defaultOpen = false,
  variant = "default" 
}: LearnMoreProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            "w-full flex items-center justify-between p-4 rounded-lg text-left transition-all",
            variant === "tip" 
              ? "bg-chart-1/10 hover:bg-chart-1/15 border border-chart-1/20"
              : "bg-accent hover:bg-accent/80 border border-border",
            isOpen && "rounded-b-none"
          )}
        >
          <span className={cn(
            "text-sm font-medium",
            variant === "tip" ? "text-chart-1" : "text-foreground"
          )}>
            {variant === "tip" ? "💡 " : "📖 "}
            {title}
          </span>
          <CaretDown 
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180"
            )} 
            weight="bold"
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div 
          className={cn(
            "p-4 rounded-b-lg border border-t-0 text-sm text-muted-foreground leading-relaxed",
            variant === "tip" 
              ? "bg-chart-1/5 border-chart-1/20"
              : "bg-accent/50 border-border"
          )}
        >
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

interface LearnMoreMarkdownProps {
  title: string;
  content: string;
  defaultOpen?: boolean;
  variant?: "default" | "tip";
}

/**
 * LearnMore with markdown-like content support
 * Supports: **bold**, *italic*, bullet points, and paragraphs
 */
export function LearnMoreMarkdown({ 
  title, 
  content, 
  defaultOpen = false,
  variant = "default"
}: LearnMoreMarkdownProps) {
  // Simple markdown parser
  const parseContent = (text: string) => {
    const lines = text.trim().split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: string[] = [];

    const processText = (line: string) => {
      // Bold
      line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      // Italic
      line = line.replace(/\*(.+?)\*/g, '<em>$1</em>');
      return line;
    };

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 my-2">
            {currentList.map((item, i) => (
              <li 
                key={i} 
                dangerouslySetInnerHTML={{ __html: processText(item) }} 
              />
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      if (trimmed === '') {
        flushList();
        return;
      }
      
      if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
        currentList.push(trimmed.substring(2));
      } else {
        flushList();
        elements.push(
          <p 
            key={`p-${index}`} 
            className="my-2 first:mt-0 last:mb-0"
            dangerouslySetInnerHTML={{ __html: processText(trimmed) }} 
          />
        );
      }
    });

    flushList();
    return elements;
  };

  return (
    <LearnMore title={title} defaultOpen={defaultOpen} variant={variant}>
      {parseContent(content)}
    </LearnMore>
  );
}
