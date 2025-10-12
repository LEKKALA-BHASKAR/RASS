import React from "react";
import { motion } from "framer-motion";

interface JobRole {
  name: string;
}

interface Props {
  jobRoles: JobRole[];
}

const JobRoles: React.FC<Props> = ({ jobRoles }) => {
  // Don't render the section if there are no job roles
  if (!jobRoles || jobRoles.length === 0) {
    return null;
  }

  // Filter out any job roles with null/undefined/empty names
  const validJobRoles = jobRoles.filter(role => role.name && role.name.trim() !== '');

  if (validJobRoles.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Career Opportunities
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            After completing this course, you'll be prepared for these in-demand roles
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          {validJobRoles.map((role, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full blur-sm opacity-20"></div>
              <div className="relative bg-white bg-opacity-80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-white border-opacity-30 flex items-center transition-all duration-300">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 shadow-sm">
                  <span className="font-bold text-sm">{role.name.charAt(0)}</span>
                </div>
                <h3 className="text-base font-semibold text-gray-800">{role.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobRoles;