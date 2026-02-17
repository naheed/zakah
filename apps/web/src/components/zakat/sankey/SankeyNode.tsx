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

import React from "react";
import { FlowNode } from "./types";
import { formatCurrency } from "@zakatflow/core";

interface SankeyNodeProps {
    node: FlowNode;
    currency: string;
    chartWidth: number;
    showLabels: boolean;
    onHover: (node: FlowNode, e: React.MouseEvent) => void;
    onLeave: () => void;
}

export const SankeyNode: React.FC<SankeyNodeProps> = ({ node, currency, chartWidth, showLabels, onHover, onLeave }) => {
    const nodeWidth = 16;

    // Layout Logic for Labels
    const isLeftSide = node.x < chartWidth * 0.35;
    const isCenter = !isLeftSide && node.x < chartWidth * 0.75;

    return (
        <g>
            <rect
                x={node.x}
                y={node.y}
                width={nodeWidth}
                height={node.height}
                fill={node.color}
                rx={4}
                className="cursor-pointer transition-all duration-200 hover:opacity-80"
                onMouseEnter={(e) => onHover(node, e)}
                onMouseLeave={onLeave}
            />
            {showLabels && (
                <>
                    {isCenter ? (
                        <>
                            <text
                                x={node.x + nodeWidth / 2}
                                y={node.y + node.height + 16}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="fill-foreground text-xs font-semibold pointer-events-none"
                                style={{ fontSize: '10px' }}
                            >
                                {node.name}
                            </text>
                            <text
                                x={node.x + nodeWidth / 2}
                                y={node.y + node.height + 28}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="fill-muted-foreground text-xs pointer-events-none"
                                style={{ fontSize: '9px' }}
                            >
                                {formatCurrency(node.value, currency)}
                            </text>
                        </>
                    ) : (
                        <>
                            <text
                                x={isLeftSide ? node.x - 8 : node.x + nodeWidth + 8}
                                y={node.y + node.height / 2 - 6}
                                textAnchor={isLeftSide ? "end" : "start"}
                                dominantBaseline="middle"
                                className="fill-foreground text-xs font-semibold pointer-events-none"
                                style={{ fontSize: '11px' }}
                            >
                                {node.name}
                            </text>
                            <text
                                x={isLeftSide ? node.x - 8 : node.x + nodeWidth + 8}
                                y={node.y + node.height / 2 + 8}
                                textAnchor={isLeftSide ? "end" : "start"}
                                dominantBaseline="middle"
                                className="fill-muted-foreground text-xs pointer-events-none"
                                style={{ fontSize: '10px' }}
                            >
                                {formatCurrency(node.value, currency)}
                            </text>
                        </>
                    )}
                </>
            )}
        </g>
    );
};
