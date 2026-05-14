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
  const formattedDate = date ? new Date(date).toLocaleDateString("ko-KR") : "-";
  const maskedUser = username ? maskName(username) : "";

  return (
    <div
      className={cn(
        "relative flex flex-col w-116.25 group border border-gray-300 py-15 pl-10 pr-26.5 hover:border-2 hover:py-14.75 hover:pl-9.75 hover:pr-26.25 hover:border-pinned cursor-pointer",
        className,
      )}
      onClick={() => onClick?.(id)}
    >
      {/* 공지사항 전용: 핀 아이콘 */}
      {notice && pinned && (
        <div className="absolute top-0 right-0 bg-pinned p-3.25">
          <PinIcon />
        </div>
      )}

      {/* 일반 게시글 전용: 별점 */}
      {!notice && <StarRating value={star} readOnly />}

      <div className="flex-col justify-between">
        {/* 공통: 제목 (스타일만 분기) */}
        <p
          className={cn("title-20-b text-neutral-black pt-6", {
            "line-clamp-2": notice,
            "line-clamp-1": !notice,
          })}
        >
          {title}
        </p>

        {/* 조건부 본문 및 하단 영역 */}
        {notice ? (
          /* 공지사항 뷰 */
          <div className="flex items-center typo-14-m text-gray-700 pt-27">
            <p>{formattedDate}</p>
          </div>
        ) : (
          /* 일반 게시글 뷰 */
          <>
            <p className="typo-14-m text-gray-700 keep-all pt-6 h-21 line-clamp-3">
              {content}
            </p>
            <div className="flex items-center typo-14-m text-gray-700 pt-10 gap-2">
              {maskedUser && (
                <LineItem className="after:bg-gray-700">{maskedUser}</LineItem>
              )}
              <p>{formattedDate}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
