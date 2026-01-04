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
