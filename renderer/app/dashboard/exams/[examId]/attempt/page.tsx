"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

import ExamHeader from "@/components/ui-elements/exam-interface/examHeader";
import QuestionCard from "@/components/ui-elements/exam-interface/questionCard";
import ExamSubmitted from "@/components/ui-elements/exam-interface/examSubmitted";
import Feed from "@/components/ui-elements/exam-interface/feed";

import { Skeleton } from "@/components/ui/skeleton";

import {
  verifyLockApi,
  getExamById,
  submitExamApi,
  createViolationApi,
} from "@/lib/api";

type Question = {
  id: string | number;
  questionText: string;
  options?: any[];
};

type Exam = {
  id: string;
  title: string;
  duration: number;
  questions: Question[];
};

/* WAIT FOR ELECTRON */

async function waitForBridge(): Promise<any> {
  let tries = 0;

  while (!(window as any).axoma && tries < 100) {
    await new Promise((r) => setTimeout(r, 100));
    tries++;
  }

  return (window as any).axoma;
}

export default function AttemptPage() {
  const router = useRouter();
  const { examId } = useParams();

  const violationCountRef = useRef(0);
  const handleSubmitRef = useRef<() => Promise<void>>(async () => {});

  const [exam, setExam] = useState<Exam | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});

  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  /* LOAD EXAM */

  useEffect(() => {
    async function loadExam() {
      try {
        const axoma = await waitForBridge();

        if (!axoma) throw new Error("Bridge missing");

        const fingerprint = await axoma.getDeviceFingerprint();

        await verifyLockApi({
          examId: String(examId),
          fingerprint,
        });

        const meta = (await getExamById(String(examId))).data;

        const examJson = await (
          await fetch(`https://gateway.pinata.cloud/ipfs/${meta.cid}`)
        ).json();

        setExam(examJson);
        setTimeLeft(examJson.duration * 60);
      } catch (err) {
        console.error(err);
        router.push("/dashboard/exams");
      } finally {
        setLoading(false);
      }
    }

    if (examId) loadExam();
  }, [examId]);

  /* TIMER */

  useEffect(() => {
    if (!timeLeft || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  /* PROCTOR CHECK */

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        if (submitted) return;

        const axoma = await waitForBridge();

        const [displayCount, processes, vmDetected] = await Promise.all([
          axoma.checkDisplays(),
          axoma.scanProcesses(),
          axoma.checkVM(),
        ]);

        const violation =
          displayCount > 1 || processes.length > 0 || vmDetected;

        if (violation) {
          violationCountRef.current++;

          await createViolationApi({
            examId: String(examId),
            type: "SYSTEM_VIOLATION",
            severity: "HIGH",
            metadata: { displayCount, processes, vmDetected },
          });

          if (violationCountRef.current >= 3) {
            await handleSubmitRef.current();
          }
        }
      } catch (err) {
        console.error(err);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [submitted]);

  /* SUBMIT */

  const handleSubmit = async () => {
    try {
      await submitExamApi({
        examId: String(examId),
        answers: selectedAnswers,
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  });

  if (loading || !exam) return <Skeleton className="h-64 w-full" />;

  if (submitted) return <ExamSubmitted />;

  const q = exam.questions[currentIndex];

  return (
    <div className="min-h-screen bg-muted/40 p-6 relative">
      <ExamHeader
        examTitle={exam.title}
        timeLeft={`${Math.floor(timeLeft / 60)}:${(timeLeft % 60)
          .toString()
          .padStart(2, "0")}`}
        onSubmit={handleSubmit}
      />

      <div className="fixed top-6 right-6 w-72 z-50">
        <Feed examId={String(examId)} candidateId="self" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <QuestionCard
            currentQuestion={q}
            currentQuestionIndex={currentIndex}
            totalQuestions={exam.questions.length}
            progressPercent={((currentIndex + 1) / exam.questions.length) * 100}
            selectedAnswers={selectedAnswers}
            onSelectAnswer={(val) =>
              setSelectedAnswers((p) => ({
                ...p,
                [String(q.id)]: val,
              }))
            }
            onPrevious={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
            onNext={() =>
              setCurrentIndex((i) => Math.min(i + 1, exam.questions.length - 1))
            }
          />
        </div>
      </div>
    </div>
  );
}
