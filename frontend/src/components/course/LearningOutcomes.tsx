import React from "react";
import { CheckCircle, Award, Brain, Code, Database, Zap } from "lucide-react";

interface Props {
  outcomes: string[];
}

const LearningOutcomes: React.FC<Props> = ({ outcomes }) => {
  if (!outcomes || outcomes.length === 0) return null;

  // Icons for different types of outcomes
  const getIconForOutcome = (index: number) => {
    const icons = [
      <Award key="award" className="h-5 w-5" />,
      <Brain key="brain" className="h-5 w-5" />,
      <Code key="code" className="h-5 w-5" />,
      <Database key="database" className="h-5 w-5" />,
      <Zap key="zap" className="h-5 w-5" />,
      <CheckCircle key="check" className="h-5 w-5" />
    ];
    return icons[index % icons.length];
  };

  // Colors for different types of outcomes
  const getColorForOutcome = (index: number) => {
    const colors = [
      "from-blue-500 to-cyan-500",
      "from-purple-500 to-pink-500",
      "from-green-500 to-emerald-500",
      "from-amber-500 to-orange-500",
      "from-indigo-500 to-blue-500",
      "from-pink-500 to-rose-500"
    ];
    return colors[index % colors.length];
  };

  return (
    <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl shadow-lg border border-gray-200/60 p-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
          <Award className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">What You'll Learn</h2>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {outcomes.map((outcome, idx) => (
          <li
            key={idx}
            className="flex items-start gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-200/60 hover:shadow-md transition-all duration-300 group hover:-translate-y-1"
          >
            <div className={`w-8 h-8 bg-gradient-to-br ${getColorForOutcome(idx)} rounded-lg flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform duration-300`}>
              {getIconForOutcome(idx)}
            </div>
            <span className="text-gray-800 text-sm font-medium">{outcome}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default LearningOutcomes;