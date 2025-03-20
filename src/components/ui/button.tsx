
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-white text-black hover:bg-gray-200 hover:text-black",
        secondary:
          "bg-secondary text-white hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Navigation buttons (uniform style)
        navigation: "bg-white text-maternal-900 border border-maternal-200 hover:bg-gray-200 hover:text-maternal-900",
        // Progress tab buttons
        "progress-active": "bg-maternal-100 text-maternal-900 hover:bg-maternal-100/80",
        // Resource buttons with better visibility
        resource: "bg-maternal-100 text-maternal-900 border border-maternal-300 hover:bg-maternal-200 font-medium",
        "resource-highlight": "bg-maternal-400 text-white border border-maternal-500 hover:bg-maternal-500 font-medium",
        // Nova variante para o botão do construtor de plano de parto com rosa escuro
        "birth-plan-builder": "bg-gradient-to-r from-pink-800 to-pink-900 text-white border border-pink-900 hover:from-pink-700 hover:to-pink-800 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 rounded-full",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
