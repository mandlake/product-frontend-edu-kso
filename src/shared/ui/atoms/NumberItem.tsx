import { cn } from "@/shared/lib/cn";

export const NumberItem = ({
  number,
  title,
  children,
  className,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex items-start gap-1 text-gray-900", className)}>
      <span className="shrink-0 typo-16-b leading-7.5">{number}.</span>
      <div>
        <p className="typo-16-b leading-7.5">{title}</p>
        <p className="typo-14-r leading-7.5">{children}</p>
      </div>
    </div>
  );
};
