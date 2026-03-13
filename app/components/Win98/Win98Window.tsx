"use client";
import { useState, useRef, useEffect, ReactNode } from "react";

interface Win98WindowProps {
  title: string;
  icon?: string;
  onClose: () => void;
  onMinimize: () => void;
  children: ReactNode;
  initialX?: number;
  initialY?: number;
  width?: number;
  zIndex?: number;
  onFocus?: () => void;
}

export default function Win98Window({
  title,
  icon = "💾",
  onClose,
  onMinimize,
  children,
  initialX = 100,
  initialY = 80,
  width = 520,
  zIndex = 10,
  onFocus,
}: Win98WindowProps) {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleTitleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    onFocus?.();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      setPos({
        x: Math.max(0, e.clientX - dragOffset.current.x),
        y: Math.max(0, e.clientY - dragOffset.current.y),
      });
    };
    const handleMouseUp = () => setDragging(false);

    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  return (
    <div
      style={{ left: pos.x, top: pos.y, width, zIndex, position: "fixed" }}
      className="win98-window"
      onMouseDown={() => onFocus?.()}
    >
      {/* Title Bar */}
      <div className="win98-titlebar" onMouseDown={handleTitleMouseDown}>
        <div className="win98-titlebar-text">
          <span>{icon}</span>
          <span>{title}</span>
        </div>
        <div className="win98-titlebar-buttons">
          <button
            className="win98-btn win98-btn-sm"
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            title="Minimize"
          >
            _
          </button>
          <button className="win98-btn win98-btn-sm" title="Maximize">□</button>
          <button
            className="win98-btn win98-btn-sm"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Fake Menu Bar */}
      <div className="win98-menubar">
        <span className="win98-menu-item">File</span>
        <span className="win98-menu-item">Edit</span>
        <span className="win98-menu-item">View</span>
        <span className="win98-menu-item">Help</span>
      </div>

      {/* Content */}
      <div className="win98-window-content">{children}</div>

      {/* Status Bar */}
      <div className="win98-statusbar">
        <div className="win98-statusbar-pane">{title}</div>
        <div className="win98-statusbar-pane" style={{ maxWidth: 80 }}>Ready</div>
      </div>
    </div>
  );
}
