"use client";

import Select from "@/shared/ui/atoms/Select";
import { NoDataIcon } from "@/shared/ui/icons";
import { NoReviewDataIcon } from "@/shared/ui/icons/NoReviewDataIcon";
import { Card } from "@/shared/ui/molecules/Card";
import { SearchInput } from "@/shared/ui/molecules/SearchInput";

// TODO : 데이터 수정, 카드 데이터 받아오기

interface CardProps {
  notice?: boolean;
  hover?: boolean;
  pinned?: boolean;
  className?: string;
  star?: number;
  title?: string;
  content?: string;
  username?: string;
  date?: string;
}

interface BoardSectionContentsProps {
  cardLists?: CardProps[];
  searchLists?: CardProps[];
  isSearching: boolean;
  value: string;
  setValue: (value: string) => void;
  keyword: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  errorMessage?: string;
}

export const BoardSectionContents = ({
  cardLists,
  searchLists,
  isSearching,
  value,
  setValue,
  keyword,
  onChange,
  onSearch,
  errorMessage,
}: BoardSectionContentsProps) => {
  return (
    <section className="pt-5 min-h-111">
      {/* 게시판 콘텐츠 영역 */}
      <div className="flex flex-row items-center justify-between">
        {cardLists?.length ? (
          <p className="typo-14-m font-gray-800">
            총{" "}
            <span className="font-bold text-sub-yellow">
              {cardLists?.length || 0}건
            </span>
            의 후기가 있습니다.
          </p>
        ) : (
          <p></p>
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
      {cardLists?.map((cardProps, index) => (
        <Card key={index} {...cardProps} />
      ))}
      {!cardLists?.length && isSearching ? (
        <div className="border-b border-gray-300 pt-20 pb-35 flex flex-col gap-7.5 items-center justify-center">
          <NoDataIcon className="w-15.5 h-15.5" />
          <p className="typo-16-m text-gray-600 text-center">
            검색 결과가 없습니다.
          </p>
        </div>
      ) : (
        <div className="border-b border-gray-300 pt-20 pb-35 flex flex-col gap-7.5 items-center justify-center">
          <NoReviewDataIcon className="w-15.5 h-15.5" />
          <p className="typo-16-m text-gray-600 text-center">
            {errorMessage || "검색 결과가 없습니다."}
          </p>
        </div>
      )}
    </section>
  );
};
