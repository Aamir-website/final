import React, { useRef, useEffect } from "react";

interface VideoThumbnailProps {
  src: string;
  title?: string;
  aspectRatio?: "horizontal" | "vertical";
}

export function VideoThumbnail({ src, title, aspectRatio = "horizontal" }: VideoThumbnailProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawFrame = () => {
      if (video.readyState >= 2) {
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
    };

    video.addEventListener("loadeddata", () => {
      video.currentTime = 1; // thumbnail at 1s
    });
    video.addEventListener("seeked", drawFrame);

    return () => {
      video.removeEventListener("loadeddata", drawFrame);
      video.removeEventListener("seeked", drawFrame);
    };
  }, []);

  return (
    <div
      className={`relative overflow-hidden rounded-xl shadow-md ${
        aspectRatio === "vertical" ? "aspect-[9/16]" : "aspect-video"
      }`}
    >
      {/* hidden video (only for thumbnail) */}
      <video ref={videoRef} src={src} className="hidden" />

      {/* thumbnail */}
      <canvas ref={canvasRef} className="w-full h-full object-cover" />

      {/* title (optional) */}
      {title && (
        <div className="absolute bottom-2 left-2 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
          {title}
        </div>
      )}
    </div>
  );
}
