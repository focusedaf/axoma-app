"use client";

import { useEffect, useState } from "react";
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
import { getExamViolationsApi } from "@/lib/api";
import { TableSkeleton } from "@/components/ui-elements/skeletons/table-skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Violation = {
  id: string;
  type: string;
  severity: "Low" | "Medium" | "High";
  createdAt: string;
  metadata?: any;
};

export default function ExamViolationsPage() {
  const { examId } = useParams();

  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    async function loadViolations() {
      try {
        const res = await getExamViolationsApi(String(examId));
        setViolations(res.data);
      } catch (err) {
        console.error("Failed to load exam violations", err);
      } finally {
        setLoading(false);
      }
    }

    if (examId) loadViolations();
  }, [examId]);

  const paginated = violations.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil(violations.length / limit);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-10">
        <TableSkeleton rows={5} cols={3} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Exam Violations</CardTitle>
          <CardDescription>Exam ID: {examId}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {paginated.length === 0 && (
            <p className="text-muted-foreground text-sm">
              No violations recorded.
            </p>
          )}

          {paginated.map((v, index) => (
            <div key={v.id} className="space-y-2">
              <div className="flex justify-between">
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

              {v.metadata && (
                <pre className="text-xs bg-muted p-2 rounded">
                  {JSON.stringify(v.metadata, null, 2)}
                </pre>
              )}

              <p className="text-xs text-muted-foreground">
                {new Date(v.createdAt).toLocaleString()}
              </p>

              {index !== paginated.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
              />
            </PaginationItem>

            <PaginationItem>
              <span className="px-3 text-sm">
                {page} / {totalPages}
              </span>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
