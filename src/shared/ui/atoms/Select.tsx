import React from "react";
import { ArrowIcon } from "./icons";

interface Option {
  label: string;
  value: string;
}

interface SelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "onChange"
> {
  options: Option[];
  onChange?: (value: string) => void;
}

const Select = ({
  options,
  value,
  onChange,
  className,
  ...props
}: SelectProps) => {
  return (
    <div
      className={`relative inline-flex items-center h-10.75 ${className ?? ""}`}
    >
      <select
        {...props}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="text-sm text-neutral-black pr-4 py-2 outline-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="py-2">
            {opt.label}
          </option>
        ))}
      </select>

      {/* Arrow */}
      <div className="pointer-events-none absolute right-0 flex items-center">
        <ArrowIcon className="h-4 w-4 text-neutral-black" />
      </div>
    </div>
  );
};

export default Select;
