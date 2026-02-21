"use client";
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

export type Exam = {
  id: string;
  title: string;
  course: string;
  scheduledOn: Date;
  duration: number;
  status: "Upcoming" | "Live" | "Closed";
};

interface ExamScheduleProps {
  exams: Exam[];
}

function formatScheduledOn(date: Date) {
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getStatusVariant(status: Exam["status"]) {
  switch (status) {
    case "Live":
      return "default";
    case "Upcoming":
      return "secondary";
    case "Closed":
      return "outline";
    default:
      return "secondary";
  }
}

export function ExamSchedule({ exams }: ExamScheduleProps) {
  const router = useRouter();

  const handleTakeExam = (examId: string) => {
    router.push(`/guidelines?examId=${examId}`);
  };

  return (
    <div className="border rounded-md">
      <Table className="text-center">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Exam Title</TableHead>
            <TableHead className="text-center">Course</TableHead>
            <TableHead className="text-center">Scheduled On</TableHead>
            <TableHead className="text-center">Duration</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exams.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground py-8"
              >
                No exams scheduled.
              </TableCell>
            </TableRow>
          )}

          {exams.map((exam) => (
            <TableRow key={exam.id}>
              <TableCell className="font-medium text-black">
                {exam.title}
              </TableCell>

              <TableCell className="font-medium text-black">
                {exam.course || "N/A"}
              </TableCell>

              <TableCell className="font-medium text-black">
                {formatScheduledOn(exam.scheduledOn)}
              </TableCell>

              <TableCell className="font-medium text-black">
                {exam.duration} mins
              </TableCell>

              <TableCell>
                <Badge variant={getStatusVariant(exam.status)}>
                  {exam.status}
                </Badge>
              </TableCell>

              <TableCell>
                <Button
                  size="sm"
                  disabled={exam.status !== "Live"}
                  onClick={() => handleTakeExam(exam.id)}
                >
                  Take Exam
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
