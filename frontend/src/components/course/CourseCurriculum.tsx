import React, { useState } from "react";
import { Clock, ChevronDown, ChevronUp, FileText, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Course Curriculum</h2>

      <div className="space-y-4">
        {modules.map((module, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={module._id || index}
              className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex justify-between items-center px-6 py-4 text-left font-medium text-gray-900 hover:bg-gray-50"
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

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 py-4 text-gray-700 text-sm bg-gray-50"
                  >
                    <p>{module.description || "No description available."}</p>
                    <div className="mt-4 flex flex-wrap gap-4">
                      {module.videoUrl && (
                        <div className="flex items-center gap-2 text-indigo-600 text-sm">
                          <Play className="h-4 w-4" /> Preview video available
                        </div>
                      )}
                      {module.resources?.map((res, idx) => (
                        <a
                          key={idx}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-indigo-600 hover:underline"
                        >
                          <FileText className="h-4 w-4" /> {res.title}
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CourseCurriculum;
