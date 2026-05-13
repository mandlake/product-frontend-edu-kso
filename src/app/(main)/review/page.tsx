"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { BoardSection } from "@/widgets/BoardSection";
import { mockExampleReviews } from "@/mocks/data/ExampleReviews";
import Select from "@/shared/ui/atoms/Select";
import { SearchInput } from "@/shared/ui/molecules/SearchInput";
import { Card } from "@/shared/ui/molecules/Card";
import { NoDataIcon, NoReviewDataIcon } from "@/shared/ui/icons";
import { Pagination } from "@/widgets/Pagination";

export default function ReviewPage() {
  const router = useRouter();

  const [keyword, setKeyword] = useState("");
  const [value, setValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // 페이지 번호를 클릭했을 때 실행될 함수
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // 검색 시 실행될 함수
  const handleSearch = (value: string) => {
    console.log("검색:", value);
    setIsSearching(true);
  };

  // 카드를 클릭하면 상세 페이지로 이동
  const handleClick = (id: number) => {
    router.push(`/review/${id}`);
  };

  return (
    <>
      <BoardSection
        title="후기 게시판"
        subTitle="미켈란 골프투어 이용에 대한 소중한 경험을 나눠주세요."
        hasButton
      >
        {/* 검색창 영역 */}
        <div className="flex flex-row items-center justify-between">
          {mockExampleReviews?.length ? (
            <p className="typo-14-m font-gray-800">
              총{" "}
              <span className="font-bold text-sub-yellow">
                {mockExampleReviews?.length}건
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
              onChange={setKeyword}
              onSearch={handleSearch}
            />
          </div>

          {/* 카드 영역 : 데이터가 있을 때 */}
          {mockExampleReviews?.length ? (
            <div className="flex flex-wrap mt-7.5 gap-7.5 pb-15 border-b border-gray-300">
              {mockExampleReviews?.map((cardProps, index) => (
                <Card
                  key={index}
                  id={cardProps.id}
                  title={cardProps.title}
                  content={cardProps.contents}
                  username={cardProps.regId}
                  date={cardProps.modDt}
                  star={cardProps.rating}
                  onClick={handleClick}
                />
              ))}
            </div>
          ) : null}

          {/* 카드 영역 : 데이터가 없을 때 */}
          {!mockExampleReviews?.length ? (
            isSearching ? (
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
                  등록된 후기 게시글이 없습니다.
                </p>
              </div>
            )
          ) : null}
        </div>

        {/* 페이지네이션 영역 */}

        {mockExampleReviews?.length ? (
          <div className="mt-15 mb-35.25">
            <Pagination
              totalPages={Math.ceil(mockExampleReviews?.length / 9)}
              currentPage={currentPage}
              handlePaging={handlePageChange}
            />
          </div>
        ) : null}
      </BoardSection>
    </>
  );
}
