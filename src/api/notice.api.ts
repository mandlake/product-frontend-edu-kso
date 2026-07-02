import { FetchNoticesParams } from "@/types/notice";

export const fetchNotices = async ({
  currentPage,
  type,
  keyword,
}: FetchNoticesParams) => {
  const baseUrl = `/api/notice?page=${currentPage}&size=9`;
  const queryType = type ? `&type=${type}` : "";
  const queryKeyword = keyword ? `&search=${encodeURIComponent(keyword)}` : "";

  const response = await fetch(`${baseUrl}${queryType}${queryKeyword}`);
  if (!response.ok) throw new Error("공지사항을 불러오는데 실패했습니다.");

  return response.json();
};
