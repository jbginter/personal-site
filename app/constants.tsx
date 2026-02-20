interface skillsetInterface { title: string, skills: string[] };
interface experienceInterface { title: string, company: string, period: string, description: string };
interface projectsInterface { title: string, description: string, tags: string[] };

const skillSet: skillsetInterface[] = [
  {
    title: 'Frontend',
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    title: 'Backend',
    skills: ["Node.js", "Python", "PostgreSQL", "REST APIs"],
  },
  {
    title: 'DevOps',
    skills: ["Docker", "AWS", "CI/CD", "Git"],
  },
  {
    title: 'Tools',
    skills: ["Jest", "Webpack", "Redis", "GraphQL"],
  }
];

const experience: experienceInterface[] = [
  {
    title: "Senior Fullstack Engineer",
    company: "Tech Company",
    period: "2022 - Present",
    description: "Led development of microservices architecture serving 1M+ users. Improved application performance by 40% through optimization and caching strategies.",
  },
  {
    title: "Fullstack Engineer",
    company: "Startup Inc",
    period: "2020 - 2022",
    description: "Built customer-facing web application from scratch using React and Node.js. Implemented real-time features using WebSockets and Redis.",
  },
  {
    title: "Software Engineer",
    company: "Digital Agency",
    period: "2019 - 2020",
    description: "Developed responsive web applications for multiple clients. Collaborated with designers to implement pixel-perfect UIs and smooth user experiences.",
  },
];

const projects: projectsInterface[] = [
  {
    title: "E-Commerce Platform",
    description: "Full-featured online store with payment integration, inventory management, and admin dashboard",
    tags: ["Next.js", "Stripe", "PostgreSQL"],
  },
  {
    title: "Real-time Analytics Dashboard",
    description: "Live data visualization dashboard processing millions of events per day",
    tags: ["React", "WebSocket", "Redis"],
  },
  {
    title: "Task Management System",
    description: "Collaborative project management tool with real-time updates and team features",
    tags: ["TypeScript", "Node.js", "MongoDB"],
  }
];

export {
    skillSet,
    experience,
    projects,
}

export type {
    skillsetInterface,
    experienceInterface,
    projectsInterface,
}