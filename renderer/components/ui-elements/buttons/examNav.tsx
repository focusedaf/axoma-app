import { Button } from "@/components/ui/button";

interface ExamNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
}

const ExamNavigation = ({
  onPrevious,
  onNext,
  isFirstQuestion,
  isLastQuestion,
}:ExamNavigationProps) => {
  return (
    <div className="flex md:flex-1 justify-between items-center gap-4">
      <Button
        onClick={onPrevious}
        disabled={isFirstQuestion}
        className="bg-gray-700 hover:bg-gray-800 disabled:opacity-50 px-5 py-3"
      >
        Previous
      </Button>
      <Button
        onClick={onNext}
        disabled={isLastQuestion}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-5 py-3"
      >
        Next
      </Button>
    </div>
  );
};

export default ExamNavigation