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
import { FlowLink } from "./types";

interface SankeyLinkProps {
    link: FlowLink;
    onHover: (link: FlowLink, e: React.MouseEvent) => void;
    onLeave: () => void;
}

export const SankeyLink: React.FC<SankeyLinkProps> = ({ link, onHover, onLeave }) => {
    const nodeWidth = 16;

    const generatePath = (link: FlowLink) => {
        const sX = link.source.x + nodeWidth;
        const tX = link.target.x;

        // Heights
        const hS = link.sourceHeight || 4;
        const hT = link.targetHeight || 4;
        const wS = hS / 2;
        const wT = hT / 2;

        const sY = link.sourceY;
        const tY = link.targetY;

        const dist = tX - sX;
        const cX = dist * 0.5;

        return `
      M ${sX} ${sY - wS}
      C ${sX + cX} ${sY - wS}, ${tX - cX} ${tY - wT}, ${tX} ${tY - wT}
      L ${tX} ${tY + wT}
      C ${tX - cX} ${tY + wT}, ${sX + cX} ${sY + wS}, ${sX} ${sY + wS}
      Z
    `;
    };

    const isZakatLink = link.target.name === "Zakat Due";
    const opacity = isZakatLink ? 0.7 : 0.5;

    return (
        <path
            d={generatePath(link)}
            fill={link.color}
            fillOpacity={opacity}
            stroke="none"
            className="cursor-pointer transition-all duration-200 hover:fill-opacity-80"
            onMouseEnter={(e) => onHover(link, e)}
            onMouseLeave={onLeave}
        />
    );
};
