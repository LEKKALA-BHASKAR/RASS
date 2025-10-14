import React from "react";
import { motion } from "framer-motion";

interface JobRole {
  name: string;
}

interface Props {
  jobRoles: JobRole[];
}

const JobRoles: React.FC<Props> = ({ jobRoles }) => {
  if (!jobRoles || jobRoles.length === 0) return null;

  const validJobRoles = jobRoles.filter(
    (role) => role.name && role.name.trim() !== ""
  );

  if (validJobRoles.length === 0) return null;

  const getRandomGradient = (index: number) => {
    const gradients = [
      "from-blue-500 to-cyan-500",
      "from-purple-500 to-pink-500",
      "from-green-500 to-emerald-500",
      "from-orange-500 to-red-500",
      "from-indigo-500 to-blue-500",
      "from-pink-500 to-rose-500",
      "from-teal-500 to-green-500",
      "from-amber-500 to-orange-500",
      "from-violet-500 to-purple-500",
      "from-cyan-500 to-blue-500",
      "from-emerald-500 to-teal-500",
      "from-rose-500 to-pink-500"
    ];
    return gradients[index % gradients.length];
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
            Career Opportunities
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            After completing this course, you'll be prepared for these in-demand roles
          </p>
        </motion.div>

        {/* Job Cards */}
        <div className="flex flex-wrap justify-center gap-4">
          {validJobRoles.map((role, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              whileHover={{ 
                scale: 1.05,
                y: -2,
                transition: { duration: 0.2 }
              }}
              className="relative"
            >
              {/* Gradient Glow */}
              <div className={`absolute inset-0 bg-gradient-to-r ${getRandomGradient(idx)} rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-900`}></div>
              
              {/* Main Card */}
              <div className="relative bg-white/190 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-gray-200/60 flex items-center transition-all duration-300 group hover:shadow-xl">
                <h3 className="text-base font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                  {role.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobRoles;