import { http, HttpResponse } from "msw";
import { mockExampleNotice } from "../data/ExampleNotice";
import { paginate } from "../util";

// 데이터 추가 및 변경이 가능하도록 let 변수로 초기화합니다.
const currentNotices = [...mockExampleNotice];

export const noticeHandlers = [
  http.get("/api/notice", ({ request }) => {
    const url = new URL(request.url);
    const pageParam = url.searchParams.get("page");
    const sizeParam = url.searchParams.get("size");

    // 프론트엔드에서 보낸 검색 타입(type)과 검색어(search)를 꺼냅니다.
    const searchType = url.searchParams.get("type") || ""; // "", "title", "content", "name"
    const searchQuery = url.searchParams.get("search")?.toLowerCase() || "";

    // 검색 조건이 있으면 원본 데이터에서 먼저 필터링합니다.
    let filteredNotices = [...currentNotices];

    if (searchQuery) {
      filteredNotices = filteredNotices.filter((review) => {
        const titleMatch = review.title?.toLowerCase().includes(searchQuery);
        const contentMatch = review.contents
          ?.toLowerCase()
          .includes(searchQuery);

        // Select 박스 선택 항목에 따른 분기 처리
        if (searchType === "title") return titleMatch;
        if (searchType === "content") return contentMatch;

        return titleMatch || contentMatch;
      });
    }

    // 전체 데이터 정렬
    const sortedData = [...filteredNotices].sort((a, b) => {
      if (a.topYn === "Y" && b.topYn !== "Y") return -1;
      if (a.topYn !== "Y" && b.topYn === "Y") return 1;

      return b.id - a.id;
    });

    const totalItems = sortedData.length;

    // 쿼리 파라미터가 없으면 전체 데이터 반환
    if (!pageParam || !sizeParam) {
      return HttpResponse.json({
        items: sortedData,
        totalPages: 1,
        totalItems: totalItems,
      });
    }

    // 유틸리티 함수를 사용하여 페이지네이션 처리
    const page = Number(pageParam) || 1;
    const size = Number(sizeParam) || 9;

    const result = paginate(sortedData, page, size);

    return HttpResponse.json({
      items: Array.isArray(result) ? result : result.items,
      totalPages: Array.isArray(result)
        ? Math.ceil(totalItems / size)
        : result.totalPages,
      totalItems: totalItems,
    });
  }),
];
