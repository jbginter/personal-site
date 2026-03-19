import type { skillsetInterface } from "@/app/constants";

export default function SkillCard({ title, skills }: skillsetInterface) {
  return (
    <div className="p-4 border" style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
      <h4
        className="text-xs font-bold uppercase tracking-widest mb-3"
        style={{ color: "var(--accent)", fontFamily: "var(--font-space-mono)" }}
      >
        {title}
      </h4>
      <ul className="space-y-1.5">
        {skills.map((skill) => (
          <li key={skill} className="text-sm flex items-center gap-2" style={{ color: "var(--foreground)" }}>
            <span style={{ color: "var(--accent)" }}>·</span>
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
}
