"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export type Exam = {
  id: string;
  title: string;
  course: string;
  scheduledOn: Date;
  duration: number;
  status: "Upcoming" | "Live" | "Closed";
};

const ITEMS_PER_PAGE = 5;

export function ExamSchedule({ exams }: { exams: Exam[] }) {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(exams.length / ITEMS_PER_PAGE);
  const paginated = exams.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-xl bg-white shadow-sm">
        <Table className="text-center">
          <TableHeader>
            <TableRow>
              <TableHead>Exam Title</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Scheduled</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>No exams</TableCell>
              </TableRow>
            )}

            {paginated.map((exam) => (
              <TableRow key={exam.id}>
                <TableCell>{exam.title}</TableCell>
                <TableCell>{exam.course}</TableCell>
                <TableCell>{exam.scheduledOn.toLocaleString()}</TableCell>
                <TableCell>{exam.duration} min</TableCell>
                <TableCell>
                  <Badge>{exam.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    disabled={exam.status !== "Live"}
                    onClick={() => {
                      sessionStorage.removeItem(`guidelines-${exam.id}`);
                      sessionStorage.removeItem(`verified-${exam.id}`);
                      router.push(`/dashboard/exams/${exam.id}/guidelines`);
                    }}
                  >
                    Take Exam
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => goToPage(page - 1)}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => goToPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => goToPage(page + 1)}
                className={
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
