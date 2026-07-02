import {
  FileProps,
  ContentProps,
  FormRequest,
  DetailPageProps,
} from "./common";

// 공지사항
export interface NoticeItem extends ContentProps {
  topYn: "N" | "Y";
  startDt: string;
  endDt?: string;
  date?: {
    from: string;
    to: string;
  };
  existFiles: boolean;
}

export interface NoticeDetailResponse extends ContentProps {
  startDt: string;
  endDt: string;
  files: FileProps[];
  topYn: string;
  date: {
    from: string;
    to: string;
  };
  prevNotice: DetailPageProps;
  nextNotice: DetailPageProps;
}

export interface FormNotice extends FormRequest {
  files?: string[];
  startDt: string;
  endDt: string;
  contents: string;
  topYn: "Y" | "N";
  attachment?: File[];
  [key: string]: unknown;
}

export interface FetchNoticesParams {
  currentPage: number;
  type?: string;
  keyword?: string;
}
