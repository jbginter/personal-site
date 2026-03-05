import type { experienceInterface } from "@/app/constants";

export default function ExperienceCard({ title, company, site, period, description }: experienceInterface) {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-4 items-center">
        <div>
          <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h4>
          <a href={site} target="_blank" className="text-lg text-blue-600 dark:text-blue-400 hover:text-white transition-all">{company}</a>
        </div>
        <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap">{period}</span>
      </div>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}