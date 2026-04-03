"use client";

import { Button } from "../shared/ui/atoms/button";
import { StackedButtonGroup } from "../shared/ui/atoms/button/StackedButtonGroup";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-start gap-5 p-5">
        <Button size="list">목록</Button>
        <StackedButtonGroup
          topLabel="수정하기"
          bottomLabel="삭제하기"
          onTopClick={() => console.log("수정")}
          onBottomClick={() => console.log("삭제")}
        ></StackedButtonGroup>
      </div>
    </>
  );
}
