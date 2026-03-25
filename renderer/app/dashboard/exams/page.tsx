"use client";

import { useEffect, useState } from "react";
import { getAllExamsApi } from "@/lib/api";
import { ExamTabs } from "@/components/ui-elements/dash/examTabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/ui-elements/skeletons/table-skeleton";

type Exam = {
  id: string;
  title: string;
  scheduledOn: string;
  status: "Upcoming" | "Live" | "Closed";
};

const ITEMS_PER_PAGE = 5;

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageLive, setPageLive] = useState(1);
  const [pageUpcoming, setPageUpcoming] = useState(1);

  useEffect(() => {
    async function loadExams() {
      try {
        const res = await getAllExamsApi();
        setExams(res.data);
      } catch (err) {
        console.error("Failed to load exams:", err);
      } finally {
        setLoading(false);
      }
    }

    loadExams();
  }, []);

  if (loading) return <TableSkeleton />;

  const liveExams = exams.filter((e) => e.status === "Live");
  const upcomingExams = exams.filter((e) => e.status === "Upcoming");

  function renderTable(data: Exam[], page: number, setPage: any) {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const paginated = data.slice(start, start + ITEMS_PER_PAGE);
    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

    return (
      <div className="space-y-4 mt-4">
        <div className="border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginated.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.title}</TableCell>

                  <TableCell>
                    {new Date(exam.scheduledOn).toLocaleString("en-IN")}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        exam.status === "Live"
                          ? "destructive"
                          : exam.status === "Upcoming"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {exam.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p: number) => Math.max(1, p - 1))}
                />
              </PaginationItem>

              <PaginationItem>
                Page {page} of {totalPages || 1}
              </PaginationItem>

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setPage((p: number) => Math.min(totalPages || 1, p + 1))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 w-full">
      <ExamTabs
        liveCount={liveExams.length}
        upcomingCount={upcomingExams.length}
        liveContent={renderTable(liveExams, pageLive, setPageLive)}
        upcomingContent={renderTable(
          upcomingExams,
          pageUpcoming,
          setPageUpcoming,
        )}
      />
    </div>
  );
}
