"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { lockAttemptApi } from "@/lib/api";

type Check = {
  label: string;
  status: boolean;
};

export default function SystemCheckPage() {
  const { examId } = useParams();
  const router = useRouter();

  const [checks, setChecks] = useState<Check[]>([]);
  const [loading, setLoading] = useState(true);

  /* WAIT FOR ELECTRON BRIDGE */

  async function waitForBridge() {
    let tries = 0;

    while (!window.axoma && tries < 30) {
      await new Promise((r) => setTimeout(r, 100));
      tries++;
    }

    return window.axoma;
  }

  useEffect(() => {
    async function runChecks() {
      try {
        const axoma = await waitForBridge();

        if (!axoma) {
          console.error("Electron bridge not found");
          throw new Error("Bridge missing");
        }

        const [display, vm, processes, fingerprint] = await Promise.all([
          axoma.checkDisplays(),
          axoma.checkVM(),
          axoma.scanProcesses(),
          axoma.getDeviceFingerprint(),
        ]);

        /* CAMERA + MIC */

        let cameraOk = false;
        let micOk = false;

        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

          cameraOk = stream.getVideoTracks().length > 0;
          micOk = stream.getAudioTracks().length > 0;

          stream.getTracks().forEach((t) => t.stop());
        } catch {}

        const results: Check[] = [
          { label: "Single Monitor", status: display === 1 },
          { label: "No Virtual Machine", status: !vm },
          { label: "No Suspicious Processes", status: processes.length === 0 },
          { label: "Device Fingerprint", status: !!fingerprint },
          { label: "Camera Access", status: cameraOk },
          { label: "Microphone Access", status: micOk },
        ];

        setChecks(results);

        const allPassed = results.every((c) => c.status);

        if (allPassed && fingerprint) {
          await lockAttemptApi({
            examId: String(examId),
            fingerprint,
          });
        }
      } catch (err) {
        console.error("System check failed", err);

        setChecks([
          { label: "Single Monitor", status: false },
          { label: "No Virtual Machine", status: false },
          { label: "No Suspicious Processes", status: false },
          { label: "Device Fingerprint", status: false },
          { label: "Camera Access", status: false },
          { label: "Microphone Access", status: false },
        ]);
      } finally {
        setLoading(false);
      }
    }

    runChecks();
  }, [examId]);

  const allPassed = checks.length > 0 && checks.every((c) => c.status);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-6">
      <Card className="w-full max-w-xl rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle>System Verification</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {loading && (
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="animate-spin w-4 h-4" />
              Running checks...
            </div>
          )}

          {!loading &&
            checks.map((c) => (
              <div
                key={c.label}
                className="flex justify-between items-center border rounded-xl px-4 py-3"
              >
                <span className="text-sm">{c.label}</span>

                {c.status ? (
                  <CheckCircle className="text-green-500 w-5 h-5" />
                ) : (
                  <AlertCircle className="text-red-500 w-5 h-5" />
                )}
              </div>
            ))}

          <Button
            disabled={!allPassed}
            className="w-full mt-4"
            onClick={() => router.push(`/dashboard/exams/${examId}/attempt`)}
          >
            Start Exam
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
