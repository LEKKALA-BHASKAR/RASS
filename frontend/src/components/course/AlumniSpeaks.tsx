import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Hear From Our Alumni
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Join thousands of successful students who transformed their careers with our courses
          </p>
        </div>
        
        {/* Slider Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full shadow-md p-2 hover:bg-gray-50 transition-colors duration-200 border border-gray-200"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full shadow-md p-2 hover:bg-gray-50 transition-colors duration-200 border border-gray-200"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6 text-gray-600" />
          </button>
          
          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-10">
            {getCurrentPageItems().map((t, idx) => (
              <motion.div
                key={currentIndex * itemsPerPage + idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-blue-50 p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start mb-3">
                  {t.avatar ? (
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="h-12 w-12 rounded-full object-cover shadow-sm mr-3"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg mr-3 shadow-sm">
                      {t.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{t.name}</h3>
                    <p className="text-indigo-600 text-sm font-medium">{t.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm italic relative pl-5">
                  <span className="absolute left-0 top-0 text-3xl text-indigo-200 leading-none">"</span>
                  {t.quote}
                </p>
              </motion.div>
            ))}
          </div>
          
          {/* Pagination Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? "bg-indigo-600" : "bg-gray-300"
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