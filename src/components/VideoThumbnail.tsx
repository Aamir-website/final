import React, { useRef, useEffect } from "react";

interface VideoThumbnailProps {
  src: string;
  title?: string;
  aspectRatio?: "horizontal" | "vertical";
}

function VideoThumbnail({ src, title, aspectRatio = "horizontal" }: VideoThumbnailProps) {
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

    const onLoaded = () => { video.currentTime = 1; };
    video.addEventListener("loadeddata", onLoaded);
    video.addEventListener("seeked", drawFrame);

    return () => {
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("seeked", drawFrame);
    };
  }, []);

  return (
    <div className={`relative overflow-hidden rounded-xl shadow-md ${aspectRatio === "vertical" ? "aspect-[9/16]" : "aspect-video"}`}>
      <video ref={videoRef} src={src} className="hidden" />
      <canvas ref={canvasRef} className="w-full h-full object-cover" />
      {title && (
        <div className="absolute bottom-2 left-2 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
          {title}
        </div>
      )}
    </div>
  );
}

export default VideoThumbnail;
