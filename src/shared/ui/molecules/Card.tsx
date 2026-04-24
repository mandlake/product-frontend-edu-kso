"use client";

import { cn } from "@/shared/lib/cn";
import { StarRating } from "../atoms/StarRating";
import { PinIcon } from "../icons";

interface CardProps {
  notice?: boolean;
  pinned?: boolean;
  className?: string;
  star?: number;
  title?: string;
  content?: string;
  username?: string;
  date?: string;
}

export const maskName = (name: string) => {
  if (name.length <= 1) return name;

  if (name.length === 2) {
    return name[0] + "*";
  }

  return name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
};

export const Card = ({
  notice,
  className,
  pinned,
  star,
  title,
  content,
  username = "",
  date,
}: CardProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-col max-w-116 group border border-gray-300 p-10 hover:border-2 hover:border-pinned",
        pinned && "border-2 border-pinned",
        className,
      )}
    >
      {pinned && (
        <div className="absolute top-0 right-0 bg-pinned p-3.25">
          <PinIcon />
        </div>
      )}
      <StarRating value={star} readOnly />
      <p
        className={`title-20-b text-neutral-black pt-6 ${notice ? "line-clamp-2" : "line-clamp-1"}`}
      >
        {title}
      </p>
      <p className="typo-14-m text-gray-700 keep-all pt-6 h-21 line-clamp-3">
        {content}
      </p>
      <div className="flex items-center typo-14-m text-gray-600 pt-10 gap-3">
        {username && (
          <p className="relative pr-3 after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-3 after:w-px after:bg-gray-400">
            {maskName(username)}
          </p>
        )}
        <p>{date}</p>
      </div>
    </div>
  );
};
