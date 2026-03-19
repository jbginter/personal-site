"use client";
import { useEffect, useState } from "react";
import { useTheme } from "@/app/context/ThemeContext";
import type { Win98TaskbarProps } from "./constants";

export default function Win98Taskbar({ windows, onWindowClick, activeWindowId }: Win98TaskbarProps) {
  const { toggleTheme } = useTheme();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const h = now.getHours() % 12 || 12;
  const m = now.getMinutes().toString().padStart(2, "0");
  const ampm = now.getHours() >= 12 ? "PM" : "AM";
  const time = `${h}${now.getSeconds() % 2 === 0 ? ":" : " "}${m} ${ampm}`;

  return (
    <div className="win98-taskbar">
      <button className="win98-start-btn" onClick={toggleTheme}>
        <span>🖥️</span>
        <strong>Modern View</strong>
      </button>

      <div className="win98-taskbar-divider" />

      {windows.map((w) => (
        <button
          key={w.id}
          className={`win98-taskbar-btn ${w.id === activeWindowId && !w.isMinimized ? "" : "inactive"}`}
          onClick={() => onWindowClick(w.id)}
        >
          <span>{w.icon}</span>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{w.title}</span>
        </button>
      ))}

      <div className="win98-clock">
        {time}
      </div>
    </div>
  );
}
