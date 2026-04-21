"use client";

import { ReactNode, useEffect } from "react";
import { Button } from "../atoms/Button";
import { CloseIcon } from "../icons/CloseIcon";

type BaseDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  children: ReactNode;
};

export const BaseDialog = ({
  open,
  onClose,
  onConfirm,
  children,
}: BaseDialogProps) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/65" onClick={onClose} />

      {/* dialog */}
      <div
        className="relative w-130.5 bg-white px-9 py-15"
        onClick={(e) => e.stopPropagation()}
      >
        {/* X 버튼 (title과 독립) */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-500"
        >
          <CloseIcon />
        </button>
        {/* body */}
        <div className="mt-6">{children}</div>
        <div className="flex flex-col items-center">
          {/* 확인 버튼 */}
          <Button onClick={onConfirm} className="mt-10 w-37">
            확인
          </Button>
        </div>
      </div>
    </div>
  );
};
