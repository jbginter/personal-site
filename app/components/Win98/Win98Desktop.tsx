"use client";
import { useState, useCallback } from "react";
import Win98Window from "./Win98Window";
import Win98Icon from "./Win98Icon";
import Win98Taskbar from "./Win98Taskbar";
import { skillSet, experience, projects } from "@/app/constants";
import { DESKTOP_ICONS, WINDOW_CONFIG, INITIAL_WINDOWS } from "./constants";
import type { WindowId, WindowState } from "./constants";

// ─── Window Content Components ────────────────────────────────────────────────

function AboutContent() {
  return (
    <div style={{ padding: 8 }}>
      <div className="win98-raised" style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 48 }}>👤</span>
        <div>
          <div style={{ fontWeight: "bold", fontSize: 14 }}>Jonathan Ginter</div>
          <div style={{ color: "#000080", fontSize: 12 }}>Fullstack Engineer</div>
        </div>
      </div>
      <div className="win98-field" style={{ marginBottom: 8 }}>
        <p style={{ margin: "0 0 6px" }}>
          I&apos;m a passionate fullstack engineer with over 10+ years of experience building
          robust, scalable web applications. My expertise spans modern frontend frameworks,
          backend systems, databases, and cloud infrastructure.
        </p>
        <p style={{ margin: 0 }}>
          I thrive on solving complex problems and transforming ideas into elegant,
          user-friendly solutions that drive business value.
        </p>
      </div>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {["10+ Years Experience", "Fullstack", "React", "Next.js", "AWS"].map(t => (
          <span key={t} className="win98-tag">{t}</span>
        ))}
      </div>
    </div>
  );
}

