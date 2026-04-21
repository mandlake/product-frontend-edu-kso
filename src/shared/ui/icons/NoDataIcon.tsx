import { SVGProps } from "react";

interface NoDataIconProps extends SVGProps<SVGSVGElement> {
  filled?: boolean;
}

export const NoDataIcon = ({ className, ...props }: NoDataIconProps) => {
  return (
    <svg
      width="90"
      height="90"
      viewBox="0 0 90 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M45 82.5C65.7107 82.5 82.5 65.7107 82.5 45C82.5 24.2893 65.7107 7.5 45 7.5C24.2893 7.5 7.5 24.2893 7.5 45C7.5 65.7107 24.2893 82.5 45 82.5ZM48 28.875H42V51.375H48V28.875ZM42 55.125H48V61.125H42V55.125Z"
        fill="#D3D5DA"
      />
    </svg>
  );
};
