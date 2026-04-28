import { cn } from "@/shared/lib/cn";
import { SVGProps } from "react";

interface NextArrowIconProps extends SVGProps<SVGSVGElement> {
  isActive?: boolean;
}

export const NextArrowIcon = ({
  isActive,
  className,
  ...props
}: NextArrowIconProps) => {
  return (
    <svg
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(isActive ? "bg-black" : "bg-gray-400", className)}
      {...props}
    >
      <path
        d="M5.96046e-08 11.5H19L13.541 5.5"
        stroke="black"
        stroke-width="1.5"
      />
    </svg>
  );
};
