import { ReactNode } from "react";

export interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "error";
  className?: string;
}

export const Badge = ({ children, variant = "default", className = "" }: BadgeProps) => {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    default: "bg-[#f1f5f9] text-[#0b1c30]",
    success: "bg-[#e2f8eb] text-[#005236]",
    warning: "bg-[#fff3cd] text-[#856404]",
    error: "bg-[#ffdad6] text-[#93000a]",
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${className}`;

  return (
    <div className="inline-flex items-center">
      <div className={combinedClasses}>
        {children}
      </div>
    </div>
  );
};
