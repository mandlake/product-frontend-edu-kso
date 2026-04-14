import { SVGProps } from "react";

interface ArrowIconProps extends SVGProps<SVGSVGElement> {
  filled?: boolean;
}

export const ArrowIcon = ({ className, ...props }: ArrowIconProps) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M2.9203 4.70001L1.97363 5.64001L7.63363 11.3L13.2936 5.64001L12.347 4.70001L7.63363 9.41335L2.9203 4.70001Z"
        fill="#1D1D1D"
      />
    </svg>
  );
};
