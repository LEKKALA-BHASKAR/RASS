import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Play, Pause, Award, Shield, Star, Code, Cpu, Database, Brain, Cloud, Server } from "lucide-react";

const heroTech = "https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
const heroCode = "../slide1.jpg";
const heroAI = "../Slide3.webp";
const heroCommunity = "https://images.unsplash.com/photo-1584697964358-3e14ca57658b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";

const slides = [
  {
    id: 1,
    title: "Become the Talent Every Company Wants to Hire",
    subtitle: "India’s #1 Outcome-Focused Skill Development Initiative, trusted by thousands of learners with proven results.",
    image: heroCode,
    cta: "Explore Our Impact",
    accentColor: "indigo",
    icon: <Code className="h-8 w-8" />
  },
  {
    id: 2,
    title: "The Gold Standard in Tech Certifications. Powered by NASSCOM.",
    subtitle: "As an officially recognized partner of NASSCOM's FutureSkills Prime, we are committed to building India's next generation of tech talent. Our programs are built upon the official joint framework of the Ministry of Electronics & IT (MeitY) and NASSCOM’s Skill development initiative, empowering every participant with the elite, industry-validated skills needed to excel professionally.",
    image: heroTech,
    cta: "Learn More",
    accentColor: "teal",
    icon: <Cpu className="h-8 w-8" />
  },
  {
    id: 3,
    title: "An Innovative Approach. Backed by Startup India.",
    subtitle: "Our commitment to revolutionizing education is officially recognized by the Government of India's Startup India initiative.",
    image: heroAI,
    cta: "See Our Recognition",
    accentColor: "purple",
    icon: <Brain className="h-8 w-8" />
  },
  {
    id: 4,
    title: "Go Beyond Theory. Become Job-Ready.",
    subtitle: "Translate your knowledge into action: Successfully complete your training and the official FutureSkills Prime assessment to unlock exclusive virtual internships and real-world job simulations.",
    image: heroCommunity,
    cta: "Get Started",
    accentColor: "rose",
    icon: <Server className="h-8 w-8" />
  },
];


const colorMap = {
  indigo: {
    gradient: "from-indigo-900/80 via-gray-900/70 to-gray-900/90",
    primary: "bg-indigo-600",
    light: "text-indigo-400",
    dark: "border-indigo-700",
    hover: "hover:bg-indigo-700"
  },
  teal: {
    gradient: "from-teal-800/80 via-gray-900/70 to-gray-900/90",
    primary: "bg-teal-600",
    light: "text-teal-400",
    dark: "border-teal-700",
    hover: "hover:bg-teal-700"
  },
  purple: {
    gradient: "from-purple-900/80 via-gray-900/70 to-gray-900/90",
    primary: "bg-purple-300",
    light: "text-purple-400",
    dark: "border-purple-200",
    hover: "hover:bg-purple-700"
  },
  rose: {
    gradient: "from-rose-800/80 via-gray-900/70 to-gray-900/90",
    primary: "bg-rose-600",
    light: "text-rose-400",
    dark: "border-rose-700",
    hover: "hover:bg-rose-700"
  }
};



