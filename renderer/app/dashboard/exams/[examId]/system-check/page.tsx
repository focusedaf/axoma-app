"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function SystemCheckPage() {
  const { examId } = useParams();
  const router = useRouter();

  const [checks, setChecks] = useState([
    { label: "Single Monitor", status: false },
    { label: "No Virtual Machine", status: false },
    { label: "No Suspicious Software", status: false },
  ]);

  useEffect(() => {
    async function runChecks() {
      if (!window.axoma) return;

      const displayCount = await window.axoma.checkDisplays();
      const isVM = await window.axoma.checkVM();
      const suspicious = await window.axoma.scanProcesses();
      const fingerprint = await window.axoma.getDeviceFingerprint();

      if (fingerprint) {
        await fetch("/api/lock-attempt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            examId,
            fingerprint,
          }),
        });
      }

      setChecks([
        { label: "Single Monitor", status: displayCount === 1 },
        { label: "No Virtual Machine", status: !isVM },
        { label: "No Suspicious Software", status: suspicious.length === 0 },
        { label: "Device Registered", status: !!fingerprint },
      ]);
    }

    runChecks();
  }, []);
  
  const allPassed = checks.every((c) => c.status);

  return (
    <div className="max-w-3xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>System Check</CardTitle>
          <CardDescription>
            Ensure your system meets the requirements before starting.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {checks.map((check) => (
            <div
              key={check.label}
              className="flex items-center justify-between border p-3 rounded-md"
            >
              <span>{check.label}</span>
              {check.status ? (
                <CheckCircle className="text-green-600" />
              ) : (
                <AlertCircle className="text-red-600" />
              )}
            </div>
          ))}

          <Button
            className="w-full mt-4"
            disabled={!allPassed}
            onClick={() => router.push(`/dashboard/exams/${examId}/guidelines`)}
          >
            Continue to Guidelines
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
