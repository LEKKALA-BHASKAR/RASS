import React from "react";
import { motion } from "framer-motion";

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  avatar?: string;
}

interface Props {
  testimonials: Testimonial[];
}

const AlumniSpeaks: React.FC<Props> = ({ testimonials }) => {
  // Use the testimonials passed as props directly
  const displayTestimonials = testimonials.length > 0 ? testimonials : [
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
  ];

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
        Hear From Our Alumni
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {displayTestimonials.map((t, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-2xl shadow-md border flex flex-col sm:flex-row gap-5"
          >
            {t.avatar ? (
              <img
                src={t.avatar}
                alt={t.name}
                className="h-16 w-16 rounded-full object-cover shadow"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                {t.name.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-gray-700 italic mb-3">"{t.quote}"</p>
              <h3 className="font-semibold text-gray-900">{t.name}</h3>
              <p className="text-sm text-gray-500">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AlumniSpeaks;