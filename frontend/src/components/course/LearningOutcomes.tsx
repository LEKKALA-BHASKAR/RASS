import React from "react";
import { CheckCircle } from "lucide-react";

interface Props {
  outcomes: string[];
}

const LearningOutcomes: React.FC<Props> = ({ outcomes }) => {
  if (!outcomes || outcomes.length === 0) return null;

  return (
    <section className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-sm border p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        What You’ll Learn
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {outcomes.map((outcome, idx) => (
          <li
            key={idx}
            className="flex items-start gap-3 bg-white rounded-lg p-3 shadow-sm border hover:shadow-md transition"
          >
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700 text-sm">{outcome}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default LearningOutcomes;
