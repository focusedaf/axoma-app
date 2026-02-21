"use client";

import { useParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Violation = {
  id: string;
  type: string;
  severity: "Low" | "Medium" | "High";
  timestamp: string;
  description: string;
};

export default function ExamViolationsPage() {
  const { examId } = useParams();

  const violations: Violation[] = [
    {
      id: "1",
      type: "Tab Switch",
      severity: "Low",
      timestamp: "10:32 AM",
      description: "User switched browser tabs during exam.",
    },
    {
      id: "2",
      type: "Multiple Faces Detected",
      severity: "High",
      timestamp: "10:41 AM",
      description: "More than one face detected via webcam.",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Exam Violations</CardTitle>
          <CardDescription>
            Monitoring log for Exam ID: {examId}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {violations.length === 0 && (
            <p className="text-muted-foreground text-sm">
              No violations recorded for this exam.
            </p>
          )}

          {violations.map((v, index) => (
            <div key={v.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-medium">{v.type}</div>

                <Badge
                  variant={
                    v.severity === "High"
                      ? "destructive"
                      : v.severity === "Medium"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {v.severity}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">{v.description}</p>

              <p className="text-xs text-muted-foreground">
                Time: {v.timestamp}
              </p>

              {index !== violations.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
