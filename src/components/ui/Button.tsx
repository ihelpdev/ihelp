import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-[#002d62] text-white border border-[#002d62] hover:bg-[#1a4480]",
      secondary: "bg-white text-[#002d62] border border-[#002d62] hover:bg-[#eaf1ff]",
      ghost: "bg-transparent text-[#002d62] hover:bg-[#eaf1ff]",
    };

    const combinedClasses = `${baseStyles} ${variants[variant]} ${className}`;

    return (
      <button ref={ref} className={combinedClasses} {...props} />
    );
  }
);

Button.displayName = "Button";
