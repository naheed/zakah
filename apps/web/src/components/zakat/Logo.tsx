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

// Using wordmark from public folder for better caching
const zakatflowLogo = "/ZF_WordMark_2848_1500.png";
import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-9",
  md: "h-12",
  lg: "h-16",
};

export function Logo({ className = "", size = "md" }: LogoProps) {
  return (
    <Link to="/" className={`block hover:opacity-80 transition-opacity ${className}`}>
      <img
        src={zakatflowLogo}
        alt="ZakatFlow"
        className={`${sizeClasses[size]} w-auto object-contain object-left dark:brightness-0 dark:invert dark:opacity-[0.87]`}
      />
    </Link>
  );
}
