import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

interface Testimonial {
  id: string;
  content: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
}

interface TestimonialCarouselProps {
  testimonials?: Testimonial[];
  autoPlay?: boolean;
  interval?: number;
}

const defaultTestimonials: Testimonial[] = [
  {
    id: "1",
    content: "The courses completely transformed my career. The hands-on projects and industry-relevant curriculum helped me land my dream job at a top tech company within 3 months of completion.",
    name: "Sarah Chen",
    role: "Senior Developer at TechCorp",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150&q=80",
    rating: 5,
  },
  {
    id: "2",
    content: "Outstanding mentorship and support throughout the program. The 1:1 guidance and real-world projects gave me the confidence to excel in technical interviews and practical scenarios.",
    name: "Michael Rodriguez",
    role: "Product Manager at InnovateLabs",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    rating: 5,
  },
  {
    id: "3",
    content: "The certification program enhanced my technical skills and provided exceptional career guidance. The placement assistance team was incredibly helpful in connecting me with top employers.",
    name: "Priya Sharma",
    role: "Data Scientist at AnalyticsPro",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    rating: 5,
  },
  {
    id: "4",
    content: "As a working professional, the flexible learning schedule was perfect. The course material was comprehensive and the instructors were always available to clarify doubts.",
    name: "David Thompson",
    role: "Cloud Architect at CloudSystems",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    rating: 5,
  },
  {
    id: "5",
    content: "The practical approach to learning made all the difference. Instead of just theory, we worked on real projects that are directly applicable in the industry. Highly recommended!",
    name: "Emily Watson",
    role: "UX Designer at DesignStudio",
    avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=150&q=80",
    rating: 5,
  },
  {
    id: "6",
    content: "The community and networking opportunities through this platform are incredible. I connected with industry experts and like-minded peers who helped me grow professionally.",
    name: "Alex Kim",
    role: "Full Stack Developer at WebSolutions",
    avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?auto=format&fit=crop&w=150&q=80",
    rating: 5,
  },
  {
    id: "7",
    content: "The career transition program was exactly what I needed. From resume building to interview preparation, every aspect was covered comprehensively.",
    name: "Maria Garcia",
    role: "DevOps Engineer at CloudTech",
    avatar: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=150&q=80",
    rating: 5,
  },
  {
    id: "8",
    content: "The instructors are industry experts who bring real-world experience into the classroom. The insights they shared were invaluable for my career growth.",
    name: "James Wilson",
    role: "Mobile Developer at AppWorks",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    rating: 5,
  },
  {
    id: "9",
    content: "The learning platform is intuitive and the support team is always responsive. I never felt stuck during my learning journey.",
    name: "Lisa Brown",
    role: "Product Designer at CreativeMinds",
    avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=150&q=80",
    rating: 5,
  }
];

