import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center transition whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-neutral-black",
        outline: "border border-gray-600 bg-white",
      },
      size: {
        list: "w-18.5 h-12.5 px-5 py-3 gap-4 text-md", // 목록
        sm: "w-35 h-12.5 px-5 py-3 gap-4 text-md", // 후기 작성하기
        md: "w-37 h-12.5 px-15 py-2.5", // 확인
        lg: "w-42.5 h-16.5 px-15 py-6 text-md", // 취소, 수정
        main: "w-45.75 h-18 px-15 py-6 text-md", // 메인으로
        before: "w-49.5 h-18 px-15 py-6 text-md", // 이전페이지
      },
      text: {
        white: "text-neutral-white",
        black: "text-neutral-black",
        gray: "text-gray-600",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
      text: "white",
    },
  },
);
