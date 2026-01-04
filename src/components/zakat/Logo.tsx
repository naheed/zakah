import zakatflowLogo from "@/assets/zakatflow-logo.png";
import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-7",
  md: "h-9",
  lg: "h-11",
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
