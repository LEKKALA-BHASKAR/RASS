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
} from "lucide-react";

const heroTech =
  "https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
const heroCode = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
const heroAI = "../hero_startupindia_website.svg";
const heroCommunity =
  "https://images.unsplash.com/photo-1584697964358-3e14ca57658b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";

const slides = [
  {
    id: 1,
    title: "Become the Talent Every Company Wants to Hire",
    subtitle:
      "India's #1 Outcome-Focused Skill Development Initiative, trusted by thousands of learners with proven results.",
    image: heroCode,
    cta: "Explore Our Impact",
    accentColor: "blue",
    icon: <Code className="h-6 w-6" />,
  },
  {
    id: 2,
    title: "The Gold Standard in Tech Certifications",
    subtitle:
      "Officially recognized partner of NASSCOM's FutureSkills Prime, building India's next generation of tech talent.",
    image: heroTech,
    cta: "Learn More",
    accentColor: "teal",
    icon: <Cpu className="h-6 w-6" />,
  },
  {
    id: 3,
    title: "Innovative Approach. Backed by Startup India.",
    subtitle:
      "Our commitment to revolutionizing education is officially recognized by the Government of India.",
    image: heroAI,
    cta: "See Our Recognition",
    accentColor: "indigo",
    icon: <Brain className="h-6 w-6" />,
  },
  {
    id: 4,
    title: "Go Beyond Theory. Become Job-Ready.",
    subtitle:
      "Translate knowledge into action with virtual internships and real-world job simulations.",
    image: heroCommunity,
    cta: "Get Started",
    accentColor: "purple",
    icon: <Server className="h-6 w-6" />,
  },
];

const colorMap = {
  blue: {
    primary: "bg-blue-600",
    gradient: "from-blue-500 via-blue-600 to-blue-700",
  },
  teal: {
    primary: "bg-teal-600",
    gradient: "from-teal-500 via-teal-600 to-teal-700",
  },
  indigo: {
    primary: "bg-indigo-600",
    gradient: "from-indigo-500 via-indigo-600 to-indigo-700",
  },
  purple: {
    primary: "bg-purple-600",
    gradient: "from-purple-500 via-purple-600 to-purple-700",
  },
};

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const carouselRef = useRef(null);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 7000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (index) => setCurrentSlide(index);
  const togglePlay = () => setIsPlaying(!isPlaying);

  const currentAccent = colorMap[slides[currentSlide].accentColor];

  return (
    <section
      ref={carouselRef}
      className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100"
    >
      <AnimatePresence mode="wait">
        {slides.map(
          (slide, index) =>
            index === currentSlide && (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                <div className="relative h-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2">
                  {/* Left Content */}
                  <div className="flex items-center justify-center px-8 py-16 lg:px-16">
                    <div className="max-w-lg">
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="mb-8 inline-flex p-4 rounded-full bg-white/70 backdrop-blur-lg border shadow-sm"
                      >
                        <div className={`text-${slides[currentSlide].accentColor}-600`}>
                          {slide.icon}
                        </div>
                      </motion.div>

                      <motion.h1
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6"
                      >
                        {slide.title}
                      </motion.h1>

                      <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 1 }}
                        className="text-lg text-gray-600 leading-relaxed mb-8"
                      >
                        {slide.subtitle}
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="flex gap-4"
                      >
                        <button
                          className={`px-8 py-3 rounded-lg text-white font-medium shadow-lg bg-gradient-to-r ${currentAccent.gradient} hover:scale-105 transition-transform duration-300 flex items-center gap-2`}
                        >
                          {slide.cta} <ArrowRight className="h-4 w-4" />
                        </button>
                        <button className="px-6 py-3 rounded-lg font-medium border bg-white/80 backdrop-blur-lg hover:shadow-lg transition-all duration-300">
                          Our Story
                        </button>
                      </motion.div>

                      <div className="flex gap-8 mt-12 text-gray-500">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">Industry Excellence</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Trusted Partner</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Image */}
                  <div className="relative hidden lg:flex items-center justify-center p-12">
                    <motion.img
                      src={slide.image}
                      alt={slide.title}
                      initial={{ scale: 1.1, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="w-full h-96 object-cover rounded-3xl shadow-2xl"
                    />
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-black/10 mix-blend-overlay"></div>
                  </div>
                </div>
              </motion.div>
            )
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-white/70 backdrop-blur-md px-6 py-3 rounded-full border shadow-lg">
        <button onClick={togglePlay} className="text-gray-600 hover:text-gray-900">
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? `${currentAccent.primary} scale-125`
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
        <div className="text-sm text-gray-500 font-medium">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-md p-3 rounded-full border shadow-lg hover:scale-110 transition-transform duration-300"
      >
        <ChevronLeft className="h-5 w-5 text-gray-700" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-md p-3 rounded-full border shadow-lg hover:scale-110 transition-transform duration-300"
      >
        <ChevronRight className="h-5 w-5 text-gray-700" />
      </button>
    </section>
  );
}
