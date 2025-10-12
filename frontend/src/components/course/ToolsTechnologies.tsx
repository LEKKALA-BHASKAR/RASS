import React from "react";
import { motion } from "framer-motion";

export interface Tool {
  name: string;
  imageUrl?: string;
  color?: string;
}

interface Props {
  tools: Tool[];
}

const ToolsTechnologies: React.FC<Props> = ({ tools }) => {
  if (!tools || tools.length === 0) {
    return null;
  }

  // Tool-specific colors to match the image
  const getToolColor = (toolName: string) => {
    const colors: { [key: string]: string } = {
      'Python': 'bg-blue-500',
      'SQL': 'bg-orange-500',
      'NumPy': 'bg-indigo-600',
      'Pandas': 'bg-blue-600',
      'Seaborn': 'bg-teal-600',
      'scikit-learn': 'bg-orange-600',
      'Keras': 'bg-red-500',
      'Tensorflow': 'bg-orange-500',
      'Transformers': 'bg-yellow-500',
      'ChatGPT': 'bg-green-600',
      'OpenCV': 'bg-red-600',
      'SpaCy': 'bg-indigo-500',
      'LangChain': 'bg-blue-700',
      'Docker': 'bg-blue-400',
      'Flask': 'bg-gray-800',
      'Whisper': 'bg-purple-600',
      'ML Flow': 'bg-blue-800',
      'Github': 'bg-gray-900',
      'Gemini': 'bg-blue-500',
      'DALL-E': 'bg-green-500',
      'Dall.E': 'bg-green-500'
    };
    return colors[toolName] || 'bg-gray-500';
  };

  return (
    <section className="py-12 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Tools & Technologies
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Master the cutting-edge tools and technologies used by industry professionals
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tools.map((tool, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-2xl blur-sm opacity-20"></div>
              <div className="relative bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-lg border border-white border-opacity-30 flex items-center transition-all duration-300 overflow-hidden">
                {/* Left 30% - Tool Icon */}
                <div className="w-3/10 flex-shrink-0 flex items-center justify-center p-3">
                  {tool.imageUrl ? (
                    <motion.div 
                      className="w-12 h-12 rounded-full overflow-hidden bg-white border border-gray-200"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <img
                        src={tool.imageUrl}
                        alt={tool.name}
                        className="w-full h-full object-contain p-1"
                      />
                    </motion.div>
                  ) : (
                    <motion.div 
                      className={`w-12 h-12 ${getToolColor(tool.name)} rounded-full flex items-center justify-center`}
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <span className="text-white font-bold text-lg">
                        {tool.name.charAt(0).toUpperCase()}
                      </span>
                    </motion.div>
                  )}
                </div>
                
                {/* Right 70% - Tool Name */}
                <div className="w-7/10 p-3">
                  <span className="text-base font-semibold text-gray-800 truncate block">
                    {tool.name}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsTechnologies;