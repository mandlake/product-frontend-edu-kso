import { SVGProps } from "react";

interface NoReviewDataIconProps extends SVGProps<SVGSVGElement> {
  filled?: boolean;
}

export const NoReviewDataIcon = ({
  className,
  ...props
}: NoReviewDataIconProps) => {
  return (
    <svg
      width="62"
      height="62"
      viewBox="0 0 62 62"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M31.0003 56.8337C45.2677 56.8337 56.8337 45.2677 56.8337 31.0003C56.8337 16.733 45.2677 5.16699 31.0003 5.16699C16.733 5.16699 5.16699 16.733 5.16699 31.0003C5.16699 45.2677 16.733 56.8337 31.0003 56.8337Z"
        fill="#D3D5DA"
      />
      <path
        d="M42 27.4173V19.3333C42 18.597 41.4031 18 40.6667 18H39.3333C36.6952 20.6382 31.7369 22.1164 28.6667 22.8171V37.1829C31.7369 37.8836 36.6952 39.3619 39.3333 42H40.6667C41.4031 42 42 41.4031 42 40.6667V32.5827C43.1501 32.2867 44 31.2425 44 30C44 28.7575 43.1501 27.7133 42 27.4173ZM20.6667 23.3333C19.1939 23.3333 18 24.5272 18 26V34C18 35.4728 19.1939 36.6667 20.6667 36.6667H22L23.3333 43.3333H26V23.3333H20.6667Z"
        fill="white"
      />
    </svg>
  );
};
