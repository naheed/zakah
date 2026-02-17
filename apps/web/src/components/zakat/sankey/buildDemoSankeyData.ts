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

/**
 * Shared Sankey Data Builder
 * 
 * Creates a unified data model for Sankey charts that can be used by both:
 * 1. AnimatedSankeyChart (demo/landing page) - simplified, animated
 * 2. ZakatSankeyChart (report) - full detail, interactive
 * 
 * Flow Model:
 * - Assets (Left) → Zakat Due, Retained Wealth, Exempt (Right)
 * - Every dollar in must equal dollars out (flow conservation)
 */

import { ASSET_COLORS } from "./constants";

export interface DemoAsset {
    name: string;
    displayName: string;
    grossValue: number;      // Full value of asset (for bar sizing)
    zakatableValue: number;  // Portion subject to Zakat
    color: string;
}

export interface DemoSankeyNode {
    id: string;
    displayName: string;
    value: number;
    color: string;
    isSource?: boolean;
    isZakat?: boolean;
    isRetained?: boolean;
    isExempt?: boolean;
    x: number;
    y: number;
    height: number;
}

export interface DemoSankeyLink {
    source: string;
    target: string;
    value: number;
    color: string;
    type: "zakat" | "retained" | "exempt";
    sourceY: number;
    targetY: number;
    thickness: number;
}

export interface DemoSankeyData {
    assets: DemoAsset[];
    nodes: DemoSankeyNode[];
    links: DemoSankeyLink[];
    totalGross: number;
    totalZakatable: number;
    totalExempt: number;
    zakatDue: number;
    retainedWealth: number;
}

interface BuildDemoSankeyOptions {
    assets: DemoAsset[];
    zakatRate?: number; // Default 0.025 (2.5%)
    width: number;
    height: number;
    nodeWidth?: number;
    leftPadding?: number;
    rightPadding?: number;
    topMargin?: number;
    bottomMargin?: number;
    assetSpacing?: number;
}

/**
 * Builds Sankey data with unified flow model:
 * - Assets (left) flow to 3 destinations (right)
 * - Zakat Due: 2.5% of zakatable portion
 * - Retained Wealth: 97.5% of zakatable portion
 * - Exempt: Non-zakatable portion (gross - zakatable)
 */
