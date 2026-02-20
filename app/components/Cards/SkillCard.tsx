import type { skillsetInterface } from "@/app/constants";

export default function SkillCard({ title, skills }: skillsetInterface) {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <h4 className="font-bold text-gray-900 dark:text-white mb-3">{title}</h4>
      <ul className="space-y-2">
        {skills.map((skill) => (
          <li key={skill} className="text-sm text-gray-600 dark:text-gray-300">• {skill}</li>
        ))}
      </ul>
    </div>
  );
}