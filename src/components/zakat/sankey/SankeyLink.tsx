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