export function buildDemoSankeyData(options: BuildDemoSankeyOptions): DemoSankeyData {
    const {
        assets,
        zakatRate = 0.025,
        width,
        height,
        nodeWidth = 8,
        leftPadding = 6,
        rightPadding = 6,
        topMargin = 8,
        bottomMargin = 16,
        assetSpacing = 3,
    } = options;

    // Calculate totals
    const totalGross = assets.reduce((sum, a) => sum + a.grossValue, 0);
    const totalZakatable = assets.reduce((sum, a) => sum + a.zakatableValue, 0);
    const totalExempt = totalGross - totalZakatable;
    const zakatDue = totalZakatable * zakatRate;
    const retainedWealth = totalZakatable - zakatDue;

    // Available height for chart content
    const availableHeight = height - topMargin - bottomMargin;
    const totalSpacing = assetSpacing * (assets.length - 1);

    // === LEFT SIDE: Asset Nodes ===
    // Heights proportional to GROSS value (full bar representation)
    let leftY = topMargin;
    const assetNodes: DemoSankeyNode[] = assets.map((asset) => {
        const proportion = asset.grossValue / totalGross;
        const nodeHeight = Math.max(10, proportion * (availableHeight - totalSpacing));
        const node: DemoSankeyNode = {
            id: asset.name,
            displayName: asset.displayName,
            value: asset.grossValue,
            color: asset.color,
            isSource: true,
            x: leftPadding,
            y: leftY,
            height: nodeHeight,
        };
        leftY += nodeHeight + assetSpacing;
        return node;
    });

    // === RIGHT SIDE: Destination Nodes ===
    // Stacked: Zakat (top), Retained (middle), Exempt (bottom if applicable)
    const rightX = width - rightPadding - nodeWidth;
    const hasExempt = totalExempt > 1;

    // Calculate destination heights (proportional to their values)
    const totalDestination = hasExempt ? totalGross : totalZakatable;
    const zakatProportion = zakatDue / totalDestination;
    const retainedProportion = retainedWealth / totalDestination;
    const exemptProportion = hasExempt ? totalExempt / totalDestination : 0;

    // Scale up for visibility (Zakat is tiny at 2.5%)
    const minHeight = 20;
    const zakatHeight = Math.max(minHeight, zakatProportion * availableHeight * 4);
    const retainedHeight = Math.max(minHeight, retainedProportion * availableHeight * 0.8);
    const exemptHeight = hasExempt
        ? Math.max(minHeight, exemptProportion * availableHeight * 0.8)
        : 0;

    // Position destination nodes (stacked)
    const destNodes: DemoSankeyNode[] = [];
    let destY = topMargin;

    destNodes.push({
        id: "zakat",
        displayName: "Zakat Due",
        value: zakatDue,
        color: ASSET_COLORS.zakat,
        isZakat: true,
        x: rightX,
        y: destY,
        height: zakatHeight,
    });
    destY += zakatHeight + assetSpacing;

    destNodes.push({
        id: "retained",
        displayName: "Retained",
        value: retainedWealth,
        color: ASSET_COLORS.retained,
        isRetained: true,
        x: rightX,
        y: destY,
        height: retainedHeight,
    });
    destY += retainedHeight + assetSpacing;

    if (hasExempt) {
        destNodes.push({
            id: "exempt",
            displayName: "Exempt",
            value: totalExempt,
            color: ASSET_COLORS.exempt,
            isExempt: true,
            x: rightX,
            y: destY,
            height: exemptHeight,
        });
    }

    // === LINKS ===
    // Each asset contributes to Zakat, Retained, and optionally Exempt
    const links: DemoSankeyLink[] = [];

    // Track Y positions for stacking flows into destination nodes
    let zakatFlowY = topMargin;
    let retainedFlowY = destNodes.find((n) => n.id === "retained")!.y;
    let exemptFlowY = hasExempt ? destNodes.find((n) => n.id === "exempt")!.y : 0;

    assetNodes.forEach((assetNode) => {
        const asset = assets.find((a) => a.name === assetNode.id)!;
        const zakatContribution = asset.zakatableValue * zakatRate;
        const retainedContribution = asset.zakatableValue - zakatContribution;
        const exemptContribution = asset.grossValue - asset.zakatableValue;

        // Calculate proportional heights on destination nodes
        const zakatDestHeight = (zakatContribution / zakatDue) * zakatHeight;
        const retainedDestHeight = (retainedContribution / retainedWealth) * retainedHeight;
        const exemptDestHeight = hasExempt && totalExempt > 0
            ? (exemptContribution / totalExempt) * exemptHeight
            : 0;

        // 1. Zakat flow
        if (zakatContribution > 0.01) {
            links.push({
                source: assetNode.id,
                target: "zakat",
                value: zakatContribution,
                color: asset.color,
                type: "zakat",
                sourceY: assetNode.y + assetNode.height * 0.15, // Start from top portion
                targetY: zakatFlowY + zakatDestHeight / 2,
                thickness: Math.min(zakatDestHeight, assetNode.height * 0.3),
            });
            zakatFlowY += zakatDestHeight;
        }

        // 2. Retained flow
        if (retainedContribution > 0.01) {
            links.push({
                source: assetNode.id,
                target: "retained",
                value: retainedContribution,
                color: asset.color,
                type: "retained",
                sourceY: assetNode.y + assetNode.height * 0.5, // Center
                targetY: retainedFlowY + retainedDestHeight / 2,
                thickness: Math.min(retainedDestHeight, assetNode.height * 0.5),
            });
            retainedFlowY += retainedDestHeight;
        }

        // 3. Exempt flow (if applicable)
        if (hasExempt && exemptContribution > 0.01) {
            links.push({
                source: assetNode.id,
                target: "exempt",
                value: exemptContribution,
                color: ASSET_COLORS.exempt, // Gray for exempt
                type: "exempt",
                sourceY: assetNode.y + assetNode.height * 0.85, // Bottom portion
                targetY: exemptFlowY + exemptDestHeight / 2,
                thickness: Math.min(exemptDestHeight, assetNode.height * 0.3),
            });
            exemptFlowY += exemptDestHeight;
        }
    });

    return {
        assets,
        nodes: [...assetNodes, ...destNodes],
        links,
        totalGross,
        totalZakatable,
        totalExempt,
        zakatDue,
        retainedWealth,
    };
}

/**
 * Generates a curved bezier path for Sankey flow
 */
export function generateSankeyPath(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    thickness: number
): string {
    const midX = (startX + endX) / 2;
    return `
    M ${startX} ${startY - thickness / 2}
    C ${midX} ${startY - thickness / 2}, ${midX} ${endY - thickness / 2}, ${endX} ${endY - thickness / 2}
    L ${endX} ${endY + thickness / 2}
    C ${midX} ${endY + thickness / 2}, ${midX} ${startY + thickness / 2}, ${startX} ${startY + thickness / 2}
    Z
  `;
}
