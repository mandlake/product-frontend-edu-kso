"use client";

import { usePathname } from "next/navigation";

import { getBreadcrumbLabel } from "@/shared/lib/navigation";
import { BreadcrumbHeader } from "@/shared/ui/molecules/BreadcrumbHeader";
import { StarRating } from "@/shared/ui/atoms/StarRating";
import { LineItem } from "@/shared/ui/atoms/LineItem";
import { maskName } from "@/shared/lib/masking";
import { DropdownMenu } from "@/shared/ui/molecules/DropdownMenu";
import { Button } from "@/shared/ui/atoms/Button";

export default function DetailReviewPage() {
  const pathname = usePathname();
  const breadcrumbLabel = getBreadcrumbLabel(pathname);

  // KebabMenu에 들어갈 아이템 구성
  const kebabMenuItems = [
    { label: "수정하기", onClick: () => console.log("수정") },
    { label: "삭제하기", onClick: () => console.log("삭제") },
  ];

  const review = {
          id: 1,
          title: "친절한 직원과 환상적인 뷰!!",
          star: 3,
          username: "홍길동",
          date: "2026.05.06",
          content:
            "우선, 직원분들이 너무 친절하시고!\n골프 리조트답게 렌탈 클럽도 컨디션도 훌륭했고 광활한 뷰를 즐기며 여유롭게 라운드를 했습니다.\n날씨도 좋고 잔디도 좋고 코스도 너무 좋았습니다~~~\n즐겁고 행복한 라운딩이었습니다. 다음에 또 오겠습니다!!!",
          next: {
            id: 2,
            title: "완벽하게 휴식할 수 있는 곳 꼭 다시 들려요.",
          },
          images: [],
          reply: {
            content: "고객님, 안녕하세요 미켈란 골프투어입니다./n시간 내주어 좋은 후기 남겨주셔서 감사합니다.\n믿고 방문해 주시는 고객님들께 보답하기 위하여 앞으로 더욱 고객님들의 니즈와 취향을 맞춰 더 나은 서비스와 즐거운 여행이 되실 수 \n있도록 발전하고 노력하겠습니다. 오늘 하루도 좋은 일만 가득하시길 바랍니다.\n감사합니다."
          },
          before: {
            id: 0,
            title: "",
          },
        };

  return (
    <>
        <section className="px-57.75 pt-7.5">
          {/* Board Section Header */}
          <BreadcrumbHeader items={[{ label: breadcrumbLabel }]} />
    
          {/* 게시판 헤더 영역 */}
          <div className="mt-15">
            <h2 className="title-36-b text-gray-900">{review.title}</h2>
    
            <div className="mt-2.5 flex justify-between items-start h-22.75 border-b border-gray-700 pb-6">
              <div className="flex flex-row justify-center items-center gap-7.5">
                <StarRating value={String(review.star)} readOnly />
                <div className="flex items-center typo-14-m text-gray-700 gap-2">
                  <LineItem className="after:bg-gray-700">
                    {maskName(review.username)}
                  </LineItem>
                  <p>{review.date}</p>
                </div>
              </div>
              <DropdownMenu items={kebabMenuItems} />
            </div>
          </div>
    
          {/* 게시판 콘텐츠 영역 */}
          <div className="py-15 whitespace-pre-line">{review.content}</div>
    
          {/* 이미지 영역 */}
          {review.images && <div></div>}
    
          {/* 직원 답변 영역 */}
          {review.reply && (
            <div className="mt-90">
              <div>
                <div></div>
                <p>2023.09.14</p>
              </div>
              <div className="whitespace-pre-wrap w-240">
                {review.reply.content}
                고객님, 안녕하세요 미켈란 골프투어입니다.\n 시간 내주어 좋은 후기
                남겨주셔서 감사합니다.\n 믿고 방문해 주시는 고객님들께 보답하기
                위하여 앞으로 더욱 고객님들의 니즈와 취향에 맞춰 더 나은 서비스와
                즐거운 여행이 되실 수 있도록 발전하고 노력하겠습니다. 오늘 하루도
                좋은 일만 가득하시길 바랍니다.\n 감사합니다.
              </div>
            </div>
          )}
    
          {/* 게시판 바텀 영역 */}
          <div className="mt-25 flex-row">
            <div className="flex gap-7.5 py-7 border-y border-gray-300">
              <p>이전글</p>
              <p>{review.before?.title || "이전글이 없습니다."}</p>
            </div>
            <div className="flex gap-7.5 py-7 border-b border-gray-300">
              <p>다음글</p>
              <p>{review.next?.title || "다음글이 없습니다."}</p>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="mt-12 mb-45">
            <Button />
            <Button />
          </div>
        </section>
    </>
  );
}
