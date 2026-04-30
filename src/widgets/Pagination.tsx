"use client";

import { useEffect } from "react";

import { cn } from "@/shared/lib/cn";
import { Button, ButtonProps } from "@/shared/ui/atoms/Button";
import { NextArrowIcon, NextDoubleArrowIcon } from "@/shared/ui/icons";

interface PaginationProps {
  isReset?: boolean;
  totalPages: number;
  currentPage?: number;
  handlePaging: (page: number) => void;
}

export function Pagination({
  isReset,
  totalPages,
  currentPage = 1,
  handlePaging,
}: PaginationProps) {
  const DISPLAY_PAGE_NUM = 5;

  const page = currentPage;

  const updatePage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    handlePaging(newPage);
  };

  useEffect(() => {
    if (isReset) {
      handlePaging(1);
    }
  }, [isReset, handlePaging]);

  const currentGroup = Math.ceil(page / DISPLAY_PAGE_NUM);
  const startPage = (currentGroup - 1) * DISPLAY_PAGE_NUM + 1;
  const endPage = Math.min(startPage + DISPLAY_PAGE_NUM - 1, totalPages);

  if (totalPages <= 0) return null;

  return (
    <div className="flex items-center justify-center gap-7.5 px-2 my-8">
      {/* 1. 첫 페이지로 이동 */}
      <PaginationItem onClick={() => updatePage(1)} disabled={page === 1}>
        <span className="sr-only">Go to first page</span>
        <NextDoubleArrowIcon
          className="h-4 w-4 -scale-x-100"
          isActive={currentPage !== 1}
        />
      </PaginationItem>

      {/* 2. 이전 페이지로 이동 (-1) */}
      <PaginationItem
        onClick={() => updatePage(page - 1)}
        disabled={page === 1}
      >
        <span className="sr-only">Go to previous page</span>
        <NextArrowIcon
          className="h-4 w-4 -scale-x-100"
          isActive={currentPage !== 1}
        />
      </PaginationItem>

      {/* 3. 숫자 배열 */}
      {Array.from(
        { length: endPage - startPage + 1 },
        (_, index) => startPage + index,
      ).map((pageNum) => (
        <PaginationItem
          key={pageNum}
          className={cn(
            "h-10 w-8 bg-transparent text-l rounded-none transition-colors hover:bg-transparent gap-1",
            page === pageNum
              ? "text-black font-bold border-b-[3px] border-black" // 활성: 검은 텍스트 + 두꺼운 검은 밑줄
              : "text-gray-300 font-medium border-b-[3px] border-transparent hover:text-gray-500", // 비활성: 옅은 회색 텍스트 + 투명한 밑줄 (들썩임 방지)
          )}
          onClick={() => updatePage(pageNum)}
        >
          {pageNum}
        </PaginationItem>
      ))}

      {/* 4. 다음 페이지로 이동 (+1) */}
      <PaginationItem
        onClick={() => updatePage(page + 1)}
        disabled={page === totalPages}
      >
        <span className="sr-only">Go to next page</span>
        <NextArrowIcon
          className="h-4 w-4"
          isActive={currentPage !== totalPages}
        />
      </PaginationItem>

      {/* 5. 마지막 페이지로 이동 */}
      <PaginationItem
        onClick={() => updatePage(totalPages)}
        disabled={page === totalPages}
      >
        <span className="sr-only">Go to last page</span>
        <NextDoubleArrowIcon
          className="h-4 w-4"
          isActive={currentPage !== totalPages}
        />
      </PaginationItem>
    </div>
  );
}

// 화살표 버튼과 숫자 버튼이 공통으로 사용하는 베이스 스타일
const PaginationItem = ({ children, className, ...props }: ButtonProps) => {
  return (
    <Button
      variant="outline"
      // 기본 테두리 제거(border-0) 및 투명한 배경 강제
      className={cn(
        "border-0 p-0 flex items-center justify-center bg-transparent",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
};
