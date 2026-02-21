"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function ResultsPage() {
  const { examId } = useParams();

  const score = 78;

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
            <p className="text-sm mb-2">Score: {score}%</p>
            <Progress value={score} />
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
