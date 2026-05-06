"use client";

import { usePathname } from "next/navigation";

import { getBreadcrumbLabel } from "@/shared/lib/navigation";
import { BreadcrumbHeader } from "@/shared/ui/molecules/BreadcrumbHeader";
import { StarRating } from "@/shared/ui/atoms/StarRating";
import { LineItem } from "@/shared/ui/atoms/LineItem";
import { maskName } from "@/shared/lib/masking";
import { DropdownMenu } from "@/shared/ui/molecules/DropdownMenu";

interface ReviewDetailProps {
  review: {
    id: number;
    title: string;
    star: number;
    username: string;
    date: string;
    content: string;
  };
  onBackToList: () => void;
}

export const ReviewDetail = ({ review, onBackToList }: ReviewDetailProps) => {
  const pathname = usePathname();
  const breadcrumbLabel = getBreadcrumbLabel(pathname);

  // KebabMenu에 들어갈 아이템 구성
  const kebabMenuItems = [
    { label: "수정하기", onClick: () => console.log("수정") },
    { label: "삭제하기", onClick: () => console.log("삭제") },
  ];

  return (
    <section className="px-57.75 pt-7.5">
      {/* Board Section Header */}
      <BreadcrumbHeader items={[{ label: breadcrumbLabel }]} />

      {/* 게시판 헤더 영역 */}
      <div className="mt-15 w-364.75">
        <h2 className="title-36-b text-gray-900">{review.title}</h2>

        <div className="mt-2.5 flex justify-between items-start h-22.75 border-b border-gray-700">
          <div className="flex flex-row justify-center items-center gap-7.5">
            <StarRating value={review.star} readOnly />
            <div className="flex items-center typo-14-m text-gray-700 gap-2">
              <LineItem className="after:bg-gray-700">
                {maskName(review.username)}
              </LineItem>
              <p>{review.date}</p>
            </div>
          </div>
          <DropdownMenu items={kebabMenuItems} />
        </div>
      </div>

      {/* 게시판 콘텐츠 영역 */}
    </section>
  );
};
