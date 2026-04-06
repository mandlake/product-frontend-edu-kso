import { cn } from "@/src/shared/lib/cn";

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  type?: React.HTMLInputTypeAttribute;
}

export const Input = ({ className, type = "text", ...props }: InputProps) => {
  return (
    <>
      <input
        type={type}
        className={cn(
          "w-full h-11.5 border-b border-gray-300 pb-4 text-sm outline-none disabled:opacity-50 disabled:cursor-not-allowed",
          "placeholder:text-gray-600",
          "focus:border-gray-900",
          className,
        )}
        {...props}
      />
    </>
  );
};
