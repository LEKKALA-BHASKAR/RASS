import React from "react";
import { motion } from "framer-motion";

export interface Tool {
  name: string;
  icon?: string;
  category?: string;
}

interface Props {
  tools: Tool[];
}

const ToolsTechnologies: React.FC<Props> = ({ tools }) => {
  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Tools & Technologies
      </h2>
      <div className="flex flex-wrap justify-center gap-6">
        {tools.map((tool, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center gap-2 bg-white p-4 rounded-xl shadow border w-28"
          >
            {tool.icon ? (
              <img src={tool.icon} alt={tool.name} className="h-10 w-10" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600">
                {tool.name.charAt(0)}
              </div>
            )}
            <span className="text-sm font-medium text-gray-800">{tool.name}</span>
            {tool.category && (
              <span className="text-xs text-gray-500">{tool.category}</span>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ToolsTechnologies;