const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({
  testimonials = defaultTestimonials,
  autoPlay = true,
  interval = 6000,
}) => {
  const [currentGroup, setCurrentGroup] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout>();

  const testimonialsPerGroup = 3;
  const totalGroups = Math.ceil(testimonials.length / testimonialsPerGroup);

  const getCurrentTestimonials = () => {
    const startIndex = currentGroup * testimonialsPerGroup;
    return testimonials.slice(startIndex, startIndex + testimonialsPerGroup);
  };

  const startAutoPlay = useCallback(() => {
    if (!autoPlay || isPaused) return;
    
    autoPlayRef.current = setInterval(() => {
      setDirection(1);
      setCurrentGroup(prev => (prev + 1) % totalGroups);
    }, interval);
  }, [autoPlay, isPaused, interval, totalGroups]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  }, []);

  useEffect(() => {
    startAutoPlay();
    return stopAutoPlay;
  }, [startAutoPlay, stopAutoPlay]);

  const nextGroup = () => {
    setDirection(1);
    setCurrentGroup(prev => (prev + 1) % totalGroups);
  };

  const prevGroup = () => {
    setDirection(-1);
    setCurrentGroup(prev => (prev - 1 + totalGroups) % totalGroups);
  };

  const goToGroup = (groupIndex: number) => {
    setDirection(groupIndex > currentGroup ? 1 : -1);
    setCurrentGroup(groupIndex);
  };

  const groupVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2 + 0.3,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex justify-center gap-1 mb-3">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
        >
          <Star
            className={`w-4 h-4 ${
              i < rating 
                ? "fill-yellow-400 text-yellow-400" 
                : "fill-gray-200 text-gray-200"
            }`}
          />
        </motion.div>
      ))}
    </div>
  );

  const FloatingElement = ({ delay = 0, className = "" }) => (
    <motion.div
      className={`absolute rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 ${className}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 0.8, type: "spring" }}
    />
  );

  return (
    <section className="relative w-full py-24 bg-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingElement 
          delay={0.2} 
          className="w-72 h-72 -top-36 -left-36" 
        />
        <FloatingElement 
          delay={0.4} 
          className="w-96 h-96 -bottom-48 -right-48" 
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-gray-100"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-block mb-4"
          >
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
              TESTIMONIALS
            </div>
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Students</span> Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Join thousands of successful learners who transformed their careers through our innovative programs
          </p>
        </motion.div>

        {/* Main Carousel - 3 Testimonials at a time */}
        <div 
          className="relative max-w-7xl mx-auto"
          onMouseEnter={() => {
            setIsPaused(true);
            stopAutoPlay();
          }}
          onMouseLeave={() => {
            setIsPaused(false);
            startAutoPlay();
          }}
        >
          <div className="relative min-h-[400px] flex items-center justify-center">
            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.div
                key={currentGroup}
                custom={direction}
                variants={groupVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.4 },
                }}
                className="absolute w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4"
              >
                {getCurrentTestimonials().map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 relative overflow-hidden group hover:shadow-3xl transition-all duration-500"
                  >
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-bl-3xl" />
                    
                    {/* Quote Icon */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
                      className="relative z-10 mb-4"
                    >
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">
                        <Quote className="w-5 h-5 text-white" />
                      </div>
                    </motion.div>

                    {/* Content */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.7 }}
                      className="text-gray-700 leading-relaxed mb-4 relative z-10 line-clamp-4"
                    >
                      "{testimonial.content}"
                    </motion.p>

                    {/* Rating */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.9 }}
                    >
                      <StarRating rating={testimonial.rating} />
                    </motion.div>

                    {/* Author */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 1.1 }}
                      className="flex items-center gap-3 relative z-10"
                    >
                      <motion.img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full border-2 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ scale: 1.1 }}
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-600 text-xs">
                          {testimonial.role}
                        </p>
                      </div>
                    </motion.div>

                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-blue-200 transition-all duration-500" />
                    
                    {/* Floating decorative element */}
                    <motion.div
                      className="absolute -bottom-8 -right-8 w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full opacity-5"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360]
                      }}
                      transition={{ 
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                        delay: index * 2
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <motion.button
            onClick={prevGroup}
            className="absolute left-4 md:-left-16 top-1/2 -translate-y-1/2 bg-white shadow-2xl border border-gray-200 w-14 h-14 rounded-2xl flex items-center justify-center group hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </motion.button>

          <motion.button
            onClick={nextGroup}
            className="absolute right-4 md:-right-16 top-1/2 -translate-y-1/2 bg-white shadow-2xl border border-gray-200 w-14 h-14 rounded-2xl flex items-center justify-center group hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </motion.button>

          {/* Progress Bar */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              key={currentGroup}
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: interval / 1000, ease: "linear" }}
            />
          </div>
        </div>

        {/* Group Indicators */}
        <motion.div 
          className="flex justify-center gap-3 mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {Array.from({ length: totalGroups }).map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToGroup(index)}
              className={`relative w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentGroup 
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 scale-125" 
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
            >
              {index === currentGroup && (
                <motion.div
                  layoutId="activeGroup"
                  className="absolute inset-0 rounded-full border-2 border-white shadow-sm"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;