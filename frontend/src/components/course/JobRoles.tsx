import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Target, ArrowRight } from "lucide-react";

interface JobRole {
  name: string;
}

interface Props {
  jobRoles: JobRole[];
}

const JobRoles: React.FC<Props> = ({ jobRoles }) => {
  const validJobRoles = jobRoles?.filter(
    (role) => role.name && role.name.trim() !== ""
  );
  if (!validJobRoles || validJobRoles.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 14 },
    },
  };

  return (
    <section className="relative py-20 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute -top-20 right-0 w-96 h-96 bg-gradient-to-br from-indigo-300/20 to-purple-300/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-200/20 to-indigo-200/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/90 backdrop-blur-md border border-gray-200 rounded-full shadow-sm mb-5">
            <Target className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Career Paths
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent leading-tight">
            Explore Top Roles
          </h2>

          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mt-3">
            Build your skills for the most sought-after roles in the industry.
          </p>
        </motion.div>

        {/* Job Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
        >
          {validJobRoles.map((role, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{
                y: -8,
                scale: 1.02,
                boxShadow: "0 12px 25px rgba(79,70,229,0.1)",
              }}
              className="relative group rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
            >
              {/* Subtle Gradient Accent */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="p-6 flex flex-col items-start h-full">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md mb-4 group-hover:scale-105 transition-transform duration-300">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors duration-300 leading-tight">
                  {role.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-14"
        >
          <p className="text-sm text-gray-500 font-medium">
            {validJobRoles.length}+ career opportunities curated for you
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default JobRoles;