// Floating tech icons component
const FloatingTechIcons = () => {
  const icons = [<Code key="code" />, <Cpu key="cpu" />, <Database key="db" />, <Brain key="ai" />, <Cloud key="cloud" />, <Server key="server" />];
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((Icon, i) => (
        <motion.div
          key={i}
          className="absolute text-white/10"
          initial={{ 
            y: Math.random() * 100,
            x: Math.random() * 100,
            rotate: 0,
            scale: 0.8
          }}
          animate={{ 
            y: [null, (Math.random() * 50) - 25, 0],
            x: [null, (Math.random() * 50) - 25, 0],
            rotate: [0, 5, 0],
            scale: [0.8, 1, 0.8]
          }}
          transition={{ 
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: i * 2,
            ease: "easeInOut"
          }}
          style={{
            top: `${10 + (i * 15) % 80}%`,
            left: `${10 + (i * 12) % 80}%`,
          }}
        >
          {Icon}
        </motion.div>
      ))}
    </div>
  );
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
      }, 8000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (index) => setCurrentSlide(index);
  const togglePlay = () => setIsPlaying(!isPlaying);

  const currentAccent = colorMap[slides[currentSlide].accentColor];

  return (
    <section ref={carouselRef} className="relative h-screen w-full overflow-hidden bg-gray-900">
      {/* Animated tech background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-green-500/10 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>


      
      {/* Floating tech icons */}
      <FloatingTechIcons />

      {/* Circuit board pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Glowing orb elements */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-500/5 rounded-full filter blur-3xl animate-pulse animation-delay-3000"></div>

      {/* Slides */}
      <AnimatePresence mode="wait">
        {slides.map(
          (slide, index) =>
            index === currentSlide && (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0"
              >
                {/* Background Image with Parallax Effect */}
                <motion.div 
                  className="absolute inset-0"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 10, ease: "easeOut" }}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="h-full w-full object-cover brightness-90"
                  />
                </motion.div>
                
                {/* Elegant Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${colorMap[slide.accentColor].gradient}`} />
                
                

                {/* Content */}
                <div className="relative z-10 flex h-full items-center">
                  <div className="container mx-auto px-8">
                    <div className="max-w-2xl">
                      {/* Icon badge */}
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.7, ease: "backOut" }}
                        className={`mb-8 inline-flex p-3 rounded-lg bg-black/30 backdrop-blur-sm border ${currentAccent.dark}`}
                      >
                        <div className={currentAccent.light}>
                          {slide.icon}
                        </div>
                      </motion.div>

                      {/* Main Title - Word by Word Animation */}
                      <div className="overflow-hidden mb-6">
                        <motion.h1
                          initial={{ y: 50, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ 
                            duration: 1,
                            ease: "easeOut"
                          }}
                          className="text-4xl md:text-6xl font-bold text-white leading-tight"
                        >
                          {slide.title.split(" ").map((word, i) => (
                            <motion.span
                              key={i}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ 
                                duration: 0.5, 
                                delay: 0.5 + (i * 0.05),
                                ease: "easeOut"
                              }}
                              className="inline-block mr-2"
                            >
                              {word}
                            </motion.span>
                          ))}
                        </motion.h1>
                      </div>

                      {/* Subtitle - Character by Character Animation */}
                      <div className="overflow-hidden mb-10">
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.2, duration: 1.5 }}
                          className="text-xl text-gray-200 max-w-2xl leading-relaxed font-light"
                        >
                          {slide.subtitle.split("").map((char, i) => (
                            <motion.span
                              key={i}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ 
                                duration: 0.03,
                                delay: 1.2 + (i * 0.01),
                                ease: "easeIn"
                              }}
                            >
                              {char}
                            </motion.span>
                          ))}
                        </motion.p>
                      </div>

                      {/* CTA Buttons */}
                      <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.8, duration: 0.9 }}
                        className="flex flex-wrap gap-6 items-center"
                      >
                        <button
                          className={`${currentAccent.primary} ${currentAccent.hover} px-8 py-4 rounded-md font-medium tracking-wide text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex items-center`}
                        >
                          <span className="flex items-center">
                            {slide.cta}
                            <motion.span
                              initial={{ x: -5, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 2.2, duration: 0.5 }}
                            >
                              <ArrowRight className="ml-3 h-5 w-5" />
                            </motion.span>
                          </span>
                        </button>

                        <button
                          className="bg-transparent border border-white/30 text-white px-8 py-4 rounded-md font-medium tracking-wide transition-all duration-300 hover:bg-white/10 hover:border-white/50 hover:-translate-y-1"
                        >
                          Our Story
                        </button>
                      </motion.div>

                      {/* Trust Indicators */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.5, duration: 1 }}
                        className="flex items-center mt-16 space-x-8 text-gray-300"
                      >
                        <div className="flex items-center backdrop-blur-sm bg-black/20 px-4 py-2 rounded-lg">
                          <Award className="h-5 w-5 mr-2 text-amber-400" />
                          <span className="text-sm">Industry Excellence</span>
                        </div>
                        <div className="flex items-center backdrop-blur-sm bg-black/20 px-4 py-2 rounded-lg">
                          <Shield className="h-5 w-5 mr-2 text-amber-400" />
                          <span className="text-sm">Trusted Partner</span>
                        </div>
                        <div className="flex items-center backdrop-blur-sm bg-black/20 px-4 py-2 rounded-lg">
                          <Star className="h-5 w-5 mr-2 text-amber-400" />
                          <span className="text-sm">Premium Service</span>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
        )}
      </AnimatePresence>

      {/* Premium Navigation Controls */}
      <div className="absolute bottom-12 left-1/2 z-40 flex -translate-x-1/2 items-center space-x-8 backdrop-blur-sm bg-black/30 p-3 rounded-lg border border-white/10">
        {/* Play/Pause Button */}
        <motion.button
          onClick={togglePlay}
          className="rounded-sm bg-black/30 p-3 backdrop-blur-sm border border-amber-400/30 hover:border-amber-400/60 transition-all duration-300"
          aria-label={isPlaying ? "Pause carousel" : "Play carousel"}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 text-amber-400" />
          ) : (
            <Play className="h-4 w-4 text-amber-400" />
          )}
        </motion.button>

        {/* Dots Indicator */}
        <div className="flex space-x-4">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? `w-8 ${colorMap[slides[index].accentColor].primary}`
                  : "w-4 bg-gray-500 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <motion.button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-40 bg-black/30 p-4 backdrop-blur-sm border border-amber-400/30 hover:border-amber-400/60 transition-all duration-300 group"
        aria-label="Previous slide"
        whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.5)" }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeft className="h-6 w-6 text-amber-400 group-hover:text-amber-300" />
      </motion.button>

      <motion.button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-40 bg-black/30 p-4 backdrop-blur-sm border border-amber-400/30 hover:border-amber-400/60 transition-all duration-300 group"
        aria-label="Next slide"
        whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.5)" }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronRight className="h-6 w-6 text-amber-400 group-hover:text-amber-300" />
      </motion.button>

      {/* Custom Animation Styles */}
      <style >{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}