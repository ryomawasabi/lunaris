import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "bestseller" | "new" | "giftable" | "sale";
  children: string;
  className?: string;
}

export function Badge({ variant = "bestseller", children, className }: BadgeProps) {
  const variants = {
    bestseller: "bg-gold text-white",
    new: "bg-dark text-cream",
    giftable: "bg-warm text-dark",
    sale: "bg-red-600 text-white",
  };

  return (
    <span
      className={cn(
        "inline-block rounded-full px-3 py-1 text-[10px] uppercase font-sans font-medium tracking-widest",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
