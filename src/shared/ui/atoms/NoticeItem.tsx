import { cn } from "@/shared/lib/cn";

export const NoticeItem = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex items-start gap-1 text-gray-600", className)}>
      <span className="shrink-0">※</span>
      <p>{children}</p>
    </div>
  );
};
