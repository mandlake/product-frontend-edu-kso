"use client";

import { useState } from "react";

import Select from "@/shared/ui/atoms/Select";
import { NoDataIcon } from "@/shared/ui/icons";
import { NoReviewDataIcon } from "@/shared/ui/icons";
import { Card } from "@/shared/ui/molecules/Card";
import { SearchInput } from "@/shared/ui/molecules/SearchInput";
import { CardProps } from "@/entities/board";

import { Pagination } from "../Pagination";

interface BoardSectionContentsProps {
  cardLists?: CardProps[];
  isSearching: boolean;
  value: string;
  setValue: (value: string) => void;
  keyword: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  onClick?: (id: number) => void;
  errorMessage?: string;
  notice?: boolean;
}

export const BoardSectionContents = ({
  cardLists,
  isSearching,
  value,
  setValue,
  keyword,
  onChange,
  onSearch,
  errorMessage,
  onClick,
  notice,
}: BoardSectionContentsProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  // 페이지 번호를 클릭했을 때 실행될 함수
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <section className="pt-5 min-h-111 w-364.75">
      {/* 게시판 콘텐츠 영역 */}
      <div className="flex flex-row items-center justify-between">
        {cardLists?.length ? (
          <p className="typo-14-m font-gray-800">
            총{" "}
            <span className="font-bold text-sub-yellow">
              {cardLists?.length}건
            </span>
            의 후기가 있습니다.
          </p>
        ) : (
          <div></div>
        )}
        <div className="flex flex-row gap-5">
          <Select
            value={value}
            onChange={setValue}
            options={[
              { label: "전체", value: "" },
              { label: "사과", value: "apple" },
              { label: "바나나", value: "banana" },
              { label: "포도", value: "grape" },
            ]}
          />
          <SearchInput
            value={keyword}
            onChange={onChange}
            onSearch={onSearch}
          />
        </div>
      </div>
      {cardLists?.length ? (
        <div className="flex flex-wrap mt-7.5 gap-7.5 pb-15 border-b border-gray-300">
          {cardLists?.map((cardProps, index) => (
            <Card
              key={index}
              id={cardProps.id}
              title={cardProps.title}
              content={cardProps.content}
              username={cardProps.username}
              date={cardProps.date}
              star={cardProps.star}
              pinned={cardProps.pinned}
              notice
              onClick={onClick}
            />
          ))}
        </div>
      ) : null}
      {!cardLists?.length ? (
        isSearching ? (
          <div className="border-b border-gray-300 pt-20 pb-35 flex flex-col gap-7.5 items-center justify-center">
            <NoDataIcon className="w-15.5 h-15.5" />
            <p className="typo-16-m text-gray-600 text-center">
              검색 결과가 없습니다.
            </p>
          </div>
        ) : (
          <div className="border-b border-gray-300 pt-20 pb-35 flex flex-col gap-7.5 items-center justify-center">
            {notice ? (
              <NoDataIcon className="w-15.5 h-15.5" />
            ) : (
              <NoReviewDataIcon className="w-15.5 h-15.5" />
            )}
            <p className="typo-16-m text-gray-600 text-center">
              {errorMessage || "검색 결과가 없습니다."}
            </p>
          </div>
        )
      ) : null}

      {cardLists?.length ? (
        <div className="mt-15 mb-35.25">
          <Pagination
            totalPages={Math.ceil(cardLists?.length / 9)}
            currentPage={currentPage}
            handlePaging={handlePageChange}
          />
        </div>
      ) : null}
    </section>
  );
};
