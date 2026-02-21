import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


interface ExamTabsProps {
  liveCount: number;
  upcomingCount: number;
  liveContent: React.ReactNode;
  upcomingContent: React.ReactNode;
  className?: string;
}

export function ExamTabs({
  liveCount,
  upcomingCount,
  liveContent,
  upcomingContent,
  className,
}: ExamTabsProps) {
  return (
    <Tabs defaultValue="live" className={className ?? "w-full"}>
      <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
        <TabsTrigger value="live">Live ({liveCount})</TabsTrigger>
        <TabsTrigger value="upcoming">Upcoming ({upcomingCount})</TabsTrigger>
      </TabsList>

      <TabsContent value="live">{liveContent}</TabsContent>

      <TabsContent value="upcoming">{upcomingContent}</TabsContent>
    </Tabs>
  );
}
