"use client";

import { Button } from "@/shared/ui/atoms/Button";
import { BreadcrumbHeader } from "@/shared/ui/molecules/BreadcrumbHeader";

interface BoardSectionProps {
  title: string;
  subTitle: string;
  hasButton?: boolean; // 후기 작성하기 버튼 포함 여부
  children?: React.ReactNode;
}

export const BoardSection = ({
  title,
  subTitle,
  hasButton,
  children,
}: BoardSectionProps) => {
  return (
    <section className="px-57.75 pt-7.5">
      {/* Board Section Header */}
      <BreadcrumbHeader title={title} />

      {/* 게시판 헤더 영역 */}
      <div className="mt-15 w-364.75">
        <h2 className="title-44-b text-gray-900">{title}</h2>
        <div className="mt-4 flex justify-between items-start h-22.75 border-b border-gray-700">
          {subTitle && (
            <p className="pt-4 text-gray-700 typo-16-r/1.4">{subTitle}</p>
          )}
          {hasButton && (
            <Button variant="default" className="w-35 h-12.5">
              후기 작성하기
            </Button>
          )}
        </div>
      </div>

      {/* 게시판 콘텐츠 영역 */}
      {children}
    </section>
  );
};
