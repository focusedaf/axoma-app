"use client";

import { useEffect, useState } from "react";
import { ExamTabs } from "@/components/ui-elements/dash/examTabs";
import { ExamSchedule, Exam } from "@/components/ui-elements/dash/examSchedule";

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExams() {
      try {
        const res = await fetch("/api/exams");
        const data = await res.json();

        /**
         * Expected API response shape:
         * [
         *   {
         *     id: "1",
         *     title: "Data Structures Midterm",
         *     course: "CSE 201",
         *     scheduledOn: "2026-02-21T10:00:00Z",
         *     duration: 60,
         *     status: "Live"
         *   }
         * ]
         */

        const formatted: Exam[] = data.map((exam: any) => ({
          ...exam,
          scheduledOn: new Date(exam.scheduledOn),
        }));

        setExams(formatted);
      } catch (err) {
        console.error("Failed to load exams:", err);
      } finally {
        setLoading(false);
      }
    }

    loadExams();
  }, []);

  if (loading) return <div>Loading exams...</div>;

  const liveExams = exams.filter((e) => e.status === "Live");
  const upcomingExams = exams.filter((e) => e.status === "Upcoming");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Exams</h1>

      <ExamTabs
        liveCount={liveExams.length}
        upcomingCount={upcomingExams.length}
        liveContent={<ExamSchedule exams={liveExams} />}
        upcomingContent={<ExamSchedule exams={upcomingExams} />}
      />
    </div>
  );
}
