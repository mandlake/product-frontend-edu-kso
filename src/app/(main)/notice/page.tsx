"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { noticeData } from "@/entities/board";
import { BoardSection } from "@/widgets/board-section/BoardSection";
import { BoardSectionContents } from "@/widgets/board-section/BoardSectionContents";

export default function NoticePage() {
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
    router.push(`/notice/${id}`);
  };

  return (
    <>
      <BoardSection
        title="공지사항"
        subTitle="미켈란 골프투어 이용에 관련된 새로운 소식을 알려드립니다."
      >
        <BoardSectionContents
          keyword={keyword}
          onChange={setKeyword}
          onSearch={handleSearch}
          cardLists={noticeData}
          value={value}
          setValue={setValue}
          onClick={handleClick}
          errorMessage="등록된 공지사항이 없습니다."
          isSearching={isSearching}
          notice
        />
      </BoardSection>
    </>
  );
}
