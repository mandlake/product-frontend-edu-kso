import { VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/cn";

import { buttonVariants } from "./button.varaints";

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  onClick?: () => void;
}

export const Button = ({
  className,
  variant,
  size,
  onClick,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};
