import React from "react";
import { motion } from "framer-motion";
import { 
  Star, 
  Target, 
  Award, 
  Zap, 
  TrendingUp, 
  Users, 
  CheckCircle,
  ArrowRight,
  Play,
  Clock,
  Shield,
  Briefcase
} from "lucide-react";

const TrainingAssessment: React.FC = () => {
  const features = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Industry-Aligned Curriculum",
      description: "Designed with input from top tech companies"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Govt. Approved Certification",
      description: "Recognized skill validation"
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: "Guaranteed Internships",
      description: "Real workplace experience"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Placement Ready",
      description: "100% placement assistance"
    }
  ];

  const processSteps = [
    {
      number: "01",
      title: "Intensive Training",
      description: "Comprehensive, hands-on learning with live instructors and industry-aligned modules. Includes core skill training, soft skills, and cultural fitment sessions.",
      features: ["Live Instructor Sessions", "Real-world Projects", "Soft Skills Training", "Industry Expert Sessions"],
      gradient: "from-blue-500 to-cyan-500",
      delay: 0.2
    },
    {
      number: "02",
      title: "Skill Certification",
      description: "Candidates undergo Government of India–approved skill assessment to validate technical and professional competence.",
      features: ["Govt. Approved Assessment", "Technical Validation", "Professional Competence", "Skill Certification"],
      gradient: "from-purple-500 to-pink-500",
      delay: 0.4
    },
    {
      number: "03",
      title: "Industry Internship",
      description: "Certified learners are placed in internships with industry partners or in-house real-time projects based on performance.",
      features: ["Industry Partnerships", "Real Workplace Experience", "Performance-based Placement", "Project Experience"],
      gradient: "from-orange-500 to-red-500",
      delay: 0.6
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {/* Header Section */}
        <motion.div 
          className="flex-1 flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 py-8 lg:py-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Left Content - Text */}
          <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0 lg:pr-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Badge */}
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-white text-sm font-medium">India's First Full-Cycle Pathway</span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                From Learning
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  to Earning
                </span>
                in One Pathway
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-xl lg:text-2xl text-gray-200 font-light mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Building Tomorrow's Workforce, Today with India's Most Comprehensive Career-Ready Program
              </motion.p>

              {/* Features Grid */}
              <motion.div 
                className="grid grid-cols-2 gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/20">
                      {feature.icon}
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold text-sm">{feature.title}</p>
                      <p className="text-gray-400 text-xs">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <button className="group relative bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    Start Your Journey <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
                
                <button className="group relative bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <span className="relative flex items-center justify-center gap-2">
                    <Play className="h-5 w-5" /> Watch Demo
                  </span>
                </button>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Content - Full Flex Image */}
          <motion.div 
            className="lg:w-1/2 w-full flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.95, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="relative w-full max-w-2xl">
              {/* Main Image Container */}
              <motion.div
                className="relative w-full h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="../../improve_yourself.png"
                  alt="Career Development Pathway"
                  className="w-full h-full object-cover"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-purple-900/30"></div>
                
                {/* Floating Elements */}
                <motion.div 
                  className="absolute top-6 left-6 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">100%</p>
                      <p className="text-gray-200 text-xs">Placement Support</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="absolute bottom-6 right-6 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4, duration: 0.5 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-400 rounded-2xl flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">5000+</p>
                      <p className="text-gray-200 text-xs">Students Trained</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Background Decoration */}
              <div className="absolute -z-10 -inset-4">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-400/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-pink-400/20 rounded-full blur-xl"></div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Process Steps - Mobile & Compact View */}
        <motion.div 
          className="px-4 sm:px-6 lg:px-8 pb-12 lg:pb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Your <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">3-Step</span> Success Path
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                From beginner to industry professional with our proven pathway
              </p>
            </motion.div>

            {/* Process Steps */}
            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className="group relative bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:-translate-y-2"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: step.delay }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Step Number */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-white font-bold text-2xl">{step.number}</span>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">{step.description}</p>

                  {/* Features */}
                  <div className="space-y-3">
                    {step.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 text-green-400" />
                        </div>
                        <span className="text-gray-200 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TrainingAssessment;