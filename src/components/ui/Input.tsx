import { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && <label className="text-sm font-medium text-on-surface">{label}</label>}
        <input
          ref={ref}
          className={`flex h-11 w-full rounded border border-[#c3c6d1] bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-outline-variant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002d62] disabled:cursor-not-allowed disabled:opacity-50 ${
            error ? "border-[#ba1a1a] focus-visible:ring-[#ba1a1a]" : ""
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-[#ba1a1a] flex items-center gap-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
