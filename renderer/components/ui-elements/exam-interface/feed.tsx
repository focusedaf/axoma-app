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
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const startStreaming = async () => {
      try {
        // Get webcam
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Create peer connection
        const peer = new RTCPeerConnection();
        peerRef.current = peer;

        // Add tracks
        stream.getTracks().forEach((track) => {
          peer.addTrack(track, stream);
        });

        // Create offer
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);

        // Send offer to proctor server
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_PROCTOR_SERVER}/webrtc/offer`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              offer,
              examId,
              candidateId,
            }),
          },
        );

        const data = await response.json();

        // Set remote answer
        await peer.setRemoteDescription(new RTCSessionDescription(data.answer));

        toast.success("Proctoring started");
      } catch (error) {
        console.error(error);
        toast.error("Failed to start proctoring");
      }
    };

    startStreaming();

    return () => {
      // Cleanup
      peerRef.current?.close();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [examId, candidateId]);

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
          LIVE
        </Badge>
      </div>
    </Card>
  );
}
