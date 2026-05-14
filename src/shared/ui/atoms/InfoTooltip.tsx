import { cn } from "@/shared/lib/cn";

interface InfoTooltipProps {
  id?: string;
  content: React.ReactNode;
  position?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  className?: string;
}

const getPositionClass = (
  position: InfoTooltipProps["position"],
  align: InfoTooltipProps["align"],
) => {
  switch (position) {
    case "top":
      return {
        start: "bottom-full left-0 mb-2",
        center: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        end: "bottom-full right-0 mb-2",
      }[align ?? "start"];

    case "bottom":
      return {
        start: "top-full left-0 mt-2",
        center: "top-full left-1/2 -translate-x-1/2 mt-2",
        end: "top-full right-0 mt-2",
      }[align ?? "start"];

    case "left":
      return {
        start: "right-full top-0 mr-2",
        center: "right-full top-1/2 -translate-y-1/2 mr-2",
        end: "right-full bottom-0 mr-2",
      }[align ?? "center"];

    case "right":
      return {
        start: "left-full top-0 ml-2",
        center: "left-full top-1/2 -translate-y-1/2 ml-2",
        end: "left-full bottom-0 ml-2",
      }[align ?? "center"];

    default:
      return "top-full left-0 mt-2";
  }
};

export const InfoTooltip = ({
  id,
  content,
  position = "bottom",
  align = "start",
  className,
}: InfoTooltipProps) => {
  return (
    <div
      id={id}
      role="tooltip"
      className={cn(
        "pointer-events-none absolute z-50",
        "min-w-71",
        "drop-shadow-lg bg-white p-3 pr-2.5",
        "typo-14-m text-gray-700",
        "opacity-0 invisible transition-all duration-200",
        "group-hover:visible group-hover:opacity-100",
        "group-focus-within:visible group-focus-within:opacity-100",
        getPositionClass(position, align),
        className,
      )}
    >
      {content}
    </div>
  );
};
