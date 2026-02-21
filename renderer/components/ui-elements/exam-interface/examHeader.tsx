import { Button } from "@/components/ui/button";

interface ExamHeaderProps {
  examTitle: string;
  timeLeft: string;
  onSubmit: () => void;
}

const ExamHeader = ({ examTitle, timeLeft, onSubmit }: ExamHeaderProps) => {
  return (
    <header className="flex items-center justify-between border bg-white shadow-md px-6 py-4 rounded-xl">
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-2xl tracking-tight">{examTitle}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="font-mono text-sm px-4 py-2 rounded-lg bg-black text-white">
          {timeLeft}
        </div>
        <Button
          onClick={onSubmit}
          className="min-w-[110px] bg-red-600 hover:bg-red-700 rounded-lg"
        >
          Submit
        </Button>
      </div>
    </header>
  );
};

export default ExamHeader;
