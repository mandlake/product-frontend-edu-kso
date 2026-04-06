"use client";

import { Button, StackedButtonGroup } from "../shared/ui/atoms/button";
import { Checkbox } from "../shared/ui/atoms/Checkbox";

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
        <Checkbox label="개인정보 수집 및 이용 동의" />
      </div>
    </>
  );
}
