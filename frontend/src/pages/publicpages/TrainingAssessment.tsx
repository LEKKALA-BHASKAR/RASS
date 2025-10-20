import React from "react";
import { motion } from "framer-motion";
import { 
  Target, 
  Award, 
  TrendingUp, 
  Users, 
  CheckCircle,
  Zap,
  Shield,
  Rocket,
  Gem,
  BookOpen,
  Briefcase,
  Clock,
  Star,
  ArrowRight
} from "lucide-react";

const TrainingAssessment: React.FC = () => {
  // Consistent color palette
  const colors = {
    primary: "#4f46e5",
    primaryLight: "#6366f1",
    primaryDark: "#4338ca",
    secondary: "#8b5cf6",
    accent: "#06b6d4",
    background: "#0f172a",
    surface: "#1e293b",
    text: "#f8fafc",
    textMuted: "#cbd5e1"
  };

  const features = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Industry-Aligned Curriculum",
      description: "Designed with input from top tech companies",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Govt. Approved Certification",
      description: "Recognized skill validation",
      gradient: "from-purple-500 to-indigo-600"
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: "Guaranteed Internships",
      description: "Real workplace experience",
      gradient: "from-indigo-500 to-blue-600"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Placement Ready",
      description: "100% placement assistance",
      gradient: "from-cyan-500 to-blue-600"
    }
  ];

  const processSteps = [
    {
      number: "01",
      title: "Intensive Training",
      description: "Comprehensive, hands-on learning with live instructors and industry-aligned modules. Includes core skill training, soft skills, and cultural fitment sessions.",
      features: ["Live Instructor Sessions", "Real-world Projects", "Soft Skills Training", "Industry Expert Sessions"],
      gradient: "from-blue-500 to-indigo-600",
      icon: <BookOpen className="h-7 w-7" />,
      accentColor: "#3b82f6"
    },
    {
      number: "02",
      title: "Skill Certification",
      description: "Candidates undergo Government of India–approved skill assessment to validate technical and professional competence.",
      features: ["Govt. Approved Assessment", "Technical Validation", "Professional Competence", "Skill Certification"],
      gradient: "from-indigo-500 to-purple-600",
      icon: <Shield className="h-7 w-7" />,
      accentColor: "#8b5cf6"
    },
    {
      number: "03",
      title: "Industry Internship",
      description: "Certified learners are placed in internships with industry partners or in-house real-time projects based on performance.",
      features: ["Industry Partnerships", "Real Workplace Experience", "Performance-based Placement", "Project Experience"],
      gradient: "from-purple-500 to-cyan-600",
      icon: <Rocket className="h-7 w-7" />,
      accentColor: "#06b6d4"
    }
  ];

  const stats = [
    { number: "1000+", label: "Students Trained" },
    { number: "95%", label: "Placement Rate" },
    { number: "50+", label: "Industry Partners" },
    { number: "100%", label: "Certified Success" }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      </div>

      {/* Header Section */}
      <motion.div 
        className="relative z-10 px-4 sm:px-6 lg:px-8 pt-16 lg:pt-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            {/* Enhanced Badge */}
            <motion.div 
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 mb-8 shadow-2xl shadow-blue-500/10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Gem className="h-5 w-5 text-cyan-400" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                </div>
                <span className="text-white font-semibold text-sm bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  India's First Full-Cycle Pathway
                </span>
              </div>
              <div className="w-1 h-1 bg-white/30 rounded-full"></div>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                <span className="text-white/80 text-xs">Proven Success</span>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Full-Cycle
              </span>{" "}
              <br className="hidden md:block" />
              Career-Ready Training
            </motion.h1>

            {/* Enhanced Subtitle */}
            <motion.p
              className="text-xl lg:text-2xl text-gray-300 font-light mb-12 leading-relaxed max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Transforming Aspirants into Industry-Ready Professionals through{" "}
              <span className="text-cyan-300 font-semibold">Intensive Training</span>,{" "}
              <span className="text-purple-300 font-semibold">Govt. Certification</span>, and{" "}
              <span className="text-blue-300 font-semibold">Guaranteed Internships</span>
            </motion.p>
          </motion.div>
        </div>
      </motion.div>


          <img
            src="../../RASS01.jpg"
            alt="Career Development Pathway"
            className="w-full h-full object-cover"
          />
      {/* Process Steps Section */}
      <motion.div 
        className="relative z-10 px-4 sm:px-6 py-16 lg:py-24"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Section Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 rounded-full border border-cyan-500/20 mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.5 }}
            >
              <Zap className="h-4 w-4 text-cyan-400" />
              <span className="text-cyan-300 text-sm font-medium">Proven Pathway</span>
            </motion.div>
            
            <h2 className="text-4xl font-bold text-white mb-4">
              Your <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">3-Step</span> Success Journey
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              From beginner to industry professional with our structured, results-driven pathway
            </p>
          </motion.div>

          {/* Enhanced Process Steps */}
          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-24 left-1/2 transform -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full opacity-50"></div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className="group relative"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.6 + index * 0.2 }}
                >
                  <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 h-full group-hover:shadow-2xl group-hover:shadow-purple-500/10">
                    {/* Step Number Badge */}
                    <div className="absolute -top-4 -left-4">
                      <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br ${step.gradient} rounded-2xl shadow-2xl shadow-blue-500/20 font-bold text-white text-lg`}>
                        {step.number}
                      </div>
                    </div>

                    {/* Step Icon */}
                    <div className={`flex items-center justify-center w-16 h-16 bg-gradient-to-br ${step.gradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {step.icon}
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                      {step.title}
                    </h3>
                    
                    <p className="text-gray-300 leading-relaxed mb-6 text-base">
                      {step.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-3">
                      {step.features.map((feature, featureIndex) => (
                        <motion.div 
                          key={featureIndex}
                          className="flex items-center gap-3 group/item"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 1.8 + index * 0.2 + featureIndex * 0.1 }}
                        >
                          <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center group-hover/item:bg-green-500/30 transition-colors duration-300">
                            <CheckCircle className="h-3 w-3 text-green-400" />
                          </div>
                          <span className="text-gray-200 text-sm font-medium group-hover/item:text-white transition-colors duration-300">
                            {feature}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Hover Arrow */}
                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      <ArrowRight className="h-5 w-5 text-cyan-400" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.2 }}
          >
            <motion.button
              className="group relative bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-12 rounded-2xl transition-all duration-300 shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative z-10 flex items-center gap-3">
                <span>Start Your Journey Today</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </motion.button>
            
            <p className="text-gray-400 text-sm mt-4">
              Join 1000+ successful professionals who transformed their careers
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default TrainingAssessment;