import { SVGProps } from "react";

interface InfoIconProps extends SVGProps<SVGSVGElement> {
  filled?: boolean;
}

export const InfoIcon = ({ className, ...props }: InfoIconProps) => {
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
      <rect width="20" height="20" rx="10" fill="#C99F32" />
      <path
        d="M11.1562 4.6875L10.9531 12.6094H8.95312L8.75 4.6875H11.1562ZM9.96875 16.1406C9.23438 16.1406 8.64062 15.5469 8.65625 14.8281C8.64062 14.1094 9.23438 13.5312 9.96875 13.5312C10.6562 13.5312 11.2656 14.1094 11.2656 14.8281C11.2656 15.5469 10.6562 16.1406 9.96875 16.1406Z"
        fill="white"
      />
    </svg>
  );
};
