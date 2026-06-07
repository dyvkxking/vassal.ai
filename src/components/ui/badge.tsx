import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-[var(--primary-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--canvas)] [&_svg]:pointer-events-none [&_svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-[var(--primary)] text-[var(--on-primary)]",
        secondary: "bg-[var(--surface-2)] text-[var(--ink-muted)]",
        destructive: "bg-[var(--destructive)]/10 text-[var(--destructive)]",
        outline: "border-[var(--hairline)] text-[var(--ink)]",
        ghost: "text-[var(--ink-subtle)] hover:text-[var(--ink)]",
        success: "bg-[var(--semantic-success)]/10 text-[var(--semantic-success)]",
        subtle: "bg-[var(--surface-3)] text-[var(--ink-subtle)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
