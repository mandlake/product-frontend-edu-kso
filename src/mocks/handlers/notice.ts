import { http, HttpResponse } from "msw";
import { mockExampleNotice } from "../data/ExampleNotice";
import { paginate } from "../util";

export const noticeHandlers = [
  http.get("/api/notice", ({ request }) => {
    const url = new URL(request.url);
    const pageParam = url.searchParams.get("page");
    const sizeParam = url.searchParams.get("size");

    // 전체 데이터 정렬
    const sortedData = [...mockExampleNotice].sort((a, b) => {
      if (a.topYn === "Y" && b.topYn !== "Y") return -1;
      if (a.topYn !== "Y" && b.topYn === "Y") return 1;
      return a.id - b.id;
    });

    // 쿼리 파라미터가 없으면 전체 데이터 반환
    if (!pageParam || !sizeParam) {
      return HttpResponse.json(sortedData);
    }

    // 유틸리티 함수를 사용하여 페이지네이션 처리
    const page = Number(pageParam) || 1;
    const size = Number(sizeParam) || 9;
    const result = paginate(sortedData, page, size);

    return HttpResponse.json(result);
  }),
];
