import React from "react";

interface Props {
  description: string;
}

const CourseDescription: React.FC<Props> = ({ description }) => {
  if (!description) return null;

  return (
    <section className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-sm border p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Course Description</h2>
      <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
        {description}
      </p>
    </section>
  );
};

export default CourseDescription;
