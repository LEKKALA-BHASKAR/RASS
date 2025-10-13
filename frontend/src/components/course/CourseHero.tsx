import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, easeInOut, easeOut } from "framer-motion";
import { 
  Calendar, 
  Users, 
  Clock, 
  PlayCircle, 
  Star, 
  CheckCircle, 
  Award,
  Shield,
  BookOpen
} from "lucide-react";

interface CourseHeroProps {
  course: {
    _id?: string;
    title: string;
    description: string;
    thumbnail?: string;
    instructor?: { 
      name: string;
      avatar?: string;
    };
    category?: string;
    level?: string;
    price?: number;
    enrollmentCount?: number;
    rating?: { 
      average: number; 
      count: number;
    };
    totalDuration?: number;
    lessonsCount?: number;
    lastUpdated?: string;
  };
  enrollment?: any;
  onEnroll?: () => void;
  onPreview?: () => void;
}

const CourseHero: React.FC<CourseHeroProps> = ({ 
  course, 
  enrollment, 
  onEnroll,
  onPreview 
}) => {
  const navigate = useNavigate();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9, rotateY: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 1,
        ease: easeOut
      }
    }
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: easeInOut
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getLevelColor = (level: string) => {
    const colors = {
      beginner: "from-green-500 to-emerald-600",
      intermediate: "from-blue-500 to-cyan-600",
      advanced: "from-purple-500 to-pink-600",
      expert: "from-red-500 to-orange-600"
    };
    return colors[level as keyof typeof colors] || colors.beginner;
  };

  const handleContinueLearning = () => {
    navigate(`/learn/${course._id}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-20 px-4 sm:px-6 lg:px-8">
      {/* Enhanced Background with Animated Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-blue-200 to-transparent rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-l from-purple-200 to-transparent rounded-full blur-3xl opacity-40" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_rgba(120,119,198,0.1),_transparent_70%)]" />
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 right-20 hidden xl:block"
        animate={floatingAnimation}
      >
        <div className="w-6 h-6 bg-blue-400 rounded-full opacity-20" />
      </motion.div>
      <motion.div
        className="absolute bottom-32 left-20 hidden lg:block"
        animate={{ 
          y: [0, -10, 0],
          transition: { 
            duration: 4, 
            repeat: Infinity, 
            ease: easeInOut,
            delay: 1 
          } 
        }}
      >
        <div className="w-4 h-4 bg-purple-400 rounded-full opacity-30" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start pt-8">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Category and Level Badge */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
              {course.category && (
                <span className="px-4 py-2 bg-white/80 backdrop-blur-sm text-blue-700 text-sm font-semibold rounded-full border border-blue-200 shadow-sm">
                  {course.category}
                </span>
              )}
              {course.level && (
                <span className={`px-4 py-2 bg-gradient-to-r ${getLevelColor(course.level)} text-white text-sm font-bold rounded-full shadow-lg capitalize`}>
                  {course.level}
                </span>
              )}
              {course.lastUpdated && (
                <span className="px-3 py-2 bg-amber-100 text-amber-700 text-xs font-medium rounded-full flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Updated {course.lastUpdated}
                </span>
              )}
            </motion.div>

            {/* Title */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight"
            >
              {course.title}
            </motion.h1>

            {/* Description */}
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-600 leading-relaxed max-w-2xl font-light"
            >
              {course.description}
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center gap-4 pt-4"
            >
              <motion.button
                onClick={enrollment ? handleContinueLearning : onEnroll}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(79, 70, 229, 0.3)"
                }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 group"
              >
                {enrollment ? (
                  <>
                    <PlayCircle className="w-6 h-6" />
                    Continue Learning
                  </>
                ) : (
                  <>
                    <span>Enroll Now</span>
                    {course.price !== undefined && (
                      <span className="bg-white/20 px-2 py-1 rounded-lg text-sm">
                        {formatPrice(course.price)}
                      </span>
                    )}
                  </>
                )}
              </motion.button>

            </motion.div>

            {/* Enhanced Trust Badges */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-gray-300/50 mt-8"
            >
              <div className="flex items-center gap-3 p-3 bg-white/50 backdrop-blur-sm rounded-xl">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Lifetime Access</p>
                  <p className="text-sm text-gray-600">Learn at your pace</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/50 backdrop-blur-sm rounded-xl">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Award className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Certificate</p>
                  <p className="text-sm text-gray-600">Share your achievement</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/50 backdrop-blur-sm rounded-xl">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">100% Safe Skill</p>
                  <p className="text-sm text-gray-600">100% promise</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image Section - Aligned with title */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={imageVariants}
            className="flex justify-center lg:justify-end relative -mt-8"
          >
            <div className="relative w-full max-w-3xl">
              {/* Larger Course Image Card with increased height */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group h-[500px]">
                <div className="relative w-full h-full">
                  <img
                    src={course.thumbnail || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"}
                    alt={course.title}
                    className="w-full h-full object-cover bg-gray-100 transition-all duration-1000 group-hover:scale-105"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-70 group-hover:opacity-50 transition-all duration-500" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CourseHero;