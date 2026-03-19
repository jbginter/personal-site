import type { projectsInterface } from "@/app/constants";

export default function ProjectCard({ title, description, tags }: projectsInterface) {
  return (
    <div
      className="p-6 border transition-colors group"
      style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--accent)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
    >
      <h4 className="text-lg font-bold mb-3" style={{ color: "var(--foreground)" }}>{title}</h4>
      <p className="text-sm mb-5 leading-relaxed" style={{ color: "var(--muted)" }}>{description}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 text-xs uppercase tracking-wider"
            style={{
              fontFamily: "var(--font-space-mono)",
              color: "var(--accent)",
              background: "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.2)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
