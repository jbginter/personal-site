"use client";
import { useEffect, useState } from "react";
import { useTheme } from "@/app/context/ThemeContext";

export interface TaskbarWindow {
  id: string;
  title: string;
  icon: string;
  isMinimized: boolean;
}

interface Win98TaskbarProps {
  windows: TaskbarWindow[];
  onWindowClick: (id: string) => void;
  activeWindowId?: string;
}

export default function Win98Taskbar({ windows, onWindowClick, activeWindowId }: Win98TaskbarProps) {
  const { toggleTheme } = useTheme();
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

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

      <div className="win98-clock">{time}</div>
    </div>
  );
}
