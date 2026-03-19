import { ReactNode } from "react";

type WindowId = "about" | "projects" | "experience" | "skills" | "contact";

interface TaskbarWindow {
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

interface Win98IconProps {
  icon: string;
  label: string;
  onClick: () => void;
}

interface WindowState {
  open: boolean;
  minimized: boolean;
  zIndex: number;
}

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

const WINDOW_CONFIG: Record<WindowId, { title: string; icon: string; initialX: number; initialY: number; width: number }> = {
  about:      { title: "About Me",        icon: "🖥️", initialX: 120, initialY: 40,  width: 480 },
  projects:   { title: "My Projects",     icon: "📁", initialX: 160, initialY: 60,  width: 560 },
  experience: { title: "Work Experience", icon: "💼", initialX: 200, initialY: 80,  width: 620 },
  skills:     { title: "Skills",          icon: "⚙️", initialX: 240, initialY: 100, width: 500 },
  contact:    { title: "Contact Info",    icon: "📧", initialX: 280, initialY: 120, width: 420 },
};

const DESKTOP_ICONS: { id: WindowId; icon: string; label: string }[] = [
  { id: "about",      icon: "🖥️", label: "My Portfolio" },
  { id: "projects",   icon: "📁", label: "My Projects"  },
  { id: "experience", icon: "💼", label: "Experience"   },
  { id: "skills",     icon: "⚙️", label: "Skills"       },
  { id: "contact",    icon: "📧", label: "Contact"      },
];

const INITIAL_WINDOWS: Record<WindowId, WindowState> = {
  about:      { open: false, minimized: false, zIndex: 10 },
  projects:   { open: false, minimized: false, zIndex: 10 },
  experience: { open: false, minimized: false, zIndex: 10 },
  skills:     { open: false, minimized: false, zIndex: 10 },
  contact:    { open: false, minimized: false, zIndex: 10 },
};

export type { Win98TaskbarProps, Win98IconProps, WindowId, WindowState, Win98WindowProps };
export { WINDOW_CONFIG, DESKTOP_ICONS, INITIAL_WINDOWS };