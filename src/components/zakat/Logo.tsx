import zakatflowLogo from "@/assets/zakatflow-logo.png";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-6",
  md: "h-8",
  lg: "h-10",
};

export function Logo({ className = "", size = "md" }: LogoProps) {
  return (
    <img
      src={zakatflowLogo}
      alt="ZakatFlow"
      className={`${sizeClasses[size]} w-auto ${className}`}
    />
  );
}
