"use client";

import { useEffect, useState } from "react";

import { NoticeItem } from "@/shared/ui/atoms/NoticeItem";
import { BaseDialog } from "@/shared/ui/organisms/BaseDialog";

type PasswordDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
};

export const PasswordDialog = ({
  open,
  onClose,
  onConfirm,
}: PasswordDialogProps) => {
  const [password, setPassword] = useState("");

  const handleClose = () => {
    setPassword("");
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(password);
    setPassword("");
  };

  return (
    <BaseDialog
      open={open}
      onClose={handleClose}
      onConfirm={handleConfirm}
    >
      <h1 className="title-26-b text-left">비밀번호 입력</h1>
      <p className="typo-16-m mt-9 text-left text-gray-900">
        후기 게시글 등록 시 설정한 비밀번호를 입력해 주세요.
      </p>

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="숫자 4자리 입력해 주세요"
        className="mt-4 h-14 w-full border border-gray-300 px-4 text-center outline-none placeholder:text-gray-600"
      />

      <div className="mt-5 flex flex-col gap-2 text-left">
        <NoticeItem>
          비밀번호 5회 이상 오류 시 10분 동안 사용이 제한됩니다.
        </NoticeItem>
        <NoticeItem>
          비밀번호를 잊어버리신 경우 아래 관리자 메일로 문의 부탁드립니다.
          <br />
          관리자 메일 : mgtour-lee@naver.com
        </NoticeItem>
      </div>
    </BaseDialog>
  );
};
