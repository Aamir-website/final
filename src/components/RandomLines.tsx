import React from 'react';

interface RandomLinesProps {
  count?: number;
  className?: string;
}

export function RandomLines({ count = 15, className = '' }: RandomLinesProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {Array.from({ length: count }, (_, i) => {
        const isVertical = Math.random() > 0.5;
        const length = Math.random() * 300 + 100;
        const thickness = Math.random() > 0.7 ? 2 : 1;
        const opacity = Math.random() * 0.15 + 0.05;
        
        return (
          <div
            key={i}
            className="absolute bg-black/20"
            style={{
              width: isVertical ? `${thickness}px` : `${length}px`,
              height: isVertical ? `${length}px` : `${thickness}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              opacity,
              animation: `float ${Math.random() * 20 + 10}s infinite linear`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        );
      })}
    </div>
  );
}