import { SVGProps } from "react";

interface KebabIconProps extends SVGProps<SVGSVGElement> {
  filled?: boolean;
}

export const KebabIcon = ({ className, ...props }: KebabIconProps) => {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <circle cx="18" cy="8" r="2" fill="#D3D5DA" />
      <circle cx="18" cy="18" r="2" fill="#D3D5DA" />
      <circle cx="18" cy="28" r="2" fill="#D3D5DA" />
    </svg>
  );
};
