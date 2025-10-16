import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, TrendingUp, Users, Star, Award, Clock, Target, Building, Brain, Handshake } from "lucide-react";

const heroTech = "https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
const heroCode = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
const heroAI = "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
const heroCommunity = "https://images.unsplash.com/photo-1584697964358-3e14ca57658b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";

const slide = {
  id: 1,
  title: "Become the Talent that every company wants to Hire.",
  subtitle: "India's #1 Outcome-Focused Skill Development Initiative, trusted by learners with proven results.",
  image: heroCode,
  cta: "Explore Our Impact",
  accentColor: "blue",
  bgGradient: "from-blue-900 via-indigo-900 to-purple-900",
  overlay: "bg-gradient-to-br from-blue-600/20 to-purple-600/10",
  stats: [
    { value: "Startup India", label: "Recognized", icon: Award },
    { value: "AI Powered", label: "Learning Platform", icon: Brain },
    { value: "Industry", label: "Collaborations", icon: Handshake }
  ],
  features: ["Industry-aligned curriculum", "1:1 Mentorship", "Real-world projects"]
};

const colorMap = {
  blue: {
    primary: "bg-blue-600",
    hover: "hover:bg-blue-700",
    gradient: "from-blue-500 via-blue-600 to-blue-700",
    light: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
    glow: "shadow-2xl shadow-blue-500/20"
  },
  emerald: {
    primary: "bg-emerald-600",
    hover: "hover:bg-emerald-700",
    gradient: "from-emerald-500 via-emerald-600 to-emerald-700",
    light: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200",
    glow: "shadow-2xl shadow-emerald-500/20"
  },
  amber: {
    primary: "bg-amber-600",
    hover: "hover:bg-amber-700",
    gradient: "from-amber-500 via-amber-600 to-amber-700",
    light: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-200",
    glow: "shadow-2xl shadow-amber-500/20"
  },
  violet: {
    primary: "bg-violet-600",
    hover: "hover:bg-violet-700",
    gradient: "from-violet-500 via-violet-600 to-violet-700",
    light: "bg-violet-50",
    text: "text-violet-600",
    border: "border-violet-200",
    glow: "shadow-2xl shadow-violet-500/20"
  },
};

export function HeroCarousel() {
  const currentSlideData = slide;
  const currentAccent = colorMap[currentSlideData.accentColor];

  return (
    <section className="relative h-[90vh] w-full overflow-hidden pt-0 mt-0">
      <div className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.bgGradient}`}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-conic from-white/5 via-transparent to-transparent animate-spin-slow" />
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-conic from-transparent via-white/5 to-transparent animate-spin-slower" />
        </div>

        {/* Main Content */}
        <div className="relative h-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 pt-0 mt-0 px-4">
          {/* Left Content */}
          <div className="flex items-center justify-center px-2 py-4 lg:px-6 lg:py-8 z-10 order-2 lg:order-1">
            <div className="max-w-2xl text-center lg:text-left flex flex-col justify-center h-full">
              <motion.h1
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-6xl font-bold text-white leading-tight pb-2"
              >
                {currentSlideData.title}
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-lg sm:text-xl md:text-3xl text-white/80 leading-relaxed mb-8 font-light"
              >
                {currentSlideData.subtitle}
              </motion.p>

              {/* Stats - Enhanced styling */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="grid grid-cols-3 gap-2 md:gap-3 mt-12 mb-6"
              >
                {currentSlideData.stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-2 md:p-3 border border-white/20 hover:bg-white/20 transition-all duration-300">
                      <div className="flex flex-col items-center justify-center">
                        <div className="bg-gradient-to-br from-white/20 to-white/5 p-1.5 md:p-2 rounded-lg md:rounded-xl mb-1 md:mb-2">
                          <IconComponent className="h-4 w-4 md:h-5 md:w-5 text-white" />
                        </div>
                        <div className="text-center">
                          <div className="text-xs md:text-base font-bold text-white">{stat.value}</div>
                          <div className="text-white/80 text-[0.6rem] md:text-xs font-medium mt-0.5 md:mt-1">{stat.label}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex items-center justify-center p-2 lg:p-4 order-1 lg:order-2 relative">
            <motion.div
              initial={{ scale: 1.1, opacity: 0, rotate: 2 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="relative w-full max-w-2xl"
            >
              {/* Main Image */}
              <div className="relative rounded-2xl md:rounded-3xl overflow-hidden">
                <img
                  src={currentSlideData.image}
                  alt={currentSlideData.title}
                  className="w-full h-80 sm:h-96 md:h-[500px] object-cover"
                />
                <div className={`absolute inset-0 ${currentSlideData.overlay}`} />
                
                {/* Floating Badge */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1, duration: 0.8, type: "spring" }}
                  className={`absolute top-4 right-4 md:top-6 md:right-6 ${currentAccent.primary} ${currentAccent.glow} text-white p-2 md:p-3 rounded-xl md:rounded-2xl backdrop-blur-sm border border-white/20`}
                >
                  <TrendingUp className="h-5 w-5 md:h-6 md:w-6" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />
      </div>
    </section>
  );
}