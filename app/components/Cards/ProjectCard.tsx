import type { projectsInterface } from "@/app/constants";

export default function ProjectCard({ title, description, tags }: projectsInterface) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg hover:shadow-xl transition-shadow">
      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h4>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span 
            key={tag} 
            className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}