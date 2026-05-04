"use client";

import { useState } from "react";
import { BoardSection } from "@/widgets/board-section/BoardSection";
import { BoardSectionContents } from "@/widgets/board-section/BoardSectionContents";
import { reviewData } from "@/entities/board";

export default function DetailReviewPage() {
  const [keyword, setKeyword] = useState("");
  const [value, setValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (value: string) => {
    console.log("검색:", value);
    setIsSearching(true);
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
          setValue={setValue}
          errorMessage="등록된 후기 게시글이 없습니다."
          isSearching={isSearching}
        />
      </BoardSection>
    </>
  );
}
