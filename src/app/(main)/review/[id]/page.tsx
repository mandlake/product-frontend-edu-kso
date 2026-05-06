"use client";

import { useState } from "react";

import { ReviewDetail } from "@/widgets/review-detail/ReviewDetail";

export default function DetailReviewPage() {
  return (
    <>
      <ReviewDetail
        review={{
          id: 1,
          title: "제목",
          star: 3,
          username: "홍길동",
          date: "2026.05.06",
          content: "내용",
        }}
        onBackToList={function (): void {
          throw new Error("Function not implemented.");
        }}
      ></ReviewDetail>
    </>
  );
}
