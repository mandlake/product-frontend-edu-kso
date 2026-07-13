"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import Image from "next/image";

import { getBreadcrumbLabel } from "@/shared/lib/navigation";
import { maskName } from "@/shared/lib/masking";
import { formatDate } from "@/shared/lib/date";
import { BreadcrumbHeader } from "@/shared/ui/molecules/BreadcrumbHeader";
import { StarRating } from "@/shared/ui/atoms/StarRating";
import { LineItem } from "@/shared/ui/atoms/LineItem";
import { DropdownMenu } from "@/shared/ui/molecules/DropdownMenu";
import { Button } from "@/shared/ui/atoms/Button";
import DetailGallery from "@/shared/ui/molecules/DetailGallery";
import { useReviewDetail } from "@/hooks/useReviews";

export default function DetailReviewPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { id } = useParams();
  const breadcrumbLabel = getBreadcrumbLabel(pathname);

  const { review } = useReviewDetail(id);

  // KebabMenu에 들어갈 아이템 구성
  const kebabMenuItems = [
    { label: "수정하기", onClick: () => router.push(`/review/${id}/update`) },
    { label: "삭제하기", onClick: () => console.log("삭제") },
  ];

  // TODO - reply 내부 값 연결
  const sample = {
    reply: {
      img: "/example/reply_img.png",
      regId: "관리자",
      content:
        "고객님, 안녕하세요 미켈란 골프투어입니다.\n시간 내주어 좋은 후기 남겨주셔서 감사합니다.\n믿고 방문해 주시는 고객님들께 보답하기 위하여 앞으로 더욱 고객님들의 니즈와 취향을 맞춰 더 나은 서비스와 즐거운 여행이 되실 수\n있도록 발전하고 노력하겠습니다. 오늘 하루도 좋은 일만 가득하시길 바랍니다.\n감사합니다.",
    },
  };

  return (
    <>
      <section className="px-57.75 pt-7.5">
        {/* Board Section Header */}
        <BreadcrumbHeader items={[{ label: breadcrumbLabel }]} />

        {/* 게시판 헤더 영역 */}
        <div className="mt-15">
          <h2 className="title-36-b text-gray-900">{review?.title || "-"}</h2>

          <div className="mt-2.5 flex justify-between items-center border-b border-gray-700 pb-6">
            <div className="flex flex-row justify-center items-center gap-7.5">
              <StarRating value={String(review?.rating) || "-"} readOnly />
              <div className="flex items-center typo-14-m text-gray-700 gap-2">
                <LineItem className="after:bg-gray-700">
                  {maskName(review?.regId || "-")}
                </LineItem>
                <p>{formatDate(review?.modDt || review?.regDt || "-")}</p>
              </div>
            </div>
            <DropdownMenu items={kebabMenuItems} />
          </div>
        </div>

        {/* 게시판 콘텐츠 영역 */}
        <div className="py-15 whitespace-pre-line">
          {review?.contents || "-"}
        </div>

        {/* 이미지 영역 */}
        {review?.files && review.files.length > 0 && (
          <DetailGallery
            images={review.files.map((file) => file.url || file.blobURL || "")}
          />
        )}

        {/* 직원 답변 영역 */}
        {sample.reply && (
          <div className="mt-22.5 bg-gray-100 border border-gray-300 text-gray-900 p-10 flex flex-col gap-7.5">
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row items-center gap-4">
                <Image
                  src={sample.reply.img}
                  alt="임시 이미지"
                  width={55}
                  height={55}
                  className="rounded-full"
                />
                <p className="typo-20-m">{sample.reply.regId}</p>
              </div>
              <p className="text-gray-600">2023.09.14</p>
            </div>
            <div className="whitespace-pre-wrap w-240 typo-18-r">
              {sample.reply.content}
            </div>
          </div>
        )}

        {/* 게시판 바텀 영역 */}
        <div className="mt-25 flex-row">
          <div
            className={`flex gap-7.5 px-5 py-7 border-y border-gray-300 ${
              review?.before ? "cursor-pointer hover:bg-gray-50" : ""
            }`}
            onClick={() => {
              if (review?.before?.id) {
                router.push(`/review/${review.before.id}`);
              }
            }}
          >
            <p className="typo-16-b text-gray-900">이전글</p>
            <p className="typo-16-r text-gray-700">
              {review?.before?.title || "이전글이 없습니다."}
            </p>
          </div>
          <div
            className={`flex gap-7.5 px-5 py-7 border-b border-gray-300 ${
              review?.next ? "cursor-pointer hover:bg-gray-50" : ""
            }`}
            onClick={() => {
              if (review?.next?.id) {
                router.push(`/review/${review.next.id}`);
              }
            }}
          >
            <p className="typo-16-b text-gray-900">다음글</p>
            <p className="typo-16-r text-gray-700">
              {review?.next?.title || "다음글이 없습니다."}
            </p>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="mt-12 mb-45 flex flex-row gap-2 justify-end">
          <Button variant="outline" onClick={() => router.push("/review")}>
            목록
          </Button>
          <Button
            className="w-35"
            onClick={() => router.push("/review/create")}
          >
            후기 작성하기
          </Button>
        </div>
      </section>
    </>
  );
}
