import { SVGProps } from "react";

interface CloseIconProps extends SVGProps<SVGSVGElement> {
  filled?: boolean;
}

export const CloseIcon = ({ className, ...props }: CloseIconProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.3388 11.3388L20.5559 18.5559L19.4952 19.6165L12.2782 12.3995L5.061 19.6167L4.00034 18.556L11.2175 11.3388L3.93886 4.06017L4.99952 2.99951L12.2782 10.2782L19.5567 2.99966L20.6174 4.06032L13.3388 11.3388Z"
        fill="#1D1D1D"
      />
    </svg>
  );
};
