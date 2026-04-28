"use client";

import { BoardSection } from "@/widgets/board-section/BoardSection";
import { BoardSectionContents } from "@/widgets/board-section/BoardSectionContents";
import { useState } from "react";

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

export default function NoticePage() {
  const [keyword, setKeyword] = useState("");
  const [value, setValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const cardData: CardProps[] = [
    {
      title:
        "제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목",
      pinned: true,
      date: "2023.11.13",
    },
    {
      title:
        "제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목",
      pinned: true,
      date: "2023.11.13",
    },
    {
      title:
        "제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목",
      date: "2023.11.13",
    },
    {
      title:
        "제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목",
      date: "2023.11.13",
    },
  ];

  const handleSearch = (value: string) => {
    console.log("검색:", value);
    setIsSearching(true);
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
          cardLists={cardData}
          value={value}
          setValue={setValue}
          errorMessage="등록된 공지사항이 없습니다."
          isSearching={isSearching}
          notice
        />
      </BoardSection>
    </>
  );
}
