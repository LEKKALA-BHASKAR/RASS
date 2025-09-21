import React from "react";
import { Users, Award, Target, Briefcase } from "lucide-react";

interface Props {
  description: string;
}

const CourseDescription: React.FC<Props> = ({ description }) => {
  if (!description) return null;

  return (
    <section className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-sm border p-10">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Course</h2>

      {/* Main Description */}
      <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
        {description}
      </p>

      {/* Why choose this course */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Why Choose This Program?
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
          <li className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition">
            <Award className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
            Industry-recognized certificate on completion
          </li>
          <li className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition">
            <Users className="h-5 w-5 text-indigo-600 mt-1 flex-shrink-0" />
            1:1 mentorship & dedicated community support
          </li>
          <li className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition">
            <Briefcase className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
            Placement assistance with 50+ hiring partners
          </li>
          <li className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition">
            <Target className="h-5 w-5 text-pink-600 mt-1 flex-shrink-0" />
            Learn by building real-world industry projects
          </li>
        </ul>
      </div>

      {/* Who is this course for */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Who Is This Course For?
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          This program is designed for:
        </p>
        <ul className="mt-3 list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>Freshers who want to kickstart a career in tech</li>
          <li>Working professionals looking to switch domains</li>
          <li>Students aiming to strengthen their portfolio</li>
          <li>Anyone passionate about learning by doing</li>
        </ul>
      </div>
    </section>
  );
};

export default CourseDescription;
