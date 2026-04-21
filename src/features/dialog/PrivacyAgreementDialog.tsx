"use client";

import { NoticeItem } from "@/shared/ui/atoms/NoticeItem";
import { NumberItem } from "@/shared/ui/atoms/NumberItem";
import { BaseDialog } from "@/shared/ui/organisms/BaseDialog";

type PrivacyAgreementDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
};

export const PrivacyAgreementDialog = ({
  open,
  onClose,
  onConfirm,
}: PrivacyAgreementDialogProps) => {
  return (
    <BaseDialog open={open} onClose={onClose} onConfirm={onConfirm}>
      <h1 className="title-26-b text-left">개인정보 수집 및 이용 동의</h1>

      <div className="mt-9.5 gap-5 flex flex-col text-left ">
        <NumberItem number={1} title="개인정보의 수집 · 이용 목적">
          후기 게시판 게시글 목록
        </NumberItem>
        <NumberItem number={2} title="수집하는 개인정보의 항목">
          이메일 주소, 닉네임
        </NumberItem>
        <NumberItem number={3} title="개인정보의 보유 및 이용 기간">
          동의일로부터 1년
        </NumberItem>
      </div>

      <div className="mt-5 flex flex-col gap-2 text-left text-gray-600">
        <NoticeItem className="pt-4 border-t border-gray-300">
          귀하께서는 이에 대한 동의를 거부할 수 있으며, 동의 거부 시 <br />
          [후기 게시판] 게시물 등록이 불가능 할 수도 있음을 알려드립니다.
        </NoticeItem>
      </div>
    </BaseDialog>
  );
};
