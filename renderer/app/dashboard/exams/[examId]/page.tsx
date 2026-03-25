"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getExamById } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui-elements/skeletons/table-skeleton";

type ExamMeta = {
  id: string;
  title: string;
  duration: number;
  cid: string;
};

export default function ExamOverviewPage() {
  const params = useParams();
  const examId = params.examId as string;

  const router = useRouter();
  const [exam, setExam] = useState<ExamMeta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExam() {
      try {
        const res = await getExamById(examId);
        setExam(res.data);
      } catch (err) {
        console.error("Failed to load exam:", err);
      } finally {
        setLoading(false);
      }
    }

    if (examId) loadExam();
  }, [examId]);

 if (loading) return <TableSkeleton rows={5} cols={3} />;
  if (!exam) return <div className="p-6">Exam not found</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <Card className="shadow-md border rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">{exam.title}</CardTitle>
          <CardDescription>Duration: {exam.duration} mins</CardDescription>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
