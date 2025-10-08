import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Play,
  Pause,
  Award,
  Shield,
  Code,
  Cpu,
  Brain,
  Server,
  Star,
  Users,
  TrendingUp,
  CheckCircle
} from "lucide-react";

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
    icon: <Code className="h-6 w-6" />,
    stats: [
      { value: "95%", label: "Placement Rate" },
      { value: "10K+", label: "Students Trained" },
      { value: "500+", label: "Hiring Partners" }
    ],
    features: ["Industry-aligned curriculum", "1:1 Mentorship", "Real-world projects"]
  },
  {
    id: 2,
    title: "The Gold Standard in Tech Certifications",
    subtitle: "Officially recognized partner of NASSCOM's FutureSkills Prime, building India's next generation of tech talent.",
    image: heroTech,
    cta: "Learn More",
    accentColor: "teal",
    icon: <Cpu className="h-6 w-6" />,
    stats: [
      { value: "NASSCOM", label: "Certified Partner" },
      { value: "4.9/5", label: "Student Rating" },
      { value: "100+", label: "Certifications" }
    ],
    features: ["Industry-recognized certificates", "Skill India aligned", "Global recognition"]
  },
  {
    id: 3,
    title: "Innovative Approach. Backed by Startup India.",
    subtitle: "Our commitment to revolutionizing education is officially recognized by the Government of India.",
    image: heroAI,
    cta: "See Our Recognition",
    accentColor: "indigo",
    icon: <Brain className="h-6 w-6" />,
    stats: [
      { value: "Startup", label: "India Recognized" },
      { value: "AI-Powered", label: "Learning Platform" },
      { value: "24/7", label: "Support" }
    ],
    features: ["Government recognized", "Cutting-edge technology", "Personalized learning paths"]
  },
  {
    id: 4,
    title: "Go Beyond Theory. Become Job-Ready.",
    subtitle: "Translate knowledge into action with virtual internships and real-world job simulations.",
    image: heroCommunity,
    cta: "Get Started",
    accentColor: "purple",
    icon: <Server className="h-6 w-6" />,
    stats: [
      { value: "6 Months", label: "Average Hiring Time" },
      { value: "300%", label: "Salary Hike" },
      { value: "100+", label: "Live Projects" }
    ],
    features: ["Virtual internships", "Job simulations", "Portfolio building"]
  },
];

const colorMap = {
  blue: {
    primary: "bg-blue-600",
    hover: "hover:bg-blue-700",
    gradient: "from-blue-500 via-blue-600 to-blue-700",
    light: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200"
  },
  teal: {
    primary: "bg-teal-600",
    hover: "hover:bg-teal-700",
    gradient: "from-teal-500 via-teal-600 to-teal-700",
    light: "bg-teal-50",
    text: "text-teal-600",
    border: "border-teal-200"
  },
  indigo: {
    primary: "bg-indigo-600",
    hover: "hover:bg-indigo-700",
    gradient: "from-indigo-500 via-indigo-600 to-indigo-700",
    light: "bg-indigo-50",
    text: "text-indigo-600",
    border: "border-indigo-200"
  },
  purple: {
    primary: "bg-purple-600",
    hover: "hover:bg-purple-700",
    gradient: "from-purple-500 via-purple-600 to-purple-700",
    light: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-200"
  },
};

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const carouselRef = useRef(null);

  useEffect(() => {
    let timer;
    if (isPlaying && !isHovering) {
      timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, isHovering]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (index) => setCurrentSlide(index);
  const togglePlay = () => setIsPlaying(!isPlaying);

  const currentAccent = colorMap[slides[currentSlide].accentColor];

  return (
    <section
      ref={carouselRef}
      className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <AnimatePresence mode="wait">
        {slides.map(
          (slide, index) =>
            index === currentSlide && (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2 }}
                className="absolute inset-0"
              >
                <div className="relative h-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2">
                  {/* Left Content */}
                  <div className="flex items-center justify-center px-8 py-16 lg:px-16 lg:py-24">
                    <div className="max-w-2xl">
                      
                      <motion.h1
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
                      >
                        {slide.title}
                      </motion.h1>

                      <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-xl text-gray-600 leading-relaxed mb-8"
                      >
                        {slide.subtitle}
                      </motion.p>

                      {/* Features List */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                        className="flex flex-wrap gap-4 mb-8"
                      >
                        {slide.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-lg border shadow-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </motion.div>

                      {/* Stats */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.8 }}
                        className="flex gap-8 mb-8"
                      >
                        {slide.stats.map((stat, idx) => (
                          <div key={idx} className="text-center">
                            <div className={`text-2xl font-bold ${currentAccent.text} mb-1`}>{stat.value}</div>
                            <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                          </div>
                        ))}
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1, duration: 0.8 }}
                        className="flex flex-col sm:flex-row gap-4"
                      >
                        <button
                          className={`px-8 py-4 rounded-xl text-white font-semibold shadow-xl bg-gradient-to-r ${currentAccent.gradient} hover:scale-105 transition-all duration-300 flex items-center gap-3 group`}
                        >
                          {slide.cta}
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-6 py-4 rounded-xl font-semibold border-2 bg-white/80 backdrop-blur-lg hover:shadow-lg transition-all duration-300 hover:scale-105">
                          Our Story
                        </button>
                      </motion.div>

                    </div>
                  </div>

                  {/* Right Image */}
                  <div className="relative hidden lg:flex items-center justify-center p-12">
                    <motion.div
                      initial={{ scale: 1.1, opacity: 0, rotate: 2 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="relative w-full max-w-2xl"
                    >
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-[500px] object-cover rounded-3xl shadow-2xl"
                      />
                      {/* Floating Elements */}
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border"
                      >
                        <TrendingUp className="h-6 w-6 text-green-500" />
                      </motion.div>
                      <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl border"
                      >
                        <Users className="h-6 w-6 text-blue-500" />
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )
        )}
      </AnimatePresence>

      {/* Enhanced Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-white/80 backdrop-blur-xl px-6 py-4 rounded-2xl border shadow-2xl">
        <button
          onClick={togglePlay}
          className={`p-2 rounded-lg ${currentAccent.text} hover:${currentAccent.light} transition-colors`}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        
        <div className="flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                index === currentSlide
                  ? `${currentAccent.primary} scale-125 shadow-lg`
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
        
        <div className={`text-sm font-semibold ${currentAccent.text}`}>
          {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </div>
      </div>

      {/* Enhanced Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-xl p-4 rounded-2xl border shadow-2xl hover:scale-110 transition-all duration-300 group"
      >
        <ChevronLeft className="h-6 w-6 text-gray-700 group-hover:scale-110 transition-transform" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-xl p-4 rounded-2xl border shadow-2xl hover:scale-110 transition-all duration-300 group"
      >
        <ChevronRight className="h-6 w-6 text-gray-700 group-hover:scale-110 transition-transform" />
      </button>
    </section>
  );
}