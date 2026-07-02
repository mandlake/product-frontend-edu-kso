import { fileToBase64 } from "@/shared/lib/fileToBase64";
import {
  FetchReviewsParams,
  ImageFileItem,
  ReviewFormData,
} from "@/types/review";

// 리뷰 목록 조회
export const fetchReviews = async ({
  currentPage,
  type,
  keyword,
}: FetchReviewsParams) => {
  const baseUrl = `/api/reviews?page=${currentPage}&size=9`;
  const queryType = type ? `&type=${type}` : "";
  const queryKeyword = keyword ? `&search=${encodeURIComponent(keyword)}` : "";

  const response = await fetch(`${baseUrl}${queryType}${queryKeyword}`);
  if (!response.ok) throw new Error("후기 데이터를 불러오는데 실패했습니다.");

  return response.json();
};

// 리뷰 상세 조회
export const fetchReviewDetail = async (id: string) => {
  const response = await fetch(`/api/reviews/${id}`);
  if (!response.ok) {
    throw new Error("리뷰를 불러오는데 실패했습니다.");
  }
  return response.json();
};

// 리뷰 등록
export const createReview = async (
  formData: ReviewFormData,
  items: ImageFileItem[],
) => {
  const base64Images = await Promise.all(
    items.map(async (item, index) => {
      const base64Url = await fileToBase64(item.file);
      return {
        fileId: `temp_file_${Date.now()}_${index}`,
        fileName: item.file.name,
        fileSize: item.file.size,
        fileType: item.file.type,
        url: base64Url,
        fileLocal: true,
      };
    }),
  );

  const payload = {
    ...formData,
    rating: Number(formData.rating),
    images: base64Images,
  };

  const response = await fetch("/api/reviews/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("서버 응답 에러: ", errorData);
    throw new Error("리뷰 등록에 실패했습니다.");
  }

  return response.json();
};
