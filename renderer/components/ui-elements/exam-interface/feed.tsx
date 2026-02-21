"use client";

import  { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";


const AI_MESSAGES = [
  "Frame analyzed successfully",
  "No anomalies detected",
  "Student appears attentive",
  "Lighting conditions optimal",
  "Minor motion detected",
];

const AI_ERRORS = [
  "Proctoring failed: unclear frame",
  "Face not detected",
  "Multiple faces detected",
  "Frame too dark to analyze",
];


async function analyzeFrame(formData: FormData) {
  await new Promise((resolve) =>
    setTimeout(resolve, 500 + Math.random() * 1500),
  );

  const success = Math.random() > 0.1; 

  if (success) {
    const message = AI_MESSAGES[Math.floor(Math.random() * AI_MESSAGES.length)];
    const confidence = (80 + Math.random() * 20).toFixed(1);
    return { status: "ok", message, confidence };
  } else {
    const errorMsg = AI_ERRORS[Math.floor(Math.random() * AI_ERRORS.length)];
    throw new Error(errorMsg);
  }
}

export default function Feed() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let stream: MediaStream;

    const setupWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        toast.error("Unable to access webcam");
        console.error("Webcam error:", err);
      }
    };

    setupWebcam();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!videoRef.current) return;

      const video = videoRef.current;

      if (video.readyState !== 4) return;

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const formData = new FormData();
        formData.append("frame", blob, "frame.jpg");

        try {
          const result = await analyzeFrame(formData);

          toast.success(
            `${result.message} (Confidence: ${result.confidence}%)`,
          );
        } catch (error: any) {
          console.error("Frame analysis failed:", error);
          toast.error(error.message);
        }
      }, "image/jpeg");
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="relative w-full rounded-xl overflow-hidden border shadow-md bg-black">
      <div className="aspect-video relative">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover -scale-x-100"
        />
        <Badge className="absolute top-3 left-3 bg-red-600 text-white animate-pulse shadow-md">
          REC
        </Badge>
      </div>
    </Card>
  );
}
