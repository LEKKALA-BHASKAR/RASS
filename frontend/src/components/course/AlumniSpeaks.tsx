import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

export interface Testimonial {
  name: string;
  role?: string;
  quote?: string;
  description?: string;
  avatar?: string;
  imageUrl?: string;
}

interface Props {
  testimonials: Testimonial[];
}

const AlumniSpeaks: React.FC<Props> = ({ testimonials }) => {
  // Use the testimonials passed as props directly
  // Map the admin-created testimonials to the expected format
  const displayTestimonials = testimonials.length > 0 ? 
    testimonials.map(t => ({
      name: t.name,
      role: t.role || "Alumni",
      quote: t.quote || t.description || "",
      avatar: t.avatar || t.imageUrl || ""
    })) : [
    {
      name: "Rajesh Kumar",
      role: "Frontend Engineer @ Microsoft",
      quote:
        "This course gave me the confidence and skills to land my first developer role in just 6 months.",
      avatar: "",
    },
    {
      name: "Kavya Reddy",
      role: "Data Analyst @ Amazon",
      quote:
        "The hands-on projects and placement support were game-changers for my career transition.",
      avatar: "",
    },
    {
      name: "Arjun Iyer",
      role: "Full Stack Developer @ Wipro",
      quote:
        "The mentorship and career guidance provided a clear roadmap to my first IT job.",
      avatar: "",
    },
    {
      name: "Priya Sharma",
      role: "ML Engineer @ Google",
      quote:
        "The curriculum was perfectly structured to build both theoretical knowledge and practical skills.",
      avatar: "",
    },
    {
      name: "Vikram Patel",
      role: "DevOps Specialist @ AWS",
      quote:
        "Hands-on projects and mentor support helped me transition from testing to DevOps in 4 months.",
      avatar: "",
    },
    {
      name: "Anjali Nair",
      role: "Data Scientist @ Meta",
      quote:
        "The real-world case studies and industry mentorship gave me an edge in my job interviews.",
      avatar: "",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  // Update items per page based on screen size
  React.useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(displayTestimonials.length / itemsPerPage);

  // Get current page items
  const getCurrentPageItems = () => {
    const start = currentIndex * itemsPerPage;
    const end = start + itemsPerPage;
    return displayTestimonials.slice(start, end);
  };

  // Navigation functions
  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-block mb-4"
          >
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-full text-xs sm:text-sm font-semibold">
              TESTIMONIALS
            </div>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Alumni</span> Say
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Join thousands of successful learners who transformed their careers through our programs
          </p>
        </motion.div>
        {/* Main Carousel */}
        <div className="relative max-w-7xl mx-auto">
          <div className="relative min-h-[400px] flex items-center justify-center">
            {/* Testimonials Grid */}
            <div className="absolute w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
              {getCurrentPageItems().map((testimonial, index) => (
                <motion.div
                  key={currentIndex * itemsPerPage + index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 hover:shadow-3xl transition-all duration-500"
                >
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-bl-3xl" />
                  
                  {/* Quote icon */}
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
                    "{testimonial.quote}"
                  </motion.p>

                  {/* Rating */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.9 }}
                    className="flex gap-1 mb-4"
                  >
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </motion.div>

                  {/* Author */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 1.1 }}
                    className="flex items-center gap-3 relative z-10"
                  >
                    {/* Avatar with initials */}
                    <motion.div
                      className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ scale: 1.1 }}
                    >
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </motion.div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-600 text-xs">
                        {testimonial.role}
                      </p>
                    </div>
                  </motion.div>

                  {/* Hover effect border */}
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
            </div>
          </div>

          {/* Navigation Arrows - Exact match from home page */}
          <motion.button
            onClick={goToPrev}
            className="absolute left-4 md:-left-16 top-1/2 -translate-y-1/2 bg-white shadow-2xl border border-gray-200 w-14 h-14 rounded-2xl flex items-center justify-center group hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </motion.button>

          <motion.button
            onClick={goToNext}
            className="absolute right-4 md:-right-16 top-1/2 -translate-y-1/2 bg-white shadow-2xl border border-gray-200 w-14 h-14 rounded-2xl flex items-center justify-center group hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Next testimonials"
          >
            <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </motion.button>

          {/* Group Indicators */}
          <motion.div 
            className="flex justify-center gap-3 mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {Array.from({ length: totalPages }).map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-12 bg-gradient-to-r from-blue-600 to-indigo-600"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Go to testimonial group ${index + 1}`}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AlumniSpeaks;