"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllViolationsApi } from "@/lib/api";
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
  examId: string;
  type: string;
  severity: "Low" | "Medium" | "High";
  createdAt: string;
};

export default function GlobalViolationsPage() {
  const [filter, setFilter] = useState("all");
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const limit = 6;

  useEffect(() => {
    async function load() {
      try {
        const res = await getAllViolationsApi();
        setViolations(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const filtered =
    filter === "all"
      ? violations
      : violations.filter((v) => v.severity === filter);

  const paginated = filtered.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil(filtered.length / limit);

  if (loading) {
    return (
      <div className="p-6">
        <TableSkeleton rows={8} cols={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
    
      {/* FILTER */}
      <Select onValueChange={(v) => setFilter(v)}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filter severity" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="Low">Low</SelectItem>
          <SelectItem value="Medium">Medium</SelectItem>
          <SelectItem value="High">High</SelectItem>
        </SelectContent>
      </Select>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>All Violations</CardTitle>
          <CardDescription>Across all exams</CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginated.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>{v.examId}</TableCell>
                  <TableCell>{v.type}</TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    {new Date(v.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {paginated.length === 0 && (
            <p className="text-sm text-muted-foreground mt-4">
              No violations found.
            </p>
          )}
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
