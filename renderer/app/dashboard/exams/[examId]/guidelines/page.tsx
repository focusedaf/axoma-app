"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Capture, type CaptureHandle } from "@/components/ui-elements/dash/capture";
import { toast } from "sonner";
import { Camera, Loader2, Upload } from "lucide-react";

const CLOUDINARY_CLOUD_NAME = "dfu2kgodh";
const CLOUDINARY_UPLOAD_PRESET = "preexam_upload";

const instructions = [
  "Ensure proper lighting in the room.",
  "Your face must be clearly visible and uncovered.",
  "Avoid wearing glasses or accessories that cause glare.",
  "Sit directly in front of the camera at eye level.",
  "Ensure stable internet connection before starting.",
  "Do not switch tabs or minimize the browser during the exam.",
  "Keep your camera enabled throughout the examination.",
  "Ensure no other person is present in the room.",
];

export default function GuidelinesPage() {
  const { examId } = useParams();
  const router = useRouter();
  const cameraRef = useRef<CaptureHandle>(null);

  const [approved, setApproved] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCapture = async () => {
    try {
      const imageDataUrl = await cameraRef.current?.capture();
      if (!imageDataUrl) throw new Error();
      setCapturedImage(imageDataUrl);
      toast.success("Image captured successfully");
    } catch {
      toast.error("Failed to capture image");
    }
  };

  const handleUpload = async () => {
    if (!capturedImage) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", capturedImage);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData },
      );

      if (!response.ok) throw new Error();

      toast.success("Verification successful. Redirecting...");

      router.push(`/dashboard/exams/${examId}/attempt`);
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Pre-Exam Guidelines & Verification
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Instructions */}
            <div>
              <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground">
                {instructions.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>

              <div className="mt-6 flex items-center space-x-3">
                <Checkbox
                  id="approve"
                  checked={approved}
                  onCheckedChange={(val) => setApproved(val as boolean)}
                />
                <Label htmlFor="approve" className="text-sm">
                  I have read and agree to follow the above guidelines.
                </Label>
              </div>
            </div>

            {/* Camera Section */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-full max-w-sm relative rounded-lg overflow-hidden border bg-muted">
                {!approved && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center text-center px-6">
                    <p className="text-white text-sm">
                      Please approve the guidelines to enable camera access.
                    </p>
                  </div>
                )}

                <Capture ref={cameraRef} />
              </div>

              <div className="mt-5 w-full max-w-sm space-y-3">
                <Button
                  onClick={handleCapture}
                  disabled={!approved}
                  className="w-full"
                  variant="secondary"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Capture Photo
                </Button>

                {capturedImage && (
                  <Button
                    onClick={handleUpload}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    ) : (
                      <Upload className="mr-2 h-4 w-4" />
                    )}
                    Confirm & Start Exam
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
