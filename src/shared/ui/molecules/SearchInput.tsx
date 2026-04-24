import React from "react";
import { SearchIcon } from "../icons";
import { cn } from "@/shared/lib/cn";

interface SearchInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  wrapperClassName?: string;
}

export const SearchInput = ({
  value,
  onChange,
  onSearch,
  placeholder = "검색어를 입력해주세요.",
  className,
  wrapperClassName,
  ...props
}: SearchInputProps) => {
  const handleSearch = () => {
    onSearch?.(value);
  };

  return (
    <div
      className={cn(
        "w-62.25 h-10.75 flex items-center justify-between bg-gray-100 px-4 py-3",
        wrapperClassName,
      )}
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
        placeholder={placeholder}
        className={cn(
          "typo-16-m w-full bg-transparent outline-none placeholder:text-gray-600",
          className,
        )}
        {...props}
      />
      <button type="button" onClick={handleSearch} aria-label="검색">
        <SearchIcon />
      </button>
    </div>
  );
};
