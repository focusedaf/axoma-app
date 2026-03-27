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

/* ---------------- TYPES ---------------- */

type Option =
  | string
  | {
      id?: string | number;
      text?: string;
      value?: string;
    };

type Question = {
  id: string | number;
  questionText: string;
  options?: Option[];
  image?: string | null;
};

type Exam = {
  id: string;
  title: string;
  duration: number;
  questions: Question[];
};

/* ---------------- HELPERS ---------------- */

const normalizeOptions = (options?: Option[]) => {
  if (!options) return [];
  return options.map((opt) =>
    typeof opt === "string" ? opt : opt.text || opt.value || String(opt.id),
  );
};

/* ---------------- COMPONENT ---------------- */

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

  /* ---------------- FLOW GUARD ---------------- */
  useEffect(() => {
    const guidelines = sessionStorage.getItem(`guidelines-${examId}`);
    const verified = sessionStorage.getItem(`verified-${examId}`);

    if (!guidelines) {
      router.replace(`/dashboard/exams/${examId}/guidelines`);
      return;
    }

    if (!verified) {
      router.replace(`/dashboard/exams/${examId}/system-check`);
      return;
    }
  }, [examId]);

  /* ---------------- STORE SUBMIT REF ---------------- */
  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  });

  /* ---------------- PROCTOR ---------------- */
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        if (!window.axoma || submitted) return;

        const [display, proc, vm] = await Promise.all([
          window.axoma.checkDisplays(),
          window.axoma.scanProcesses(),
          window.axoma.checkVM(),
        ]);

        const violation = display > 1 || proc.length > 0 || vm;

        if (violation) {
          violationCountRef.current++;

          await createViolationApi({
            examId: String(examId),
            type: "PROCTOR_VIOLATION",
            severity: "HIGH",
          });

          if (violationCountRef.current >= 3) {
            await handleSubmitRef.current();
          }
        }
      } catch {}
    }, 10000);

    return () => clearInterval(interval);
  }, [submitted]);

  /* ---------------- LOAD EXAM ---------------- */
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const fp = await window.axoma?.getDeviceFingerprint();

        if (fp) {
          await verifyLockApi({ examId: String(examId), fingerprint: fp });
        }

        const meta = (await getExamById(String(examId))).data;

        const examJson = await (
          await fetch(`https://gateway.pinata.cloud/ipfs/${meta.cid}`)
        ).json();

        setExam(examJson);
        setTimeLeft(examJson.duration * 60);
      } catch {
        router.push("/dashboard/exams");
      } finally {
        setLoading(false);
      }
    }

    if (examId) load();
  }, [examId]);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (!timeLeft || submitted) return;

    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [timeLeft, submitted]);

  const handleSubmit = async () => {
    await submitExamApi({
      examId: String(examId),
      answers: selectedAnswers,
    });
    setSubmitted(true);
  };

  if (loading || !exam) return <Skeleton className="h-64 w-full" />;
  if (submitted) return <ExamSubmitted />;

  const q = exam.questions[currentIndex];

  return (
    <div className="min-h-screen bg-muted/40 p-6">
      <ExamHeader
        examTitle={exam.title}
        timeLeft={`${Math.floor(timeLeft / 60)}:${(timeLeft % 60)
          .toString()
          .padStart(2, "0")}`}
        onSubmit={handleSubmit}
      />

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <QuestionCard
            currentQuestion={{
              ...q,
              options: normalizeOptions(q.options),
            }}
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

        <div className="sticky top-6">
          <Feed examId={String(examId)} candidateId="candidate-123" />
        </div>
      </div>
    </div>
  );
}
