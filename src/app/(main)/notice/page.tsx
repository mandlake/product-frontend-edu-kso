"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { BoardSection } from "@/widgets/BoardSection";
import { Card } from "@/shared/ui/molecules/Card";
import { NoDataIcon } from "@/shared/ui/icons";
import { Pagination } from "@/widgets/Pagination";
import { useNotice } from "@/hooks/useNotices";

export default function NoticePage() {
  const router = useRouter();

  const [keyword, setKeyword] = useState("");
  const [value, setValue] = useState("");
  const [searchParams, setSearchParams] = useState({ type: "", keyword: "" });

  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  const { noticeList, totalPage, totalCount } = useNotice(
    currentPage,
    searchParams,
  );

  // 페이지 번호를 클릭했을 때 실행될 함수
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // 카드를 클릭하면 상세 페이지로 이동
  const handleClick = (id: number) => {
    router.push(`/notice/${id}`);
  };

  return (
    <>
      <BoardSection
        title="공지사항"
        subTitle="미켈란 골프투어 이용에 관련된 새로운 소식을 알려드립니다."
        searchProps={{
          totalCount,
          countLabel: "공지사항",
          selectOptions: [
            { label: "전체", value: "" },
            { label: "제목", value: "title" },
            { label: "내용", value: "content" },
          ],
          selectValue: value,
          onSelectChange: setValue,
          keyword: keyword,
          onKeywordChange: setKeyword,
          // 상태 업데이트 함수 전달 (handleSearch 로직을 BoardSection이 처리함)
          setCurrentPage,
          setIsSearching,
          setSearchParams,
        }}
      >
        <section>
          {/* 카드 영역 : 데이터가 있을 때 */}
          {noticeList?.length ? (
            <div className="flex flex-wrap mt-7.5 gap-7.25 pb-15 border-b border-gray-300">
              {noticeList?.map((cardProps, index) => (
                <Card
                  key={index}
                  id={cardProps.id}
                  title={cardProps.title}
                  content={cardProps.contents}
                  username={cardProps.regId}
                  date={cardProps.modDt}
                  pinned={cardProps.topYn === "Y"}
                  notice
                  onClick={handleClick}
                />
              ))}
            </div>
          ) : null}

          {/* 카드 영역 : 데이터가 없을 때 */}
          {!noticeList?.length ? (
            isSearching ? (
              <div className="border-b border-gray-300 pt-20 pb-35 flex flex-col gap-7.5 items-center justify-center">
                <NoDataIcon className="w-15.5 h-15.5" />
                <p className="typo-16-m text-gray-600 text-center">
                  검색 결과가 없습니다.
                </p>
              </div>
            ) : (
              <div className="border-b border-gray-300 pt-20 pb-35 flex flex-col gap-7.5 items-center justify-center">
                <NoDataIcon className="w-15.5 h-15.5" />
                <p className="typo-16-m text-gray-600 text-center">
                  등록된 공지사항이 없습니다.
                </p>
              </div>
            )
          ) : null}

          {/* 페이지네이션 영역 */}
          {noticeList?.length ? (
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
