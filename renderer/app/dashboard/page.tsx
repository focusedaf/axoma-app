"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eye, History, NotebookPen } from "lucide-react";
import { studentStats, upcomingExams, recentResults } from "@/lib/data";
import { PerformanceOverviewCard } from "@/components/ui-elements/dash/percentOverviewCard";
import { UpcomingExamsCard } from "@/components/ui-elements/dash/upcomingExamsCard";
import { RecentResultsCard } from "@/components/ui-elements/dash/recentResultsCard";

export default function StudentDashboardPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <PerformanceOverviewCard stats={studentStats} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
          <UpcomingExamsCard exams={upcomingExams} />
          <RecentResultsCard results={recentResults} />
        </div>
      </main>
    </div>
  );
}
