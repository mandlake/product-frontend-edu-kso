"use client";

import { useEffect, useState } from "react";
import { Button } from "@/shared/ui/atoms/Button";
import { Checkbox } from "@/shared/ui/atoms/Checkbox";
import { ImageInput, Input } from "@/shared/ui/atoms/input";
import { StarRating } from "@/shared/ui/atoms/StarRating";
import { Textarea } from "@/shared/ui/atoms/Textarea";
import Select from "@/shared/ui/atoms/Select";
import { StackedButtonGroup } from "@/shared/ui/molecules/StackedButtonGroup";
import { SearchInput } from "@/shared/ui/molecules/SearchInput";
import { Label } from "@/shared/ui/molecules/Label";

interface PreviewFile {
  file: File;
  previewUrl: string;
}

export default function TestPage() {
  const [items, setItems] = useState<PreviewFile[]>([]);
  const [value, setValue] = useState("");
  const [keyword, setKeyword] = useState("");

  const handleSearch = (value: string) => {
    console.log("검색:", value);
  };

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
        <div className="flex items-center gap-10">
          <Label
            required
            tooltip={
              <ul className="list-disc pl-5 space-y-2">
                <li>숫자 4자리를 입력해 주세요.</li>
                <li>동일한 숫자 3개 이상 연속 사용이 불가합니다.</li>
              </ul>
            }
          >
            제목
          </Label>
          <Input
            placeholder="제목을 입력해 주세요.(최대 50자)"
            className="min-w-14"
          />
        </div>
        <Textarea placeholder="내용을 입력해주세요." />
        <StarRating />
        <StarRating value={4} readOnly />
        <div className="flex gap-5">
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
          <SearchInput
            value={keyword}
            onChange={setKeyword}
            onSearch={handleSearch}
          />
        </div>
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
