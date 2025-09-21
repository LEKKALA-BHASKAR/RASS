import React from "react";
import { Clock, Users, Star, Layers, Award, Play } from "lucide-react";
import { Course } from "../../types";

interface Props {
  course: Course;
}

const CourseDetails: React.FC<Props> = ({ course }) => {
  const rating = course.rating?.average ?? 0;
  const ratingCount = course.rating?.count ?? 0;

  const details = [
    {
      icon: <Clock className="h-6 w-6 text-indigo-600" />,
      label: "Duration",
      value: `${course.totalDuration} mins`,
    },
    {
      icon: <Users className="h-6 w-6 text-green-600" />,
      label: "Enrollments",
      value: `${course.enrollmentCount} students`,
    },
    {
      icon: <Star className="h-6 w-6 text-yellow-500" />,
      label: "Rating",
      value: `${rating.toFixed(1)} (${ratingCount})`,
    },
    {
      icon: <Layers className="h-6 w-6 text-pink-600" />,
      label: "Level",
      value: course.level.charAt(0).toUpperCase() + course.level.slice(1),
    },
    {
      icon: <Award className="h-6 w-6 text-blue-600" />,
      label: "Certificate",
      value: "Industry-recognized on completion",
    },
    {
      icon: <Play className="h-6 w-6 text-purple-600" />,
      label: "Mode",
      value: "Live + Recorded Classes",
    },
  ];

  return (
    <section className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-sm border p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Overview</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
        {details.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center bg-white rounded-lg p-4 shadow hover:shadow-md transition"
          >
            <div className="mb-2">{item.icon}</div>
            <div className="text-sm font-medium text-gray-900">{item.label}</div>
            <div className="text-xs text-gray-600">{item.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CourseDetails;
