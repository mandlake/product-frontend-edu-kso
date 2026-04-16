"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/cn";
import { StarIcon } from "../icons";

interface StarRatingProps {
  value?: number;
  defaultValue?: number;
  readOnly?: boolean;
  onChange?: (value: number) => void;
  className?: string;
  starClassName?: string;
  max?: number;
}

export const StarRating = ({
  value,
  defaultValue = 0,
  readOnly = false,
  onChange,
  className,
  starClassName,
  max = 5,
}: StarRatingProps) => {
  const [internalRating, setInternalRating] = useState(defaultValue);
  const [hover, setHover] = useState(0);

  const rating = value ?? internalRating;

  const handleClick = (nextValue: number) => {
    if (readOnly) return;

    if (value === undefined) {
      setInternalRating(nextValue);
    }

    onChange?.(nextValue);
  };

  return (
    <div className={cn("flex gap-1", className)}>
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        const filled = starValue <= (hover || rating);

        return (
          <button
            key={starValue}
            type="button"
            className={cn(
              "flex items-center justify-center",
              readOnly ? "cursor-default" : "cursor-pointer",
              starClassName,
            )}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => {
              if (!readOnly) setHover(starValue);
            }}
            onMouseLeave={() => {
              if (!readOnly) setHover(0);
            }}
            disabled={readOnly}
            aria-label={`${starValue}점`}
          >
            <StarIcon filled={filled} />
          </button>
        );
      })}
    </div>
  );
};
