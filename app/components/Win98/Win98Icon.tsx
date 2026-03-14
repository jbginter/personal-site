"use client";
import { useRef } from "react";

interface Win98IconProps {
  icon: string;
  label: string;
  onClick: () => void;
}

export default function Win98Icon({ icon, label, onClick }: Win98IconProps) {
  const lastTap = useRef<number>(0);

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastTap.current < 300) {
      onClick();
    }
    lastTap.current = now;
  };

  return (
    <div
      className="win98-icon"
      onDoubleClick={onClick}
      onTouchEnd={handleTouchEnd}
      title={`Double-tap to open ${label}`}
    >
      <div className="win98-icon-image">{icon}</div>
      <span className="win98-icon-label">{label}</span>
    </div>
  );
}
