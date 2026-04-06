"use client";

import { useState } from "react";
import { StarIcon } from "../../icons/StarIcon";

export const StarRating = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1 cursor-pointer">
      {[...Array(5)].map((_, i) => {
        const value = i + 1;

        return (
          <span
            key={i}
            onClick={() => setRating(value)}
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(0)}
          >
            <StarIcon filled={value <= (hover || rating)} />
          </span>
        );
      })}
    </div>
  );
};
