"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import {
  Capture,
  type CaptureHandle,
} from "@/components/ui-elements/dash/capture";

import { toast } from "sonner";
import { Camera } from "lucide-react";

export default function GuidelinesPage() {
  const { examId } = useParams();
  const router = useRouter();

  const cameraRef = useRef<CaptureHandle>(null);

  const [approved, setApproved] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [loading, setLoading] = useState(false);

  

  const handleCapture = async () => {
    const img = await cameraRef.current?.capture();

    if (!img) {
      toast.error("Capture failed");
      return;
    }

    setCaptured(true);
    toast.success("Face captured successfully");
  };

  

  const handleContinue = async () => {
    setLoading(true);
    router.push(`/dashboard/exams/${examId}/system-check`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-6">
      <Card className="w-full max-w-5xl rounded-2xl shadow-xl">
        <CardHeader>
          <CardTitle>Pre-Exam Guidelines</CardTitle>
        </CardHeader>

        <CardContent className="grid md:grid-cols-2 gap-10">
          {/* LEFT */}
          <div className="space-y-3 text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li>• Proper lighting required</li>
              <li>• Face must be visible</li>
              <li>• No tab switching</li>
              <li>• No external devices</li>
              <li>• Camera must stay ON</li>
            </ul>

            <div className="flex items-center gap-2 pt-4">
              <Checkbox
                checked={approved}
                onCheckedChange={(v) => setApproved(v as boolean)}
              />
              <Label>I agree to follow these guidelines</Label>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-sm border rounded-xl overflow-hidden">
              <Capture ref={cameraRef} />
            </div>

            <div className="w-full max-w-sm mt-5 space-y-3">
              <Button
                onClick={handleCapture}
                disabled={!approved}
                variant="secondary"
                className="w-full"
              >
                <Camera className="mr-2 h-4 w-4" />
                Capture Photo
              </Button>

              <Button
                onClick={handleContinue}
                disabled={!captured || loading}
                className="w-full"
              >
                Continue
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
