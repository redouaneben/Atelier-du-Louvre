import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const restoButtonBase =
  "rounded-lg border font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

export const restoButtonVariants = cva(
  cn(restoButtonBase, "inline-flex shrink-0 items-center justify-center"),
  {
    variants: {
      variant: {
        primary:
          "border-white bg-white text-black hover:border-[var(--resto-brand)] hover:bg-[var(--resto-brand)] hover:text-neutral-950",
        command:
          "border-white bg-white text-black hover:border-[var(--resto-brand)] hover:bg-[var(--resto-brand)] hover:text-neutral-950",
        secondary:
          "border-white bg-white text-black hover:border-[var(--resto-brand)] hover:bg-[var(--resto-brand)] hover:text-neutral-950",
        outline:
          "border-white bg-white text-black hover:border-[var(--resto-brand)] hover:bg-[var(--resto-brand)] hover:text-neutral-950",
        social:
          "border-white bg-white text-black hover:border-[var(--resto-brand)] hover:bg-[var(--resto-brand)] hover:text-neutral-950",
      },
      size: {
        md: "min-h-9 gap-1.5 px-3.5 text-sm",
        sm: "min-h-8 gap-1.5 px-3 text-sm",
        heroPhone: "min-h-9 gap-1.5 px-3.5 text-sm",
        compact: "min-h-8 gap-1.5 px-3 text-sm",
        social: "min-h-9 w-full px-3.5 text-sm sm:w-auto",
        fab: "min-h-9 gap-1.5 px-3.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export type RestoButtonVariant = NonNullable<
  VariantProps<typeof restoButtonVariants>["variant"]
>;

export function restoButtonClass(
  variant: RestoButtonVariant = "primary",
  size: VariantProps<typeof restoButtonVariants>["size"] = "md",
  className?: string
) {
  return cn(restoButtonVariants({ variant, size }), className);
}

export const menuToggleActive =
  "border border-[var(--resto-brand)] bg-[var(--resto-brand)] text-neutral-950";

export const menuToggleInactive = "border border-white bg-white text-black";

export const menuToggleInactiveHover = {
  forest:
    "hover:border-[var(--resto-brand)] hover:bg-[var(--resto-brand)] hover:text-neutral-950",
  sage: "hover:border-[var(--resto-brand)] hover:bg-[var(--resto-brand)] hover:text-neutral-950",
} as const;
