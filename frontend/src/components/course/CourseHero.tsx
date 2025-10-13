import React from "react";
import { motion } from "framer-motion";
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
        ease: "easeOut"
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
        ease: "easeOut"
      }
    }
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
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

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-16 px-4 sm:px-6 lg:px-8 xl:px-12">
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
        animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 1 } }}
      >
        <div className="w-4 h-4 bg-purple-400 rounded-full opacity-30" />
      </motion.div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
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

          {/* Enhanced Stats Grid */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4"
          >
            <div className="flex flex-col p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm">
              <div className="flex items-center gap-2 text-gray-700 mb-1">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Enrolled</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {(course.enrollmentCount || 0).toLocaleString()}
              </span>
            </div>

            <div className="flex flex-col p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm">
              <div className="flex items-center gap-2 text-gray-700 mb-1">
                <Clock className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">Duration</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {course.totalDuration || 0}h
              </span>
            </div>

            <div className="flex flex-col p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm">
              <div className="flex items-center gap-2 text-gray-700 mb-1">
                <BookOpen className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Lessons</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {course.lessonsCount || 0}
              </span>
            </div>

            <div className="flex flex-col p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm">
              <div className="flex items-center gap-2 text-gray-700 mb-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">Rating</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold text-gray-900">
                  {course.rating?.average?.toFixed(1) || "0.0"}
                </span>
                <span className="text-sm text-gray-500">
                  ({course.rating?.count || 0})
                </span>
              </div>
            </div>
          </motion.div>



          {/* Action Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 pt-4"
          >
            <motion.button
              onClick={onEnroll}
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
                <CheckCircle className="w-30 h-25 text-green-600" />
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

        {/* Right Image Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={imageVariants}
          className="flex justify-center lg:justify-end relative"
        >
          <div className="relative w-full max-w-lg">
            {/* Enhanced Main Course Image - Full Image Display */}
<div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl group h-[500px] lg:h-[600px] w-full">
  <div className="relative w-full h-full">
    <img
      src={course.thumbnail || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"}
      alt={course.title}
      className="w-full h-full object-contain bg-gray-100 transition-all duration-1000 group-hover:scale-105"
    />
    
    {/* Enhanced Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-70 group-hover:opacity-50 transition-all duration-500" />
    
    {/* Side Gradients for Better Contrast */}
    <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

    {/* Animated Background Pattern */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(120,119,198,0.2)_0%,_transparent_50%)]" />
    </div>
  </div>


  {/* Course Info Overlay */}
  <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-0 group-hover:translate-y-[-10px] transition-transform duration-500">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-3 text-white/90">
          <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
            <Clock className="w-4 h-4" />
            <span className="font-medium text-sm">{course.totalDuration || 0} hours</span>
          </div>
          <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
            <BookOpen className="w-4 h-4" />
            <span className="font-medium text-sm">{course.lessonsCount || 0} lessons</span>
          </div>
        </div>
      </div>
      

    </div>
  </div>
</div>

           

            {/* Floating Students Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-2xl border border-gray-200/50 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    +{(course.enrollmentCount || 0) > 1000 ? '1K' : course.enrollmentCount}
                  </div>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Students</p>
                  <p className="text-sm text-gray-600">Joined recently</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CourseHero;