import { http, HttpResponse } from "msw";
import { mockExampleReviews } from "../data/ExampleReview";
import { paginate } from "../util";
import { CreateReviewPayload, ReviewItem } from "@/types/review";

// 데이터 추가 및 변경이 가능하도록 let 변수로 초기화합니다.
const currentReviews = [...mockExampleReviews];

export const reviewHandlers = [
  http.get("/api/reviews", ({ request }) => {
    const url = new URL(request.url);
    const pageParam = url.searchParams.get("page");
    const sizeParam = url.searchParams.get("size");

    // 쿼리 파라미터(page, size)가 없는 경우 전체 데이터 반환
    if (!pageParam || !sizeParam) {
      return HttpResponse.json(currentReviews);
    }

    // 숫자로 변환 (기본값 설정)
    const page = Number(pageParam) || 1;
    const size = Number(sizeParam) || 9;

    // paginate 유틸리티를 사용하여 결과 반환
    const result = paginate(currentReviews, page, size);

    return HttpResponse.json(result);
  }),

  // 리뷰 등록 (post)
  http.post("/api/reviews/create", async ({ request }) => {
    const body = (await request.json()) as CreateReviewPayload;

    // 기존 데이터 중 가장 큰 ID를 찾아 +1을 합니다. 데이터가 비어있을 때를 대비해 기본값은 0
    const nextId =
      currentReviews.length > 0
        ? Math.max(...currentReviews.map((r) => r.id)) + 1
        : 1;

    const newReview: ReviewItem = {
      id: nextId,
      title: body.title,
      contents: body.content, 
      rating: String(body.rating),
      regId: body.author, 
      modDt: new Date().toISOString(), // 현재 시간 저장
      regDt: new Date().toISOString(),
      answerYn: "N",
      viewYn: "Y", 
      files: body.images || [],
    };

    // 가상 DB(배열) 맨 앞에 새 리뷰 추가 (최신순 정렬을 위해 unshift 사용, 기존 방식이 유지되려면 push 사용)
    currentReviews.unshift(newReview);

    console.log("MSW에 새 리뷰가 등록되었습니다:", newReview);

    // 성공 응답 반환 (201 Created)
    return HttpResponse.json(newReview, { status: 201 });
  }),
];
