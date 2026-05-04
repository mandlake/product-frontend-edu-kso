import { BOARD_NAME_MAP } from "../config/navigation";

export const getBreadcrumbLabel = (pathname: string): string => {
  const rootPath = pathname.split("/")[1];
  return BOARD_NAME_MAP[rootPath] || "게시판";
};
