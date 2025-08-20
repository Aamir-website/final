import React, { useRef, useEffect, useState } from "react";
import { Maximize2, X } from "lucide-react";

interface VideoThumbnailProps {
  src: string;
  title: string;
  className?: string;
}

export function VideoThumbnail({ src, title, className = "" }: VideoThumbnailProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Generate thumbnail from video @ 1s
  useEffect(() => {
    const video = document.createElement("video");
    video.src = src;
    video.currentTime = 1; // jump to 1s
    video.preload = "metadata";

    video.addEventListener("loadeddata", () => {
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setThumbnail(canvas.toDataURL("image/jpeg"));
      }
    });
  }, [src]);

  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      videoRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div
      className={`relative group cursor-pointer rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
        isFullscreen
          ? "fixed inset-0 z-[9999] !rounded-none w-screen h-screen"
          : "hover:shadow-xl hover:scale-105"
      } ${className}`}
      onClick={handlePlay}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={src}
        playsInline
        loop
        className={`w-full h-full transition-opacity duration-300 ${
          isFullscreen ? "object-contain" : "object-cover"
        }`}
        poster={thumbnail || ""} // <-- thumbnail here
      />

      {/* Play button overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm w-16 h-16">
            <div className="w-0 h-0 border-l-[20px] border-t-[12px] border-b-[12px] border-l-white border-t-transparent border-b-transparent ml-1"></div>
          </div>
        </div>
      )}

      {/* Hover dark overlay */}
      {!isFullscreen && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
      )}

      {/* Fullscreen toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFullscreen();
        }}
        className={`absolute bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
          isFullscreen
            ? "top-8 right-8 w-12 h-12 opacity-100"
            : "top-4 right-4 w-10 h-10 opacity-0 group-hover:opacity-100"
        }`}
      >
        {isFullscreen ? (
          <X size={20} className="text-white" />
        ) : (
          <Maximize2 size={16} className="text-white" />
        )}
      </button>

      {/* Title */}
      <div
        className={`absolute transition-all duration-300 ${
          isFullscreen
            ? "bottom-8 left-8 opacity-100"
            : "bottom-4 left-4 opacity-0 group-hover:opacity-100"
        }`}
      >
        <span
          className={`text-white font-bosenAlt bg-black/50 px-3 py-1 rounded-full ${
            isFullscreen ? "text-lg" : "text-sm"
          }`}
        >
          {title}
        </span>
      </div>
    </div>
  );
}

export default VideoThumbnail;