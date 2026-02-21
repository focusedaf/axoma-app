import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import QuestionProgressBar from "./questionProgressBar";
import QuestionOptions from "./questionOptions";
import ExamNavigation from "../buttons/examNav";

interface QuestionCardProps {
  currentQuestion: {
    id: string | number; 
    questionText: string;
    options: string[];
    image?: string | null;
  };
  currentQuestionIndex: number;
  totalQuestions: number;
  progressPercent: number;
  selectedAnswers: Record<string, string>;
  onSelectAnswer: (option: string) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const QuestionCard = ({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  progressPercent,
  selectedAnswers,
  onSelectAnswer,
  onPrevious,
  onNext,
}: QuestionCardProps) => {
  const hasOptions = currentQuestion.options.length > 0;
  const questionId = String(currentQuestion.id); 

  return (
    <Card className="w-full max-w-5xl mx-auto border shadow-sm">
      <CardHeader className="border-b pb-4">
        <h2 className="text-xl font-semibold">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </h2>
        <QuestionProgressBar
          current={currentQuestionIndex + 1}
          total={totalQuestions}
          percent={progressPercent}
        />
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <p className="text-lg text-gray-800">{currentQuestion.questionText}</p>

        {/* Show image if exists */}
        {currentQuestion.image && (
          <div className="my-4">
            <img
              src={currentQuestion.image}
              alt="Question"
              className="max-h-64 rounded border"
            />
          </div>
        )}

        {hasOptions ? (
          <QuestionOptions
            question={{
              id: questionId,
              questionText: currentQuestion.questionText,
              options: currentQuestion.options,
            }}
            selectedOption={selectedAnswers[questionId]}
            onSelectAnswer={onSelectAnswer}
          />
        ) : (
          <div className="p-6 border border-dashed rounded-md bg-slate-50">
            <textarea
              placeholder="Type your answer here..."
              value={selectedAnswers[questionId] || ""}
              onChange={(e) => onSelectAnswer(e.target.value)}
              className="w-full min-h-[150px] p-4 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t bg-gray-50 p-4 rounded-b-lg">
        <ExamNavigation
          onPrevious={onPrevious}
          onNext={onNext}
          isFirstQuestion={currentQuestionIndex === 0}
          isLastQuestion={currentQuestionIndex === totalQuestions - 1}
        />
      </CardFooter>
    </Card>
  );
};

export default QuestionCard;
