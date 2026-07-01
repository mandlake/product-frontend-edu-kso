"use client";

import { useEffect, useState } from "react";

import { fetchNotices } from "@/api/notice.api";
import { NoticeItem } from "@/types/notice";

export const useNotice = (
  currentPage: number,
  searchParams: {
    type?: string;
    keyword?: string;
  },
) => {
  const [noticeList, setNoticeList] = useState<NoticeItem[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadNotices = async () => {
      try {
        setIsLoading(true);
        const data = await fetchNotices({
          currentPage,
          type: searchParams.type,
          keyword: searchParams.keyword,
        });

        setNoticeList(data.items);
        setTotalPage(data.totalPages);
        setTotalCount(data.totalItems || 0);
      } catch (error) {
        console.error("공지사항을 불러오는 중 오류가 발생했습니다:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotices();
  }, [currentPage, searchParams.type, searchParams.keyword]);

  return { noticeList, totalPage, totalCount, isLoading };
};
