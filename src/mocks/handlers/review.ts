import { http, HttpResponse } from "msw";
import { mockExampleReviews } from "../data/ExampleReview";
import { paginate } from "../util";

export const reviewHandlers = [
  http.get("/api/reviews", ({ request }) => {
    const url = new URL(request.url);
    const pageParam = url.searchParams.get("page");
    const sizeParam = url.searchParams.get("size");

    // 쿼리 파라미터(page, size)가 없는 경우 전체 데이터 반환
    if (!pageParam || !sizeParam) {
      return HttpResponse.json(mockExampleReviews);
    }

    // 숫자로 변환 (기본값 설정)
    const page = Number(pageParam) || 1;
    const size = Number(sizeParam) || 9;

    // paginate 유틸리티를 사용하여 결과 반환
    const result = paginate(mockExampleReviews, page, size);

    return HttpResponse.json(result);
  }),
];
