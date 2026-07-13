"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams, usePathname, useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { PrivacyAgreementDialog } from "@/features/dialog/PrivacyAgreementDialog";
import { reviewSchema } from "@/features/schema/ReviewSchema";
import { BreadcrumbHeader } from "@/shared/ui/molecules/BreadcrumbHeader";
import { getBreadcrumbLabel } from "@/shared/lib/navigation";
import { EllipseItem } from "@/shared/ui/atoms/Ellipse";
import { Label } from "@/shared/ui/molecules/Label";
import { StarRating } from "@/shared/ui/atoms/StarRating";
import { ImageInput, Input } from "@/shared/ui/atoms/input";
import { Textarea } from "@/shared/ui/atoms/Textarea";
import { Checkbox } from "@/shared/ui/atoms/Checkbox";
import { Button } from "@/shared/ui/atoms/Button";
import { InfoIcon } from "@/shared/ui/icons";
import { useReviewDetail, useUpdateReview } from "@/hooks/useReviews";
import { ImageFileItem } from "@/types/review";

type ReviewFormData = z.infer<typeof reviewSchema>;

export default function UpdateReviewPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { id } = useParams();
  const breadcrumbLabel = getBreadcrumbLabel(pathname);

  const { review } = useReviewDetail(id);
  const { handleUpdateReview } = useUpdateReview();

  const [items, setItems] = useState<ImageFileItem[]>([]);
  const [privacyOpen, setPrivacyOpen] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<ReviewFormData>({
    mode: "onChange",
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: "",
      title: "",
      content: "",
      author: "",
      password: "",
      isPrivacyAgree: false,
    },
  });

  // 💡 중복되던 useEffect를 하나로 깔끔하게 통합하여 동기화 이슈 해결
  useEffect(() => {
    if (!review) return;

    // 1. React Hook Form Form 데이터 바인딩
    reset({
      rating: String(review.rating),
      title: review.title,
      content: review.contents,
      author: review.regId,
      password: review.password || "",
      isPrivacyAgree: true,
    });

    // 2. 이미지 파일 바인딩
    if (review.files) {
      const loadedFiles: ImageFileItem[] = review.files
        .map((f) => ({
          file: null as unknown as File,
          previewUrl: f.url || f.blobURL || "",
        }))
        .filter((item) => item.previewUrl !== "");

      const timer = setTimeout(() => {
        setItems((prev) => (prev.length === 0 ? loadedFiles : prev));
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [review, reset]);

  useEffect(() => {
    return () => {
      items.forEach((item) => {
        if (item.file instanceof File) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, [items]);

  const onSubmit = async (data: ReviewFormData) => {
    if (!id) return;

    await handleUpdateReview(String(id), data, items, {
      onSuccess: (result) => {
        console.log("MSW 수정 성공 결과: ", result);
        router.push(`/review/${id}`);
      },
      onError: (error) => {
        console.log("리뷰 수정 중 에러 발생: ", error);
        alert("리뷰를 수정하는 중 에러가 발생했습니다.");
      },
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);

    setItems((prev) => {
      const newItems: ImageFileItem[] = selectedFiles.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      return [...prev, ...newItems];
    });
  };

  const handleRemove = (targetIndex: number) => {
    setItems((prev) => {
      const target = prev[targetIndex];
      if (target && target.file instanceof File) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((_, index) => index !== targetIndex);
    });
  };

  return (
    <section className="px-57.75 pt-7.5">
      <BreadcrumbHeader items={[{ label: breadcrumbLabel }]} />

      <div className="mt-7.5 py-7.5 w-365 flex flex-row justify-between items-center border-b border-gray-700">
        <h2 className="title-36-b text-gray-900">후기 수정</h2>
        <div className="flex flex-row justify-center items-center gap-1.25">
          <EllipseItem size={5} />
          <p className="typo-16-r text-gray-600">필수항목</p>
        </div>
      </div>

      <div className="py-15 flex flex-col gap-15">
        <div className="flex flex-row gap-30.5 items-center">
          <Label required>별점</Label>
          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <StarRating
                value={field.value}
                onChange={(val) => field.onChange(String(val))}
              />
            )}
          />
        </div>
        <div className="flex flex-row gap-30.5 items-center">
          <Label required>제목</Label>
          <Input
            placeholder="제목을 입력해 주세요.(최대 50자)"
            maxLength={50}
            className="w-326.5"
            {...register("title")}
          />
        </div>
        <div className="flex flex-row gap-30.5 items-start">
          <Label required>내용</Label>
          <Textarea
            placeholder="내용을 입력해주세요."
            {...register("content")}
          />
        </div>
        <div className="flex flex-row gap-17.75 items-start">
          <Label>이미지 첨부</Label>
          <div className="flex flex-col gap-4">
            <ImageInput
              multiple
              maxSize={5}
              previewUrls={items.map((item) => item.previewUrl)}
              onChange={handleImageChange}
              onRemove={handleRemove}
            />
            <p className="typo-14-m text-gray-600">
              *사진은 최대 5MB 이하의 PNG, JPG 파일 5장까지 첨부 가능합니다.
              영상 첨부는 불가능합니다.
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-30.5 items-start">
          <Label required>이름</Label>
          <Input
            placeholder="이름을 입력해 주세요."
            className="w-326.5"
            {...register("author")}
          />
        </div>
        <div className="flex flex-row gap-13.75 items-start">
          <Label
            required
            tooltip={
              <ul className="list-disc pl-5 space-y-2 typo-14-m w-71">
                <li>숫자 4자리를 입력해 주세요.</li>
                <li>동일한 숫자 3개 이상 연속 사용이 불가합니다.</li>
              </ul>
            }
            className="mt-3"
          >
            비밀번호
          </Label>
          <div className="flex flex-col gap-1">
            <Input
              type="password"
              placeholder="비밀번호를 입력해주세요."
              className="w-326.5"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-ellipse-red text-sm">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <div className="bg-gray-100 p-7.5 flex flex-row gap-4 items-center justify-start">
          <Controller
            name="isPrivacyAgree"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Checkbox
                label="개인정보 수집 및 이용 동의"
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <span
            role="button"
            className="underline type-14-m text-gray-700 underline-offset-4 cursor-pointer"
            onClick={() => setPrivacyOpen(true)}
          >
            내용 보기
          </span>
        </div>
      </div>

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
            onClick={() => router.push(`/review/${id}`)}
          >
            취소
          </Button>
          <Button
            size="md"
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid}
            className={!isValid ? "opacity-50 cursor-not-allowed" : ""}
          >
            수정 완료
          </Button>
        </div>
      </div>

      <PrivacyAgreementDialog
        open={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        onConfirm={() => {
          setValue("isPrivacyAgree", true, { shouldValidate: true });
          setPrivacyOpen(false);
        }}
      />
    </section>
  );
}
