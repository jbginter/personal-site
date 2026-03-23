"use client";
import ProjectCard from "./components/Cards/ProjectCard";
import ExperienceCard from "./components/Cards/ExperienceCard";
import SkillCard from "./components/Cards/SkillCard";
import { skillSet, experience, projects } from "./constants";
import { Navigation } from "./components/Navigation/Navigation";
import Win98Desktop from "./components/Win98/Win98Desktop";
import { useTheme } from "./context/ThemeContext";

const SectionNumber = ({ n }: { n: string }) => (
  <span
    className="text-5xl font-bold leading-none"
    style={{ color: "var(--accent)", fontFamily: "var(--font-space-mono)" }}
  >
    {n}
  </span>
);

export default function Home() {
  const { theme } = useTheme();

  if (theme === "win98") {
    return <Win98Desktop />;
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <Navigation />

      {/* Hero */}
      <section className="pt-40 pb-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <p
            className="text-xs tracking-[0.25em] uppercase mb-8"
            style={{ color: "var(--accent)", fontFamily: "var(--font-space-mono)" }}
          >
            Available for new projects
          </p>
          <h1 className="text-7xl md:text-[10rem] font-bold leading-none uppercase tracking-tight mb-12">
            <span className="block">Fullstack</span>
            <span className="block" style={{ color: "var(--accent)" }}>Engineer</span>
          </h1>
          <div className="flex flex-col md:flex-row gap-8 md:items-end justify-between border-t pt-10" style={{ borderColor: "var(--border)" }}>
            <p className="text-lg max-w-md leading-relaxed" style={{ color: "var(--muted)" }}>
              10+ years building scalable web applications, APIs, and cloud infrastructure.
            </p>
            <div className="flex gap-3">
              <a
                href="#projects"
                className="px-6 py-3 text-sm font-bold uppercase tracking-widest transition-opacity hover:opacity-80"
                style={{ background: "var(--accent)", color: "#111111", fontFamily: "var(--font-space-mono)" }}
              >
                View Work
              </a>
              <a
                href="#contact"
                className="px-6 py-3 text-sm font-bold uppercase tracking-widest border transition-colors border-zinc-800 text-zinc-100 hover:border-amber-500 hover:text-amber-400"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About / Skills */}
      <section id="about" className="py-24 px-6 md:px-12 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-5 items-baseline mb-16">
            <SectionNumber n="01" />
            <h2 className="text-3xl font-bold uppercase tracking-tight">About</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="space-y-5">
              <p className="text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
                I&apos;m a fullstack engineer with 10+ years of experience building robust, scalable
                web applications. My expertise spans modern frontend frameworks, backend systems,
                databases, and cloud infrastructure.
              </p>
              <p className="text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
                I thrive on solving complex problems and transforming ideas into elegant,
                user-friendly solutions that drive real business value.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {skillSet.map((value, index) => (
                <SkillCard key={`${value.title}-${index}`} {...value} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="py-24 px-6 md:px-12 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-5 items-baseline mb-16">
            <SectionNumber n="02" />
            <h2 className="text-3xl font-bold uppercase tracking-tight">Experience</h2>
          </div>
          <div className="space-y-4">
            {experience.map((value, index) => (
              <ExperienceCard key={`${value.title}-${index}`} {...value} />
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-24 px-6 md:px-12 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-5 items-baseline mb-16">
            <SectionNumber n="03" />
            <h2 className="text-3xl font-bold uppercase tracking-tight">Projects</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((value, index) => (
              <ProjectCard key={`${value.title}-${index}`} {...value} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-6 md:px-12 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-5 items-baseline mb-16">
            <SectionNumber n="04" />
            <h2 className="text-3xl font-bold uppercase tracking-tight">Contact</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-16">
            <p className="text-xl leading-relaxed" style={{ color: "var(--muted)" }}>
              Available for new opportunities and exciting projects.
              Let&apos;s build something great together.
            </p>
            <div className="flex flex-col">
              {[
                { label: "jbginter88@gmail.com", href: "mailto:jbginter88@gmail.com" },
                { label: "GitHub", href: "https://github.com/jbginter" },
                { label: "LinkedIn", href: "https://www.linkedin.com/in/jonathan-ginter-bb1b007a/" },
              ].map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  className="flex items-center justify-between border-b py-5 transition-colors group hover:text-amber-400"
                  style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                  <span>{label}</span>
                  <span style={{ color: "var(--accent)" }} className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-12 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto justify-between items-center md:flex">
          <p style={{ color: "var(--muted)", fontFamily: "var(--font-space-mono)", fontSize: "0.7rem" }}>
            Building for the web since 2013
          </p>
          <p style={{ color: "var(--muted)", fontFamily: "var(--font-space-mono)", fontSize: "0.7rem" }}>
            © {new Date().getFullYear()} Jonathan Ginter
          </p>
        </div>
      </footer>
    </div>
  );
}
