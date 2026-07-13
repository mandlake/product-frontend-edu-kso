"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { BoardSection } from "@/widgets/BoardSection";
import { Pagination } from "@/widgets/Pagination";
import { Card } from "@/shared/ui/molecules/Card";
import { NoDataIcon, NoReviewDataIcon } from "@/shared/ui/icons";
import { useReviews } from "@/hooks/useReviews";

export default function ReviewPage() {
  const router = useRouter();

  const [keyword, setKeyword] = useState("");
  const [value, setValue] = useState("");
  const [searchParams, setSearchParams] = useState({ type: "", keyword: "" });

  const [isSearching, setIsSearching] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const { reviewList, totalPage, totalCount } = useReviews(
    currentPage,
    searchParams,
  );

  // 페이지 번호를 클릭했을 때 실행될 함수
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // 카드를 클릭하면 팝업이 열림
  const handleClick = (id: string | number) => {
    const review = reviewList.find((item) => item.id === id);
    if (review) {
      router.push(`/review/${id}`);
    }
  };

  return (
    <>
      <BoardSection
        title="후기 게시판"
        subTitle="미켈란 골프투어 이용에 대한 소중한 경험을 나눠주세요."
        searchProps={{
          totalCount,
          countLabel: "후기",
          selectOptions: [
            { label: "전체", value: "" },
            { label: "제목", value: "title" },
            { label: "내용", value: "content" },
            { label: "이름", value: "name" },
          ],
          selectValue: value,
          onSelectChange: setValue,
          keyword: keyword,
          onKeywordChange: setKeyword,
          setCurrentPage,
          setIsSearching,
          setSearchParams,
        }}
        hasButton
      >
        <section className="pt-5 min-h-111 w-365">
          {/* 카드 영역 : 데이터가 있을 때 */}
          <div>
            {reviewList?.length ? (
              <div className="flex flex-wrap mt-7.5 gap-7.5 pb-15 border-b border-gray-300">
                {reviewList?.map((cardProps, index) => (
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
            {!reviewList?.length ? (
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
          {reviewList?.length ? (
            <div className="mt-15 mb-35.25">
              <Pagination
                totalPages={totalPage}
                currentPage={currentPage}
                handlePaging={handlePageChange}
              />
            </div>
          ) : null}
        </section>
      </BoardSection>
    </>
  );
}
