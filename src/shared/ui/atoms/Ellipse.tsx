import { cn } from "@/shared/lib/cn";

export const EllipseItem = ({
  size,
  className,
}: {
  size: number;
  className?: string;
}) => {
  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className={cn("rounded-full bg-ellipse-red", className)}
    />
  );
};
