"use client";

import { useId } from "react";
import { cn } from "@/shared/lib/cn";
import { TooltipIcon } from "@/shared/ui/icons";
import { InfoTooltip } from "@/shared/ui/atoms/InfoTooltip";

interface LabelProps {
  children: React.ReactNode;
  required?: boolean;
  tooltip?: React.ReactNode;
  tooltipPosition?: "top" | "right" | "bottom" | "left";
  tooltipAlign?: "start" | "center" | "end";
  className?: string;
}

export const Label = ({
  children,
  required = false,
  tooltip,
  tooltipPosition = "bottom",
  tooltipAlign = "start",
  className,
}: LabelProps) => {
  const tooltipId = useId();

  return (
    <div
      className={cn("relative flex items-center w-80 gap-1 group", className)}
    >
      {/* label text */}
      <span className="typo-18-r font-medium text-gray-900">
        {children}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>

      {/* tooltip icon */}
      {tooltip && (
        <>
          <TooltipIcon
            aria-describedby={tooltipId}
            className="w-4 h-4 cursor-pointer"
            tabIndex={0}
          />

          <InfoTooltip
            id={tooltipId}
            position={tooltipPosition}
            align={tooltipAlign}
            content={tooltip}
          />
        </>
      )}
    </div>
  );
};
