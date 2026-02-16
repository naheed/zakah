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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { example } from '@/content/methodology';
import {
    Users,
    Briefcase,
    Receipt,
    Calculator,
    Info
} from '@phosphor-icons/react';
import { motion } from 'framer-motion';

export const CaseStudy = () => {
    return (
        <section id="case-study" className="py-12 scroll-mt-20">
            <div className="space-y-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Users size={28} weight="duotone" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">{example.title}</h2>
                        <p className="text-muted-foreground">{example.intro}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Profile & Context */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="h-full border-primary/20 bg-primary/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users size={20} />
                                    {example.profile.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-4">
                                    {example.profile.items.map((item, i) => (
                                        <li key={i} className="flex gap-3 text-sm leading-relaxed">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Assets & Liabilities Tables */}
                    <div className="lg:col-span-2 space-y-6">
                        <Tabs defaultValue="assets" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="assets" className="flex items-center gap-2">
                                    <Briefcase size={18} />
                                    Assets
                                </TabsTrigger>
                                <TabsTrigger value="liabilities" className="flex items-center gap-2">
                                    <Receipt size={18} />
                                    Liabilities
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="assets" className="mt-4">
                                <Card>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Asset Description</TableHead>
                                                <TableHead className="text-right">Value</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {example.assets.table.map((item: any, i: number) => (
                                                <TableRow key={i}>
                                                    <TableCell>
                                                        <div className="font-medium">{item.label}</div>
                                                        {item.note && <div className="text-xs text-muted-foreground italic">{item.note}</div>}
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono">{item.value}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Card>
                            </TabsContent>

                            <TabsContent value="liabilities" className="mt-4">
                                <Card>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Liability Description</TableHead>
                                                <TableHead className="text-right">Amount</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {example.liabilities.table.map((item: any, i: number) => (
                                                <TableRow key={i}>
                                                    <TableCell>
                                                        <div className="font-medium">{item.label}</div>
                                                        {item.note && <div className="text-xs text-muted-foreground italic">{item.note}</div>}
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono text-red-500">{item.value}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                {/* Bottom: Detailed Calculation Comparison */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Calculator size={24} className="text-primary" />
                        <h3 className="text-2xl font-semibold">Scholarly Impact Comparison</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {example.calculation.modes.map((mode, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className="h-full border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-colors shadow-sm overflow-hidden">
                                    <div className="bg-slate-50 dark:bg-slate-900 px-4 py-3 border-b flex justify-between items-center">
                                        <span className="font-bold text-sm uppercase tracking-wider text-slate-500">{mode.title}</span>
                                        <div className="p-1 rounded bg-white dark:bg-slate-800 shadow-sm border">
                                            <Info size={14} className="text-slate-400" />
                                        </div>
                                    </div>
                                    <CardContent className="pt-6">
                                        <div className="text-3xl font-black text-primary mb-4 tracking-tight">
                                            {mode.result}
                                        </div>
                                        <ul className="space-y-2">
                                            {mode.details.map((detail, di) => (
                                                <li key={di} className="text-xs text-muted-foreground border-b border-slate-50 dark:border-slate-900 pb-1.5 last:border-0">
                                                    {detail}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <Card className="bg-primary/5 border-primary/10">
                        <CardContent className="py-4 flex items-start gap-3">
                            <Info size={20} className="text-primary mt-0.5" />
                            <p className="text-sm text-balance">
                                <span className="font-bold">Interpretation Breakdown:</span> {example.summary.text}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
};
