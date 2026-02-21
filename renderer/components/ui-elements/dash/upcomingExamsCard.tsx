"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UpcomingExam } from "@/lib/data"
import { NotebookPen } from "lucide-react";

interface UpcomingExamsCardProps {
  exams: UpcomingExam[];
}

export function UpcomingExamsCard({ exams }: UpcomingExamsCardProps) {
  const router = useRouter(); 

  const handleTakeExam = (examId: string) => {
    router.push(`/exams/setup/${examId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Exams</CardTitle>
        <CardDescription>Your scheduled tests. Prepare well!</CardDescription>
      </CardHeader>
      <CardContent>
        <Table className="text-center">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Exam</TableHead>
              <TableHead className="text-center">Date</TableHead>
              <TableHead className="text-center">Time</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exams.map((exam) => (
              <TableRow key={exam.id}>
                <TableCell className="font-medium">{exam.title}</TableCell>
                <TableCell>{exam.date}</TableCell>
                <TableCell>{exam.time}</TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTakeExam(exam.id)}
                  >
                    <NotebookPen className="mr-2 h-4 w-4" /> Take Exam
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
