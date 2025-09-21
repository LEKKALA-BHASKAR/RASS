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
    <section className="py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Frequently Asked Questions
      </h2>
      <div className="max-w-3xl mx-auto space-y-4">
        {displayFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex justify-between items-center px-5 py-4 text-left font-medium text-gray-900 hover:bg-gray-50"
              >
                {faq.question}
                {isOpen ? (
                  <ChevronUp className="h-5 w-5 text-gray-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-600" />
                )}
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-5 pb-4 text-sm text-gray-600"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQSection;