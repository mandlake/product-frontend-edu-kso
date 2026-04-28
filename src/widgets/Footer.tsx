import { LineItem } from "@/shared/ui/atoms/LineItem";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="flex flex-col px-25 pt-20 bg-gray-900 w-full">
      <Link href="/">
        <Image
          src="/icons/logo-white.png"
          alt="로고"
          width={162}
          height={56}
          style={{ height: "auto" }}
          loading="eager"
        />
      </Link>
      <div className="flex flex-row pt-10.25 text-white gap-2.5 typo-14-r">
        <LineItem className="pr-2.5">(주) 미켈란골프투어</LineItem>
        <LineItem className="pr-2.5">대표이사 : 이동익</LineItem>
        <p>성남시 분당구 정자일로 100, 상가3층 303호(13562)</p>
      </div>
      <div className="flex flex-row pt-2.5 text-gray-700 gap-2.5 typo-14-r w-full pb-5 border-b border-gray-700">
        <LineItem className="pr-2.5 after:bg-gray-700">
          M. 010 - 3726 - 6000
        </LineItem>
        <LineItem className="pr-2.5 after:bg-gray-700">
          T. 031 - 712 - 7982
        </LineItem>
        <p>E. mgtour-lee@naver.com</p>
      </div>
      <div className="flex flex-row pt-5 text-gray-700 gap-2.5 typo-14-r mb-20">
        <p>COPYRIGHT Ⓒ 2023 MICHELANGOLFTOUR. ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  );
};
