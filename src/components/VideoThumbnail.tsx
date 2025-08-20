import React, { useRef, useState } from "react";
import { Maximize2 } from "lucide-react";

interface VideoThumbnailProps {
  src: string;
  title: string;
  aspectRatio?: "video" | "vertical";
  className?: string;
  onClick?: () => void; // Agar future me click se LazyVideo open karna ho
}

export function VideoThumbnail({
  src,
  title,
  aspectRatio = "video",
  className = "",
  onClick,
}: VideoThumbnailProps) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const aspectClasses =
    aspectRatio === "vertical" ? "aspect-[9/16]" : "aspect-video";

  return (
    <div
      ref={containerRef}
      className={`relative group cursor-pointer ${aspectClasses} rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Thumbnail Image */}
      <img
        src={`${src}#t=1`}
        alt={title}
        className="w-full h-full object-cover"
        loading="lazy"
      />

      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-all duration-300">
        <div
          className={`bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm ${
            aspectRatio === "vertical" ? "w-12 h-12" : "w-16 h-16"
          }`}
        >
          <div
            className={`w-0 h-0 border-l-white border-t-transparent border-b-transparent ml-1 
            ${
              aspectRatio === "vertical"
                ? "border-l-[12px] border-t-[8px] border-b-[8px]"
                : "border-l-[20px] border-t-[12px] border-b-[12px]"
            } ${!isHovered ? "animate-bounce-triangle" : ""}`}
          />
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

      {/* Fullscreen button (dummy for now) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          alert("Fullscreen action yaha implement karein!");
        }}
        className={`absolute bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-300 z-10 
          top-4 right-4 w-10 h-10 opacity-0 group-hover:opacity-100`}
      >
        <Maximize2 size={16} className="text-white" />
      </button>

      {/* Title Badge */}
      <div
        className={`absolute bottom-4 left-4 transition-all duration-300 opacity-0 group-hover:opacity-100`}
      >
        <span className="text-white font-bosenAlt bg-black/50 px-3 py-1 rounded-full text-sm">
          {title}
        </span>
      </div>
    </div>
  );
}
