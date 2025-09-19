import React, { useState } from "react";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";

type Module = {
  _id: string;
  title: string;
  description?: string;
  duration: number;
  videoUrl?: string;
  resources?: { title: string; url: string }[];
};

interface Props {
  modules: Module[];
}

const CourseCurriculum: React.FC<Props> = ({ modules }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!modules || modules.length === 0) return null;

  return (
    <section className="bg-white rounded-2xl shadow-sm border p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Course Curriculum</h2>

      <div className="space-y-3">
        {modules.map((module, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={module._id || index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex justify-between items-center px-4 py-3 text-left font-medium text-gray-900 bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex items-center gap-3">
                  <span className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </span>
                  <span>{module.title}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Clock className="h-4 w-4" />
                  {module.duration} min
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5 ml-2" />
                  ) : (
                    <ChevronDown className="h-5 w-5 ml-2" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="px-6 py-4 bg-white text-gray-700 text-sm">
                  {module.description || "No description available."}
                  {module.resources && module.resources.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {module.resources.map((res, idx) => (
                        <li key={idx}>
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline"
                          >
                            {res.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CourseCurriculum;
