import ProjectCard from "./components/Cards/ProjectCard";
import ExperienceCard from "./components/Cards/ExperienceCard";
import SkillCard from "./components/Cards/SkillCard";
import { skillSet, experience, projects } from "./constants";
import { Navigation } from "./components/Navigation/Navigation";

export default function Home() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navigation />
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6">
            <h2 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white">
              Fullstack Engineer
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Building scalable web applications with modern technologies and 10+ years of experience
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <a 
                href="#projects" 
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View Projects
              </a>
              <a 
                href="#contact" 
                className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:border-blue-600 dark:hover:border-blue-400 transition-colors font-medium"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">About Me</h3>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                I'm a passionate fullstack engineer with over 10+ years of experience building 
                robust, scalable web applications. My expertise spans modern frontend frameworks, 
                backend systems, databases, and cloud infrastructure.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                I thrive on solving complex problems and transforming ideas into elegant, 
                user-friendly solutions that drive business value.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {
                skillSet.map((value, index) => <SkillCard key={`${value.title}-${index}`} {...value} />)
              }
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">Experience</h3>
          <div className="space-y-8">
            {
              experience.map((value, index) => <ExperienceCard key={`${value.title}-${index}`} {...value} />)
            }
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">Featured Projects</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {
              projects.map((value, index) => <ProjectCard key={`${value.title}-${index}`} {...value} />)
            }
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Let's Work Together</h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            I'm always interested in hearing about new opportunities and exciting projects.
          </p>
          <div className="flex gap-6 justify-center">
            <a href="mailto:jbginter88@gmail.com" target="_blank" className="text-blue-600 dark:text-blue-400 hover:text-white transition-all">
              jbginter88@gmail.com
            </a>
            <a href="https://github.com/jbginter" target="_blank" className="text-blue-600 dark:text-blue-400 hover:text-white transition-all">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/jonathan-ginter-bb1b007a/" target="_blank" className="text-blue-600 dark:text-blue-400 hover:text-white transition-all">
              LinkedIn
            </a>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="py-8 px-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto text-center text-gray-600 dark:text-gray-400">
          <p>Building content for the web since 2013</p>
        </div>
      </footer>
    </div>
  );
}
