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

import { useState } from "react";
import { CaretDown, BookOpen, Lightbulb } from "@phosphor-icons/react";
import DOMPurify from "dompurify";
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

  const Icon = variant === "tip" ? Lightbulb : BookOpen;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            "w-full flex items-center gap-2 p-4 rounded-lg text-left transition-colors duration-200",
            variant === "tip"
              ? "bg-tertiary/10 hover:bg-tertiary/15 border border-tertiary/30"
              : "bg-surface-container hover:bg-surface-container-high border border-border",
            isOpen && "rounded-b-none"
          )}
        >
          <Icon
            className={cn(
              "h-4 w-4 shrink-0",
              variant === "tip" ? "text-tertiary" : "text-primary"
            )}
            weight="duotone"
          />
          <span className={cn(
            "text-sm font-medium flex-1",
            variant === "tip" ? "text-tertiary" : "text-foreground"
          )}>
            {title}
          </span>
          <CaretDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0",
              isOpen && "rotate-180"
            )}
            weight="bold"
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
        <div
          className={cn(
            "p-4 rounded-b-lg border border-t-0 text-sm leading-relaxed",
            variant === "tip"
              ? "bg-tertiary/5 border-tertiary/30 border-l-[3px] border-l-tertiary/50 text-foreground/85"
              : "bg-surface-container-low border-border border-l-[3px] border-l-primary/40 text-foreground/85"
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
 * Sanitize HTML output to prevent XSS attacks.
 * Only allows safe inline formatting tags (bold, italic, emphasis).
 * All other HTML is stripped by DOMPurify.
 */
const sanitizeHtml = (html: string): string =>
  DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['strong', 'em', 'b', 'i'],
    ALLOWED_ATTR: ['class'],
  });

/**
 * LearnMore with markdown-like content support.
 * Supports: **bold**, *italic*, bullet points, and paragraphs.
 *
 * Security: All HTML output is sanitized via DOMPurify before rendering
 * to prevent XSS. Only <strong>, <em>, <b>, <i> tags are allowed.
 */
export function LearnMoreMarkdown({
  title,
  content,
  defaultOpen = false,
  variant = "default"
}: LearnMoreMarkdownProps) {
  // Simple markdown parser (output sanitized via DOMPurify)
  const parseContent = (text: string) => {
    const lines = text.trim().split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: string[] = [];

    const processText = (line: string) => {
      // Bold - use class for styling
      line = line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>');
      // Italic
      line = line.replace(/\*(.+?)\*/g, '<em>$1</em>');
      // Sanitize to prevent XSS — only allows safe inline tags
      return sanitizeHtml(line);
    };

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc pl-5 space-y-1.5 my-3 marker:text-primary/70">
            {currentList.map((item, i) => (
              <li
                key={i}
                className="pl-1"
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
            className="my-3 first:mt-0 last:mb-0"
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
