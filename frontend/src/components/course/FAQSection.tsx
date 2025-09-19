import React from "react";

export interface FAQ {
  question: string;
  answer: string;
}

interface Props {
  faqs: FAQ[];
}

const FAQSection: React.FC<Props> = ({ faqs }) => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-lg shadow border hover:shadow-md transition"
          >
            <h3 className="font-semibold text-gray-900">{faq.question}</h3>
            <p className="text-sm text-gray-600 mt-2">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
