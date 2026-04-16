import { SVGProps } from "react";

interface SearchIconProps extends SVGProps<SVGSVGElement> {
  filled?: boolean;
}

export const SearchIcon = ({ className, ...props }: SearchIconProps) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M15.0262 13.8474L18.5951 17.4163L17.4166 18.5948L13.8477 15.0259C12.5644 16.0525 10.937 16.6667 9.16699 16.6667C5.02699 16.6667 1.66699 13.3067 1.66699 9.16669C1.66699 5.02669 5.02699 1.66669 9.16699 1.66669C13.307 1.66669 16.667 5.02669 16.667 9.16669C16.667 10.9367 16.0528 12.5641 15.0262 13.8474ZM13.3542 13.229C14.3732 12.1789 15.0003 10.7464 15.0003 9.16669C15.0003 5.94377 12.3899 3.33335 9.16699 3.33335C5.94408 3.33335 3.33366 5.94377 3.33366 9.16669C3.33366 12.3896 5.94408 15 9.16699 15C10.7467 15 12.1792 14.3729 13.2293 13.3539L13.3542 13.229Z"
        fill="#1D1D1D"
      />
    </svg>
  );
};
