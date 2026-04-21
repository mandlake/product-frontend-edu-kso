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
        <Button
          size="lg"
          onClick={() => window.history.back()}
          className="w-49.5"
        >
          이전페이지
        </Button>
      </div>
    </div>
  );
};
