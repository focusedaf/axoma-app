"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { getResultApi } from "@/lib/api";

type Result = {
  score: number;
};

export default function ResultsPage() {
  const params = useParams();
  const examId = params.examId as string;

  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResult() {
      try {
        const res = await getResultApi(examId);
        setResult(res.data);
      } catch (err) {
        console.error("Failed to load result:", err);
      } finally {
        setLoading(false);
      }
    }

    if (examId) loadResult();
  }, [examId]);

  if (loading) return <div>Loading result...</div>;
  if (!result) return <div>No result found</div>;

  return (
    <div className="max-w-3xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Exam Results</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">Exam ID</p>
            <p className="font-medium">{examId}</p>
          </div>

          <div>
            <p className="text-sm mb-2">Score: {result.score}%</p>
            <Progress value={result.score} />
          </div>

          <Button className="w-full" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
