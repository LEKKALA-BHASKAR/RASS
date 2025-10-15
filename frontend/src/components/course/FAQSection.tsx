import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface FAQ {
  question: string;
  answer: string;
}

interface Props {
  faqs: FAQ[];
}

const FAQSection: React.FC<Props> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  // Use the faqs passed as props directly
  const displayFaqs = faqs.length > 0 ? faqs : [
    {
      question: "Do I get a certificate after completion?",
      answer:
        "Yes, you will receive an industry-recognized certificate that can be added to LinkedIn and your resume.",
    },
    {
      question: "Is placement support provided?",
      answer:
        "Absolutely! Our team helps with resume prep, mock interviews, and connects you to hiring partners.",
    },
    {
      question: "What if I miss a live class?",
      answer:
        "All live sessions are recorded and uploaded. You can revisit them anytime.",
    },
    {
      question: "Is there a refund policy?",
      answer:
        "There is no refund policy Once You Enrolled into Course.",
    },
    {
      question: "Do I need prior coding knowledge?",
      answer:
        "No prior coding experience is required. This course starts from basics and scales to advanced concepts.",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 pb-3 leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about our courses
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {displayFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex justify-between items-center px-6 py-5 text-left font-medium text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="text-lg font-semibold">{faq.question}</span>
                  {isOpen ? (
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 180 }}
                      transition={{ duration: 0.1 }}
                    >
                      <ChevronUp className="h-6 w-6 text-indigo-600" />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 0 }}
                      transition={{ duration: 0.1 }}
                    >
                      <ChevronDown className="h-6 w-6 text-indigo-600" />
                    </motion.div>
                  )}
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-5 text-gray-600 border-t border-gray-100"
                    >
                      <p className="pt-4 text-lg">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;