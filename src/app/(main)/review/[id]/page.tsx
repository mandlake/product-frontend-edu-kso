"use client";

import { useState } from "react";

import { ReviewDetail } from "@/widgets/review-detail/ReviewDetail";

export default function DetailReviewPage() {
  return (
    <>
      <ReviewDetail
        review={{
          id: 1,
          title: "친절한 직원과 환상적인 뷰!!",
          star: 3,
          username: "홍길동",
          date: "2026.05.06",
          content:
            "우선, 직원분들이 너무 친절하시고!\n골프 리조트답게 렌탈 클럽도 컨디션도 훌륭했고 광활한 뷰를 즐기며 여유롭게 라운드를 했습니다.\n날씨도 좋고 잔디도 좋고 코스도 너무 좋았습니다~~~\n즐겁고 행복한 라운딩이었습니다. 다음에 또 오겠습니다!!!",
          next: {
            id: 2,
            title: "완벽하게 휴식할 수 있는 곳 꼭 다시 들려요.",
          },
        }}
      ></ReviewDetail>
    </>
  );
}
