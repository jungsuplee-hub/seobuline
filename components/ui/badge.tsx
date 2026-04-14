import type React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border border-[#d0a453]/50 bg-[#d0a453]/15 px-2.5 py-1 text-xs font-semibold text-[#f7d899]",
        className,
      )}
      {...props}
    />
  );
}
