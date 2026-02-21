"use client";

import { useState } from "react";
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

type Violation = {
  id: string;
  exam: string;
  type: string;
  severity: "Low" | "Medium" | "High";
  time: string;
};

export default function GlobalViolationsPage() {
  const [filter, setFilter] = useState<string>("all");

  const violations: Violation[] = [
    {
      id: "1",
      exam: "Data Structures Midterm",
      type: "Tab Switch",
      severity: "Low",
      time: "12 Feb, 10:32 AM",
    },
    {
      id: "2",
      exam: "Operating Systems Quiz",
      type: "Multiple Faces Detected",
      severity: "High",
      time: "14 Feb, 11:15 AM",
    },
  ];

  const filtered =
    filter === "all"
      ? violations
      : violations.filter((v) => v.severity === filter);

  const total = violations.length;
  const highCount = violations.filter((v) => v.severity === "High").length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Violation History</h1>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Violations</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{total}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>High Severity</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-red-600">
            {highCount}
          </CardContent>
        </Card>
      </div>

      {/* Filter + Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Records</CardTitle>
          <CardDescription>Review violations across all exams.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Select onValueChange={(value) => setFilter(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam</TableHead>
                <TableHead>Violation</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>{v.exam}</TableCell>
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
                  <TableCell>{v.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
