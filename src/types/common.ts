// 공통 데이터 타입
export interface DataItem<T> {
  totalPages: number;
  totalElements: number;
  size: number;
  content: T[];
  number: number;
  sort: SortProps;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: PageProps;
  empty: boolean;
}

interface SortProps {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

// 컨텐츠
export interface ContentProps {
  id: number;
  title: string;
  regId: string;
  regDt: string;
  modDt: string;
  viewYn: "N" | "Y";
  contents: string;
  num?: number;
}

//file
export interface FileProps {
  fileId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  blobURL?: string;
  fileLocal?: boolean;
  url?: string;
}

// 페이징
export interface PageProps {
  offset: number;
  sort: SortProps;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
}

// 공통 등록 데이터
export interface FormRequest {
  id?: string;
  title?: string;
  viewYn?: "Y" | "N";
}

// 이전 다음 페이징
export interface DetailPageProps {
  id: string;
  title: string;
}

// 공통 미리보기 파일 타입
export interface PreviewFile {
  file: File;
  previewUrl: string;
}
