import { useState, useRef, useEffect } from "react";
import { Button } from "../atoms/Button";
import { KebabIcon } from "../icons";

interface MenuItem {
  label: string;
  onClick: () => void;
}

interface DropdownMenuProps {
  items: MenuItem[];
  className?: string;
}

export const DropdownMenu = ({ items, className }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 메뉴 바깥 클릭 시 닫기 로직
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block ${className}`} ref={menuRef}>
      {/* 점 3개 아이콘 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="더 보기"
      >
        <KebabIcon />
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="absolute right-0 z-10 flex flex-col overflow-hidden border border-gray-400 bg-white shadow-lg">
          {items.map((item, index) => (
            <Button
              key={item.label}
              className={`rounded-none border-0 w-30 h-[44.5px] font-normal justify-center px-4 ${
                index !== 0 ? "border-t border-gray-400" : ""
              }`}
              variant="outline"
              onClick={() => {
                item.onClick();
                setIsOpen(false); // 클릭 후 메뉴 닫기
              }}
            >
              {item.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
