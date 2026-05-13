"use client";

import { cn } from "@/shared/lib/cn";
import { maskName } from "@/shared/lib/masking";
import { CardProps } from "@/types/card";

import { StarRating } from "../atoms/StarRating";
import { PinIcon } from "../icons";
import { LineItem } from "../atoms/LineItem";

export const Card = ({
  id,
  notice,
  className,
  pinned,
  star,
  title,
  content,
  username = "",
  date,
  onClick,
}: CardProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-col w-116 min-h-76 group border border-gray-300 p-10 hover:border-2 hover:border-pinned",
        className,
      )}
      onClick={() => onClick?.(id)}
    >
      {pinned && (
        <div className="absolute top-0 right-0 bg-pinned p-3.25">
          <PinIcon />
        </div>
      )}
      <StarRating value={star} readOnly />
      <p
        className={`title-20-b text-neutral-black pt-6 ${notice ? "line-clamp-2 mb-17" : "line-clamp-1"}`}
      >
        {title}
      </p>
      {!notice && (
        <p className="typo-14-m text-gray-700 keep-all pt-6 h-21 line-clamp-3">
          {content}
        </p>
      )}
      <div className="flex items-center typo-14-m text-gray-700 pt-10 gap-2">
        {!notice && username && (
          <LineItem className="after:bg-gray-700">
            {maskName(username)}
          </LineItem>
        )}
        <p>{date ? new Date(date).toLocaleDateString("ko-KR") : "-"}</p>
      </div>
    </div>
  );
};
