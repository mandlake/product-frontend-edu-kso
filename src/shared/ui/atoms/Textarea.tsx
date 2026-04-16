import { cn } from "@/shared/lib/cn";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = ({ className, ...props }: TextareaProps) => {
  return (
    <>
      <textarea
        className={cn(
          "w-full p-6 min-h-70 border border-gray-300 bg-gray-100 pb-4 text-sm outline-none resize-none",
          "placeholder:text-gray-600",
          "focus:border-gray-900",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className,
        )}
        {...props}
      />
    </>
  );
};
