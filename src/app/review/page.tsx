"use client";

import { useEffect, useState } from "react";
import { BoardSection } from "@/widgets/board-section/BoardSection";
import { BoardSectionContents } from "@/widgets/board-section/BoardSectionContents";

export default function ReviewPage() {
  const [keyword, setKeyword] = useState("");
  const [value, setValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const cardData = [
    {
      title:
        "제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목",
      content:
        "내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용",
      username: "남현희",
      date: "2023.11.13",
      star: 4,
    },
    {
      title:
        "제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목",
      content:
        "내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용",
      username: "남현희",
      date: "2023.11.13",
      star: 4,
    },
    {
      title:
        "제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목",
      content:
        "내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용",
      username: "남현희",
      date: "2023.11.13",
      star: 4,
    },
    {
      title:
        "제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목",
      content:
        "내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용",
      username: "남현희",
      date: "2023.11.13",
      star: 4,
    },
  ];

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
          cardLists={cardData}
          value={value}
          setValue={setValue}
          errorMessage="등록된 후기 게시글이 없습니다."
          isSearching={isSearching}
        />
      </BoardSection>
    </>
  );
}
