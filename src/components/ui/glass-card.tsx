
import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "bordered";
}

const GlassCard = ({
  children,
  className,
  variant = "default",
  ...props
}: GlassCardProps) => {
  return (
    <div
      className={cn(
        "rounded-xl glass animate-fade-in p-6",
        variant === "elevated" && "shadow-lg",
        variant === "bordered" && "border border-white/20",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
