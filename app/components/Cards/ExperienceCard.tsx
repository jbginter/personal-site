import type { experienceInterface } from "@/app/constants";

export default function ExperienceCard({ title, company, site, period, description }: experienceInterface) {
  return (
    <div
      className="p-6 border-l-2 pl-8"
      style={{ borderLeftColor: "var(--accent)", background: "var(--card-bg)" }}
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1 mb-3">
        <div>
          <h4 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>{title}</h4>
          <a
            href={site}
            target="_blank"
            className="text-sm transition-opacity hover:opacity-70"
            style={{ color: "var(--accent)" }}
          >
            {company}
          </a>
        </div>
        <span
          className="text-xs uppercase tracking-wider whitespace-nowrap mt-1"
          style={{ color: "var(--muted)", fontFamily: "var(--font-space-mono)" }}
        >
          {period}
        </span>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{description}</p>
    </div>
  );
}
