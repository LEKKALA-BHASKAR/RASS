import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, TrendingUp, Users, Star, Award, Clock, Target, Building, Brain, Handshake } from "lucide-react";

const heroCode = "https://res.cloudinary.com/dc3bi7giu/image/upload/v1760631051/rass_hero_image_ty1tpb.jpg";

const slide = {
  id: 1,
  title: "Become the Talent that every company wants to Hire.",
  subtitle: "India's #1 Outcome-Focused Skill Development Initiative, trusted by learners with proven results.",
  image: heroCode,
  cta: "Explore Our Impact",
  accentColor: "blue",
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
      {/* Background Image - Displayed clearly without any overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${currentSlideData.image})` }}
      />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-conic from-white/5 via-transparent to-transparent animate-spin-slow" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-conic from-transparent via-white/5 to-transparent animate-spin-slower" />
      </div>

      {/* Main Content */}
      <div className="relative h-full max-w-7xl mx-auto flex items-center px-4 py-8">
        {/* Left Content - Full Width on Mobile, 60% on Desktop */}
        <div className="w-full lg:w-3/5 xl:w-2/3">
          <div className="max-w-2xl">
            <motion.h1
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-5xl sm:text-6xl md:text-5xl lg:text-6xl xl:text-6xl font-bold text-black leading-tight pb-2"
            >
              {currentSlideData.title}
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-lg sm:text-xl md:text-4xl text-black/90 leading-relaxed mb-6 font-light"
            >
              {currentSlideData.subtitle}
            </motion.p>

            {/* Stats - Desktop Version (Hidden on Mobile) */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="hidden md:grid grid-cols-3 gap-2 md:gap-3 mt-8 mb-6"
            >
              {currentSlideData.stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="bg-black/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-2 md:p-3 border border-gray-200 hover:bg-black/20 transition-all duration-300">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-gradient-to-br from-black/20 to-black/5 p-1.5 md:p-2 rounded-lg md:rounded-xl mb-1 md:mb-2">
                        <IconComponent className="h-4 w-4 md:h-5 md:w-5 text-black" />
                      </div>
                      <div className="text-center">
                        <div className="text-xs md:text-base font-bold text-black">{stat.value}</div>
                        <div className="text-black/80 text-[0.6rem] md:text-xs font-medium mt-0.5 md:mt-1">{stat.label}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            {/* Stats - Mobile Version (Visible on Mobile) */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="md:hidden grid grid-cols-1 gap-4 mt-6 mb-6"
            >
              {currentSlideData.stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-center">
                      <div className="bg-gradient-to-br from-white/20 to-white/5 p-2 rounded-lg mr-4">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white">{stat.value}</div>
                        <div className="text-white/80 text-sm font-medium">{stat.label}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
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