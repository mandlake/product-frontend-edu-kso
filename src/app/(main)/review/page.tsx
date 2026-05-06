"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { BoardSection } from "@/widgets/board-section/BoardSection";
import { BoardSectionContents } from "@/widgets/board-section/BoardSectionContents";
import { reviewData } from "@/entities/board";

export default function ReviewPage() {
  const router = useRouter();

  const [keyword, setKeyword] = useState("");
  const [value, setValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

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
        <BoardSectionContents
          keyword={keyword}
          onChange={setKeyword}
          onSearch={handleSearch}
          cardLists={reviewData}
          value={value}
          onClick={handleClick}
          setValue={setValue}
          errorMessage="등록된 후기 게시글이 없습니다."
          isSearching={isSearching}
        />
      </BoardSection>
    </>
  );
}
