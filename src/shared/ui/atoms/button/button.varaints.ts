import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center transition whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-background-black",
        outline: "border border-gray-600 bg-white",
      },
      size: {
        sm: "px-5 py-3 gap-4 text-md",
        lg: "px-15 py-6 text-md",
      },
      text: {
        white: "text-neutral-white",
        black: "text-neutral-black",
        gray: "text-gray-600",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "sm",
      text: "black",
    },
  },
);
