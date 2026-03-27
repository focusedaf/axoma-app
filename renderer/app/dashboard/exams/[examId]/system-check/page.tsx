"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { lockAttemptApi } from "@/lib/api";

export default function SystemCheckPage() {
  const { examId } = useParams();
  const router = useRouter();

  const [checks, setChecks] = useState<any[]>([]);
  const [phase, setPhase] = useState<"entering" | "checking" | "done">(
    "entering",
  );
useEffect(() => {
  async function waitForAxoma() {
    return new Promise<boolean>((resolve) => {
      if (window.axoma) return resolve(true);

      let timeout = setTimeout(() => resolve(false), 3000);

      window.addEventListener("message", (event) => {
        if (event.data?.type === "AXOMA_READY") {
          clearTimeout(timeout);
          resolve(true);
        }
      });
    });
  }

  async function run() {
    try {
      const ready = await waitForAxoma();

      if (!ready) {
        console.error("AXOMA NOT READY");
        setChecks([{ label: "Kiosk Mode Active", status: false }]);
        setPhase("done");
        return;
      }

      // 🔥 ENTER KIOSK (NOW IT WILL ACTUALLY WORK)
      await window.axoma.enterExamMode();

      setPhase("checking");

      const [display, vm, proc, fp] = await Promise.all([
        window.axoma.checkDisplays(),
        window.axoma.checkVM(),
        window.axoma.scanProcesses(),
        window.axoma.getDeviceFingerprint(),
      ]);

      if (fp && display === 1 && !vm && proc.length === 0) {
        await lockAttemptApi({
          examId: String(examId),
          fingerprint: fp,
        });
      }

      setChecks([
        { label: "Kiosk Mode Active", status: true },
        { label: "Single Monitor", status: display === 1 },
        { label: "No Virtual Machine", status: !vm },
        { label: "No Suspicious Software", status: proc.length === 0 },
        { label: "Device Registered", status: !!fp },
      ]);

      setPhase("done");
    } catch (err) {
      console.error(err);

      setChecks([{ label: "System Check Failed", status: false }]);
      setPhase("done");
    }
  }

  run();
}, [examId]);

  const allPassed =
    phase === "done" && checks.length > 0 && checks.every((c) => c.status);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-6">
      <Card className="w-full max-w-xl rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle>System Verification</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* PHASE UI */}
          {phase === "entering" && (
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="animate-spin w-4 h-4" />
              Entering secure exam mode...
            </div>
          )}

          {phase === "checking" && (
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="animate-spin w-4 h-4" />
              Running system checks...
            </div>
          )}

          {/* CHECKLIST */}
          {phase === "done" &&
            checks.map((c) => (
              <div
                key={c.label}
                className="flex justify-between items-center border p-3 rounded-lg"
              >
                <span>{c.label}</span>
                {c.status ? (
                  <CheckCircle className="text-green-500" />
                ) : (
                  <AlertCircle className="text-red-500" />
                )}
              </div>
            ))}

          {/* BUTTON */}
          <Button
            disabled={!allPassed}
            className="w-full mt-4"
            onClick={() => {
              sessionStorage.setItem(`verified-${examId}`, "true");
              router.push(`/dashboard/exams/${examId}/attempt`);
            }}
          >
            Start Exam
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
