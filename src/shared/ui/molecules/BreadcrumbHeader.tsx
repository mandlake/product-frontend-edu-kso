import Link from "next/link";
import { Fragment } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string; // 마지막 아이템은 링크가 없을 수 있으므로 선택사항
}

interface BreadcrumbHeaderProps {
  items: BreadcrumbItem[];
}

export const BreadcrumbHeader = ({ items }: BreadcrumbHeaderProps) => {
  return (
    <div className="flex items-center gap-x-3 py-8">
      {/* HOME은 기본적으로 포함 */}
      <Link
        href="/"
        className="text-gray-600 text-xl font-light transition-colors hover:text-gray-900"
      >
        HOME
      </Link>

      {items.map((item, index) => (
        <Fragment key={index}>
          {/* 구분 점 (Dot) - HOME 뒤와 아이템들 사이에 위치 */}
          <span className="w-1 h-1 rounded-full bg-gray-600" />

          {item.href ? (
            // 링크가 있는 경우 (부모 경로)
            <Link
              href={item.href}
              className="text-gray-600 text-xl font-light transition-colors hover:text-gray-900"
            >
              {item.label}
            </Link>
          ) : (
            // 링크가 없는 경우 (현재 페이지 - 진한 검정)
            <h1 className="text-gray-900 text-xl font-bold">{item.label}</h1>
          )}
        </Fragment>
      ))}
    </div>
  );
};
