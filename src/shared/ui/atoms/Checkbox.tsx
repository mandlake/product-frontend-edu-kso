import { cn } from "@/shared/lib/cn";

interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
}

export const Checkbox = ({ className, label, ...props }: CheckboxProps) => {
  return (
    <label className="inline-flex items-center gap-4 cursor-pointer">
      <input type="checkbox" className="peer sr-only" {...props} />

      <span
        className={cn(
          "h-5 w-5 border border-gray-600 bg-white flex justify-center items-center",
          "peer-checked:bg-gray-900 peer-checked:border-gray-900 peer-checked:[&_svg]:opacity-100",
          className,
        )}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.99498 10.9669L13.2969 5.66504L14.3575 6.72569L7.99357 13.0897L6.93292 12.029L6.93433 12.0276L3.75 8.84326L4.81065 7.78261L7.99498 10.9669Z"
            fill="white"
          />
        </svg>
      </span>

      {label && (
        <span className="text-gray-900 typo-20-m leading-7.5">{label}</span>
      )}
    </label>
  );
};
