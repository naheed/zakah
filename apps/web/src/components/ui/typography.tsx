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


import React from 'react';
import { cn } from '@/lib/utils';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'muted' | 'small' | 'lead';
}

// Text component without ScrollReveal to avoid DOM nesting issues (<p> inside <div> inside <p>)
export const Text: React.FC<TextProps> = ({ children, className, variant = 'default', ...props }) => {
    const variants = {
        default: "text-base text-muted-foreground leading-relaxed",
        muted: "text-sm text-muted-foreground",
        small: "text-xs text-muted-foreground",
        lead: "text-lg text-muted-foreground mb-6"
    };

    return (
        <p className={cn(variants[variant], className)} {...props}>
            {children}
        </p>
    );
};

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children: React.ReactNode;
    className?: string;
    level?: 1 | 2 | 3 | 4;
}

export const Heading: React.FC<HeadingProps> = ({ children, className, level = 2, ...props }) => {
    const styles = {
        1: "text-3xl md:text-4xl font-bold text-foreground mb-4 font-serif",
        2: "text-2xl font-bold text-foreground mt-8 mb-4 font-serif",
        3: "text-lg font-medium text-foreground mt-6 mb-2",
        4: "font-medium text-foreground mt-4 mb-2"
    };

    const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4';

    return (
        <ScrollReveal>
            <Tag className={cn(styles[level], className)} {...(props as React.HTMLAttributes<HTMLHeadingElement>)}>
                {children}
            </Tag>
        </ScrollReveal>
    );
};

interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
    children: React.ReactNode;
    className?: string;
    ordered?: boolean;
}

export const List: React.FC<ListProps> = ({ children, className, ordered = false, ...props }) => {
    const Tag = ordered ? 'ol' : 'ul';
    return (
        <Tag className={cn("pl-6 space-y-2 text-muted-foreground", ordered ? "list-decimal" : "list-disc", className)} {...props}>
            {children}
        </Tag>
    );
};

export const ListItem: React.FC<React.LiHTMLAttributes<HTMLLIElement>> = ({ children, className, ...props }) => (
    <li className={cn("pl-2", className)} {...props}>{children}</li>
);
