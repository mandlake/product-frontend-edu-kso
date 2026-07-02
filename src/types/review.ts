import { FileProps, ContentProps, FormRequest } from "./common";

// 리뷰
export interface ReviewItem extends ContentProps {
  rating: string;
  answerYn: "N" | "Y";
  files: FileProps[];
  comment?: string;
  password: string;
}

export interface ReviewDetailResponse extends ReviewItem {
  before: { id: number; title: string } | null;
  next: { id: number; title: string } | null;
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
  password: string;
  isPrivacyAgree?: boolean;
  images?: FileProps[];
}

export interface FetchReviewsParams {
  currentPage: number;
  type?: string;
  keyword?: string;
}

export interface ReviewFormData {
  rating: string;
  title: string;
  content: string;
  author: string;
  password?: string;
  isPrivacyAgree: boolean;
}

export interface ImageFileItem {
  file: File;
  previewUrl: string;
}
