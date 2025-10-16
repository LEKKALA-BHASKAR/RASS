import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle, TrendingUp, Users, Star, Award, Clock, Target } from "lucide-react";

const heroTech = "https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
const heroCode = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
const heroAI = "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
const heroCommunity = "https://images.unsplash.com/photo-1584697964358-3e14ca57658b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";

const slides = [
  {
    id: 1,
    title: "Become the Talent Every Company Wants to Hire",
    subtitle: "India's #1 Outcome-Focused Skill Development Initiative, trusted by thousands of learners with proven results.",
    image: heroCode,
    cta: "Explore Our Impact",
    accentColor: "blue",
    bgGradient: "from-blue-900 via-indigo-900 to-purple-900",
    overlay: "bg-gradient-to-br from-blue-600/20 to-purple-600/10",
    stats: [
      { value: "95%", label: "Placement Rate", icon: Target },
      { value: "10K+", label: "Students Trained", icon: Users },
      { value: "500+", label: "Hiring Partners", icon: TrendingUp }
    ],
    features: ["Industry-aligned curriculum", "1:1 Mentorship", "Real-world projects"]
  },
  
];

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const currentSlideData = slides[currentSlide];
  const currentAccent = colorMap[currentSlideData.accentColor];

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlideData.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.bgGradient}`}
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-conic from-white/5 via-transparent to-transparent animate-spin-slow" />
            <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-conic from-transparent via-white/5 to-transparent animate-spin-slower" />
          </div>

          {/* Main Content */}
          <div className="relative h-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Content */}
            <div className="flex items-center justify-center px-6 py-16 lg:px-8 lg:py-24 z-10 order-2 lg:order-1">
              <div className="max-w-2xl text-center lg:text-left">
                {/* Progress Bar */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 6, ease: "linear" }}
                  className="h-1 bg-white/30 rounded-full mb-8 overflow-hidden"
                >
                  <div className={`h-full ${currentAccent.primary} bg-gradient-to-r ${currentAccent.gradient}`} />
                </motion.div>

                <motion.h1
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6"
                >
                  {currentSlideData.title}
                </motion.h1>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-xl sm:text-2xl text-white/80 leading-relaxed mb-8 font-light"
                >
                  {currentSlideData.subtitle}
                </motion.p>



                {/* Stats */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="grid grid-cols-3 gap-6 mb-8"
                >
                  {currentSlideData.stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <div key={index} className="text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                          <IconComponent className="h-5 w-5 text-white/80" />
                          <div className="text-2xl font-bold text-white">{stat.value}</div>
                        </div>
                        <div className="text-white/60 text-sm font-medium">{stat.label}</div>
                      </div>
                    );
                  })}
                </motion.div>


              </div>
            </div>

            {/* Right Image */}
            <div className="flex items-center justify-center p-8 lg:p-12 order-1 lg:order-2 relative">
              <motion.div
                initial={{ scale: 1.1, opacity: 0, rotate: 2 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="relative w-full max-w-2xl"
              >
                {/* Main Image */}
                <div className="relative rounded-3xl overflow-hidden">
                  <img
                    src={currentSlideData.image}
                    alt={currentSlideData.title}
                    className="w-full h-[500px] object-cover"
                  />
                  <div className={`absolute inset-0 ${currentSlideData.overlay}`} />
                  
                  {/* Floating Badge */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 1, duration: 0.8, type: "spring" }}
                    className={`absolute top-6 right-6 ${currentAccent.primary} ${currentAccent.glow} text-white p-4 rounded-2xl backdrop-blur-sm border border-white/20`}
                  >
                    <TrendingUp className="h-8 w-8" />
                  </motion.div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  initial={{ y: 20, opacity: 0, x: -20 }}
                  animate={{ y: 0, opacity: 1, x: 0 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20"
                >
                  <Users className="h-8 w-8 text-blue-500 mb-2" />
                  <div className="text-sm font-semibold text-gray-900">10K+ Happy</div>
                  <div className="text-sm text-gray-600">Students</div>
                </motion.div>

                <motion.div
                  initial={{ y: -20, opacity: 0, x: 20 }}
                  animate={{ y: 0, opacity: 1, x: 0 }}
                  transition={{ delay: 1.4, duration: 0.8 }}
                  className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20"
                >
                  <Award className="h-8 w-8 text-amber-500 mb-2" />
                  <div className="text-sm font-semibold text-gray-900">Award</div>
                  <div className="text-sm text-gray-600">Winning</div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Enhanced Slide Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
        {/* Slide Indicators */}
        <div className="flex items-center gap-3 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative w-3 h-3 rounded-full transition-all duration-500 ${
                index === currentSlide
                  ? `${currentAccent.primary} scale-125 ${currentAccent.glow}`
                  : "bg-white/40 hover:bg-white/60"
              }`}
            >
              {index === currentSlide && (
                <motion.div
                  layoutId="activeSlide"
                  className="absolute inset-0 rounded-full border-2 border-white/30"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>


      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />
      </div>
    </section>
  );
}