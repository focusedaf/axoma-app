import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface QuestionOptionsProps {
  question: { id: string; questionText: string; options: string[] };
  selectedOption: string | undefined;
  onSelectAnswer: (option: string) => void;
}

const QuestionOptions = ({
  question,
  selectedOption,
  onSelectAnswer,
}: QuestionOptionsProps) => {
  return (
    <RadioGroup
      value={selectedOption}
      onValueChange={onSelectAnswer}
      className="space-y-3"
    >
      {question.options.map((option) => {
        const isSelected = selectedOption === option;
        return (
          <Label
            key={option}
            htmlFor={`${question.id}-${option}`}
            className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all select-none ${
              isSelected
                ? "bg-blue-50 border-blue-500 shadow-sm"
                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
            }`}
          >
            <RadioGroupItem
              id={`${question.id}-${option}`}
              value={option}
              className="mr-4"
            />
            <span
              className={`text-base ${
                isSelected ? "font-semibold text-blue-800" : "text-gray-700"
              }`}
            >
              {option}
            </span>
          </Label>
        );
      })}
    </RadioGroup>
  );
};

export default QuestionOptions;
