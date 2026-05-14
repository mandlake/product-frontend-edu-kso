"use client";

import { useEffect, useState } from "react";
import { Button } from "@/shared/ui/atoms/Button";
import { Checkbox } from "@/shared/ui/atoms/Checkbox";
import { ImageInput, Input } from "@/shared/ui/atoms/input";
import { StarRating } from "@/shared/ui/atoms/StarRating";
import { Textarea } from "@/shared/ui/atoms/Textarea";
import Select from "@/shared/ui/atoms/Select";
import { SearchInput } from "@/shared/ui/molecules/SearchInput";
import { Label } from "@/shared/ui/molecules/Label";
import { Card } from "@/shared/ui/molecules/Card";
import { PasswordDialog } from "@/features/dialog/PasswordDialog";
import { PrivacyAgreementDialog } from "@/features/dialog/PrivacyAgreementDialog";
import { DropdownMenu } from "@/shared/ui/molecules/DropdownMenu";
import { Pagination } from "@/widgets/Pagination";

interface PreviewFile {
  file: File;
  previewUrl: string;
}

export default function TestPage() {
  const [items, setItems] = useState<PreviewFile[]>([]);
  const [value, setValue] = useState("");
  const [keyword, setKeyword] = useState("");
  const [open, setOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 12; // (가상 데이터) 총 페이지 수. 보통 API 응답에서 받아옵니다.

  // 페이지 번호를 클릭했을 때 실행될 함수
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // KebabMenu에 들어갈 아이템 구성
  const kebabMenuItems = [
    { label: "수정하기", onClick: () => console.log("수정") },
    { label: "삭제하기", onClick: () => console.log("삭제") },
  ];

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
        <div className="flex justify-end w-full">
          <DropdownMenu items={kebabMenuItems} />
        </div>
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
        <Card
          id={0}
          title="제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목"
          content="내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용"
          username="남현희"
          date="2023.11.13"
          star="4"
        />
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          handlePaging={handlePageChange}
        />

        <Button size="md" onClick={() => setOpen(true)}>
          비밀번호 팝업 열기
        </Button>

        <PasswordDialog
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => {
            console.log("확인 클릭");
            setOpen(false);
          }}
        />

        <Button size="lg" onClick={() => setPrivacyOpen(true)}>
          개인정보 수집 및 이용 동의 팝업 열기
        </Button>

        <PrivacyAgreementDialog
          open={privacyOpen}
          onClose={() => setPrivacyOpen(false)}
          onConfirm={() => {
            console.log("확인 클릭");
            setPrivacyOpen(false);
          }}
        />
      </div>
    </>
  );
}
