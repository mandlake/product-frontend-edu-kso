import { cn } from "@/shared/lib/cn";

export const LineItem = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={cn(
        "relative pr-2 after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-2.5 after:w-px after:bg-white",
        className,
      )}
    >
      {children}
    </p>
  );
};
