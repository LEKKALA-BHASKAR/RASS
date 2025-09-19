import React from "react";

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
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Alumni Speaks</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-lg shadow border hover:shadow-md transition"
          >
            {t.avatar && (
              <img
                src={t.avatar}
                alt={t.name}
                className="h-12 w-12 rounded-full object-cover mb-4"
              />
            )}
            <p className="text-gray-700 italic mb-4">“{t.quote}”</p>
            <h3 className="font-semibold text-gray-900">{t.name}</h3>
            <p className="text-sm text-gray-500">{t.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AlumniSpeaks;
