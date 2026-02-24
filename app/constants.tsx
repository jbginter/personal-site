interface skillsetInterface { title: string, skills: string[] };
interface experienceInterface { title: string, company: string, period: string, description: string };
interface projectsInterface { title: string, description: string, tags: string[] };

const skillSet: skillsetInterface[] = [
  {
    title: 'Frontend',
    skills: ["React", "Next.js", "TypeScript", "Svelte", "Ant Design", "SASS/LESS", "Tailwind CSS"],
  },
  {
    title: 'Backend',
    skills: ["Node.js", "Express.js", "Python", "PostgreSQL", "GraphQL", "MySQL", "NoSQL", "DynamoDB"],
  },
  {
    title: 'DevOps',
    skills: ["Docker", "AWS", "CI/CD", "Git"],
  },
  {
    title: 'Tools',
    skills: ["Webpack", "Redis", "Atlassian Suite", "AEM", "WordPress"],
  }
];

const experience: experienceInterface[] = [
  {
    title: "Software Engineer",
    company: "Dow Jones",
    period: "2024 - 2025",
    description: "Designed and implemented a React-based authoring system that streamlined article publishing via GraphQL into WordPress, reducing editor publishing time. Led development of a custom WYSIWYG editor adopted across WSJ properties, empowering editors with a consistent and scalable publishing experience.",
  },
  {
    title: "Software Engineer",
    company: "Spotify",
    period: "2023 - 2024",
    description: "Delivered an external tooling platform in React (MUI + Typescript) with GraphQL + Node backend, enabling non-engineers to set up automated checks and tracks, reducing engineering overhead by 30%. Built a real-time performance dashboard with filtering capabilities, giving teams visibility into track health and adoption.",
  },
  {
    title: "Senior Software Engineer",
    company: "Buzzfeed",
    period: "2019 - 2023",
    description: "Engineered an internal ad automation tool (React, Python, Svelte, Next.js) that published ads to Google Ad Manager, Facebook, Instagram, and BuzzFeed, reaching millions daily. Drove frontend development for BuzzFeed.com updates using React, Next.js, and SASS, while contributing backend updates in Python.",
  },
  {
    title: "Fullstack Engineer",
    company: "VaynerMedia",
    period: "2015-2019",
    description: "Developed websites, custom WordPress modules, and React applications for global clients including Budweiser, Johnnie Walker, and Hulu. Created Facebook Messenger bots (Node + Redis/SQL) and Alexa/Google voice apps (Node + DynamoDB) for Fortune 500 brands, deployed on AWS Lambda + S3.",
  },
];

const projects: projectsInterface[] = [
  {
    title: "Dow Jones Publishing Tool",
    description: "Full-featured CMS for deploying articles across all DJ owned workspaces with real-time tracking and multiple editors interacting with articles.",
    tags: ["React", "GraphQL", "Node.js", "TypeScript", "WordPress", "AWS"],
  },
  {
    title: "Real-time Performance Dashboard",
    description: "Live data visualization dashboard for tracking team adoption of certain checks and tracks.",
    tags: ["MUI", "Typescript", "Node.js", "GraphQL"],
  },
  {
    title: "Ads Deployment Dashboard",
    description: "Internal CMS for building and deploying ads across BuzzFeed. Showed live view of ads and placement, as well as 1:1 visualization of ads.",
    tags: ["Next.js", "Node.js", "Python", "React", "Svelte", "SQL"],
  }
];

const navLinks: { href: string, label: string }[] = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

export {
    skillSet,
    experience,
    projects,
    navLinks,
}

export type {
    skillsetInterface,
    experienceInterface,
    projectsInterface,
}