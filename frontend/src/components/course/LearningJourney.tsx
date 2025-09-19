import React from "react";

export interface JourneyStep {
  step: string;
  desc: string;
}

interface Props {
  journey: JourneyStep[];
}

const LearningJourney: React.FC<Props> = ({ journey }) => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Learning Journey</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {journey.map((j, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-lg shadow border text-center hover:shadow-md transition"
          >
            <div className="text-indigo-600 text-3xl font-bold mb-3">
              {idx + 1}
            </div>
            <h3 className="font-semibold text-gray-900">{j.step}</h3>
            <p className="text-sm text-gray-600 mt-2">{j.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LearningJourney;
