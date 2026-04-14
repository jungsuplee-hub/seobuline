import type React from "react";import { cn } from "@/lib/utils";
export function Badge({className,...props}:React.HTMLAttributes<HTMLSpanElement>){return <span className={cn("rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-900",className)} {...props}/>;}
