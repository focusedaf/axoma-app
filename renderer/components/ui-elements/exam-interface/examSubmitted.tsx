import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const ExamSubmitted = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-6">
      <Card className="w-full max-w-md p-8 text-center border shadow-sm bg-white">
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">
          Exam Submitted
        </h1>
        <p className="text-gray-600 mb-6">
          Your responses have been securely recorded.
        </p>
        <Button
          onClick={() => router.push("/dashboard/student/exams")}
          className="w-full bg-gray-900 hover:bg-black"
        >
          Go to Dashboard
        </Button>
      </Card>
    </div>
  );
};

export default ExamSubmitted;
