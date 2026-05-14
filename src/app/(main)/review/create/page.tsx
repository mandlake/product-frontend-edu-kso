"use client";

import { useEffect, useState } from "react";

import { usePathname, useRouter } from "next/navigation";

import { PrivacyAgreementDialog } from "@/features/dialog/PrivacyAgreementDialog";
import { BreadcrumbHeader } from "@/shared/ui/molecules/BreadcrumbHeader";
import { getBreadcrumbLabel } from "@/shared/lib/navigation";
import { EllipseItem } from "@/shared/ui/atoms/Ellipse";
import { Label } from "@/shared/ui/molecules/Label";
import { StarRating } from "@/shared/ui/atoms/StarRating";
import { ImageInput, Input } from "@/shared/ui/atoms/input";
import { Textarea } from "@/shared/ui/atoms/Textarea";
import { PreviewFile } from "@/types/common";
import { Checkbox } from "@/shared/ui/atoms/Checkbox";
import { Button } from "@/shared/ui/atoms/Button";
import { InfoIcon } from "@/shared/ui/icons";

export default function CreateReviewPage() {
  const router = useRouter();
  const pathname = usePathname();
  const breadcrumbLabel = getBreadcrumbLabel(pathname);

  const [items, setItems] = useState<PreviewFile[]>([]);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);

    setItems((prev) => {
      prev.forEach((item) => URL.revokeObjectURL(item.previewUrl));

      return selectedFiles.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));
    });
  };

  const handleRemove = (targetIndex: number) => {
    setItems((prev) => {
      const target = prev[targetIndex];

      if (target) {
        URL.revokeObjectURL(target.previewUrl); // 메모리 정리
      }

      return prev.filter((_, index) => index !== targetIndex);
    });
  };

  useEffect(() => {
    return () => {
      items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, [items]);

  return (
    <>
      <section className="px-57.75 pt-7.5">
        {/* 브레드 스크럼 */}
        <BreadcrumbHeader items={[{ label: breadcrumbLabel }]} />

        {/* 제목 */}
        <div className="mt-7.5 py-7.5 w-365 flex flex-row justify-between items-center border-b border-gray-700">
          <h2 className="title-36-b text-gray-900">후기 작성</h2>
          <div className="flex flex-row justify-center items-center gap-1.25">
            <EllipseItem size={5} />
            <p className="typo-16-r text-gray-600">필수항목</p>
          </div>
        </div>

        {/* 본문 */}
        <div className="py-15 flex flex-col gap-15">
          <div className="flex flex-row gap-30.5 items-center">
            <Label required>별점</Label>
            <StarRating />
          </div>
          <div className="flex flex-row gap-30.5 items-center">
            <Label required>제목</Label>
            <Input
              placeholder="제목을 입력해 주세요.(최대 50자)"
              className="w-326.5"
            />
          </div>
          <div className="flex flex-row gap-30.5 items-start">
            <Label required>내용</Label>
            <Textarea placeholder="내용을 입력해주세요." />
          </div>
          <div className="flex flex-row gap-17.75 items-start">
            <Label>이미지 첨부</Label>
            <div className="flex flex-col gap-4">
              <ImageInput
                multiple
                maxSize={5}
                previewUrls={items.map((item) => item.previewUrl)}
                onChange={handleChange}
                onRemove={handleRemove}
              />
              <p className="typo-14-m text-gray-600">
                *사진은 최대 5MB 이하의 PNG, JPG 파일 5장까지 첨부 가능합니다.
                영상 첨부는 불가능합니다.
              </p>
            </div>
          </div>
          <div className="flex flex-row gap-30.5 items-center">
            <Label required>이름</Label>
            <Input placeholder="이름을 입력해 주세요." className="w-326.5" />
          </div>
          <div className="flex flex-row gap-13.75 items-center">
            <Label
              required
              tooltip={
                <ul className="list-disc pl-5 space-y-2 typo-14-m w-71">
                  <li>숫자 4자리를 입력해 주세요.</li>
                  <li>동일한 숫자 3개 이상 연속 사용이 불가합니다.</li>
                </ul>
              }
            >
              비밀번호
            </Label>
            <Input placeholder="비밀번호를 입력해주세요." className="w-326.5" />
          </div>

          {/* 개인정보 수집 및 이용 동의 */}
          <div className="bg-gray-100 p-7.5 flex flex-row gap-4 items-center justify-start">
            <Checkbox label="개인정보 수집 및 이용 동의" />
            <span
              role="button"
              className="underline type-14-m text-gray-700 underline-offset-4 cursor-pointer"
              onClick={() => setPrivacyOpen(true)}
            >
              내용 보기
            </span>
          </div>
        </div>

        {/* 하단 */}
        <div className="flex flex-row justify-between items-center pb-35">
          <div className="flex flex-row gap-2 items-center">
            <InfoIcon />
            <p className="typo-20-m leading-7.5 text-primary-dark">
              등록된 후기 내용은 관리자가 확인한 후에 후기 게시판에 게시됩니다.
            </p>
          </div>
          <div className="flex flex-row gap-4">
            <Button
              size="md"
              variant="outline"
              className="text-gray-700"
              onClick={() => router.push(`/review`)}
            >
              취소
            </Button>
            <Button size="md">등록</Button>
          </div>
        </div>

        {/* 개인정보 수집 및 이용 동의 팝업 */}
        <PrivacyAgreementDialog
          open={privacyOpen}
          onClose={() => setPrivacyOpen(false)}
          onConfirm={() => {
            console.log("확인 클릭");
            setPrivacyOpen(false);
          }}
        />
      </section>
    </>
  );
}