function ProjectsContent() {
  return (
    <div>
      {projects.map((p, i) => (
        <div key={i} className="win98-list-item" style={{ flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span>📄</span>
            <span style={{ fontWeight: "bold" }}>{p.title}</span>
          </div>
          <div style={{ paddingLeft: 22 }}>
            <div className="win98-field" style={{ marginBottom: 4, fontSize: 11 }}>
              {p.description}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {p.tags.map(tag => (
                <span key={tag} className="win98-tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ExperienceContent() {
  return (
    <div>
      {experience.map((e, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          <div className="win98-raised" style={{ padding: "4px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span>🏢</span>
              <div>
                <div style={{ fontWeight: "bold" }}>{e.title}</div>
                <a
                  href={e.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#000080", textDecoration: "underline", fontSize: 11 }}
                >
                  {e.company}
                </a>
              </div>
            </div>
            <div className="win98-tag">{e.period}</div>
          </div>
          <div className="win98-field" style={{ fontSize: 11 }}>
            {e.description}
          </div>
        </div>
      ))}
    </div>
  );
}

function SkillsContent() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: 4 }}>
      {skillSet.map((group) => (
        <div key={group.title} className="win98-raised">
          <div style={{ fontWeight: "bold", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
            <span>⚙️</span>
            {group.title}
          </div>
          <div className="win98-field">
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {group.skills.map(skill => (
                <li key={skill} style={{ padding: "2px 0", borderBottom: "1px solid #dfdfdf" }}>
                  ▸ {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

function ContactContent() {
  return (
    <div style={{ padding: 8 }}>
      <div className="win98-raised" style={{ marginBottom: 8 }}>
        <div style={{ fontWeight: "bold", marginBottom: 8 }}>📬 Get in Touch</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { icon: "📨", label: "Email", href: "mailto:jbginter88@gmail.com", text: "jbginter88@gmail.com" },
            { icon: "🐙", label: "GitHub", href: "https://github.com/jbginter", text: "github.com/jbginter" },
            { icon: "💼", label: "LinkedIn", href: "https://www.linkedin.com/in/jonathan-ginter-bb1b007a/", text: "Jonathan Ginter" },
          ].map(({ icon, label, href, text }) => (
            <div key={label} className="win98-field" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span>{icon}</span>
              <span style={{ fontWeight: "bold", minWidth: 60 }}>{label}:</span>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#000080", textDecoration: "underline" }}
              >
                {text}
              </a>
            </div>
          ))}
        </div>
      </div>
      <div className="win98-sunken" style={{ fontSize: 11, fontStyle: "italic" }}>
        Building content for the web since 2013
      </div>
    </div>
  );
}

// ─── Main Desktop ─────────────────────────────────────────────────────────────

export default function Win98Desktop() {
  const [windows, setWindows] = useState<Record<WindowId, WindowState>>(INITIAL_WINDOWS);
  const [topZ, setTopZ] = useState(10);
  const [activeId, setActiveId] = useState<WindowId | null>(null);

  const bringToFront = useCallback((id: WindowId) => {
    const newZ = topZ + 1;
    setTopZ(newZ);
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], zIndex: newZ, minimized: false } }));
    setActiveId(id);
    return newZ;
  }, [topZ]);

  const openWindow = useCallback((id: WindowId) => {
    const newZ = topZ + 1;
    setTopZ(newZ);
    setWindows(prev => ({ ...prev, [id]: { open: true, minimized: false, zIndex: newZ } }));
    setActiveId(id);
  }, [topZ]);

  const closeWindow = useCallback((id: WindowId) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], open: false } }));
    setActiveId(null);
  }, []);

  const minimizeWindow = useCallback((id: WindowId) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], minimized: true } }));
    setActiveId(null);
  }, []);

  const handleTaskbarClick = useCallback((id: string) => {
    const wid = id as WindowId;
    const w = windows[wid];
    if (!w.open) return;
    if (w.minimized || wid !== activeId) {
      bringToFront(wid);
    } else {
      minimizeWindow(wid);
    }
  }, [windows, activeId, bringToFront, minimizeWindow]);

  const taskbarWindows = (Object.entries(windows) as [WindowId, WindowState][])
    .filter(([, w]) => w.open)
    .map(([id, w]) => ({
      id,
      title: WINDOW_CONFIG[id].title,
      icon: WINDOW_CONFIG[id].icon,
      isMinimized: w.minimized,
    }));

  return (
    <div className="win98-desktop">
      {/* Desktop name watermark */}
      <div className="win98-desktop-name">
        <div style={{ fontSize: 22, fontWeight: "bold" }}>Jonathan Ginter</div>
        <div style={{ fontSize: 13, opacity: 0.85 }}>Fullstack Engineer</div>
      </div>

      {/* Desktop Icons */}
      <div className="win98-desktop-icons">
        {DESKTOP_ICONS.map(({ id, icon, label }) => (
          <Win98Icon key={id} icon={icon} label={label} onClick={() => openWindow(id)} />
        ))}
      </div>

      {/* Open Windows */}
      {(Object.entries(windows) as [WindowId, WindowState][]).map(([id, state]) => {
        if (!state.open || state.minimized) return null;
        const cfg = WINDOW_CONFIG[id];
        return (
          <Win98Window
            key={id}
            id={id}
            title={cfg.title}
            icon={cfg.icon}
            initialX={cfg.initialX}
            initialY={cfg.initialY}
            width={cfg.width}
            zIndex={state.zIndex}
            onClose={() => closeWindow(id)}
            onMinimize={() => minimizeWindow(id)}
            onFocus={() => bringToFront(id)}
            activeWindowId={activeId ?? undefined}
          >
            {id === "about"      && <AboutContent />}
            {id === "projects"   && <ProjectsContent />}
            {id === "experience" && <ExperienceContent />}
            {id === "skills"     && <SkillsContent />}
            {id === "contact"    && <ContactContent />}
          </Win98Window>
        );
      })}

      {/* Taskbar */}
      <Win98Taskbar
        windows={taskbarWindows}
        onWindowClick={handleTaskbarClick}
        activeWindowId={activeId ?? undefined}
      />
    </div>
  );
}
