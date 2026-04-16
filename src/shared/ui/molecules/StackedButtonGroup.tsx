import { Button } from "../atoms/Button";

interface StackedButtonGroupProps {
  topLabel: string;
  bottomLabel: string;
  onTopClick?: () => void;
  onBottomClick?: () => void;
}

// TODO: 해당 부분은 메뉴 컴포넌트(: 모양 클릭 시에 넣어서 수정가능하도록 분기 수정. => StackedButtonGroupProps는 제거)
export const StackedButtonGroup = ({
  topLabel,
  bottomLabel,
  onTopClick,
  onBottomClick,
}: StackedButtonGroupProps) => {
  return (
    <div className="inline-flex flex-col overflow-hidden border border-gray-400 bg-white">
      <Button
        className="rounded-none border-0 w-30 h-[44.5px]"
        variant={"outline"}
        onClick={onTopClick}
      >
        {topLabel}
      </Button>
      <Button
        className="rounded-none border-0 border-t border-gray-400 bg-white w-30 h-[44.5px]"
        variant={"outline"}
        onClick={onBottomClick}
      >
        {bottomLabel}
      </Button>
    </div>
  );
};
