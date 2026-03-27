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
import { Camera, Loader2, Upload } from "lucide-react";

export default function GuidelinesPage() {
  const { examId } = useParams();
  const router = useRouter();
  const cameraRef = useRef<CaptureHandle>(null);

  const [approved, setApproved] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCapture = async () => {
    const img = await cameraRef.current?.capture();
    if (!img) return toast.error("Capture failed");
    setCapturedImage(img);
    toast.success("Captured successfully");
  };

  const handleContinue = () => {
    if (!capturedImage) return;

    sessionStorage.setItem(`guidelines-${examId}`, "true");
    router.push(`/dashboard/exams/${examId}/system-check`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-6">
      <Card className="w-full max-w-5xl shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Pre-Exam Guidelines
          </CardTitle>
        </CardHeader>

        <CardContent className="grid md:grid-cols-2 gap-10">
          {/* LEFT */}
          <div className="space-y-4 text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li>• Proper lighting required</li>
              <li>• Face clearly visible</li>
              <li>• No tab switching</li>
              <li>• Camera ON at all times</li>
              <li>• No other person allowed</li>
            </ul>

            <div className="flex items-center gap-2 pt-4">
              <Checkbox
                id="agree"
                checked={approved}
                onCheckedChange={(v) => setApproved(v as boolean)}
              />
              <Label htmlFor="agree">I agree to follow the guidelines</Label>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-sm border rounded-xl overflow-hidden">
              <Capture ref={cameraRef} />
            </div>

            <div className="w-full max-w-sm space-y-3 mt-5">
              <Button
                onClick={handleCapture}
                disabled={!approved}
                variant="secondary"
                className="w-full"
              >
                <Camera className="mr-2 h-4 w-4" />
                Capture Photo
              </Button>

              {capturedImage && (
                <Button
                  onClick={handleContinue}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  Continue to System Check
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
