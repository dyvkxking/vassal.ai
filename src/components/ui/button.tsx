import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-[var(--primary-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--canvas)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[var(--primary-hover)] active:bg-[var(--primary-focus)]",
        secondary:
          "bg-[var(--surface-1)] text-[var(--ink)] border-[var(--hairline)] hover:bg-[var(--surface-2)] hover:border-[var(--hairline-strong)]",
        tertiary:
          "bg-[var(--canvas)] text-[var(--ink)] hover:bg-[var(--surface-1)]",
        ghost:
          "text-[var(--ink)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]",
        destructive:
          "bg-[var(--destructive)]/10 text-[var(--destructive)] hover:bg-[var(--destructive)]/20 focus-visible:ring-[var(--destructive)]/20",
        link: "text-[var(--primary)] underline-offset-4 hover:underline",
        inverse:
          "bg-[var(--inverse-canvas)] text-[var(--inverse-ink)] hover:bg-[var(--inverse-surface-1)]",
        outline:
          "bg-[var(--surface-1)] text-[var(--ink)] border-[var(--hairline)] hover:bg-[var(--surface-2)] hover:border-[var(--hairline-strong)]",
      },
      size: {
        default: "h-8 gap-1.5 px-3.5 py-2",
        xs: "h-6 gap-1 rounded-md px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-md px-2.5 text-[0.8125rem] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-3.5 py-2",
        icon: "size-8",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-md",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild,
  render,
  children,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const classes = cn(buttonVariants({ variant, size, className }))

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ className?: string }>
    return React.cloneElement(child, {
      className: cn(classes, child.props.className),
    })
  }

  if (render && React.isValidElement(render)) {
    return <ButtonPrimitive data-slot="button" render={render} className={classes} {...props} />
  }

  return (
    <ButtonPrimitive
      data-slot="button"
      className={classes}
      {...props}
    >
      {children}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }