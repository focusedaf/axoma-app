"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

type ExamMeta = {
  id: string;
  title: string;
  duration: number;
  status: string;
};

export default function ExamOverviewPage() {
  const { examId } = useParams();
  const router = useRouter();

  const [exam, setExam] = useState<ExamMeta | null>(null);

  useEffect(() => {
    async function loadExam() {
      const res = await fetch(`/api/exams/${examId}`);
      const data = await res.json();
      setExam(data);
    }

    if (examId) loadExam();
  }, [examId]);

  if (!exam) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{exam.title}</CardTitle>
          <CardDescription>Duration: {exam.duration} mins</CardDescription>
        </CardHeader>

        <CardContent className="grid md:grid-cols-2 gap-4">
          <Button
            onClick={() =>
              router.push(`/dashboard/exams/${examId}/system-check`)
            }
          >
            System Check
          </Button>

          <Button
            onClick={() => router.push(`/dashboard/exams/${examId}/guidelines`)}
          >
            View Guidelines
          </Button>

          <Button
            onClick={() => router.push(`/dashboard/exams/${examId}/attempt`)}
          >
            Attempt Exam
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/exams/${examId}/results`)}
          >
            View Results
          </Button>

          <Button
            variant="destructive"
            onClick={() => router.push(`/dashboard/exams/${examId}/violations`)}
          >
            View Violations
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
