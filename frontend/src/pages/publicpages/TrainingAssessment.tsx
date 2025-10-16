import React from "react";
import { motion } from "framer-motion";

const TrainingAssessment: React.FC = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl">
        {/* Headline Section */}
        <motion.div 
          className="text-center mb-12 px-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            India's First{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Full-Cycle
            </span>{" "}
            <br className="hidden md:block" />
            Career-Ready Training Pathway
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-200 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Building Tomorrow's Workforce, Today
          </motion.p>
        </motion.div>

        {/* Main Content - Desktop: Image, Mobile: Process */}
        <div className="w-full">
          {/* Desktop View - Image */}
          <div className="hidden md:flex items-center justify-center">
            <motion.div 
              className="relative w-full max-w-4xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Image Container */}
              <div className="relative bg-white/5 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/10">
                <img
                  src="../../improve_yourself.png"
                  alt="Career Development Pathway"
                  className="w-full h-auto object-contain rounded-2xl"
                />
              </div>
            </motion.div>
          </div>

          {/* Mobile View - Process Modules */}
          <div className="md:hidden space-y-6">
            {/* Module 1 */}
            <motion.div 
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Module 1: Intensive Training</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Comprehensive, hands-on learning led by live instructors and industry-aligned self-paced modules. 
                    Includes core skill training, soft skills, and cultural fitment sessions. 
                    Real-world projects and guest lectures by industry experts ensure job readiness.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Module 2 */}
            <motion.div 
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Module 2: Skill Certification</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Candidates undergo a Government of India–approved skill assessment to validate their 
                    technical and professional competence. Successful candidates progress to the next stage.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Module 3 */}
            <motion.div 
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Module 3: Industry Internship</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Certified learners are placed in internships with industry partners or in-house real-time projects. 
                    Internships are assigned based on training performance and assessment results, 
                    providing true workplace experience.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingAssessment;