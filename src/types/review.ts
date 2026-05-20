import { FileProps, ContentProps, FormRequest } from "./common";

// 리뷰
export interface ReviewItem extends ContentProps {
  rating: string;
  answerYn: "N" | "Y";
  files: FileProps[];
  comment?: string;
  password: string,
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