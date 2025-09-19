import React from "react";

export interface Highlight {
  title: string;
  desc: string;
}

interface Props {
  highlights: Highlight[];
}

const CourseHighlights: React.FC<Props> = ({ highlights }) => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Course Highlights</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {highlights.map((h, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-lg shadow border hover:shadow-md transition"
          >
            <h3 className="font-semibold text-gray-900">{h.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{h.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CourseHighlights;
