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
      name: "Aditi Sharma",
      role: "Frontend Engineer @ Microsoft",
      quote:
        "This course gave me the confidence and skills to land my first developer role in just 6 months.",
      avatar: "",
    },
    {
      name: "Rohit Mehta",
      role: "Data Analyst @ Amazon",
      quote:
        "The hands-on projects and placement support were game-changers for my career transition.",
      avatar: "",
    },
    {
      name: "Sneha Reddy",
      role: "Full Stack Developer @ Wipro",
      quote:
        "The mentorship and career guidance provided a clear roadmap to my first IT job.",
      avatar: "",
    },
    {
      name: "Priya Kumar",
      role: "ML Engineer @ Google",
      quote:
        "The curriculum was perfectly structured to build both theoretical knowledge and practical skills.",
      avatar: "",
    },
    {
      name: "Amit Patel",
      role: "DevOps Specialist @ AWS",
      quote:
        "Hands-on projects and mentor support helped me transition from testing to DevOps in 4 months.",
      avatar: "",
    },
    {
      name: "Neha Gupta",
      role: "Data Scientist @ Meta",
      quote:
        "The real-world case studies and industry mentorship gave me an edge in my job interviews.",
      avatar: "",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

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
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_rgba(120,119,198,0.05),_transparent_70%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm pb-3 leading-tight">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-600">Success Stories</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent pb-3 leading-tight">
            Hear From Our Alumni
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join thousands of successful students who transformed their careers with our courses
          </p>
        </motion.div>
        
        {/* Slider Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 border border-gray-200 group"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600 group-hover:text-indigo-600 transition-colors" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 border border-gray-200 group"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6 text-gray-600 group-hover:text-indigo-600 transition-colors" />
          </button>
          
          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getCurrentPageItems().map((t, idx) => (
              <motion.div
                key={currentIndex * itemsPerPage + idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/60 p-6 hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
              >
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 text-indigo-100">
                  <Quote className="w-8 h-8" />
                </div>
                
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                {/* Content */}
                <div className="flex items-start mb-5">
                  {t.avatar ? (
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="h-14 w-14 rounded-full object-cover shadow-sm mr-4 border-2 border-white"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl mr-4 shadow-sm border-2 border-white">
                      {t.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{t.name}</h3>
                    <p className="text-indigo-600 font-medium">{t.role}</p>
                  </div>
                </div>
                
                <p className="text-gray-700 italic relative">
                  "{t.quote}"
                </p>
                
                {/* Decorative bottom border */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </motion.div>
            ))}
          </div>
          
          {/* Pagination Dots */}
          <div className="flex justify-center mt-10 space-x-3">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-indigo-600 w-8" : "bg-gray-300"
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AlumniSpeaks;