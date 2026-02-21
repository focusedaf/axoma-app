"use client";
import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Camera, AlertTriangle } from "lucide-react";

export type CaptureHandle = {
  capture: () => Promise<string | null>;
};

export const Capture = forwardRef<CaptureHandle>((props, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    capture: async () => {
      if (videoRef.current) {
        const canvas = document.createElement("canvas");
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          return canvas.toDataURL("image/jpeg", 0.9);
        }
      }
      return null;
    },
  }));

  useEffect(() => {
    async function getCameraStream() {
      setIsLoading(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Error accessing camera:", err);
        if (err instanceof DOMException) {
          if (
            err.name === "NotAllowedError" ||
            err.name === "PermissionDeniedError"
          ) {
            setError(
              "Camera permission denied. Please allow camera access in your browser settings."
            );
          } else {
            setError(
              "Could not access camera. Please ensure it is not in use by another application."
            );
          }
        } else {
          setError("An unknown error occurred while accessing the camera.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    getCameraStream();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCanPlay = () => setIsLoading(false);

  return (
    <div className="w-full h-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading || error ? "opacity-0" : "opacity-100"
        }`}
        onCanPlay={handleCanPlay}
      />
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground animate-pulse">
          <Camera className="w-16 h-16" />
          <p className="mt-2">Starting camera...</p>
        </div>
      )}
      {!isLoading && error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 text-destructive">
          <AlertTriangle className="w-16 h-16 mb-4" />
          <p className="font-semibold">Camera Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
});

Capture.displayName = "Capture";
