"use client";

import { useEffect, useState } from "react";
import { PerformanceOverviewCard } from "@/components/ui-elements/dash/percentOverviewCard";
import { UpcomingExamsCard } from "@/components/ui-elements/dash/upcomingExamsCard";
import { RecentResultsCard } from "@/components/ui-elements/dash/recentResultsCard";
import { getDashboardApi, getAllExamsApi } from "@/lib/api";
import { StudentStatCard } from "@/lib/data";
import { Award, CalendarCheck, NotebookPen } from "lucide-react";
import { DashboardSkeleton } from "@/components/ui-elements/skeletons/dashboard-skeleton";



type DashboardItem = {
  examId: string;
  title: string;
  duration: number;
  status: "in_progress" | "submitted";
  submittedAt: string | null;
  score: number | null;
};

type UpcomingExam = {
  id: string;
  title: string;
  date: string;
  time: string;
};

type RecentResult = {
  id: string;
  exam: string;
  date: string;
  score: string;
  status: "Passed" | "Failed";
};

type ExamApi = {
  id: string;
  title: string;
  scheduledOn: string;
  status: "Upcoming" | "Live" | "Closed";
};

export default function CandidateDashboardPage() {
  const [stats, setStats] = useState<StudentStatCard[]>([]);
  const [upcoming, setUpcoming] = useState<UpcomingExam[]>([]);
  const [results, setResults] = useState<RecentResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const dashRes = await getDashboardApi();
        const attempts: DashboardItem[] = dashRes.data;

        const total = attempts.length;

        const scored = attempts.filter((a) => a.score !== null);

        const avg =
          scored.length > 0
            ? Math.round(
                scored.reduce((acc, a) => acc + (a.score || 0), 0) /
                  scored.length,
              )
            : 0;

        const remaining = attempts.filter(
          (a) => a.status === "in_progress",
        ).length;

        setStats([
          {
            title: "Average Score",
            value: `${avg}%`,
            description: "Across all exams",
            icon: <Award className="h-4 w-4 text-muted-foreground" />,
          },
          {
            title: "Exams Remaining",
            value: String(remaining),
            description: "In progress",
            icon: <CalendarCheck className="h-4 w-4 text-muted-foreground" />,
          },
          {
            title: "Total Attempts",
            value: String(total),
            icon: <NotebookPen className="h-4 w-4 text-muted-foreground" />,
          },
        ]);

        const formattedResults: RecentResult[] = attempts
          .filter((a) => a.status === "submitted")
          .slice(0, 5)
          .map((a) => ({
            id: a.examId,
            exam: a.title,
            date: a.submittedAt
              ? new Date(a.submittedAt).toLocaleDateString("en-IN")
              : "-",
            score: `${a.score ?? 0}%`,
            status: (a.score ?? 0) >= 40 ? "Passed" : "Failed",
          }));

        setResults(formattedResults);

        const examRes = await getAllExamsApi();
        const exams: ExamApi[] = examRes.data;

        const upcomingFormatted: UpcomingExam[] = exams
          .filter((e) => e.status === "Upcoming")
          .slice(0, 5)
          .map((e) => ({
            id: e.id,
            title: e.title,
            date: new Date(e.scheduledOn).toLocaleDateString("en-IN"),
            time: new Date(e.scheduledOn).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));

        setUpcoming(upcomingFormatted);
      } catch (err) {
        console.error("Dashboard load failed:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

 if (loading) {
   return <DashboardSkeleton />;
 }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-8">
        <PerformanceOverviewCard stats={stats} />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <UpcomingExamsCard exams={upcoming} />
          <RecentResultsCard results={results} />
        </div>
      </main>
    </div>
  );
}
