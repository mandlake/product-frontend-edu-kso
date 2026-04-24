// src/shared/ui/molecules/NavItem.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/cn";

interface NavItemProps {
  href: string;
  label: string;
}

export const NavItem = ({ href, label }: NavItemProps) => {
  const pathname = usePathname();
  // 현재 경로가 해당 메뉴의 경로로 시작하는지 확인 (활성화 상태 계산)
  const isActive = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn("relative py-2 title-18-b transition-colors text-gray-900")}
    >
      {label}

      {/* 활성화 시 나타나는 하단 언더라인 */}
      {isActive && (
        <span className="absolute bottom-0 left-0 w-full h-px bg-gray-800" />
      )}
    </Link>
  );
};
