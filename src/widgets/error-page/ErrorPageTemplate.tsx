"use client";

import { Button } from "@/shared/ui/atoms/Button";
import { NoDataIcon } from "@/shared/ui/icons";

export const ErrorPageTemplate = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  // 라우터 훅(useRouter)을 제거하고 순수 브라우저 API로 대체합니다.
  const handleBack = () => {
    if (typeof window !== "undefined") {
      const prevUrl = document.referrer;

      // 이전 페이지 기록이 있고, 우리 사이트 내부에서 이동한 것이라면
      if (prevUrl && prevUrl.includes(window.location.host)) {
        // 캐시 충돌을 무시하고 이전 주소로 완전히 새로고침하며 이동 (빈 화면 버그 해결)
        window.location.href = prevUrl; 
      } else {
        // 외부 링크를 타고 들어왔거나 기록이 없으면 기본 뒤로가기 실행
        window.history.back();
      }
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-4 text-center">
      <NoDataIcon />
      <h1 className="title-36-b pt-7.5">{title}</h1>
      <p className="typo-16-m text-gray-600 pt-4 whitespace-pre-line">
        {description}
      </p>
      <div className="pt-15 flex items-center gap-4">
        <Button
          size="lg"
          variant="outline"
          onClick={() => window.location.replace("/")}
          className="w-45.75"
        >
          메인으로
        </Button>
        <Button size="lg" onClick={handleBack} className="w-49.5">
          이전페이지
        </Button>
      </div>
    </div>
  );
};