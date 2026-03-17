import { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "gold";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
  href?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  asChild = false,
  href,
  children,
  className,
  ...props
}: ButtonProps) {
  const baseStyles =
    "font-sans font-medium text-xs uppercase tracking-wider transition-all duration-300 inline-flex items-center justify-center";

  const variants = {
    primary: "bg-dark text-cream hover:bg-charcoal",
    secondary: "border border-dark text-dark hover:bg-dark hover:text-cream",
    gold: "bg-gold text-white hover:bg-gold-dark",
  };

  const sizes = {
    sm: "px-4 py-2 text-[10px]",
    md: "px-6 py-3 text-xs",
    lg: "px-8 py-4 text-sm",
  };

  const buttonClassName = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    className
  );

  if (href && !asChild) {
    return (
      <Link href={href} className={buttonClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button className={buttonClassName} {...props}>
      {children}
    </button>
  );
}
