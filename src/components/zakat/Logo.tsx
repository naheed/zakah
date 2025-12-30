import zakatflowLogo from "@/assets/zakatflow-logo.png";

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
    <img
      src={zakatflowLogo}
      alt="ZakatFlow"
      className={`${sizeClasses[size]} w-auto object-contain object-left ${className}`}
    />
  );
}
