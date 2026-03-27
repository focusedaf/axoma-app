"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

/* ---------------- TYPES ---------------- */

type OptionType =
  | string
  | {
      id?: string | number;
      text?: string;
      value?: string;
    };

interface QuestionOptionsProps {
  question: {
    id: string;
    options: OptionType[];
  };
  selectedOption: string | undefined;
  onSelectAnswer: (option: string) => void;
}

/* ---------------- HELPERS ---------------- */

const getOptionValue = (option: OptionType): string => {
  if (typeof option === "string") return option;

  return (
    option.text ||
    option.value ||
    (option.id !== undefined ? String(option.id) : "")
  );
};

/* ---------------- COMPONENT ---------------- */

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
      {question.options.map((option, index) => {
        const value = getOptionValue(option);

       
        const key = `${question.id}-${index}-${value}`;

        const isSelected = selectedOption === value;

        return (
          <Label
            key={key}
            htmlFor={key}
            className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
              isSelected
                ? "bg-blue-50 border-blue-500 shadow-sm"
                : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >
            <RadioGroupItem id={key} value={value} />

            <span
              className={`text-sm ${
                isSelected ? "font-semibold text-blue-700" : "text-gray-700"
              }`}
            >
              {value}
            </span>
          </Label>
        );
      })}
    </RadioGroup>
  );
};

export default QuestionOptions;
