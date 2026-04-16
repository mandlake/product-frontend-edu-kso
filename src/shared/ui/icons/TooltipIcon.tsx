import { SVGProps } from "react";

interface TooltipIconProps extends SVGProps<SVGSVGElement> {
  filled?: boolean;
}

export const TooltipIcon = ({ className, ...props }: TooltipIconProps) => {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M9.16667 18.3333C14.2293 18.3333 18.3333 14.2293 18.3333 9.16667C18.3333 4.10406 14.2293 0 9.16667 0C4.10406 0 0 4.10406 0 9.16667C0 14.2293 4.10406 18.3333 9.16667 18.3333Z"
        fill="#D3D5DA"
      />
      <path
        d="M9.07489 5.59163C9.62489 5.59163 9.99156 5.22497 9.99156 4.67497C9.99156 4.12497 9.62489 3.7583 9.07489 3.7583C8.52489 3.7583 8.15822 4.12497 8.15822 4.67497C8.06656 5.22497 8.52489 5.59163 9.07489 5.59163Z"
        fill="white"
      />
      <path
        d="M9.99206 12.7414V7.97474V6.69141H8.70872H7.15039V7.97474H8.70872V12.7414H7.51706V14.0247H8.70872H9.99206H11.1837V12.7414H9.99206Z"
        fill="white"
      />
    </svg>
  );
};
