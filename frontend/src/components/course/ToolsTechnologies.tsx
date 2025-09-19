import React from "react";

export interface Tool {
  name: string;
  icon?: string;
}

interface Props {
  tools: Tool[];
}

const ToolsTechnologies: React.FC<Props> = ({ tools }) => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Tools & Technologies</h2>
      <div className="flex flex-wrap gap-6">
        {tools.map((tool, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 bg-white p-3 rounded-lg shadow border hover:shadow-md transition"
          >
            {tool.icon && (
              <img src={tool.icon} alt={tool.name} className="h-6 w-6" />
            )}
            <span className="text-sm font-medium text-gray-800">
              {tool.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ToolsTechnologies;
