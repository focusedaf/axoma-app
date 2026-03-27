"use client";

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

/* ---------------- TYPES ---------------- */

interface QuestionCardProps {
  currentQuestion: {
    id: string | number;
    questionText: string;
    options?: string[];
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

/* ---------------- COMPONENT ---------------- */

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
  const questionId = String(currentQuestion.id);

  // 🔥 FIX: supports descriptive
  const hasOptions =
    currentQuestion.options && currentQuestion.options.length > 0;

  return (
    <Card className="w-full max-w-5xl mx-auto rounded-2xl border bg-white shadow-sm">
      {/* HEADER */}
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

      {/* CONTENT */}
      <CardContent className="pt-6 space-y-5">
        {/* QUESTION TEXT */}
        <p className="text-lg text-gray-800 leading-relaxed">
          {currentQuestion.questionText}
        </p>

        {/* IMAGE */}
        {currentQuestion.image && (
          <div className="my-2">
            <img
              src={currentQuestion.image}
              alt="Question"
              className="max-h-64 rounded-lg border object-contain"
            />
          </div>
        )}

        {/* OPTIONS / DESCRIPTIVE */}
        {hasOptions ? (
          <QuestionOptions
            question={{
              id: questionId,
              options: currentQuestion.options!,
            }}
            selectedOption={selectedAnswers[questionId]}
            onSelectAnswer={onSelectAnswer}
          />
        ) : (
          <div className="p-4 border border-dashed rounded-lg bg-gray-50">
            <textarea
              placeholder="Type your answer here..."
              value={selectedAnswers[questionId] || ""}
              onChange={(e) => onSelectAnswer(e.target.value)}
              className="w-full min-h-[150px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        )}
      </CardContent>

      {/* FOOTER */}
      <CardFooter className="border-t bg-gray-50 p-4 rounded-b-2xl">
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
  