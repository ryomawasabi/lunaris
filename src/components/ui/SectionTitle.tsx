import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionTitle({
  title,
  subtitle,
  align = "center",
  className,
}: SectionTitleProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={cn("mb-12 max-w-2xl", alignClass, className)}>
      {subtitle && (
        <p className="font-sans text-warm text-sm uppercase tracking-wider mb-4">
          {subtitle}
        </p>
      )}
      <h2 className={cn("font-serif text-3xl md:text-4xl mb-4", "text-dark")}>
        {title}
      </h2>
      {/* Decorative line */}
      <div className="w-12 h-0.5 bg-gold" style={{ margin: align === "center" ? "0 auto" : "0" }} />
    </div>
  );
}
