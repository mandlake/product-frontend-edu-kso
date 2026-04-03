import { Button } from "./Button";

interface StackedButtonGroupProps {
  topLabel: string;
  bottomLabel: string;
  onTopClick?: () => void;
  onBottomClick?: () => void;
}

export const StackedButtonGroup = ({
  topLabel,
  bottomLabel,
  onTopClick,
  onBottomClick,
}: StackedButtonGroupProps) => {
  return (
    <div className="inline-flex flex-col overflow-hidden border border-gray-400 bg-white">
      <Button
        text="black"
        className="rounded-none border-0 bg-white w-30 h-[44.5px]"
        onClick={onTopClick}
      >
        {topLabel}
      </Button>
      <Button
        text="black"
        className="rounded-none border-0 border-t border-gray-400 bg-white w-30 h-[44.5px]"
        onClick={onBottomClick}
      >
        {bottomLabel}
      </Button>
    </div>
  );
};
