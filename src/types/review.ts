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
