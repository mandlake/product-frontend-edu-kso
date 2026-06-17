"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

import { Button } from "@/shared/ui/atoms/Button";
import { BreadcrumbHeader } from "@/shared/ui/molecules/BreadcrumbHeader";
import { getBreadcrumbLabel } from "@/shared/lib/navigation";
import Select from "@/shared/ui/atoms/Select";
import { SearchInput } from "@/shared/ui/molecules/SearchInput";

// 검색 영역 Prop
export interface BoardSearchProps {
  totalCount: number;
  countLabel?: string;
  selectOptions: { label: string; value: string }[];
  selectValue: string;
  onSelectChange: (value: string) => void;
  keyword: string;
  onKeywordChange: (value: string) => void;

  // 추가된 상태 변경 함수들
  setCurrentPage: (page: number) => void;
  setIsSearching: (isSearching: boolean) => void;
  setSearchParams: (params: { type: string; keyword: string }) => void;
}

interface BoardSectionProps {
  title: string;
  subTitle: string;
  hasButton?: boolean;
  searchProps?: BoardSearchProps;
  children?: React.ReactNode;
}

export const BoardSection = ({
  title,
  subTitle,
  hasButton,
  searchProps,
  children,
}: BoardSectionProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const breadcrumbLabel = getBreadcrumbLabel(pathname);

  const handleSearch = (searchVal: string) => {
    if (!searchProps) return;

    console.log("검색 필터: ", searchProps.selectValue, "검색어: ", searchVal);

    searchProps.setCurrentPage(1);
    searchProps.setIsSearching(!!searchVal);
    searchProps.setSearchParams({
      type: searchProps.selectValue,
      keyword: searchVal,
    });
  };

  return (
    <section className="px-57.75 pt-7.5">
      {/* Board Section Header */}
      <BreadcrumbHeader items={[{ label: breadcrumbLabel }]} />

      {/* 게시판 헤더 영역 */}
      <div className="mt-15 w-364.75">
        <h2 className="title-44-b text-gray-900">{title}</h2>

        <div className="mt-4 flex justify-between items-start h-22.75 border-b border-gray-700">
          {subTitle && (
            <p className="pt-4 text-gray-700 typo-16-r/1.4">{subTitle}</p>
          )}
          {hasButton && (
            <Button
              variant="default"
              className="w-35 h-12.5"
              onClick={() => router.push(`/review/create`)}
            >
              후기 작성하기
            </Button>
          )}
        </div>
      </div>

      {/* 게시판 콘텐츠 영역 & 검색창 영역 */}
      <section className="pt-5 min-h-111 w-365">
        {/* 검색창 영역 */}
        {searchProps && (
          <div className="flex flex-row items-center justify-between">
            {searchProps.totalCount > 0 ? (
              <p className="typo-14-m font-gray-800">
                총{" "}
                <span className="font-bold text-primary-dark">
                  {searchProps.totalCount}건
                </span>
                의 {searchProps.countLabel || "게시물"}이 있습니다.
              </p>
            ) : (
              <div></div>
            )}
            <div className="flex flex-row gap-5">
              <Select
                value={searchProps.selectValue}
                onChange={searchProps.onSelectChange}
                options={searchProps.selectOptions}
              />
              <SearchInput
                value={searchProps.keyword}
                onChange={searchProps.onKeywordChange}
                onSearch={handleSearch}
              />
            </div>
          </div>
        )}

        {/* 카드 및 페이지네이션 (Chidren) */}
        {children}
      </section>
    </section>
  );
};
