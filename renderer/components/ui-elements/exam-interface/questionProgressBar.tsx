import { Progress } from "@/components/ui/progress";

interface QuestionProgressBarProps {
  current: number;
  total: number;
  percent: number;
}

const QuestionProgressBar = ({
  current,
  total,
  percent,
}: QuestionProgressBarProps) => {
  return (
    <div className="mt-4 w-full">
      <Progress value={percent} className="h-2.5" />
      <p className="text-sm text-gray-500 text-right mt-1">
        {current} / {total} Completed
      </p>
    </div>
  );
};

export default QuestionProgressBar;