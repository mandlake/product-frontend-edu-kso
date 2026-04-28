import { NavItem } from "@/shared/ui/molecules/NavItem";
import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  const menuList = [
    { label: "클럽소개", href: "/about" },
    { label: "예약안내", href: "/reservation" },
    { label: "갤러리", href: "/gallery" },
    { label: "후기 게시판", href: "/review" },
    { label: "공지사항", href: "/notice" },
  ];

  return (
    <header className="flex items-center justify-between px-30 h-30 w-full bg-white">
      <Link href="/">
        <Image
          src="/icons/logo.png"
          alt="로고"
          width={120}
          height={41.48}
          style={{ height: "auto" }}
          loading="eager"
        />
      </Link>
      <nav className="flex gap-8">
        {menuList.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>
    </header>
  );
};
