import { VariantProps } from "class-variance-authority";
import { buttonVariants } from "./button.varaints";
import { cn } from "@/src/shared/lib/cn";

interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  onClick?: () => void;
}

export const Button = ({
  className,
  variant,
  size,
  text,
  onClick,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, text }), className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};
