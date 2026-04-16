import { cn } from "@/shared/lib/cn";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = ({ className, ...props }: TextareaProps) => {
  return (
    <textarea
      className={cn(
        "w-full min-h-70 p-6 pb-4 border border-gray-300 bg-gray-100 text-sm outline-none resize-none",
        "focus:border-gray-900",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "placeholder:text-gray-600",
        className,
      )}
      {...props}
    />
  );
};
