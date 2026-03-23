"use client";
import { useState, useRef, useEffect } from "react";
import type { Win98WindowProps } from "./constants";

const TASKBAR_HEIGHT = 30;

export default function Win98Window({
  id,
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
  activeWindowId,
}: Win98WindowProps) {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const [dragging, setDragging] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const titleBarRef = useRef<HTMLDivElement>(null);
  const preMaxPos = useRef({ x: initialX, y: initialY });
  const maximizedRef = useRef(false);

  const handleMaximizeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (maximized) {
      setPos(preMaxPos.current);
      setMaximized(false);
      maximizedRef.current = false;
    } else {
      preMaxPos.current = { ...pos };
      setPos({ x: 0, y: 0 });
      setMaximized(true);
      maximizedRef.current = true;
    }
  };

  // ── Mouse drag ────────────────────────────────────────────────────────────

  const handleTitleMouseDown = (e: React.MouseEvent) => {
    if (maximized) return;
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

  // ── Touch drag ────────────────────────────────────────────────────────────
  // Must be added manually with passive:false so we can call preventDefault
  // and prevent the page from scrolling while dragging a window.

  useEffect(() => {
    const el = titleBarRef.current;
    if (!el) return;

    const posRef = { x: initialX, y: initialY };

    const onTouchStartStable = (e: TouchEvent) => {
      if (maximizedRef.current) return;
      const touch = e.touches[0];
      dragOffset.current = { x: touch.clientX - posRef.x, y: touch.clientY - posRef.y };
      onFocus?.();
    };

    const onTouchMove = (e: TouchEvent) => {
      if (maximizedRef.current) return;
      e.preventDefault();
      const touch = e.touches[0];
      const next = {
        x: Math.max(0, touch.clientX - dragOffset.current.x),
        y: Math.max(0, touch.clientY - dragOffset.current.y),
      };
      posRef.x = next.x;
      posRef.y = next.y;
      setPos(next);
    };

    el.addEventListener("touchstart", onTouchStartStable, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      el.removeEventListener("touchstart", onTouchStartStable);
      el.removeEventListener("touchmove", onTouchMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const windowStyle = maximized
    ? { left: 0, top: 0, width: "100vw", height: `calc(100vh - ${TASKBAR_HEIGHT}px)`, zIndex, position: "fixed" as const }
    : { left: pos.x, top: pos.y, width, zIndex, position: "fixed" as const };

  return (
    <div
      style={windowStyle}
      className="win98-window"
      onMouseDown={() => onFocus?.()}
      onTouchStart={() => onFocus?.()}
    >
      {/* Title Bar */}
      <div
        ref={titleBarRef}
        className={`win98-titlebar ${activeWindowId === id ? "active" : ""}`}
        onMouseDown={handleTitleMouseDown}
      >
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
          <button
            className="win98-btn win98-btn-sm"
            onClick={handleMaximizeClick}
            title={maximized ? "Restore" : "Maximize"}
          >
            {maximized ? "❐" : "□"}
          </button>
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
