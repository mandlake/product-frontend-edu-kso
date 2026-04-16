import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center transition whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-neutral-black text-neutral-white",
        outline: "border border-gray-600 bg-white text-neutral-black",
      },
      size: {
        sm: "w-18.5 h-12.5 px-5 py-3 gap-4 text-md", // 목록
        md: "w-42.5 h-16.5 px-15 py-6 text-md", // 취소, 수정
        lg: "w-45.75 h-18 px-15 py-6 text-md", // 메인으로
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  },
);
