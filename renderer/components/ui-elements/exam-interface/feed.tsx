"use client";

import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface FeedProps {
  examId: string;
  candidateId: string;
}

export default function Feed({ examId, candidateId }: FeedProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);

  const SERVER_URL = process.env.NEXT_PUBLIC_PROCTOR_SERVER;

  useEffect(() => {
    let frameInterval: NodeJS.Timeout;
    let lastAudioSend = 0;

    const startStreaming = async () => {
      try {
      

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        streamRef.current = stream;

      

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

       

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        frameInterval = setInterval(async () => {
          if (!videoRef.current || !ctx) return;

          const v = videoRef.current;

          if (v.videoWidth === 0) return;

          canvas.width = v.videoWidth;
          canvas.height = v.videoHeight;

          ctx.drawImage(v, 0, 0);

          const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, "image/jpeg", 0.6),
          );

          if (!blob) return;

          const formData = new FormData();
          formData.append("file", blob);
          formData.append("examId", examId);
          formData.append("candidateId", candidateId);

          await fetch(`${SERVER_URL}/process-frame`, {
            method: "POST",
            body: formData,
          });
        }, 800);

       

        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;

        await audioContext.audioWorklet.addModule("/audio-processor.js");

        const source = audioContext.createMediaStreamSource(stream);

        const workletNode = new AudioWorkletNode(audioContext, "pcm-processor");
        workletNodeRef.current = workletNode;

        source.connect(workletNode);
        workletNode.connect(audioContext.destination);


        workletNode.port.onmessage = async (event) => {
          const now = Date.now();

          // throttle audio sending
          if (now - lastAudioSend < 250) return;

          lastAudioSend = now;

          const float32Buffer = event.data;

          try {
            await fetch(`${SERVER_URL}/process-audio`, {
              method: "POST",
              headers: {
                "Content-Type": "application/octet-stream",
              },
              body: float32Buffer.buffer,
            });
          } catch (err) {
            console.error("Audio send failed", err);
          }
        };

        toast.success("Proctoring started (Video + Audio)");
      } catch (err) {
        console.error(err);
        toast.error("Camera or microphone failed");
      }
    };

    startStreaming();

    return () => {
      clearInterval(frameInterval);

      workletNodeRef.current?.disconnect();
      audioContextRef.current?.close();

      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [examId, candidateId]);

  return (
    <Card className="relative w-full rounded-xl overflow-hidden bg-black">
      <div className="aspect-video">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover -scale-x-100"
        />

        <Badge className="absolute top-2 left-2 bg-red-600 text-white animate-pulse">
          LIVE
        </Badge>
      </div>
    </Card>
  );
}
