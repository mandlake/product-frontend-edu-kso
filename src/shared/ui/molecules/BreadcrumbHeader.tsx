import Link from "next/link";

interface BreadcrumbHeaderProps {
  title: string;
}

export const BreadcrumbHeader = ({ title }: BreadcrumbHeaderProps) => {
  return (
    <div className="flex items-center gap-x-3 py-8">
      {/* HOME (연한 회색) */}
      <Link
        href="/"
        className="text-gray-600 text-xl font-light transition-colors"
      >
        HOME
      </Link>

      {/* 구분 점 (Dot) */}
      <span className="w-1 h-1 rounded-full bg-gray-600" />

      {/* 현재 페이지 제목 (진한 검정) */}
      <h1 className="text-gray-900 text-xl font-bold">{title}</h1>
    </div>
  );
};
