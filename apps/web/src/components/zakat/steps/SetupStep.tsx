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

import { useZakatPersistence } from "@/hooks/useZakatPersistence";
import { content as c } from "@/content";
import { cn } from "@/lib/utils";
import { Madhab, MADHAB_RULES } from "@zakatflow/core";
import { Check, Sparkle, ListChecks, ShieldCheck, BookOpen } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getMethodologyDisplayName, MadhhabRules } from "@zakatflow/core";
import { StepHeader } from "../StepHeader";
import { Link } from "react-router-dom";

export function SetupStep() {
    const { formData, updateFormData } = useZakatPersistence();
    const { isSimpleMode, madhab } = formData;

    const handleModeChange = (mode: 'simple' | 'detailed') => {
        updateFormData({ isSimpleMode: mode === 'simple' });
    };

    const handleMadhabChange = (newMadhab: Madhab) => {
        updateFormData({ madhab: newMadhab });
    };

    return (
        <div className="space-y-8">
            <StepHeader
                title={c.wizard.preferences.title}
                emoji={<Sparkle className="w-8 h-8 text-primary" weight="duotone" />}
            />

            <div className="space-y-8">
                {/* Section 0: Entry Method (New v0.20.0) */}
                <div className="space-y-4">
                    <Label className="text-base font-semibold text-foreground">
                        {c.wizard.preferences.entryMethod.title}
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Manual Entry */}
                        <div
                            className={cn(
                                "relative flex flex-col p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-primary/50",
                                !formData.entryMethod || formData.entryMethod === 'manual'
                                    ? "border-primary bg-primary/5"
                                    : "border-border bg-card"
                            )}
                            onClick={() => updateFormData({ entryMethod: 'manual' })}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <ListChecks
                                    className={cn(
                                        "w-6 h-6",
                                        !formData.entryMethod || formData.entryMethod === 'manual' ? "text-primary" : "text-muted-foreground"
                                    )}
                                    weight={!formData.entryMethod || formData.entryMethod === 'manual' ? "fill" : "duotone"}
                                />
                                {(!formData.entryMethod || formData.entryMethod === 'manual') && (
                                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                        <Check className="w-3 h-3 text-primary-foreground" weight="bold" />
                                    </div>
                                )}
                            </div>
                            <h3 className={cn("font-bold mb-1", !formData.entryMethod || formData.entryMethod === 'manual' ? "text-primary" : "text-foreground")}>
                                {c.wizard.preferences.entryMethod.manual.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {c.wizard.preferences.entryMethod.manual.description}
                            </p>
                        </div>

                        {/* Batch Upload */}
                        <div
                            className={cn(
                                "relative flex flex-col p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-primary/50",
                                formData.entryMethod === 'upload'
                                    ? "border-primary bg-primary/5"
                                    : "border-border bg-card"
                            )}
                            onClick={() => updateFormData({ entryMethod: 'upload' })}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <Sparkle
                                    className={cn(
                                        "w-6 h-6",
                                        formData.entryMethod === 'upload' ? "text-primary" : "text-muted-foreground"
                                    )}
                                    weight={formData.entryMethod === 'upload' ? "fill" : "duotone"}
                                />
                                {formData.entryMethod === 'upload' && (
                                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                        <Check className="w-3 h-3 text-primary-foreground" weight="bold" />
                                    </div>
                                )}
                            </div>
                            <h3 className={cn("font-bold mb-1", formData.entryMethod === 'upload' ? "text-primary" : "text-foreground")}>
                                {c.wizard.preferences.entryMethod.upload.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {c.wizard.preferences.entryMethod.upload.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section 1: Calculation Mode */}
                <div className="space-y-4">
                    <Label className="text-base font-semibold text-foreground">
                        {c.wizard.preferences.calculationMode.title}
                    </Label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Detailed Mode (Default/Recommended) */}
                        <div
                            className={cn(
                                "relative flex flex-col p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-primary/50",
                                !isSimpleMode
                                    ? "border-primary bg-primary/5"
                                    : "border-border bg-card"
                            )}
                            onClick={() => handleModeChange('detailed')}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <ListChecks
                                    className={cn(
                                        "w-6 h-6",
                                        !isSimpleMode ? "text-primary" : "text-muted-foreground"
                                    )}
                                    weight={!isSimpleMode ? "fill" : "duotone"}
                                />
                                {!isSimpleMode && (
                                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                        <Check className="w-3 h-3 text-primary-foreground" weight="bold" />
                                    </div>
                                )}
                            </div>
                            <h3 className={cn("font-bold mb-1", !isSimpleMode ? "text-primary" : "text-foreground")}>
                                {c.wizard.preferences.calculationMode.detailed.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {c.wizard.preferences.calculationMode.detailed.description}
                            </p>
                        </div>

                        {/* Simple Mode */}
                        <div
                            className={cn(
                                "relative flex flex-col p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-primary/50",
                                isSimpleMode
                                    ? "border-primary bg-primary/5"
                                    : "border-border bg-card"
                            )}
                            onClick={() => handleModeChange('simple')}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <Sparkle
                                    className={cn(
                                        "w-6 h-6",
                                        isSimpleMode ? "text-primary" : "text-muted-foreground"
                                    )}
                                    weight={isSimpleMode ? "fill" : "duotone"}
                                />
                                {isSimpleMode && (
                                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                        <Check className="w-3 h-3 text-primary-foreground" weight="bold" />
                                    </div>
                                )}
                            </div>
                            <h3 className={cn("font-bold mb-1", isSimpleMode ? "text-primary" : "text-foreground")}>
                                {c.wizard.preferences.calculationMode.simple.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {c.wizard.preferences.calculationMode.simple.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section 2: Methodology */}
                <div className="space-y-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                        <Label className="text-base font-semibold text-foreground">
                            {c.wizard.preferences.methodology.title}
                        </Label>
                        <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground -mt-2 mb-2">
                        {c.wizard.preferences.methodology.description}
                    </p>

                    {/* Methodology Link - Before choices */}
                    <Link
                        to="/methodology"
                        className="flex items-center gap-3 mb-4 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors group"
                    >
                        <BookOpen className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" weight="duotone" />
                        <div className="flex-1">
                            <p className="font-medium text-foreground text-sm">Learn about our methodology</p>
                            <p className="text-xs text-muted-foreground">Supports Sheikh Joe Bradford (Default), AMJA & classical opinions</p>
                        </div>
                    </Link>

                    <RadioGroup
                        value={madhab}
                        onValueChange={(v) => handleMadhabChange(v as Madhab)}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                        {(Object.values(MADHAB_RULES) as MadhhabRules[]).map((rule) => {
                            const isSelected = madhab === rule.name;
                            return (
                                <div key={rule.name} className="relative">
                                    <RadioGroupItem
                                        value={rule.name}
                                        id={rule.name}
                                        className="sr-only"
                                    />
                                    <Label
                                        htmlFor={rule.name}
                                        className={cn(
                                            "flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all hover:bg-muted/50",
                                            isSelected
                                                ? "border-primary bg-primary/5"
                                                : "border-border bg-card"
                                        )}
                                    >
                                        <div className="flex-1">
                                            <div className={cn("font-medium", isSelected && "text-primary")}>
                                                {rule.displayName}
                                            </div>
                                            {rule.name === 'school_1' && (
                                                <span className="text-xs text-muted-foreground">Standard</span>
                                            )}
                                        </div>
                                        {isSelected && (
                                            <Check className="w-4 h-4 text-primary" weight="bold" />
                                        )}
                                    </Label>
                                </div>
                            );
                        })}
                    </RadioGroup>
                </div>
            </div>
        </div>
    );
}
