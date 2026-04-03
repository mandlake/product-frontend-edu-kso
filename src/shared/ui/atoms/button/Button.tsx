import { VariantProps } from "class-variance-authority";
import { buttonVariants } from "./button.varaints";
import { cn } from "@/src/shared/lib/cn";

interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = ({
  className,
  variant,
  size,
  text,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, text }), className)}
      {...props}
    >
      {children}
    </button>
  );
};
