import { cn } from "@/shared/lib/cn";
import { SVGProps } from "react";

interface NextDoubleArrowIconProps extends SVGProps<SVGSVGElement> {
  isActive?: boolean;
}

export const NextDoubleArrowIcon = ({
  isActive,
  className,
  ...props
}: NextDoubleArrowIconProps) => {
  return (
    <svg
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(isActive ? "text-black" : "text-gray-400", className)}
      {...props}
    >
      <path
        d="M0 11.5H14M13.541 5.5L19 11.5H14M14 11.5L9 6.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
};
