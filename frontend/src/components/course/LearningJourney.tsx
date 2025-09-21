import React from "react";
import { motion } from "framer-motion";

export interface JourneyStep {
  step: string;
  desc: string;
}

interface Props {
  journey: JourneyStep[];
}

const LearningJourney: React.FC<Props> = ({ journey }) => {
  const steps = journey.length
    ? journey
    : [
        { step: "Apply", desc: "Submit your application and get shortlisted." },
        { step: "Screening", desc: "Clear a quick aptitude + communication round." },
        { step: "Enroll", desc: "Choose your batch and pay the registration fee." },
        { step: "Learn", desc: "Attend live classes, projects & mentorship." },
        { step: "Get Placed", desc: "Crack top companies with our placement support." },
      ];

  return (
    <section>
      <h2 className="text-3xl font-bold mb-8 text-center">Admission Journey</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {steps.map((j, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-xl shadow border text-center flex flex-col items-center"
          >
            <div className="bg-indigo-100 text-indigo-700 rounded-full w-12 h-12 flex items-center justify-center font-bold mb-3">
              {idx + 1}
            </div>
            <h3 className="font-semibold text-gray-900">{j.step}</h3>
            <p className="text-sm text-gray-600 mt-2">{j.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default LearningJourney;
