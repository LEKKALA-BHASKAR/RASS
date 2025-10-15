import React, { useState } from "react";
import { ChevronDown, ChevronRight, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CurriculumSection {
  subtitle: string;
  description?: string;
}

interface CurriculumItem {
  _id?: string;
  order: number;
  title: string;
  sections: CurriculumSection[];
}

interface Props {
  curriculum: CurriculumItem[];
}

const AdminCurriculum: React.FC<Props> = ({ curriculum }) => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  if (!curriculum || curriculum.length === 0) return null;

  // Sort curriculum items by order
  const sortedCurriculum = [...curriculum].sort((a, b) => a.order - b.order);

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Course Curriculum</h2>

      <div className="space-y-4">
        {sortedCurriculum.map((item, index) => {
          const isOpen = openItems.has(index);
          const hasSections = item.sections && item.sections.length > 0;
          
          return (
            <div
              key={item._id || index}
              className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden"
            >
              {/* Main Curriculum Item */}
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex justify-between items-center px-6 py-4 text-left font-medium text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">
                    {item.order}
                  </div>
                  <span className="text-lg">{item.title}</span>
                  {hasSections && (
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {item.sections.length} sections
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {hasSections ? (
                    isOpen ? (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-500" />
                    )
                  ) : null}
                </div>
              </button>

              {/* Sections Tree Structure */}
              <AnimatePresence>
                {isOpen && hasSections && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-4"
                  >
                    <div className="border-l-2 border-gray-200 pl-4 ml-4 py-2">
                      {item.sections.map((section, sectionIndex) => (
                        <div 
                          key={sectionIndex} 
                          className="mb-3 last:mb-0 relative"
                        >
                          {/* Tree branch connector */}
                          <div className="absolute -left-5 top-3 w-3 h-0.5 bg-gray-300"></div>
                          
                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <BookOpen className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800 text-base">
                                {section.subtitle}
                              </h3>
                              {section.description && (
                                <p className="text-gray-600 mt-1 text-sm">
                                  {section.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
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

export default AdminCurriculum;
