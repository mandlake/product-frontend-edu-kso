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

    // 프론트엔드에서 보낸 검색 타입(type)과 검색어(search)를 꺼냅니다.
    const searchType = url.searchParams.get("type") || ""; // "", "title", "content", "name"
    const searchQuery = url.searchParams.get("search")?.toLowerCase() || "";

    // 검색 조건이 있으면 원본 데이터에서 먼저 필터링합니다.
    let filteredReviews = [...currentReviews];

    if (searchQuery) {
      filteredReviews = filteredReviews.filter((review) => {
        const titleMatch = review.title.toLowerCase().includes(searchQuery);
        const contentMatch = review.contents
          .toLowerCase()
          .includes(searchQuery);
        const nameMatch = review.regId.toLowerCase().includes(searchQuery);

        // Select 박스 선택 항목에 따른 분기 처리
        if (searchType === "title") return titleMatch;
        if (searchType === "content") return contentMatch;
        if (searchType === "name") return nameMatch;

        // "전체" 선택 시 제목, 내용, 이름 중 하나라도 포함되면 매칭
        return titleMatch || contentMatch || nameMatch;
      });
    }

    // 쿼리 파라미터(page, size)가 없는 경우 전체 데이터 반환
    if (!pageParam || !sizeParam) {
      return HttpResponse.json(filteredReviews);
    }

    // 숫자로 변환 (기본값 설정)
    const page = Number(pageParam) || 1;
    const size = Number(sizeParam) || 9;

    // paginate 유틸리티를 사용하여 결과 반환
    const result = paginate(filteredReviews, page, size);

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
      password: body.password,
      regId: body.author,
      modDt: new Date().toISOString(), // 현재 시간 저장
      regDt: new Date().toISOString(),
      answerYn: "N",
      viewYn: "Y",
      files: body.images || [],
    };

    // 가상 DB(배열) 맨 앞에 새 리뷰 추가 (최신순 정렬을 위해 unshift 사용, 기존 방식이 유지되려면 push 사용)
    currentReviews.unshift(newReview);

    console.log("새 리뷰가 등록되었습니다:", newReview);

    // 성공 응답 반환 (201 Created)
    return HttpResponse.json(newReview, { status: 201 });
  }),
];
