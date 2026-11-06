import type { ReactNode } from "react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function FacebookLink({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  if (!siteConfig.facebook.href) return null;
  return (
    <a
      href={siteConfig.facebook.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(className)}
    >
      {children ?? siteConfig.facebook.label}
    </a>
  );
}
