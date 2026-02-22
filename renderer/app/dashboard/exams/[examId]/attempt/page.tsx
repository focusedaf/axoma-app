"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import ExamHeader from "@/components/ui-elements/exam-interface/examHeader";
import QuestionCard from "@/components/ui-elements/exam-interface/questionCard";
import ExamSubmitted from "@/components/ui-elements/exam-interface/examSubmitted";
import Feed from "@/components/ui-elements/exam-interface/feed";

type Question = {
  id: string | number;
  questionText: string;
  options: string[];
  image?: string | null;
};

type Exam = {
  id: string;
  title: string;
  duration: number;
  questions: Question[];
};

export default function AttemptPage() {
  const violationCountRef = useRef(0);
  const { examId } = useParams();
  const [exam, setExam] = useState<Exam | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitRef = useRef<() => Promise<void>>(async () => {});

  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  });

  useEffect(() => {
    window.axoma?.enterExamMode();

    return () => {
      window.axoma?.exitExamMode();
    };
  }, []);

  useEffect(() => {
    if (!window.axoma) return;

    const interval = setInterval(async () => {
      try {
        if (submitted) return;

        const displayCount = await window.axoma.checkDisplays();
        const suspicious = await window.axoma.scanProcesses();
        const isVM = await window.axoma.checkVM();

        if (displayCount > 1 || suspicious.length > 0 || isVM) {
          violationCountRef.current += 1;

          console.warn("Violation detected", {
            displayCount,
            suspicious,
            isVM,
            count: violationCountRef.current,
          });

          if (violationCountRef.current >= 3) {
            console.warn("Violation threshold reached. Submitting exam.");

            await handleSubmitRef.current();
            window.axoma.exitExamMode();
          }
        }
      } catch (err) {
        console.error("Proctor check failed:", err);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [submitted]);

  // Load exam
  useEffect(() => {
    async function loadExam() {
      const metaRes = await fetch(`/api/exams/${examId}`);
      const meta = await metaRes.json();

      const ipfsRes = await fetch(
        `https://gateway.pinata.cloud/ipfs/${meta.cid}`,
      );

      const examJson = await ipfsRes.json();

      setExam(examJson);
      setTimeLeft(examJson.duration * 60);
    }

    if (examId) loadExam();
  }, [examId]);

  // Timer
  useEffect(() => {
    if (!timeLeft || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  if (!exam) return <div>Loading exam...</div>;
  if (submitted) return <ExamSubmitted />;

  const totalQuestions = exam.questions.length;
  const currentQuestion = exam.questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  function handleSelectAnswer(option: string) {
    const questionId = String(currentQuestion.id);

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  }

  function handlePrevious() {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }

  function handleNext() {
    setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1));
  }

  async function handleSubmit() {
    try {
      await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId,
          answers: selectedAnswers,
        }),
      });

      setSubmitted(true);
    } catch (err) {
      console.error("Submission failed:", err);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <ExamHeader
        examTitle={exam.title}
        timeLeft={formattedTime}
        onSubmit={handleSubmit}
      />

      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="col-span-2">
          <QuestionCard
            currentQuestion={currentQuestion}
            currentQuestionIndex={currentIndex}
            totalQuestions={totalQuestions}
            progressPercent={progressPercent}
            selectedAnswers={selectedAnswers}
            onSelectAnswer={handleSelectAnswer}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </div>

        <div className="sticky top-6 h-fit">
          <Feed examId={String(examId)} candidateId="mockCandidateId123" />
        </div>
      </div>
    </div>
  );
}
