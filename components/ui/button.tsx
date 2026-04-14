import type React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LinkHref = Parameters<typeof Link>[0]["href"];

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: LinkHref;
};

export function Button({ href, className, ...props }: ButtonProps) {
  const style =
    "inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800";

  if (href) {
    return (
      <Link href={href} className={cn(style, className)}>
        {props.children}
      </Link>
    );
  }

  return <button className={cn(style, className)} {...props} />;
}
