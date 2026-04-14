import type React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LinkHref = Parameters<typeof Link>[0]["href"];

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: LinkHref;
  variant?: "primary" | "outline" | "ghost";
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-[linear-gradient(135deg,#d0a453,#9f6f2b)] text-[#1f1b16] hover:brightness-110 shadow-[0_10px_25px_rgba(208,164,83,0.25)]",
  outline: "border border-[#d0a453]/70 text-[#f4e7cf] hover:bg-[#d0a453]/15",
  ghost: "text-[#f4e7cf] hover:bg-white/10",
};

export function Button({ href, className, variant = "primary", ...props }: ButtonProps) {
  const style = cn(
    "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition",
    variants[variant],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={style}>
        {props.children}
      </Link>
    );
  }

  return <button className={style} {...props} />;
}
