"use client";

import { useEffect, useState } from "react";
import { Button } from "@/shared/ui/atoms/Button";
import { Checkbox } from "@/shared/ui/atoms/Checkbox";
import { ImageInput, Input } from "@/shared/ui/atoms/input";
import { StarRating } from "@/shared/ui/atoms/StarRating";
import { Textarea } from "@/shared/ui/atoms/Textarea";
import Select from "@/shared/ui/atoms/Select";
import { StackedButtonGroup } from "@/shared/ui/molecules/StackedButtonGroup";

interface PreviewFile {
  file: File;
  previewUrl: string;
}

export default function TestPage() {
  const [items, setItems] = useState<PreviewFile[]>([]);
  const [value, setValue] = useState("");

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
      <div className="flex flex-col items-start gap-5 p-5">
        <Button>목록</Button>
        <StackedButtonGroup
          topLabel="수정하기"
          bottomLabel="삭제하기"
          onTopClick={() => console.log("수정")}
          onBottomClick={() => console.log("삭제")}
        ></StackedButtonGroup>
        <Checkbox label="개인정보 수집 및 이용 동의" />
        <Input placeholder="제목을 입력해 주세요.(최대 50자)" />
        <Textarea placeholder="내용을 입력해주세요." />
        <StarRating />
        <Select
          value={value}
          onChange={setValue}
          options={[
            { label: "전체", value: "" },
            { label: "사과", value: "apple" },
            { label: "바나나", value: "banana" },
            { label: "포도", value: "grape" },
          ]}
        />
        <ImageInput
          multiple
          previewUrls={items.map((item) => item.previewUrl)}
          onChange={handleChange}
          onRemove={handleRemove}
        />
      </div>
    </>
  );
}
