import zakatflowLogo from "@/assets/zakatflow-logo.png";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8",
  md: "h-10",
  lg: "h-12",
};

export function Logo({ className = "", size = "md" }: LogoProps) {
  return (
    <img
      src={zakatflowLogo}
      alt="ZakatFlow"
      className={`${sizeClasses[size]} w-auto object-contain ${className}`}
    />
  );
}
