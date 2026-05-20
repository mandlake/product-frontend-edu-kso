import { FileProps, ContentProps, FormRequest } from "./common";

// 리뷰
export interface ReviewItem extends ContentProps {
  rating: string;
  answerYn: "N" | "Y";
  files: FileProps[];
  comment?: string;
}

export interface FormReview extends FormRequest {
  comment?: string;
  [key: string]: unknown;
}

export interface CreateReviewPayload {
  rating: string;
  title: string;
  content: string;
  author: string;
  password?: string;      // 필요 시 추가
  isPrivacyAgree?: boolean; // 필요 시 추가
  images?: FileProps[];         // 파일 객체나 프리뷰 문자열 배열
}