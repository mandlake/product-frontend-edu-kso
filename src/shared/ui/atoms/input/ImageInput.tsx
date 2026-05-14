import { forwardRef } from "react";

import Image from "next/image";

import { cn } from "@/shared/lib/cn";

interface ImageInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "accept"
> {
  previewUrls?: string[];
  maxSize?: number;
  onRemove?: (index: number) => void;
}

export const ImageInput = forwardRef<HTMLInputElement, ImageInputProps>(
  (
    { className, previewUrls = [], maxSize = 0, onRemove, onChange, ...props },
    ref,
  ) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!maxSize) {
        onChange?.(e);
        return;
      }

      const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
      const currentCount = previewUrls.length;

      // 이미 꽉 찼거나, 새로 추가될 파일이 한도를 넘는 경우
      if (currentCount + selectedFiles.length > maxSize) {
        alert(`최대 ${maxSize}개 까지만 등록할 수 있습니다.`);
        e.target.value = "";
        return;
      }

      // 한도 내라면 외부에서 전달받은 onChange 실행
      onChange?.(e);
    };

    // 업로드 버튼 표시 여부 : maxSize가 0보다 크고, 현재 개수가 maxSize와 같거나 많으면 숨깁니다.
    const isFull = maxSize > 0 && previewUrls.length >= maxSize;

    return (
      <div className={cn("flex flex-wrap gap-3", className)}>
        {previewUrls.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="group relative h-38 w-38 rounded-md bg-gray-100"
          >
            <Image
              src={url}
              alt={`preview-${index}`}
              fill
              className="object-cover"
              unoptimized
            />

            {/* 번호 표시 */}
            <div className="absolute top-1.5 left-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#050505]/30 px-2 text-xs text-white">
              {index + 1}
            </div>

            {/* X 버튼 추가 */}
            <button
              type="button"
              onClick={() => onRemove?.(index)}
              className="absolute -right-4 -top-4 flex h-8 w-8 items-center justify-center rounded-full opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              aria-label={`이미지 ${index + 1} 삭제`}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.0003 29.3337C8.63653 29.3337 2.66699 23.3641 2.66699 16.0003C2.66699 8.63653 8.63653 2.66699 16.0003 2.66699C23.3641 2.66699 29.3337 8.63653 29.3337 16.0003C29.3337 23.3641 23.3641 29.3337 16.0003 29.3337ZM16.0003 14.1147L12.2291 10.3435L10.3435 12.2291L14.1147 16.0003L10.3435 19.7715L12.2291 21.6571L16.0003 17.8859L19.7715 21.6571L21.6571 19.7715L17.8859 16.0003L21.6571 12.2291L19.7715 10.3435L16.0003 14.1147Z"
                  fill="#EBEBEB"
                />
                <path
                  d="M15.9996 14.114L12.2284 10.3428L10.3428 12.2284L14.114 15.9996L10.3428 19.7708L12.2284 21.6564L15.9996 17.8852L19.7708 21.6564L21.6564 19.7708L17.8852 15.9996L21.6564 12.2284L19.7708 10.3428L15.9996 14.114Z"
                  fill="#666666"
                />
              </svg>
            </button>
          </div>
        ))}

        {/* maxSize에 도달하지 않았을 때만 업로드 버튼 표시 */}
        {!isFull && (
          <label className="flex h-38 w-38 cursor-pointer items-center justify-center overflow-hidden rounded-md bg-gray-100">
            <input
              ref={ref}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              {...props}
            />

            <span>
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M38.1421 38.1421C30.3317 45.9526 17.6683 45.9525 9.85787 38.1421C2.04738 30.3316 2.04738 17.6683 9.85787 9.85784C17.6683 2.04742 30.3317 2.04735 38.1421 9.85784C45.9526 17.6683 45.9526 30.3317 38.1421 38.1421ZM22 22L14 22V26L22 26L22 33.9999L25.9999 33.9999L26 26H33.9999V22H26L25.9999 14L22 14L22 22Z"
                  fill="#EBEBEB"
                />
                <path
                  d="M22 22L14 22V26L22 25.9999L22 33.9999L25.9999 33.9999L26 25.9999L33.9999 25.9999V22L26 22L25.9999 14L22 14L22 22Z"
                  fill="#666666"
                />
              </svg>
            </span>
          </label>
        )}
      </div>
    );
  },
);

ImageInput.displayName = "ImageInput";
