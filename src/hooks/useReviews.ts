"use client";

import { useEffect, useState } from "react";

import { ParamValue } from "next/dist/server/request/params";

import {
  fetchReviews,
  fetchReviewDetail,
  createReview,
  updateReview,
} from "@/api/review.api";
import {
  ReviewDetailResponse,
  ReviewItem,
  ImageFileItem,
  ReviewFormData,
} from "@/types/review";

export const useReviews = (
  currentPage: number,
  searchParams: {
    type?: string;
    keyword?: string;
  },
) => {
  const [reviewList, setReviewList] = useState<ReviewItem[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const loadReview = async () => {
      try {
        const data = await fetchReviews({
          currentPage,
          type: searchParams.type,
          keyword: searchParams.keyword,
        });

        setReviewList(data.items);
        setTotalPage(data.totalPages);
        setTotalCount(data.totalItems || 0);
      } catch (error) {
        console.error("후기 데이터를 불러오는 중 오류가 발생했습니다:", error);
      }
    };

    loadReview();
  }, [currentPage, searchParams.type, searchParams.keyword]);

  return { reviewList, totalPage, totalCount };
};

export const useReviewDetail = (id: ParamValue) => {
  const [review, setReview] = useState<ReviewDetailResponse | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadDetail = async () => {
      try {
        const data = await fetchReviewDetail(String(id));
        setReview(data);
      } catch (error) {
        console.log(error);
      }
    };

    loadDetail();
  }, [id]);

  return { review };
};

export const useCreateReview = () => {
  const handleCreateReview = async (
    formData: ReviewFormData,
    items: ImageFileItem[],
    options?: {
      onSuccess?: (result: unknown) => void;
      onError?: (error: unknown) => void;
    },
  ) => {
    try {
      const result = await createReview(formData, items);

      if (options?.onSuccess) options.onSuccess(result);
      return result;
    } catch (error) {
      if (options?.onError) options.onError(error);
    }
  };

  return { handleCreateReview };
};

export const useUpdateReview = () => {
  const handleUpdateReview = async (
    id: string,
    formData: ReviewFormData,
    items: ImageFileItem[],
    options?: {
      onSuccess?: (result: unknown) => void;
      onError?: (error: unknown) => void;
    },
  ): Promise<void> => {
    try {
      const result = await updateReview(id, formData, items);
      if (options?.onSuccess) options.onSuccess(result);
    } catch (error) {
      if (options?.onError) options.onError(error);
    }
  };

  return { handleUpdateReview };
};
