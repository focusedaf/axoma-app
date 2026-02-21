import { ReactNode } from "react";
import {
  Activity,
  Book,
  FileCheck2,
  Users,
  Award,
  CalendarCheck,
  NotebookPen,
} from "lucide-react";

export type StatCard = {
  title: string;
  value: string;
  icon: ReactNode;
};

export type Exam = {
  id: string;
  title: string;
  class: string;
  status: "Published" | "Draft" | "Graded";
  submissions: number;
  dueDate: string;
};

export type ActivityItem = {
  id: string;
  description: string;
  time: string;
};

export type AnnouncementItem = {
  id: string;
  title: string;
  content: string;
  time: string;
};

export const statCards: StatCard[] = [
  {
    title: "Active Exams",
    value: "12",
    icon: <Activity className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: "Submissions to Review",
    value: "5",
    icon: <FileCheck2 className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: "Total Students",
    value: "148",
    icon: <Users className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: "Your Subjects",
    value: "4",
    icon: <Book className="h-4 w-4 text-muted-foreground" />,
  },
];

export const activeExams: Exam[] = [
  {
    id: "exm_001",
    title: "Mid-Term: Quantum Physics",
    class: "FYMSc. Physics",
    status: "Published",
    submissions: 15,
    dueDate: "20 Sept 2025",
  },
  {
    id: "exm_002",
    title: "Unit Test 2: Data Structures",
    class: "SYBSc. CS",
    status: "Published",
    submissions: 5,
    dueDate: "01 Oct 2025",
  },
  {
    id: "exm_003",
    title: "JS",
    class: "TYBSc. CS",
    status: "Published",
    submissions: 30,
    dueDate: "12 Oct 2025",
  },
  {
    id: "exm_004",
    title: "CN",
    class: "TE",
    status: "Published",
    submissions: 20,
    dueDate: "20 Oct 2025",
  },
  {
    id: "exm_005",
    title: "IP",
    class: "TE",
    status: "Published",
    submissions: 10,
    dueDate: "21 Oct 2025",
  },
];

export const draftExams: Exam[] = [
  {
    id: "exm_d_001",
    title: "Final Exam: Classical Mechanics",
    class: "FYMSc. Physics",
    status: "Draft",
    submissions: 0,
    dueDate: "15 Dec 2025",
  },
  {
    id: "exm_d_002",
    title: "Quiz 3: Algorithms",
    class: "SYBSc CS",
    status: "Draft",
    submissions: 0,
    dueDate: "05 Nov 2025",
  },
  {
    id: "exm_d_003",
    title: "Quiz 4: BDA",
    class: "BE CE",
    status: "Draft",
    submissions: 0,
    dueDate: "05 Nov 2025",
  },
  {
    id: "exm_d_004",
    title: "SE",
    class: "TYBSc. CS",
    status: "Draft",
    submissions: 0,
    dueDate: "06 Nov 2025",
  },
  {
    id: "exm_d_005",
    title: "CS",
    class: "SYBSc. CS",
    status: "Draft",
    submissions: 0,
    dueDate: "08 Nov 2025",
  },
];

export const gradedExams: Exam[] = [
  {
    id: "exm_g_001",
    title: "Unit Test 1: Linear Algebra",
    class: "FYBSc. CS",
    status: "Graded",
    submissions: 48,
    dueDate: "10 Oct 2025",
  },
  {
    id: "exm_g_002",
    title: "Mid-Term: Electrodynamics",
    class: "SYMSc. Physics",
    status: "Graded",
    submissions: 22,
    dueDate: "01 Oct 2025",
  },
  {
    id: "exm_g_003",
    title: "Unit Test: Python Basics",
    class: "FYBSc. CS",
    status: "Graded",
    submissions: 50,
    dueDate: "28 Sep 2025",
  },
  {
    id: "exm_g_004",
    title: "Unit Test: SE",
    class: "FYBSc. CS",
    status: "Graded",
    submissions: 50,
    dueDate: "29 Sep 2025",
  },
  {
    id: "exm_g_005",
    title: "MP",
    class: "TE CE",
    status: "Graded",
    submissions: 50,
    dueDate: "30 Sep 2025",
  },
];

export const recentActivity: ActivityItem[] = [
  {
    id: "act_001",
    description: "New submission for 'Unit Test 2: Data Structures'",
    time: "2 hours ago",
  },
  {
    id: "act_002",
    description: "'Mid-Term: Quantum Physics' was published",
    time: "1 day ago",
  },
  {
    id: "act_003",
    description: "'Intro to Mechanics' exam was created",
    time: "3 days ago",
  },
  {
    id: "act_004",
    description: "Physics Exam has been graded",
    time: "1 week ago",
  },
];

export type StudentStatCard = {
  title: string;
  value: string;
  description?: string;
  icon: ReactNode;
};

export type UpcomingExam = {
  id: string;
  title: string;
  date: string;
  time: string;
};

export type RecentResult = {
  id: string;
  exam: string;
  date: string;
  score: string;
  status: "Passed" | "Failed";
};

export const studentStats: StudentStatCard[] = [
  {
    title: "Overall Grade Average",
    value: "87%",
    description: "+4.56% from last term",
    icon: <Award className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: "Exams Remaining",
    value: "3",
    description: "This semester",
    icon: <CalendarCheck className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: "Last Exam Taken",
    value: "Mathematics",
    description: "2 days ago",
    icon: <NotebookPen className="h-4 w-4 text-muted-foreground" />,
  },
];

export const upcomingExams: UpcomingExam[] = [
  {
    id: "upc_math",
    title: "Mathematics",
    date: "Sept 15, 2025",
    time: "10:00 am",
  },
  {
    id: "upc_phys",
    title: "Physics",
    date: "Sept 17, 2025",
    time: "2:00 pm",
  },
  {
    id: "upc_chem",
    title: "Chemistry",
    date: "Sept 20, 2025",
    time: "12:00 pm",
  },
  {
    id: "upc_bio",
    title: "Biology",
    date: "Sept 22, 2025",
    time: "9:00 am",
  },
];

export const recentResults: RecentResult[] = [
  {
    id: "res_math",
    exam: "Mathematics",
    date: "Sept 15, 2025",
    score: "85/100",
    status: "Passed",
  },
  {
    id: "res_phys",
    exam: "Physics",
    date: "Sept 17, 2025",
    score: "75/100",
    status: "Passed",
  },
  {
    id: "res_chem",
    exam: "Chemistry",
    date: "Sept 20, 2025",
    score: "55/100",
    status: "Passed",
  },
];
